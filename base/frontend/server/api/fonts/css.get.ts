/**
 * Proxy CSS Google Fonts (CŒUR) — chargement RGPD-compatible des polices du thème.
 *
 * Pourquoi : la police est choisie à l'exécution dans Sanity (thème → Typographie),
 * or `@nuxt/fonts` n'héberge que les polices connues AU BUILD. Cette route permet
 * de charger DYNAMIQUEMENT n'importe quelle police Google choisie dans Sanity,
 * sans rebuild.
 *
 * RGPD : le navigateur du visiteur ne contacte JAMAIS Google. C'est ce serveur qui
 * récupère la feuille CSS depuis Google, puis réécrit les URLs des fichiers de
 * police (`fonts.gstatic.com`) vers le proxy local `/api/fonts/file`. Aucune IP
 * visiteur n'est exposée à Google.
 *
 * Usage : `/api/fonts/css?family=Inter&family=Playfair+Display`
 */

// User-Agent moderne : indispensable pour que Google renvoie du `woff2`
// (sinon il sert des formats hérités plus lourds selon l'UA).
const MODERN_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Graisses tentées dans l'ordre : on part du jeu le plus complet (titres jusqu'à
// 800, corps 400), puis on se replie si la police n'expose pas toutes ces graisses
// (Google renvoie une 400 pour une graisse indisponible sur une police statique).
const WEIGHT_SETS = ["300;400;500;600;700;800", "400;700", ""];

async function fetchFamilyCss(family: string): Promise<string | null> {
  for (const weights of WEIGHT_SETS) {
    const axis = weights ? `:wght@${weights}` : "";
    const url =
      `https://fonts.googleapis.com/css2?family=` +
      `${encodeURIComponent(family)}${axis}&display=swap`;
    try {
      const res = await fetch(url, {headers: {"User-Agent": MODERN_UA}});
      if (res.ok) return await res.text();
    } catch {
      // réseau indisponible : on tente la graisse suivante puis on abandonne.
    }
  }
  return null;
}

// Réécrit chaque URL `fonts.gstatic.com` vers notre proxy local, afin que le
// client ne télécharge les fichiers de police que depuis notre propre domaine.
function rewriteGstaticUrls(css: string): string {
  return css.replace(
    /url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g,
    (_m, gstaticUrl: string) =>
      `url(/api/fonts/file?url=${encodeURIComponent(gstaticUrl)})`,
  );
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const raw = query.family;
  const families = (Array.isArray(raw) ? raw : [raw])
    .map((f) => String(f ?? "").trim())
    .filter(Boolean)
    // Dédoublonnage (les 3 champs du thème pointent souvent sur la même police).
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .slice(0, 5); // garde-fou

  if (!families.length) {
    throw createError({statusCode: 400, statusMessage: "Paramètre `family` manquant."});
  }

  const parts = await Promise.all(families.map(fetchFamilyCss));
  const css = parts
    .filter((p): p is string => !!p)
    .map(rewriteGstaticUrls)
    .join("\n");

  // Cache long : le CSS d'une famille donnée est stable.
  setHeader(event, "content-type", "text/css; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=86400, s-maxage=604800, immutable");
  return css;
});
