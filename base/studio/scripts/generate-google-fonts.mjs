/**
 * Régénère `studio/src/fonts.ts` à partir de l'API Google Fonts.
 *
 * Usage :
 *   GOOGLE_FONTS_API_KEY=xxx node scripts/generate-google-fonts.mjs [limite]
 *   (ou `npm run fonts:sync` depuis le dossier studio)
 *
 * - `limite` (optionnel) : nombre de polices à conserver, triées par popularité
 *   (défaut : 200). On évite volontairement d'importer les ~1500 polices : une
 *   liste trop longue nuit à l'ergonomie du menu et n'apporte rien.
 * - La clé API se crée sur https://developers.google.com/fonts/docs/developer_api
 *
 * Ce script ne fait que régénérer une LISTE DE CHOIX (chaînes). Le chargement
 * réel des polices reste géré par @nuxt/fonts (voir project.css).
 */
import {writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'

const API_KEY = process.env.GOOGLE_FONTS_API_KEY
const LIMIT = Number(process.argv[2]) || 200

if (!API_KEY) {
  console.error(
    '❌ GOOGLE_FONTS_API_KEY manquante. Crée une clé (Google Fonts Developer API) puis :\n' +
      '   GOOGLE_FONTS_API_KEY=xxx npm run fonts:sync',
  )
  process.exit(1)
}

// Famille générique CSS de repli selon la catégorie Google.
const FALLBACK = {
  'sans-serif': 'sans-serif',
  serif: 'serif',
  display: 'sans-serif',
  handwriting: 'cursive',
  monospace: 'monospace',
}

const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${API_KEY}`

const res = await fetch(url)
if (!res.ok) {
  console.error(`❌ Échec de l'appel Google Fonts (${res.status} ${res.statusText}).`)
  process.exit(1)
}

const {items} = await res.json()
const fonts = items.slice(0, LIMIT).map((item) => {
  const fallback = FALLBACK[item.category] || 'sans-serif'
  return {title: item.family, value: `"${item.family}", ${fallback}`}
})

const header = `/**
 * Liste des polices proposées dans le thème (singleton \`themeSettings\`).
 *
 * ⚠️ Fichier généré par \`scripts/generate-google-fonts.mjs\` (npm run fonts:sync).
 * Ne pas éditer à la main : relancer le script pour le régénérer.
 *
 * Ce n'est qu'une liste de choix (chaînes) : elle n'alourdit PAS le projet. Le
 * chargement réel des polices est géré côté frontend (auto-hébergement via
 * @nuxt/fonts) — voir \`frontend/app/assets/css/project.css\`.
 */
export interface FontOption {
  title: string
  value: string
}

export const FONT_OPTIONS: FontOption[] = [
`

const body = fonts
  .map((f) => `  {title: ${JSON.stringify(f.title)}, value: ${JSON.stringify(f.value)}},`)
  .join('\n')

const out = `${header}${body}\n]\n`

const target = resolve(dirname(fileURLToPath(import.meta.url)), '../src/fonts.ts')
await writeFile(target, out, 'utf-8')

console.log(`✅ ${fonts.length} polices écrites dans src/fonts.ts`)
