<script setup lang="ts">
/**
 * Section "Section de page" (brique Projet) du Page Builder.
 * Construite sur <UPageSection> (Nuxt UI), avec un fond au choix (comme
 * l'en-tête principal) : couleur du thème, image, vidéo ou carrousel.
 *
 * Contenu (sur-titre / titre / description / fonctionnalités / boutons) →
 * onglet « Contenu ». Fond + style des boutons + largeur + disposition →
 * onglet « Apparence » (piloté depuis le Studio).
 *
 * Disposition :
 *  - « Bande »                   → contenu pleine largeur (vertical).
 *  - « Illustration en colonne » → image à côté du contenu (orientation
 *    horizontale + slot par défaut).
 */
import type { ButtonProps } from "@nuxt/ui";
import imageUrlBuilder from "@sanity/image-url";
import { stegaClean } from "@sanity/client/stega";
import { colorSlotToCssVar, linkResolver } from "~/lib/utils";

const props = defineProps({
  block: {
    type: Object as PropType<PageSection>,
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

// Description : texte enrichi (Portable Text). Rendu via le slot #description.
const hasDescription = computed(
  () => Array.isArray(props.block.description) && props.block.description.length > 0
);

// Largeur : contenu contraint à la largeur du site (Container) ou pleine largeur.
const isFull = computed(() => stegaClean(props.block.width) === "full");

// Disposition « Illustration en colonne » → orientation horizontale + slot image.
const isColumn = computed(() => stegaClean(props.block.layout) === "column");
const illustrationUrl = computed(() => {
  const img = props.block.illustration as any;
  if (!isColumn.value || !img?.asset?._ref) return "";
  return builder.image(img).width(1200).auto("format").fit("max").url();
});

// Largeur de la section : Container = contrainte à la largeur du site et
// détachée des bords (gouttière) ; Pleine largeur = bord à bord.
// Rythme vertical : `--section-space`, comme les sections <SectionShell>
// (le padding interne de <UPageSection> est neutralisé, voir `pageUi`).
const sectionStyle = computed(() => {
  const s: Record<string, string> = { paddingBlock: "var(--section-space)" };
  if (!isFull.value) {
    s.width = "min(100% - 2 * var(--gutter), var(--site-max))";
    s.marginInline = "auto";
  }
  return s;
});
// Gouttière latérale du contenu (le contenu ne colle pas aux bords).
const innerPadding = computed(() =>
  isFull.value
    ? "px-[var(--gutter)]"
    : "px-[clamp(var(--gutter),5vw,calc(var(--gutter)*2.5))]"
);

// Fonctionnalités Sanity → props <UPageFeature> attendues par `features`.
const features = computed(() =>
  (props.block.features ?? [])
    .filter((f) => !!f?.title)
    .map((f) => {
      const to = f.link ? linkResolver(f.link) : null;
      return {
        title: f.title!,
        description: f.description || undefined,
        icon: stegaClean(f.icon) || undefined,
        to: to || undefined,
        target: f.link?.openInNewTab ? "_blank" : undefined,
      };
    })
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

// Alignement de la citation calé sur celui de la section : en bande (vertical)
// le contenu est centré → citation centrée (sans barre) ; en colonne
// (horizontal) le contenu est aligné à gauche → barre latérale.
const citationClass = computed(() =>
  isColumn.value
    ? "border-s-4 border-primary ps-4 text-lg italic text-muted text-start"
    : "text-lg italic text-muted text-center"
);

// Overrides <UPageSection> : le conteneur remplit notre bande (la largeur est
// gérée par `sectionStyle`) ; sur-titre aux polices / couleur du thème.
const pageUi = computed(() => ({
  // `py-0` : on retire le padding vertical natif de <UPageSection> ; le rythme
  // est porté par `--section-space` sur la <section> (cf. sectionStyle).
  container: "max-w-none mx-0 w-full py-0 sm:py-0 lg:py-0",
  headline:
    "a-headline [font-weight:var(--a-headline-weight)] " +
    (lightText.value ? "text-highlighted" : "text-primary"),
}));
</script>

<template>
  <section
    class="relative w-full overflow-hidden"
    :class="lightText ? 'dark' : ''"
    :style="sectionStyle">
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
    <div class="relative z-10" :class="innerPadding">
      <UPageSection
        :headline="block.headline || undefined"
        :title="block.title || undefined"
        :features="features.length ? features : undefined"
        :links="links"
        :orientation="isColumn ? 'horizontal' : undefined"
        :ui="pageUi">
        <template v-if="block.headline" #headline>
          <RichString :text="block.headline" />
        </template>
        <template v-if="block.title" #title>
          <RichString :text="block.title" />
        </template>
        <template v-if="hasDescription" #description>
          <PortableText :portable-text="(block.description as any)" />
        </template>
        <template v-if="block.citation" #body>
          <blockquote :class="citationClass">
            <RichString :text="block.citation" />
          </blockquote>
        </template>
        <template v-if="isColumn && illustrationUrl" #default>
          <img
            :src="illustrationUrl"
            :alt="block.illustration?.alt || ''"
            class="w-full rounded-[var(--ui-radius)]"
            :loading="priority ? 'eager' : 'lazy'"
            :fetchpriority="priority ? 'high' : undefined" />
        </template>
      </UPageSection>
    </div>
  </section>
</template>
