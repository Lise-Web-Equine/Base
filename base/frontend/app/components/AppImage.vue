<script setup lang="ts">
/**
 * Image de contenu réutilisable (brique atomique « définie une fois »).
 *
 * Rend un objet `customImage` de Sanity via <SanityImage>, qui s'appuie sur
 * <NuxtImg> (@nuxt/image) pour : format auto (webp/avif), redimensionnement
 * responsive (srcset), lazy-loading et placeholder flou (LQIP).
 * Affiche légende + crédit s'ils sont renseignés. Arrondi piloté par le token
 * --a-radius (thème Sanity → « Mise en forme »).
 */
const props = withDefaults(
  defineProps<{
    image?: {
      asset?: { _ref?: string } | null
      alt?: string | null
      caption?: string | null
      credit?: string | null
    } | null
    // Indice de tailles pour le srcset responsive.
    sizes?: string
    loading?: 'lazy' | 'eager'
  }>(),
  {
    sizes: '(min-width: 1024px) 800px, 100vw',
    loading: 'lazy',
  }
);

const assetId = computed(() => props.image?.asset?._ref);
</script>

<template>
  <figure v-if="assetId" class="m-0">
    <SanityImage
      :asset-id="assetId"
      :alt="image?.alt || ''"
      auto="format"
      :sizes="sizes"
      :loading="loading"
      placeholder
      class="h-auto w-full"
      :style="{ borderRadius: 'var(--a-radius)' }"
    />
    <figcaption
      v-if="image?.caption || image?.credit"
      class="mt-2 text-sm text-muted">
      <span v-if="image?.caption">{{ image.caption }}</span>
      <span v-if="image?.credit" class="italic">
        <template v-if="image?.caption"> — </template>{{ image.credit }}
      </span>
    </figcaption>
  </figure>
</template>
