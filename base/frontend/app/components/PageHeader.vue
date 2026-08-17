<script setup lang="ts">
/**
 * En-tête de page. Fin wrapper autour de <UPageHeader> (Nuxt UI) qui se branche
 * par défaut sur l'objet Sanity `pageHeader` (title / headline / description /
 * links). Les champs peuvent aussi être passés en props pour les pages qui ne
 * sont pas des documents Sanity (ex: la page Actualités).
 * Doc : https://ui.nuxt.com/docs/components/page-header
 */
import type { ButtonProps } from "@nuxt/ui";
import { stegaClean } from "@sanity/client/stega";
import { linkResolver } from "~/lib/utils";

const props = defineProps<{
  // Objet Sanity `pageHeader` résolu (via la projection GROQ pageHeaderFields).
  value?: PageHeader | null;
  // Surcharges directes (prioritaires sur `value`).
  title?: string;
  headline?: string;
  description?: string;
}>();

const title = computed(() => props.title ?? props.value?.title ?? undefined);
const headline = computed(() => props.headline ?? props.value?.headline ?? undefined);
const description = computed(
  () => props.description ?? props.value?.description ?? undefined
);

// Boutons Sanity → props <UButton> attendues par la prop `links` de <UPageHeader>.
const links = computed<ButtonProps[]>(() =>
  (props.value?.links ?? []).flatMap((button) => {
    if (!button?.label) return [];
    const to = button.link ? linkResolver(button.link) : null;
    return [
      {
        label: button.label,
        to: to || undefined,
        target: button.link?.openInNewTab ? "_blank" : undefined,
        color: (stegaClean(button.color) || "primary") as ButtonProps["color"],
        variant: (stegaClean(button.variant) ||
          "solid") as ButtonProps["variant"],
      } satisfies ButtonProps,
    ];
  })
);
</script>

<template>
  <UPageHeader
    v-if="title"
    :title="title"
    :headline="headline"
    :description="description"
    :links="links"
    class="container" />
</template>
