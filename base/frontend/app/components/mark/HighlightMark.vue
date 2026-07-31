<script setup lang="ts">
import type { PortableTextMarkComponentProps } from '@nuxtjs/sanity/runtime/types.js';
import { colorSlotToCssVar } from '~/lib/utils';

const props = defineProps<PortableTextMarkComponentProps>();

// L'annotation `highlight` (voir studio blockContent) fournit :
//  - color : slot de couleur du thème (ex: "primary")
//  - mode  : "text" (texte coloré) ou "background" (surligné)
const colorVar = computed(() =>
  colorSlotToCssVar((props.value as { color?: string })?.color)
);
const mode = computed(() => (props.value as { mode?: string })?.mode ?? 'text');

const style = computed(() => {
  if (!colorVar.value) return undefined;
  if (mode.value === 'background') {
    // Fond teinté (lisible) via color-mix : garde le texte courant lisible.
    return {
      backgroundColor: `color-mix(in srgb, ${colorVar.value} 22%, transparent)`,
    };
  }
  return { color: colorVar.value };
});
</script>

<template>
  <span
    :style="style"
    :class="mode === 'background' ? 'rounded px-1 py-0.5' : undefined"
  >
    <slot />
  </span>
</template>
