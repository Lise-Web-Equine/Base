<script setup lang="ts">
import { colorSlotToCssVar } from "~/lib/utils";

const props = defineProps({
  block: {
    type: Object as PropType<CallToAction>,
    required: true,
  },
});

const bg = computed(() => props.block?.background);
const isImageBg = computed(() => bg.value?.type === "image");

// Couleur de fond (slot du thème) lorsque le fond est de type couleur.
const colorBgStyle = computed(() =>
  bg.value?.type === "color"
    ? { backgroundColor: colorSlotToCssVar(bg.value?.colorSlot) }
    : undefined
);

// Voile (overlay) posé sur l'image de fond pour la lisibilité du texte.
const overlayStyle = computed(() => {
  if (!isImageBg.value || !bg.value?.overlay || bg.value.overlay === "none") {
    return undefined;
  }
  const base = bg.value.overlay === "light" ? "255, 255, 255" : "0, 0, 0";
  const opacity = (bg.value.overlayOpacity ?? 40) / 100;
  return { backgroundColor: `rgba(${base}, ${opacity})` };
});

// Texte clair lorsque le fond image est assombri, sinon texte du thème.
const useLightText = computed(
  () => isImageBg.value && bg.value?.overlay !== "light"
);
</script>

<template>
  <section class="container my-12">
    <div
      class="relative overflow-hidden rounded-2xl border border-border"
      :style="colorBgStyle"
    >
      <!-- Fond image + voile -->
      <template v-if="isImageBg && bg?.image?.asset?._ref">
        <SanityImage
          class="absolute inset-0 h-full w-full object-cover"
          :asset-id="bg.image.asset._ref"
          :alt="bg.image.alt || ''"
          auto="format"
        />
        <div
          v-if="overlayStyle"
          class="absolute inset-0"
          :style="overlayStyle"
        />
      </template>

      <div
        class="relative flex flex-col gap-6 px-8 py-12 sm:px-12 sm:py-16"
        :class="useLightText ? 'text-white' : 'text-foreground'"
      >
        <div class="flex max-w-2xl flex-col gap-3">
          <p
            v-if="block.eyebrow"
            class="text-sm font-semibold uppercase tracking-wide"
            :class="useLightText ? 'text-white/80' : 'text-primary'"
          >
            {{ block.eyebrow }}
          </p>
          <h2
            v-if="block.heading"
            class="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {{ block.heading }}
          </h2>
          <p
            v-if="block.text"
            class="text-lg leading-8"
            :class="useLightText ? 'text-white/90' : 'text-muted'"
          >
            {{ block.text }}
          </p>
        </div>

        <div
          v-if="block.primaryButton || block.secondaryButton"
          class="flex flex-wrap items-center gap-4"
        >
          <AppButton v-if="block.primaryButton" :button="block.primaryButton" />
          <AppButton
            v-if="block.secondaryButton"
            :button="block.secondaryButton"
          />
        </div>
      </div>
    </div>
  </section>
</template>
