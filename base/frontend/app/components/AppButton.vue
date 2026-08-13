<script setup lang="ts">
/**
 * Bouton réutilisable rendu à partir de l'objet Sanity `button`
 * (label + link + variant). Fin wrapper autour de <UButton> (Nuxt UI) : les
 * couleurs viennent du thème (pont de couleurs), l'arrondi suit --ui-radius.
 */
import { linkResolver } from "~/lib/utils";

const props = defineProps({
  button: {
    type: Object as PropType<Button>,
    required: true,
  },
});

// Lien résolu (page / post / URL) → prop `to` de <UButton>.
const to = computed(() => (props.button?.link ? linkResolver(props.button.link) : undefined));
const target = computed(() =>
  props.button?.link?.openInNewTab ? "_blank" : undefined
);

// Mappe le variant Sanity vers les props Nuxt UI (couleur + style).
const color = computed<"primary" | "secondary">(() =>
  props.button?.variant === "secondary" ? "secondary" : "primary"
);
const variant = computed<"solid" | "outline">(() =>
  props.button?.variant === "outline" ? "outline" : "solid"
);
</script>

<template>
  <UButton
    v-if="button?.label"
    :to="to || undefined"
    :target="target"
    :color="color"
    :variant="variant"
    :label="button.label"
    size="lg" />
</template>
