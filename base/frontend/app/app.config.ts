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
    // Variantes de fond du bloc <UPageCTA> alignées sur les tokens du thème :
    //  - solid   → fond « sombre » du thème (surface) ;
    //  - soft    → fond « clair » du thème (light) ;
    //  - subtle  → fond clair + bordure ;
    //  - outline → bordure seule (fond transparent).
    // Ces classes fusionnent avec le thème Nuxt UI (le `bg-*` remplace le défaut,
    // le `ring` du thème fournit la bordure pour subtle/outline).
    pageCTA: {
      variants: {
        variant: {
          solid: {root: "bg-surface"},
          soft: {root: "bg-light"},
          subtle: {root: "bg-light"},
          outline: {root: "bg-transparent"},
        },
      },
    },
  },
});
