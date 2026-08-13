import { createClient } from "@sanity/client";

type SitemapDoc = {
  _type: string;
  slug: string | null;
  _updatedAt: string;
};

// Identique à `sitemapQuery` dans app/sanity/queries.ts. Inliné ici car le
// contexte serveur (Nitro) ne partage pas l'alias `~` du dossier app/.
const sitemapQuery = `*[
  ((_type in ["page", "post"] && defined(slug.current)) || _type == "homePage")
  && noIndex != true
]{
  _type,
  "slug": slug.current,
  _updatedAt
}`;

/**
 * Source dynamique du sitemap (consommée par @nuxtjs/sitemap via la clé
 * `sitemap.sources` de nuxt.config.ts). On interroge Sanity pour lister toutes
 * les pages et tous les articles indexables (noIndex != true) et on renvoie
 * leurs URLs absolues relatives au site.
 */
type SanityRuntimeConfig = {
  projectId?: string;
  dataset?: string;
  apiVersion?: string;
};

export default defineSitemapEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  // Selon la version de @nuxtjs/sanity, la config est exposée sous
  // `public.sanity` (client + serveur) ou `sanity` (privée serveur).
  const sanity = (config.public?.sanity ??
    (config as Record<string, unknown>).sanity ??
    {}) as SanityRuntimeConfig;

  if (!sanity.projectId || !sanity.dataset) {
    console.warn(
      "[sitemap] Configuration Sanity introuvable dans runtimeConfig — sitemap dynamique vide."
    );
    return [];
  }

  const client = createClient({
    projectId: sanity.projectId,
    dataset: sanity.dataset,
    apiVersion: sanity.apiVersion || "2025-10-20",
    useCdn: true,
  });

  const docs = await client.fetch<SitemapDoc[]>(sitemapQuery);

  return (docs ?? [])
    .filter((doc) => doc._type === "homePage" || doc.slug)
    .map((doc) => {
      const loc =
        doc._type === "homePage"
          ? "/"
          : doc._type === "post"
            ? `/articles/${doc.slug}`
            : `/${doc.slug}`;
      return { loc, lastmod: doc._updatedAt };
    });
});
