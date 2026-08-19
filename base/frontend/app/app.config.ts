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
/**
 * Titres des sections Nuxt UI (hero / CTA / section / header) alignés sur
 * l'échelle typographique du thème (tokens `--a-*`, cf. `.a-display` / `.a-title-1`
 * dans `main.css`). Objectif : une seule hiérarchie de titres, identique pour
 * les sections « maison » (`<h2 class="a-title-1">`) et les sections Nuxt UI.
 *
 * On neutralise les tailles fixes de Nuxt UI (`text-3xl`, `sm:text-4xl`,
 * `lg:text-5xl`, `text-5xl`, `sm:text-7xl`) en imposant la taille du thème à
 * CHAQUE palier (base/sm/lg) — la valeur est déjà fluide (`clamp`), donc
 * identique partout. tailwind-merge retire alors les tailles conflictuelles.
 * La COULEUR n'est pas touchée : Nuxt UI gère le contraste selon le fond
 * (`text-highlighted` / `text-inverted`, bascule `.dark` sur média sombre).
 */
const displayTitle =
  "font-display text-[length:var(--a-display)] sm:text-[length:var(--a-display)] lg:text-[length:var(--a-display)] leading-[1.05] tracking-[-0.02em] [font-weight:var(--a-heading-weight)] [text-transform:var(--a-display-case)]"
const sectionTitle =
  "font-display text-[length:var(--a-title-1)] sm:text-[length:var(--a-title-1)] lg:text-[length:var(--a-title-1)] leading-[1.1] tracking-[-0.015em] [font-weight:var(--a-heading-weight)] [text-transform:var(--a-display-case)]"

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
    // Par défaut, UHeader/UFooter n'appliquent PAS de conteneur (leur contenu est
    // bord à bord). On y injecte le conteneur du site (largeur = --ui-container,
    // branché sur « Largeur du site », + gouttière) pour aligner en-tête et pied
    // de page sur la largeur du contenu. Ces classes se fusionnent avec les
    // classes par défaut des slots (flex, py…) via tailwind-merge.
    header: {
      slots: {
        container: "max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8",
      },
    },
    footer: {
      slots: {
        top: "max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8",
        // `border-t` : séparation entre le bandeau supérieur (4 colonnes) et la
        // rangée basse (copyright / réseaux sociaux).
        container:
          "max-w-(--ui-container) mx-auto px-4 sm:px-6 lg:px-8 border-t border-default",
      },
    },
    // Variantes de fond du bloc <UPageCTA> alignées sur les tokens du thème :
    //  - solid   → fond « sombre » du thème (surface) ;
    //  - soft    → fond « clair » du thème (light) ;
    //  - subtle  → fond clair + bordure ;
    //  - outline → bordure seule (fond transparent).
    // Ces classes fusionnent avec le thème Nuxt UI (le `bg-*` remplace le défaut,
    // le `ring` du thème fournit la bordure pour subtle/outline).
    pageCTA: {
      slots: {title: sectionTitle},
      variants: {
        variant: {
          solid: {root: "bg-surface"},
          soft: {root: "bg-light"},
          subtle: {root: "bg-light"},
          outline: {root: "bg-transparent"},
        },
      },
    },
    // Titres de section/hero/en-tête alignés sur l'échelle du thème (voir plus
    // haut) : une seule hiérarchie de titres sur tout le site.
    pageHero: {
      slots: {title: displayTitle},
    },
    pageSection: {
      slots: {title: sectionTitle},
    },
    pageHeader: {
      slots: {title: sectionTitle},
    },
  },
});
