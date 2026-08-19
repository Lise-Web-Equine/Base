<script setup lang="ts">
/**
 * Section "En-tête principal" (brique Projet) du Page Builder.
 * Grand en-tête construit sur <UPageHero> (Nuxt UI), avec un fond au choix :
 * couleur du thème, image, vidéo ou carrousel.
 *
 * Contenu (sur-titre / titre / description / boutons) → onglet « Contenu ».
 * Fond + style des boutons → onglet « Apparence » (piloté depuis le Studio).
 */
import type { ButtonProps } from "@nuxt/ui";
import imageUrlBuilder from "@sanity/image-url";
import { stegaClean } from "@sanity/client/stega";
import { colorSlotToCssVar, linkResolver } from "~/lib/utils";

const props = defineProps({
  block: {
    type: Object as PropType<HeroSection>,
    required: true,
  },
  // Position dans la page (fournie par PageBuilder). 1re section → média
  // prioritaire (eager + fetchpriority high) pour préserver le LCP.
  index: {
    type: Number,
    default: 0,
  },
});

const priority = computed(() => props.index === 0);

const sanity = useSanity();
const builder = imageUrlBuilder({
  projectId: (sanity.config as any)?.projectId,
  dataset: (sanity.config as any)?.dataset,
});

// `background` inclut `videoUrl` (résolu par la projection GROQ), absent du
// type de schéma : on le lit via un accès souple.
const bg = computed(() => (props.block.background as any) ?? {});
const bgType = computed(() => stegaClean(bg.value?.type) || "color");
const isMedia = computed(() =>
  ["image", "video", "carousel"].includes(bgType.value)
);

// Texte clair (sur fond sombre / média) → classe `dark` (bascule la palette).
const lightText = computed(() => stegaClean(bg.value?.lightText) !== false);

// Typographie du thème appliquée à <UPageHero>. Le titre est aligné sur
// l'échelle du thème globalement (app.config → pageHero) ; ici on ne règle que
// le sur-titre (police + graisse d'en-tête + couleur accent, ou clair sur
// fond sombre / média). La couleur du titre suit la classe `dark` le cas échéant.
const heroUi = computed(() => ({
  // Le titre est géré globalement (app.config → pageHero), aligné sur l'échelle
  // typographique du thème (--a-display). On ne gère ici que la couleur du
  // sur-titre, qui dépend du fond (texte clair sur média sombre).
  headline:
    "a-headline [font-weight:var(--a-headline-weight)] " +
    (lightText.value ? "text-highlighted" : "text-primary"),
}));
const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${(bg.value?.overlay ?? 40) / 100})`,
}));

// Fond « couleur » : variable CSS du slot de couleur du thème.
const bgColorVar = computed(() =>
  colorSlotToCssVar(stegaClean(bg.value?.color) || "surface")
);

const imgUrl = (img: any, w = 1920) =>
  img?.asset?._ref
    ? builder.image(img).width(w).auto("format").fit("max").url()
    : "";

const imageUrl = computed(() =>
  bgType.value === "image" ? imgUrl(bg.value?.image) : ""
);
const posterUrl = computed(() => imgUrl(bg.value?.poster));
const videoUrl = computed(() => bg.value?.videoUrl || "");
const carouselImages = computed(() =>
  bgType.value === "carousel"
    ? (bg.value?.carousel ?? []).filter((i: any) => i?.asset?._ref)
    : []
);

// Boutons Sanity → props <UButton>. Le style (couleur + variant) provient de
// l'onglet « Apparence » et s'applique à tous les boutons.
const links = computed<ButtonProps[]>(() => {
  const color = (stegaClean(props.block.buttonColor) ||
    "primary") as ButtonProps["color"];
  const variant = (stegaClean(props.block.buttonVariant) ||
    "solid") as ButtonProps["variant"];
  return (props.block.buttons ?? [])
    .filter((b) => !!b?.label)
    .map((b) => {
      const to = b.link ? linkResolver(b.link) : null;
      return {
        label: b.label!,
        to: to || undefined,
        target: b.link?.openInNewTab ? "_blank" : undefined,
        color,
        variant,
        size: "xl",
      } as ButtonProps;
    });
});
</script>

<template>
  <section
    class="relative w-full overflow-hidden"
    :class="lightText ? 'dark' : ''">
    <!-- Couche de fond (isolate : contient le z-index interne de Swiper) -->
    <div class="absolute inset-0 isolate">
      <!-- Couleur du thème -->
      <div
        v-if="bgType === 'color'"
        class="h-full w-full"
        :style="{ backgroundColor: bgColorVar }" />

      <!-- Image -->
      <img
        v-else-if="bgType === 'image' && imageUrl"
        :src="imageUrl"
        :alt="bg?.image?.alt || ''"
        class="h-full w-full object-cover"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined" />

      <!-- Vidéo (muette, en boucle) -->
      <video
        v-else-if="bgType === 'video' && videoUrl"
        class="h-full w-full object-cover"
        :src="videoUrl"
        :poster="posterUrl || undefined"
        autoplay
        muted
        loop
        playsinline />

      <!-- Carrousel d'images (fondu, lecture auto) -->
      <swiper-container
        v-else-if="bgType === 'carousel' && carouselImages.length"
        class="h-full w-full"
        slides-per-view="1"
        effect="fade"
        loop="true"
        autoplay="true"
        speed="1200">
        <swiper-slide
          v-for="(img, i) in carouselImages"
          :key="img.asset?._ref || i">
          <img
            :src="imgUrl(img)"
            :alt="img.alt || ''"
            class="h-full w-full object-cover"
            :loading="priority && i === 0 ? 'eager' : 'lazy'" />
        </swiper-slide>
      </swiper-container>

      <!-- Voile sombre sur les médias (au-dessus du carrousel), pour la lisibilité -->
      <div v-if="isMedia" class="absolute inset-0 z-[2]" :style="overlayStyle" />
    </div>

    <!-- Contenu (au-dessus du fond, y compris le carrousel z-indexé de Swiper) -->
    <div class="relative z-10">
      <UPageHero
        :headline="block.headline || undefined"
        :title="block.title || undefined"
        :description="block.description || undefined"
        :links="links"
        :ui="heroUi">
        <template v-if="block.headline" #headline>
          <RichString :text="block.headline" />
        </template>
        <template v-if="block.title" #title>
          <RichString :text="block.title" />
        </template>
        <template v-if="block.description" #description>
          <RichString :text="block.description" />
        </template>
      </UPageHero>
    </div>
  </section>
</template>
