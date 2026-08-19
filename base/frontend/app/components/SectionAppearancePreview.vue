<script setup lang="ts">
/**
 * Aperçu d'une section pour l'atelier « Apparence des sections » (OUTIL DEV).
 *
 * Rend la section via son enveloppe réelle <SectionShell> à partir d'un jeu de
 * valeurs (`values`) et de la description de la section (`section`).
 *
 * Fond du CTA :
 *  - par défaut, le `variant` d'UPageCTA fournit le fond (bande transparente) ;
 *  - si une image de fond est renseignée, elle OVERRIDE le variant : on
 *    reconstitue la bande image + voile (SectionShell n'affiche que des assets
 *    Sanity, ici l'image est simulée) et le `variant` est forcé à `naked`.
 *
 * Utilisé à la fois dans la page atelier et dans la route d'aperçu embarquée en
 * iframe (pour un rendu réellement responsive : l'iframe a son propre viewport).
 */
import type {
  PlaygroundSection,
  PlaygroundLink,
  PropControl,
} from "~/lib/sectionsPlayground";
import { colorSlotToCssVar } from "~/lib/utils";

const props = defineProps<{
  section: PlaygroundSection;
  values: Record<string, any>;
}>();

const componentControls = computed<PropControl[]>(() =>
  props.section.controls.filter((c) => (c.target ?? "component") === "component")
);

// Props du composant Nuxt UI (nettoyées : pas de chaîne/tableau vide).
const boundProps = computed(() => {
  const out: Record<string, unknown> = {};
  for (const c of componentControls.value) {
    const v = props.values[c.key];
    if (c.type === "boolean") {
      if (v) out[c.key] = true;
    } else if (c.type === "links") {
      const cleaned = ((v as PlaygroundLink[]) ?? [])
        .filter((l) => l.label?.trim())
        .map((l) => ({
          label: l.label,
          to: l.to || undefined,
          color: l.color || undefined,
          variant: l.variant || undefined,
        }));
      if (cleaned.length) out[c.key] = cleaned;
    } else if (typeof v === "string") {
      if (v.trim()) out[c.key] = v;
    } else if (v != null) {
      out[c.key] = v;
    }
  }
  return out;
});

const isHorizontal = computed(() => props.values.orientation === "horizontal");
const bgImageUrl = computed(() => (props.values.image as string) || "");
const hasImage = computed(() => !!bgImageUrl.value);

// Fond coloré (variant) en bande comme en colonne ; une image renseignée prime
// et force `variant: "naked"` (override image).
const finalProps = computed(() => {
  const base = { ...boundProps.value };
  if (hasImage.value) base.variant = "naked";
  return base;
});

// --- En-tête principal (hero, base UPageHero) : fond au choix comme dans le
// Studio (couleur du thème / image / vidéo / carrousel), rendu comme le vrai
// composant <HeroSection> (couche de fond + <UPageHero> par-dessus).
const isHero = computed(() => props.section.baseComponent === "UPageHero");
const heroBgType = computed(() => (props.values.bgType as string) || "color");
const heroColorVar = computed(() =>
  colorSlotToCssVar((props.values.bgColor as string) || "surface")
);
const heroImage = computed(() => (props.values.image as string) || "");
const heroVideo = computed(() => (props.values.video as string) || "");
const heroCarousel = computed<string[]>(() =>
  ((props.values.carousel as string[]) ?? []).filter(Boolean)
);
const heroLightText = computed(() => props.values.lightText !== false);
// Typographie du thème (titre + sur-titre), comme dans <HeroSection>.
const heroUi = computed(() => ({
  title:
    "font-display [font-weight:var(--a-heading-weight)] [text-transform:var(--a-display-case)]",
  headline:
    "a-headline [font-weight:var(--a-headline-weight)] " +
    (heroLightText.value ? "text-highlighted" : "text-primary"),
}));
const heroIsMedia = computed(() =>
  ["image", "video", "carousel"].includes(heroBgType.value)
);
const heroOverlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${(Number(props.values.overlayOpacity ?? 40) || 0) / 100})`,
}));

const widthValue = computed(() => (props.values.width as string) || "container");
const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${(Number(props.values.overlayOpacity ?? 40) || 0) / 100})`,
}));
const useLightText = computed(() => props.values.lightText !== false);
// Réplique la contrainte de largeur « Conteneur » de SectionShell (bande image).
const bandStyle = computed(() =>
  props.values.width === "full"
    ? {}
    : { width: "min(100% - 2 * var(--gutter), var(--site-max))", marginInline: "auto" }
);
</script>

<template>
  <!-- En-tête principal (hero) : couche de fond + <UPageHero> par-dessus. -->
  <section
    v-if="isHero"
    class="relative w-full overflow-hidden"
    :class="heroLightText ? 'dark' : ''">
    <div class="absolute inset-0 isolate">
      <div
        v-if="heroBgType === 'color'"
        class="h-full w-full"
        :style="{ backgroundColor: heroColorVar }" />
      <img
        v-else-if="heroBgType === 'image' && heroImage"
        :src="heroImage"
        alt=""
        class="h-full w-full object-cover" />
      <video
        v-else-if="heroBgType === 'video' && heroVideo"
        :src="heroVideo"
        class="h-full w-full object-cover"
        autoplay
        muted
        loop
        playsinline />
      <swiper-container
        v-else-if="heroBgType === 'carousel' && heroCarousel.length"
        class="h-full w-full"
        slides-per-view="1"
        effect="fade"
        loop="true"
        autoplay="true"
        speed="1200">
        <swiper-slide v-for="(src, i) in heroCarousel" :key="i">
          <img :src="src" alt="" class="h-full w-full object-cover" />
        </swiper-slide>
      </swiper-container>
      <div v-if="heroIsMedia" class="absolute inset-0 z-[2]" :style="heroOverlayStyle" />
    </div>
    <div class="relative z-10">
      <UPageHero v-bind="boundProps" :ui="heroUi">
        <template v-if="isHorizontal" #default>
          <img
            src="https://picsum.photos/704/540"
            alt=""
            class="w-full rounded-[var(--ui-radius)]"
            loading="lazy" />
        </template>
      </UPageHero>
    </div>
  </section>

  <!-- Override image : image de fond + voile, variant forcé naked -->
  <div
    v-else-if="hasImage"
    class="relative overflow-hidden"
    :class="useLightText ? 'dark' : ''"
    :style="bandStyle">
    <img
      :src="bgImageUrl"
      alt=""
      class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0" :style="overlayStyle" />
    <div class="relative">
      <SectionShell
        :base="section.baseComponent"
        :appearance="{ background: 'image', width: 'full' }"
        v-bind="finalProps">
        <template v-if="isHorizontal" #default>
          <img
            src="https://picsum.photos/704/540"
            alt=""
            class="w-full rounded-[var(--ui-radius)]"
            loading="lazy" />
        </template>
      </SectionShell>
    </div>
  </div>

  <!-- Sinon : le `variant` d'UPageCTA fournit le fond (bande transparente). -->
  <SectionShell
    v-else
    :base="section.baseComponent"
    :appearance="{ background: 'none', width: widthValue }"
    v-bind="finalProps">
    <template v-if="isHorizontal" #default>
      <img
        src="https://picsum.photos/704/540"
        alt=""
        class="w-full rounded-[var(--ui-radius)]"
        loading="lazy" />
    </template>
  </SectionShell>
</template>
