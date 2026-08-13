---
trigger: model_decision
---
# Référence : Personnaliser le carrousel / la galerie (Swiper)

## Principe

Le rendu s'appuie sur **Swiper Element** (`<swiper-container>`), enregistré une
fois avec **tous ses modules** dans `frontend/app/plugins/swiper.client.ts` :
tous les effets sont donc disponibles sans installation. On passe n'importe quel
paramètre Swiper en attribut kebab-case (`autoplay="true"`, `loop="true"`,
`effect="coverflow"`…).

Dans le Studio, l'éditeur ne choisit QUE l'affichage : **Grille** ou
**Carrousel**. Le style détaillé (type de carrousel, nombre de colonnes) est
défini **dans le code**, une fois, et surchargeable par projet — jamais exposé
au client ni stocké dans Sanity.

## Où se passe tout

| Rôle | Fichier |
|---|---|
| Choix Grille/Carrousel (section) | `studio/src/schemaTypes/objects/gallery.ts` (champ `layout`) |
| Choix Grille/Carrousel (blog) | `studio/src/schemaTypes/singletons/settings.tsx` (objet `gallery`) |
| Styles + config active | `frontend/app/lib/carouselStyles.ts` |
| Rendu | `frontend/app/components/Gallery.vue` (+ `Lightbox.vue`) |

> ⚠️ Ne PAS ajouter de champ `carouselType`/`columns` dans Sanity : le style
> vient du code, pas de l'éditeur.

## Le registre : `frontend/app/lib/carouselStyles.ts`

Chaque style de carrousel est décrit par :

```typescript
export interface CarouselStyle {
  effect?: string;          // "slide" (défaut), "fade", "cube", "coverflow", "flip", "cards"
  slidesPerView?: string;   // "auto" (largeur via slideClass) ou un nombre ("1")
  slideClass?: string;      // largeur des slides — classes Tailwind LITTÉRALES
  attrs?: Record<string, string | number | boolean>; // attributs <swiper-container> kebab-case
}
```

Trois blocs :

- `coreCarouselStyles` : bibliothèque commune (CŒUR).
- `projectCarouselStyles` : styles propres au client (PROJET).
- La **config active** du site :
  - Défauts CŒUR : `CORE_CAROUSEL_STYLE`, `CORE_GRID_COLUMNS`.
  - Surcharges PROJET : `PROJECT_CAROUSEL_STYLE`, `PROJECT_GRID_COLUMNS`
    (`null` = on garde le défaut du cœur).
  - Exposés via `activeCarouselStyle` et `galleryColumns`, consommés par
    `Gallery.vue`.

## Ajouter un style commun à TOUS les projets (évolution du CŒUR)

Dans `coreCarouselStyles` :

```typescript
const coreCarouselStyles: Record<string, CarouselStyle> = {
  auto:   { slidesPerView: "auto", slideClass: "!w-[80%] sm:!w-[45%] lg:!w-[32%]" },
  single: { slidesPerView: "1", slideClass: "!w-full" },
  multi:  { slidesPerView: "auto", slideClass: "!w-full sm:!w-[calc(50%-8px)] lg:!w-[calc(33.333%-11px)]" },
  fade:   { effect: "fade", slidesPerView: "1", slideClass: "!w-full" },
  // nouveau style commun :
  cards:  { effect: "cards", slidesPerView: "1", slideClass: "!w-full" },
};
```

## Ajouter un style propre à UN client (sans toucher au CŒUR)

1. Définir le style dans `projectCarouselStyles` :

```typescript
const projectCarouselStyles: Record<string, CarouselStyle> = {
  coverflow: {
    effect: "coverflow",
    slidesPerView: "auto",
    slideClass: "!w-[70%] sm:!w-[50%] lg:!w-[40%]",
    attrs: { "centered-slides": true, loop: true },
  },
};
```

2. L'activer (et régler la grille si besoin) dans le bloc PROJET :

```typescript
const PROJECT_CAROUSEL_STYLE: string | null = "coverflow";
const PROJECT_GRID_COLUMNS: "2" | "3" | "4" | null = "4";
```

Aucun fichier Cœur (`gallery.ts`, `settings.tsx`, `Gallery.vue`) n'est à
modifier pour changer le style d'un site : tout passe par le bloc PROJET de
`carouselStyles.ts`.

## Pièges

- **Classes Tailwind littérales** : `slideClass` doit contenir des classes
  complètes (`lg:grid-cols-3`, `!w-[32%]`…). Ne jamais construire une classe par
  concaténation, sinon Tailwind ne la génère pas.
- **Effet `fade`/`cards`/`cube`** : forcer `slidesPerView: "1"` (une seule slide
  visible), sinon l'effet ne s'applique pas.
- **Peu d'images** : Swiper masque les flèches quand il n'y a rien à faire
  défiler — un carrousel « multi » à 3 colonnes ressemble alors à une grille.
- **Images qui ne chargent pas** : ne pas utiliser `<SanityImage>` (srcset
  dégénéré à 1px) ; passer par le helper `sanityImageUrl` comme dans `Gallery.vue`.

## Doc Swiper

- Paramètres : https://swiperjs.com/swiper-api#parameters
- Effets (`fade`, `cube`, `coverflow`, `flip`, `cards`) : https://swiperjs.com/swiper-api#effects
- Web components : https://swiperjs.com/element
