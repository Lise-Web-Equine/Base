/**
 * Liste des polices proposées dans le thème (singleton `themeSettings`).
 *
 * Ce n'est qu'une liste de choix (chaînes de texte) : elle n'alourdit PAS le
 * projet. Le chargement réel d'une police est géré côté frontend et n'inclut
 * QUE la (ou les) police(s) réellement utilisée(s) par le site — voir
 * `frontend/app/assets/css/project.css` (auto-hébergement via @nuxt/fonts).
 *
 * Pour régénérer une liste complète depuis l'API Google Fonts :
 *   cd studio && npm run fonts:sync   (nécessite la variable GOOGLE_FONTS_API_KEY)
 * Voir `studio/scripts/generate-google-fonts.mjs`.
 */
export interface FontOption {
  title: string
  value: string
}

export const FONT_OPTIONS: FontOption[] = [
  // — Sans-serif —
  {title: 'Inter', value: '"Inter", sans-serif'},
  {title: 'Roboto', value: '"Roboto", sans-serif'},
  {title: 'Open Sans', value: '"Open Sans", sans-serif'},
  {title: 'Lato', value: '"Lato", sans-serif'},
  {title: 'Montserrat', value: '"Montserrat", sans-serif'},
  {title: 'Poppins', value: '"Poppins", sans-serif'},
  {title: 'Raleway', value: '"Raleway", sans-serif'},
  {title: 'Nunito', value: '"Nunito", sans-serif'},
  {title: 'Nunito Sans', value: '"Nunito Sans", sans-serif'},
  {title: 'Work Sans', value: '"Work Sans", sans-serif'},
  {title: 'Source Sans 3', value: '"Source Sans 3", sans-serif'},
  {title: 'Mulish', value: '"Mulish", sans-serif'},
  {title: 'Rubik', value: '"Rubik", sans-serif'},
  {title: 'DM Sans', value: '"DM Sans", sans-serif'},
  {title: 'Manrope', value: '"Manrope", sans-serif'},
  {title: 'Figtree', value: '"Figtree", sans-serif'},
  {title: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif'},
  {title: 'Karla', value: '"Karla", sans-serif'},
  {title: 'Outfit', value: '"Outfit", sans-serif'},
  {title: 'Sora', value: '"Sora", sans-serif'},
  {title: 'Space Grotesk', value: '"Space Grotesk", sans-serif'},
  {title: 'IBM Plex Sans', value: '"IBM Plex Sans", sans-serif'},
  {title: 'Josefin Sans', value: '"Josefin Sans", sans-serif'},
  {title: 'Quicksand', value: '"Quicksand", sans-serif'},
  {title: 'Barlow', value: '"Barlow", sans-serif'},
  {title: 'Cabin', value: '"Cabin", sans-serif'},
  {title: 'Archivo', value: '"Archivo", sans-serif'},
  {title: 'Albert Sans', value: '"Albert Sans", sans-serif'},
  {title: 'Oswald', value: '"Oswald", sans-serif'},

  // — Serif —
  {title: 'Playfair Display', value: '"Playfair Display", serif'},
  {title: 'Merriweather', value: '"Merriweather", serif'},
  {title: 'Lora', value: '"Lora", serif'},
  {title: 'PT Serif', value: '"PT Serif", serif'},
  {title: 'Source Serif 4', value: '"Source Serif 4", serif'},
  {title: 'Cormorant Garamond', value: '"Cormorant Garamond", serif'},
  {title: 'EB Garamond', value: '"EB Garamond", serif'},
  {title: 'Libre Baskerville', value: '"Libre Baskerville", serif'},
  {title: 'Bitter', value: '"Bitter", serif'},
  {title: 'Crimson Text', value: '"Crimson Text", serif'},
  {title: 'Frank Ruhl Libre', value: '"Frank Ruhl Libre", serif'},
  {title: 'Spectral', value: '"Spectral", serif'},
  {title: 'Domine', value: '"Domine", serif'},
  {title: 'Georgia (système)', value: 'Georgia, serif'},

  // — Display / Titres —
  {title: 'Bebas Neue', value: '"Bebas Neue", sans-serif'},
  {title: 'Abril Fatface', value: '"Abril Fatface", serif'},
  {title: 'Righteous', value: '"Righteous", sans-serif'},
  {title: 'Comfortaa', value: '"Comfortaa", sans-serif'},

  // — Manuscrites —
  {title: 'Dancing Script', value: '"Dancing Script", cursive'},
  {title: 'Caveat', value: '"Caveat", cursive'},
  {title: 'Pacifico', value: '"Pacifico", cursive'},
  {title: 'Lobster', value: '"Lobster", cursive'},

  // — Monospace —
  {title: 'Roboto Mono', value: '"Roboto Mono", monospace'},
  {title: 'JetBrains Mono', value: '"JetBrains Mono", monospace'},
  {title: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace'},
  {title: 'Space Mono', value: '"Space Mono", monospace'},
  {title: 'Fira Code', value: '"Fira Code", monospace'},

  // — Systèmes (aucun chargement) —
  {title: 'System UI', value: 'system-ui, sans-serif'},
]
