<script setup lang="ts">
/**
 * Section "Bannière" (brique Projet) du Page Builder.
 * Délègue le rendu au composant partagé <AppBanner> (basé sur <UBanner>).
 *
 * Cette section est indépendante de l'interrupteur global « Afficher la
 * bannière » des Réglages (qui ne pilote que la bannière globale avant
 * l'en-tête). Placée dans une page, elle s'affiche dans le flux de la page.
 */
const props = defineProps({
  block: {
    type: Object as PropType<BannerSection>,
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
  <AppBanner :banner="props.block" />
</template>
