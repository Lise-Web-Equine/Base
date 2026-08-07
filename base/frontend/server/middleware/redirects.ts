import {createClient} from "@sanity/client";

/**
 * Middleware de redirections (CŒUR).
 *
 * Applique les redirections d'URL gérées dans le Studio (singleton `redirects`)
 * avec le bon code HTTP (301 permanent / 302 temporaire). Permet de gérer les
 * redirections de refonte sans redéploiement.
 *
 * Les redirections sont mises en cache (60 s) pour éviter d'interroger Sanity à
 * chaque requête. La requête est identique à `redirectsQuery`
 * (app/sanity/queries.ts) mais inlinée : le contexte serveur (Nitro) ne partage
 * pas l'alias `~` du dossier app/.
 */
type RedirectEntry = {
  source: string;
  destination: string;
  permanent: boolean;
};

type SanityRuntimeConfig = {
  projectId?: string;
  dataset?: string;
  apiVersion?: string;
};

const redirectsQuery = `*[_type == "redirects"][0].entries[]{
  source,
  destination,
  "permanent": coalesce(permanent, true)
}`;

// Récupération mise en cache (60 s) des redirections depuis Sanity.
const getRedirects = defineCachedFunction(
  async (sanity: Required<SanityRuntimeConfig>): Promise<RedirectEntry[]> => {
    const client = createClient({
      projectId: sanity.projectId,
      dataset: sanity.dataset,
      apiVersion: sanity.apiVersion,
      useCdn: true,
    });
    const entries = await client.fetch<RedirectEntry[]>(redirectsQuery);
    return (entries ?? []).filter((e) => e?.source && e?.destination);
  },
  {
    name: "sanity-redirects",
    maxAge: 60,
    getKey: (sanity) => `${sanity.projectId}:${sanity.dataset}`,
  }
);

// Normalise un chemin pour la comparaison (retire le / final, hors racine).
const normalizePath = (p: string) =>
  p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;

export default defineEventHandler(async (event) => {
  const path = (event.path.split("?")[0] || "/");

  // On n'intercepte que les navigations de pages : ignorer les routes techniques,
  // les assets et les fichiers (favicon, images, etc.).
  if (
    path.startsWith("/api/") ||
    path.startsWith("/preview/") ||
    path.startsWith("/_") ||
    path.includes(".")
  ) {
    return;
  }

  const config = useRuntimeConfig(event);
  // Selon la version de @nuxtjs/sanity, la config est exposée sous
  // `public.sanity` (client + serveur) ou `sanity` (privée serveur).
  const sanity = (config.public?.sanity ??
    (config as Record<string, unknown>).sanity ??
    {}) as SanityRuntimeConfig;

  if (!sanity.projectId || !sanity.dataset) return;

  const entries = await getRedirects({
    projectId: sanity.projectId,
    dataset: sanity.dataset,
    apiVersion: sanity.apiVersion || "2025-10-20",
  });
  if (!entries.length) return;

  const current = normalizePath(path);
  const match = entries.find((e) => normalizePath(e.source) === current);
  if (!match) return;

  // Évite une boucle de redirection si la destination pointe vers le même chemin.
  if (normalizePath(match.destination) === current) return;

  return sendRedirect(event, match.destination, match.permanent ? 301 : 302);
});
