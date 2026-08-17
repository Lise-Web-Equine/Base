<script setup lang="ts">
/**
 * Bouton réutilisable rendu à partir de l'objet Sanity `button`
 * (label + link + color + variant). Fin wrapper autour de <UButton> (Nuxt UI) :
 * `color` (primary/secondary/neutral) et `variant` (solid/outline/subtle/soft)
 * sont passés tels quels, donc appliquent le thème du site.
 */
import type { ButtonProps } from "@nuxt/ui";
import { stegaClean } from "@sanity/client/stega";
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

// Style Sanity → props <UButton> (le thème s'applique via `color`).
const color = computed(
  () => (stegaClean(props.button?.color) || "primary") as ButtonProps["color"]
);
const variant = computed(
  () => (stegaClean(props.button?.variant) || "solid") as ButtonProps["variant"]
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
