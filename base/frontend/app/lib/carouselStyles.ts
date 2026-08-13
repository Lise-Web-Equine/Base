/**
 * Registre des styles de carrousel (frontend).
 *
 * Chaque style associe une `value` (identique à celle du Studio, voir
 * `studio/src/carousel/`) à sa configuration Swiper : effet, nombre de slides
 * visibles, largeur des slides (classes Tailwind littérales) et attributs
 * supplémentaires passés à `<swiper-container>` (kebab-case).
 *
 * Doc Swiper : https://swiperjs.com/swiper-api  |  effets : #effects
 */
export interface CarouselStyle {
  /** Effet Swiper (`slide` par défaut, `fade`, `cube`, `coverflow`, `flip`, `cards`). */
  effect?: string;
  /** `slides-per-view` : "auto" (largeur libre via slideClass) ou un nombre ("1"). */
  slidesPerView?: string;
  /** Largeur des slides (classes Tailwind littérales pour qu'elles soient générées). */
  slideClass?: string;
  /** Attributs supplémentaires pour `<swiper-container>` (ex: { loop: true }). */
  attrs?: Record<string, string | number | boolean>;
}

/**
 * CŒUR (Core) : styles génériques communs à tous les projets.
 * Ne pas modifier pour un client — utiliser `projectCarouselStyles`.
 */
const coreCarouselStyles: Record<string, CarouselStyle> = {
  // Défilement libre : plusieurs slides de largeur variable.
  auto: { slidesPerView: "auto", slideClass: "!w-[80%] sm:!w-[45%] lg:!w-[32%]" },
  // Une image à la fois, plein largeur.
  single: { slidesPerView: "1", slideClass: "!w-full" },
  // Plusieurs par vue : colonnes égales responsive.
  multi: {
    slidesPerView: "auto",
    slideClass: "!w-full sm:!w-[calc(50%-8px)] lg:!w-[calc(33.333%-11px)]",
  },
  // Fondu : une image à la fois, transition en fondu.
  fade: { effect: "fade", slidesPerView: "1", slideClass: "!w-full" },
};

/**
 * PROJET : styles propres au site client.
 * SEUL bloc à modifier pour brancher un nouveau style de carrousel.
 * La clé doit correspondre à la `value` déclarée dans `studio/src/carousel/project.ts`.
 *
 * Exemple :
 *   coverflow: { effect: "coverflow", slidesPerView: "auto",
 *                slideClass: "!w-[70%] sm:!w-[50%] lg:!w-[40%]",
 *                attrs: { "centered-slides": true, loop: true } },
 */
const projectCarouselStyles: Record<string, CarouselStyle> = {};

/**
 * Registre complet consommé par `Gallery.vue`.
 */
export const carouselStyleRegistry: Record<string, CarouselStyle> = {
  ...coreCarouselStyles,
  ...projectCarouselStyles,
};

/** Renvoie la config d'un style (repli sur « Défilement libre » si inconnu). */
export function getCarouselStyle(type?: string | null): CarouselStyle {
  return carouselStyleRegistry[type ?? "auto"] ?? carouselStyleRegistry.auto!;
}

/* -------------------------------------------------------------------------- */
/*  Configuration active de la galerie                                        */
/*                                                                            */
/*  Le STYLE n'est plus choisi dans le Studio (l'éditeur ne choisit que       */
/*  « Grille » ou « Carrousel »). Il est fixé ici, une fois, et surchargeable */
/*  par projet — sans jamais modifier le cœur ni le schéma Sanity.            */
/* -------------------------------------------------------------------------- */

// --- CŒUR : valeurs par défaut communes à tous les projets ---
const CORE_CAROUSEL_STYLE = "auto"; // clé dans carouselStyleRegistry
const CORE_GRID_COLUMNS: "2" | "3" | "4" = "3";

// --- PROJET : surcharges propres au site client (null = valeur du cœur) ---
// Ex : passer le carrousel en "coverflow" (déf. dans projectCarouselStyles)
//      ou la grille en 4 colonnes.
const PROJECT_CAROUSEL_STYLE: string | null = null;
const PROJECT_GRID_COLUMNS: "2" | "3" | "4" | null = null;

/** Style de carrousel actif du site (cœur, surchargé par le projet). */
export const activeCarouselStyle: CarouselStyle = getCarouselStyle(
  PROJECT_CAROUSEL_STYLE ?? CORE_CAROUSEL_STYLE
);

/** Nombre de colonnes de la grille (cœur, surchargé par le projet). */
export const galleryColumns: "2" | "3" | "4" = PROJECT_GRID_COLUMNS ?? CORE_GRID_COLUMNS;
