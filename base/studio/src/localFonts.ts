/**
 * Polices AUTO-HÉBERGÉES (hors Google) côté Studio — point d'extension PROJET.
 *
 * Rôle : rendre une police locale (1) sélectionnable dans le thème et
 * (2) prévisualisable dans le Studio, SANS variable d'environnement ni appel
 * externe. L'aperçu charge la police depuis les fichiers `static/fonts/` du
 * Studio (servis en same-origin sous `/static/fonts/…`).
 *
 * ⚠️ À garder synchronisé avec le registre frontend `frontend/shared/localFonts.ts`
 * (même nom de famille). Le frontend gère le rendu sur le site public ; ce
 * fichier ne concerne QUE le Studio (sélection + aperçu).
 *
 * ── Ajouter une police locale (rappel) ───────────────────────────────────────
 *  1. Fichiers `.woff2` → `frontend/public/fonts/<police>/` (site)
 *     ET `studio/static/fonts/<police>/` (aperçu Studio).
 *  2. Entrée dans `projectLocalFonts` ci-dessous + dans le registre frontend.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import type {FontOption} from './fonts'

export interface StudioLocalFontFace {
  /** Graisse CSS (100–900). */
  weight: number
  /** Style CSS. Par défaut « normal ». */
  style?: 'normal' | 'italic'
  /** Fichier sous `studio/static/fonts/` (servi sous `/static/fonts/`). */
  file: string
}

export interface StudioLocalFont {
  /** Nom EXACT de la famille (identique au registre frontend et au thème). */
  family: string
  /** Repli générique CSS (« sans-serif », « serif »…). */
  fallback: string
  /** Fichiers de la police (une entrée par graisse / style). */
  faces: StudioLocalFontFace[]
}

/** CŒUR : polices locales communes (vide par défaut). */
const coreLocalFonts: StudioLocalFont[] = []

/**
 * PROJET : polices auto-hébergées propres au site client.
 * SEUL bloc à modifier (côté Studio) pour brancher une nouvelle police locale.
 *
 * Exemple :
 *   {
 *     family: 'Haras Sans',
 *     fallback: 'sans-serif',
 *     faces: [
 *       {weight: 400, file: 'haras-sans/regular.woff2'},
 *       {weight: 700, file: 'haras-sans/bold.woff2'},
 *     ],
 *   },
 */
const projectLocalFonts: StudioLocalFont[] = []

export const STUDIO_LOCAL_FONTS: StudioLocalFont[] = [...coreLocalFonts, ...projectLocalFonts]

/** Ensemble des familles locales (aiguillage aperçu Google vs local). */
export const LOCAL_FONT_FAMILIES = new Set(STUDIO_LOCAL_FONTS.map((f) => f.family))

/** Repli générique par famille (pour construire la valeur CSS stockée). */
export const LOCAL_FONT_FALLBACK = new Map(
  STUDIO_LOCAL_FONTS.map((f) => [f.family, f.fallback]),
)

/**
 * Options ajoutées au sélecteur de police (fusionnées avec la liste Google).
 * Suffixe « (locale) » pour distinguer les polices auto-hébergées.
 */
export const LOCAL_FONT_OPTIONS: FontOption[] = STUDIO_LOCAL_FONTS.map((f) => ({
  title: `${f.family} (locale)`,
  value: `"${f.family}", ${f.fallback}`,
}))

// Injecte une seule fois le `@font-face` d'une police locale, pour l'aperçu.
const injected = new Set<string>()
export function ensureLocalFontLoaded(family: string): void {
  if (typeof document === 'undefined' || injected.has(family)) return
  const font = STUDIO_LOCAL_FONTS.find((f) => f.family === family)
  if (!font) return
  injected.add(family)
  const css = font.faces
    .map(
      (face) =>
        `@font-face{font-family:"${family}";font-style:${face.style || 'normal'};` +
        `font-weight:${face.weight};font-display:swap;` +
        `src:url("/static/fonts/${face.file}") format("woff2");}`,
    )
    .join('\n')
  const style = document.createElement('style')
  style.setAttribute('data-local-font', family)
  style.textContent = css
  document.head.appendChild(style)
}
