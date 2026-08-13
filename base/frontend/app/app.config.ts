/**
 * Configuration Nuxt UI.
 *
 * On relie les alias sémantiques de Nuxt UI (primary, secondary, …) à nos
 * couleurs custom générées dans `assets/css/main.css` (échelles color-mix
 * dérivées des tokens du thème client). Ainsi tout composant Nuxt UI adopte
 * automatiquement la charte du site, sans réglage côté éditeur.
 *
 * `info` et `neutral` réutilisent des échelles déjà présentes (blue / gray).
 */
export default defineAppConfig({
  ui: {
    colors: {
      primary: "cprimary",
      secondary: "csecondary",
      success: "csuccess",
      info: "blue",
      warning: "cwarning",
      error: "cerror",
      neutral: "gray",
    },
  },
});
