<script setup lang="ts">
/**
 * Galerie d'images (brique Cœur).
 *
 * - Structure/navigation : Swiper (Web Components) en mode « carrousel ».
 * - Mode « grille » : grille responsive de vignettes.
 * - Clic sur une image → ouverture plein écran via <Lightbox>.
 * Alimentée par l'objet Sanity `gallery`. Arrondi/gouttière via les design tokens.
 */
interface Img {
  asset?: { _ref?: string } | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}

import { sanityImageUrl } from "~/lib/sanityImage";
import { activeCarouselStyle, galleryColumns } from "~/lib/carouselStyles";

const props = defineProps<{
  gallery?: {
    images?: Img[] | null;
    // L'éditeur choisit seulement « Grille » ou « Carrousel ».
    layout?: "grid" | "carousel" | null;
  } | null;
}>();

const images = computed(() => props.gallery?.images?.filter((i) => i?.asset?._ref) ?? []);
const isCarousel = computed(() => props.gallery?.layout === "carousel");

// Style de carrousel : défini dans le code (cœur + surcharge projet),
// pas par l'éditeur — cf. lib/carouselStyles.
const swiperEffect = activeCarouselStyle.effect ?? "slide";
const slidesPerView = activeCarouselStyle.slidesPerView ?? "auto";
const slideClass = activeCarouselStyle.slideClass ?? "";
const carouselAttrs = activeCarouselStyle.attrs ?? {};

// URL d'image générée directement (le wrapper <SanityImage> produit un srcset
// dégénéré à 1px, cf. lib/sanityImage). On passe donc par le helper.
const sanity = useSanity();
const imgUrl = (ref?: string | null) =>
  sanityImageUrl(
    ref,
    (sanity.config as any)?.projectId,
    (sanity.config as any)?.dataset,
    "auto=format&fit=crop&w=800&h=600"
  );

// Classe de colonnes (littérales pour que Tailwind les génère). Le nombre de
// colonnes vient du code (cœur + surcharge projet), pas du Studio.
const gridColsClass =
  ({ "2": "lg:grid-cols-2", "3": "lg:grid-cols-3", "4": "lg:grid-cols-4" }[
    galleryColumns
  ] ?? "lg:grid-cols-3");

// Index ouvert dans la lightbox (null = fermée).
const lightboxIndex = ref<number | null>(null);
const open = (i: number) => (lightboxIndex.value = i);
</script>

<template>
  <div v-if="images.length">
    <!-- Carrousel (Swiper) -->
    <swiper-container
      v-if="isCarousel"
      navigation="true"
      pagination="true"
      :slides-per-view="slidesPerView"
      :effect="swiperEffect"
      space-between="16"
      v-bind="carouselAttrs"
      :style="{ '--swiper-theme-color': 'var(--color-primary)' }">
      <swiper-slide
        v-for="(img, i) in images"
        :key="img.asset!._ref!"
        :class="slideClass">
        <button
          type="button"
          class="group block w-full overflow-hidden"
          :style="{ borderRadius: 'var(--a-radius)' }"
          @click="open(i)">
          <img
            :src="imgUrl(img.asset!._ref!)"
            :alt="img.alt || ''"
            loading="lazy"
            class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105" />
        </button>
      </swiper-slide>
    </swiper-container>

    <!-- Grille -->
    <div
      v-else
      class="grid grid-cols-2 gap-4"
      :class="gridColsClass">
      <button
        v-for="(img, i) in images"
        :key="img.asset!._ref!"
        type="button"
        class="group block overflow-hidden"
        :style="{ borderRadius: 'var(--a-radius)' }"
        @click="open(i)">
        <img
          :src="imgUrl(img.asset!._ref!)"
          :alt="img.alt || ''"
          loading="lazy"
          class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105" />
      </button>
    </div>

    <Lightbox :images="images" v-model="lightboxIndex" />
  </div>
</template>
