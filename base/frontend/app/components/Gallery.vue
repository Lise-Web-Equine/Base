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

const props = defineProps<{
  gallery?: {
    images?: Img[] | null;
    layout?: "grid" | "carousel" | null;
    columns?: "2" | "3" | "4" | null;
  } | null;
}>();

const images = computed(() => props.gallery?.images?.filter((i) => i?.asset?._ref) ?? []);
const isCarousel = computed(() => props.gallery?.layout === "carousel");

// Classe de colonnes (littérales pour que Tailwind les génère).
const gridColsClass = computed(
  () =>
    ({ "2": "lg:grid-cols-2", "3": "lg:grid-cols-3", "4": "lg:grid-cols-4" }[
      props.gallery?.columns ?? "3"
    ] ?? "lg:grid-cols-3")
);

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
      slides-per-view="auto"
      space-between="16"
      :style="{ '--swiper-theme-color': 'var(--color-primary)' }">
      <swiper-slide
        v-for="(img, i) in images"
        :key="img.asset!._ref!"
        class="!w-[80%] sm:!w-[45%] lg:!w-[32%]">
        <button
          type="button"
          class="group block w-full overflow-hidden"
          :style="{ borderRadius: 'var(--a-radius)' }"
          @click="open(i)">
          <SanityImage
            :asset-id="img.asset!._ref!"
            :alt="img.alt || ''"
            auto="format"
            sizes="(min-width: 1024px) 33vw, 80vw"
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
        <SanityImage
          :asset-id="img.asset!._ref!"
          :alt="img.alt || ''"
          auto="format"
          sizes="(min-width: 1024px) 33vw, 50vw"
          class="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-105" />
      </button>
    </div>

    <Lightbox :images="images" v-model="lightboxIndex" />
  </div>
</template>
