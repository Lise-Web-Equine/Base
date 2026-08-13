# Notes projet

Préférences et conventions apprises au fil du projet.

## Conventions UI / CSS

- **Mobile first, toujours.** Écrire d'abord les styles pour mobile (classes de base
  sans préfixe), puis ajouter les surcouches responsive (`sm:`, `md:`, `lg:`…) pour
  les écrans plus grands. Ne jamais partir du desktop.
- Aucune couleur / espacement en dur : passer par les design tokens du thème
  (voir `.windsurf/rules/architecture-core-projet.md`).
- Libellés du Studio Sanity en **français**.

## Galerie / Carrousel — ajouter un style

Le rendu s'appuie sur **Swiper Element** (`<swiper-container>`), déjà chargé avec
tous ses modules (`app/plugins/swiper.client.ts`) : tous les effets sont dispo
sans installation. On passe n'importe quel paramètre Swiper en attribut
kebab-case (`autoplay="true"`, `loop="true"`, `effect="coverflow"`…).

Doc Swiper :
- Paramètres : https://swiperjs.com/swiper-api#parameters
- Effets (`fade`, `cube`, `coverflow`, `flip`, `cards`) : https://swiperjs.com/swiper-api#effects
- Web components : https://swiperjs.com/element

Dans le Studio, l'éditeur ne choisit QUE l'affichage : **Grille** ou
**Carrousel**. Le style détaillé (type de carrousel, nombre de colonnes) est
défini **dans le code**, une fois, et surchargeable par projet — jamais exposé
au client ni stocké dans Sanity.

Tout se passe dans `frontend/app/lib/carouselStyles.ts` :
- `coreCarouselStyles` : bibliothèque de styles de carrousel (CŒUR).
- `projectCarouselStyles` : styles propres au client (PROJET).
- `activeCarouselStyle` / `galleryColumns` : la config **active** du site.
  - Défauts CŒUR : `CORE_CAROUSEL_STYLE`, `CORE_GRID_COLUMNS`.
  - Surcharges PROJET : `PROJECT_CAROUSEL_STYLE`, `PROJECT_GRID_COLUMNS`
    (mettre à `null` pour garder le défaut du cœur).

Chaque style Swiper = `{ effect, slidesPerView, slideClass, attrs }`
(attributs `<swiper-container>` en kebab-case, ex: `{ loop: true }`).

Aucun fichier Cœur (`gallery.ts`, `settings.tsx`, `Gallery.vue`) n'est à
modifier pour changer le style d'un site : tout passe par le bloc PROJET de
`carouselStyles.ts`.
