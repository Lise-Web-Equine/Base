/**
 * Proxy des fichiers de police (CŒUR) — sert en local les binaires `woff2`
 * référencés par `/api/fonts/css`.
 *
 * RGPD : le client télécharge la police depuis NOTRE domaine ; c'est ce serveur
 * qui récupère le fichier sur `fonts.gstatic.com`. Aucune connexion directe du
 * visiteur vers Google.
 *
 * Sécurité : l'URL cible est strictement limitée à l'hôte `fonts.gstatic.com`
 * (empêche d'utiliser ce proxy comme relais SSRF vers un hôte arbitraire).
 */
export default defineEventHandler(async (event) => {
  const {url} = getQuery(event);
  const target = String(url ?? "");

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    throw createError({statusCode: 400, statusMessage: "URL invalide."});
  }

  if (parsed.protocol !== "https:" || parsed.hostname !== "fonts.gstatic.com") {
    throw createError({statusCode: 400, statusMessage: "Hôte non autorisé."});
  }

  const res = await fetch(parsed.toString());
  if (!res.ok) {
    throw createError({statusCode: 502, statusMessage: "Téléchargement de la police échoué."});
  }

  // Les fichiers de police sont immuables (URL versionnée par Google) : cache long.
  setHeader(event, "content-type", res.headers.get("content-type") || "font/woff2");
  setHeader(event, "cache-control", "public, max-age=31536000, immutable");
  return Buffer.from(await res.arrayBuffer());
});
