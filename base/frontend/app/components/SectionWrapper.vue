<script setup lang="ts">
import { colorSlotToCssVar } from "~/lib/utils";

/**
 * Conteneur commun de section (brique de layout « définie une fois »).
 *
 * Deux couches :
 *  - <section> pleine largeur : porte le FOND (couleur du thème OU image + voile)
 *    et l'espacement vertical (rythme fluide).
 *  - <div class="container"> : contraint le CONTENU à la largeur du site
 *    (token --site-max) avec une gouttière latérale fluide (--gutter).
 *
 * Ainsi le fond va toujours de bord à bord, et le contenu reste aligné sur la
 * même marge partout. Piloté par l'objet Sanity `sectionAppearance`.
 */
interface Appearance {
  background?: {
    type?: "none" | "color" | "image" | null;
    colorSlot?: string | null;
    image?: { asset?: { _ref?: string } | null; alt?: string | null } | null;
    overlay?: "none" | "dark" | "light" | null;
    overlayOpacity?: number | null;
  } | null;
  spacing?: "none" | "sm" | "md" | "lg" | null;
}

const props = defineProps<{ appearance?: Appearance | null }>();

const bg = computed(() => props.appearance?.background);
const isImageBg = computed(() => bg.value?.type === "image" && !!bg.value?.image?.asset?._ref);

const colorBgStyle = computed(() =>
  bg.value?.type === "color"
    ? { backgroundColor: colorSlotToCssVar(bg.value?.colorSlot) }
    : undefined
);

const overlayStyle = computed(() => {
  if (!isImageBg.value || !bg.value?.overlay || bg.value.overlay === "none") {
    return undefined;
  }
  const base = bg.value.overlay === "light" ? "255, 255, 255" : "0, 0, 0";
  const opacity = (bg.value.overlayOpacity ?? 40) / 100;
  return { backgroundColor: `rgba(${base}, ${opacity})` };
});

// Texte clair lorsque le fond image est assombri.
const useLightText = computed(
  () => isImageBg.value && bg.value?.overlay !== "light"
);

// Espacement vertical : module le rythme global (--section-space).
const paddingStyle = computed(() => {
  const map: Record<string, string> = {
    none: "0",
    sm: "calc(var(--section-space) * 0.5)",
    md: "var(--section-space)",
    lg: "calc(var(--section-space) * 1.5)",
  };
  const key = props.appearance?.spacing ?? "md";
  return { paddingBlock: map[key] ?? map.md };
});

const sectionStyle = computed(() => ({ ...colorBgStyle.value, ...paddingStyle.value }));
</script>

<template>
  <section class="relative w-full" :style="sectionStyle">
    <!-- Couche fond image + voile -->
    <template v-if="isImageBg">
      <SanityImage
        class="absolute inset-0 h-full w-full object-cover"
        :asset-id="bg!.image!.asset!._ref!"
        :alt="bg?.image?.alt || ''"
        auto="format"
      />
      <div v-if="overlayStyle" class="absolute inset-0" :style="overlayStyle" />
    </template>

    <!-- Couche contenu contrainte (largeur du site + gouttière fluide) -->
    <div class="container relative" :class="useLightText ? 'text-white' : undefined">
      <slot />
    </div>
  </section>
</template>
