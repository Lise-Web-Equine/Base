/**
 * Génère le CSS `@font-face` des polices AUTO-HÉBERGÉES (CŒUR).
 *
 * Pendant local du proxy Google `/api/fonts/css` : ici les fichiers sont déjà
 * sur notre domaine (`frontend/public/fonts/`, servis à la racine `/fonts/`),
 * donc aucun appel externe. On se contente d'assembler les déclarations
 * `@font-face` pour les familles demandées, déclarées dans le registre partagé
 * `#shared/localFonts` (bloc PROJET).
 *
 * Usage : `/api/fonts/local?family=Haras+Sans`
 */
import { LOCAL_FONTS } from "#shared/localFonts";

function faceCss(family: string): string {
  const font = LOCAL_FONTS.find((f) => f.family === family);
  if (!font) return "";
  return font.faces
    .map(
      (face) => `@font-face {
  font-family: "${family}";
  font-style: ${face.style || "normal"};
  font-weight: ${face.weight};
  font-display: swap;
  src: url("/fonts/${face.file}") format("woff2");
}`,
    )
    .join("\n");
}

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const raw = query.family;
  const families = (Array.isArray(raw) ? raw : [raw])
    .map((f) => String(f ?? "").trim())
    .filter(Boolean)
    // Dédoublonnage (les champs du thème pointent souvent sur la même police).
    .filter((f, i, arr) => arr.indexOf(f) === i)
    .slice(0, 5); // garde-fou

  if (!families.length) {
    throw createError({ statusCode: 400, statusMessage: "Paramètre `family` manquant." });
  }

  const css = families.map(faceCss).filter(Boolean).join("\n");

  // Cache long : le CSS d'une famille locale est stable (fichiers immuables).
  setHeader(event, "content-type", "text/css; charset=utf-8");
  setHeader(event, "cache-control", "public, max-age=86400, s-maxage=604800, immutable");
  return css;
});
