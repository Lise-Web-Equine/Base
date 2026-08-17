<script setup lang="ts">
/**
 * Section "Appel à l'action" (brique Cœur).
 * Construite sur <SectionShell> avec <UPageCTA> (Nuxt UI) comme composant de
 * base (`base="UPageCTA"`). La variante de fond (`variant`) est réglable dans
 * le Studio (colonne uniquement), forcée à « naked » s'il y a une image de
 * fond. L'apparence (image + largeur) vient de `block.appearance`.
 *
 * Disposition :
 *  - « Bande »   → texte centré (vertical).
 *  - « Colonne » → illustration à côté du texte (UPageCTA orientation
 *    horizontale + slot par défaut ; `reverse` pour inverser le côté).
 */
import type { ButtonProps } from "@nuxt/ui";
import imageUrlBuilder from "@sanity/image-url";
import { stegaClean } from "@sanity/client/stega";
import { linkResolver } from "~/lib/utils";

const props = defineProps({
  block: {
    type: Object as PropType<CallToAction>,
    required: true,
  },
  // Position de la section dans la page (fournie par PageBuilder). La 1re
  // section est prioritaire : ses images se chargent en `eager` (LCP).
  index: {
    type: Number,
    default: 0,
  },
});

// 1re section de la page → image prioritaire (eager + fetchpriority high).
const priority = computed(() => props.index === 0);

const sanity = useSanity();
const builder = imageUrlBuilder({
  projectId: (sanity.config as any)?.projectId,
  dataset: (sanity.config as any)?.dataset,
});

const isColumn = computed(() => stegaClean(props.block.layout) === "column");
const reverse = computed(() => props.block.reverse === true);

// Variante de fond du bloc <UPageCTA>. Comme dans « sections-apparence » :
//  - une image de fond prime → "naked" ;
//  - hors disposition colonne (bande) → "naked" (seule l'image peut faire fond) ;
//  - sinon on applique la variante choisie.
const hasBgImage = computed(
  () => !!(props.block.appearance as any)?.image?.asset
);
const ctaVariant = computed(() =>
  hasBgImage.value || !isColumn.value
    ? "naked"
    : stegaClean(props.block.variant) || "naked"
);

// « Bord perdu » : l'illustration colle aux bords du bloc. On ne compense pas le
// padding avec des marges négatives (fragile) : on RETIRE le padding du conteneur
// du bloc et on le REPORTE sur la colonne texte. L'image remplit alors sa cellule
// (touche 3 bords) tandis que le texte garde son padding. Ne vaut qu'avec un bloc
// coloré (variant non-naked), seul cas où ce padding existe.
const CTA_BLOCK_VARIANTS = ["solid", "outline", "soft", "subtle"];
const bleed = computed(
  () =>
    props.block.illustrationBleed === true &&
    CTA_BLOCK_VARIANTS.includes(ctaVariant.value)
);
// Override `ui` transmis à <UPageCTA> via <SectionShell> : conteneur sans padding
// ni gap, padding reporté sur le bloc texte (mêmes valeurs que le thème).
const bleedUi = computed(() =>
  bleed.value
    ? {
        container: "p-0 sm:p-0 lg:p-0 gap-0 sm:gap-0",
        wrapper: "px-6 py-12 sm:px-12 sm:py-24 lg:px-16 lg:py-24",
      }
    : undefined
);
const illustrationClass = computed(() =>
  bleed.value
    ? "w-full object-cover lg:h-full lg:self-stretch"
    : "w-full rounded-[var(--ui-radius)]"
);

// Illustration (disposition colonne) : URL via le builder officiel (crop + hotspot).
const illustrationUrl = computed(() => {
  const img = props.block.illustration as any;
  if (!isColumn.value || !img?.asset?._ref) return "";
  return builder.image(img).width(1200).auto("format").fit("max").url();
});

// Bouton Sanity → props <UButton> attendues par `links` de <UPageCTA>.
// Le style (couleur + variant) n'est pas porté par le bouton mais par la
// section (onglet « Apparence » du Studio) : il est passé explicitement et
// appliqué tel quel par <UButton>, donc via le thème.
type CtaButton = CallToAction["primaryButton"];

function toButtonProps(
  button?: CtaButton | null,
  color?: string | null,
  variant?: string | null
): ButtonProps | null {
  if (!button?.label) return null;
  const to = button.link ? linkResolver(button.link) : null;
  return {
    label: button.label,
    to: to || undefined,
    target: button.link?.openInNewTab ? "_blank" : undefined,
    color: (stegaClean(color) || "primary") as ButtonProps["color"],
    variant: (stegaClean(variant) || "solid") as ButtonProps["variant"],
  };
}

const links = computed<ButtonProps[]>(() =>
  [
    toButtonProps(
      props.block.primaryButton,
      props.block.primaryButtonColor,
      props.block.primaryButtonVariant
    ),
    toButtonProps(
      props.block.secondaryButton,
      props.block.secondaryButtonColor,
      props.block.secondaryButtonVariant
    ),
  ].filter((b): b is ButtonProps => b !== null)
);
</script>

<template>
  <SectionShell
    :appearance="block.appearance"
    base="UPageCTA"
    :variant="ctaVariant"
    :ui="bleedUi"
    :priority="priority"
    :title="block.heading"
    :description="block.text || undefined"
    :links="links"
    :orientation="isColumn ? 'horizontal' : undefined"
    :reverse="isColumn ? reverse : undefined">
    <template v-if="isColumn && illustrationUrl" #default>
      <img
        :src="illustrationUrl"
        :alt="block.illustration?.alt || ''"
        :class="illustrationClass"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined" />
    </template>
  </SectionShell>
</template>
