<script setup lang="ts">
/**
 * Section "Galerie" du Page Builder (brique Cœur).
 *
 * Enveloppe la brique <Gallery> : titre optionnel + galerie d'images.
 * Le type d'affichage (grille/carrousel, colonnes) est choisi par instance
 * dans le Studio.
 */
defineProps({
  block: {
    type: Object as PropType<Gallery>,
    required: true,
  },
  // Position dans la page (fournie par PageBuilder), non utilisée ici.
  index: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="container my-12">
    <h2 v-if="block?.heading" class="a-title-1 mb-8">
      {{ block.heading }}
    </h2>
    <Gallery
      :gallery="{
        images: block.images,
        layout: block.layout,
      }" />
  </div>
</template>
