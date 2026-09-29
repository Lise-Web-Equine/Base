/**
 * Registre des polices AUTO-HÉBERGÉES (hors Google) — point d'extension PROJET.
 *
 * Pourquoi : le pipeline de polices par défaut passe par Google Fonts
 * (`/api/fonts/css` → proxy RGPD). Pour une police de marque / sous licence
 * propre, on l'héberge nous-mêmes et on la déclare ici. Le frontend génère
 * alors un `@font-face` (voir `server/api/fonts/local.get.ts`) au lieu
 * d'interroger Google.
 *
 * Ce module est PARTAGÉ (dossier Nuxt `shared/`) : importable à la fois par le
 * composable `useTheme` (app) et par l'endpoint serveur, via `#shared/localFonts`.
 *
 * ── Ajouter une police locale à un projet (3 étapes) ─────────────────────────
 *  1. Déposer les fichiers `.woff2` dans `frontend/public/fonts/<police>/`
 *     ET une copie dans `studio/static/fonts/<police>/` (pour l'aperçu Studio).
 *  2. Ajouter une entrée dans `projectLocalFonts` ci-dessous.
 *  3. Ajouter la même famille dans `PROJECT_FONT_OPTIONS` (`studio/src/fonts.ts`)
 *     et dans `PROJECT_LOCAL_FONTS` (`studio/src/localFonts.ts`) pour le Studio.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export interface LocalFontFace {
  /** Graisse CSS (100–900). */
  weight: number
  /** Style CSS. Par défaut « normal ». */
  style?: "normal" | "italic"
  /**
   * Chemin du fichier sous `frontend/public/fonts/` (servi à la racine `/fonts/`).
   * Ex. « haras-sans/regular.woff2 ».
   */
  file: string
}

export interface LocalFont {
  /** Nom EXACT de la famille, tel que déclaré dans `@font-face` et le thème. */
  family: string
  /** Repli générique CSS (« sans-serif », « serif », « monospace »…). */
  fallback: string
  /** Fichiers de la police (une entrée par graisse / style). */
  faces: LocalFontFace[]
}

/**
 * CŒUR : polices locales communes à tous les projets (vide par défaut).
 * Ne pas modifier pour un client — utiliser `projectLocalFonts`.
 */
const coreLocalFonts: LocalFont[] = []

/**
 * PROJET : polices auto-hébergées propres au site client.
 * SEUL bloc à modifier pour brancher une nouvelle police locale.
 *
 * Exemple :
 *   {
 *     family: "Haras Sans",
 *     fallback: "sans-serif",
 *     faces: [
 *       { weight: 400, file: "haras-sans/regular.woff2" },
 *       { weight: 700, file: "haras-sans/bold.woff2" },
 *     ],
 *   },
 */
const projectLocalFonts: LocalFont[] = []

/** Registre complet consommé par le frontend (endpoint + `useTheme`). */
export const LOCAL_FONTS: LocalFont[] = [...coreLocalFonts, ...projectLocalFonts]

/** Ensemble des familles locales (aiguillage rapide Google vs local). */
export const LOCAL_FONT_FAMILIES = new Set(LOCAL_FONTS.map((f) => f.family))

/** Retrouve une police locale par son nom de famille. */
export function findLocalFont(family: string): LocalFont | undefined {
  return LOCAL_FONTS.find((f) => f.family === family)
}
