<script setup lang="ts">
/**
 * Section "FAQ" du Page Builder (brique Cœur).
 * Affiche une liste de questions/réponses (accordéon accessible via <details>)
 * et génère les données structurées Schema.org (FAQPage) pour le SEO.
 */
import type { PortableTextBlock } from "sanity";

const props = defineProps({
  block: {
    type: Object as PropType<FaqSection>,
    required: true,
  },
});

const items = computed(() => props.block?.items ?? []);

// Extrait le texte brut d'un contenu Portable Text (pour le JSON-LD FAQPage).
function toPlainText(blocks?: PortableTextBlock[] | null): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block: any) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) return "";
      const text = block.children.map((c: any) => c?.text ?? "").join("");
      return block.listItem ? `• ${text}` : text;
    })
    .filter(Boolean)
    .join("\n");
}

// Données structurées : chaque question devient une Question ; nuxt-schema-org
// les regroupe automatiquement dans une FAQPage.
useSchemaOrg(
  items.value
    .filter((item) => item?.question && item?.answer)
    .map((item) =>
      defineQuestion({
        name: item.question as string,
        acceptedAnswer: toPlainText(item.answer as PortableTextBlock[]),
      })
    )
);
</script>

<template>
  <section class="container my-12">
    <div class="mx-auto max-w-3xl">
      <div v-if="block.eyebrow || block.heading || block.intro" class="mb-8 flex flex-col gap-3">
        <p v-if="block.eyebrow" class="a-eyebrow">
          {{ block.eyebrow }}
        </p>
        <h2 v-if="block.heading" class="a-h1">
          {{ block.heading }}
        </h2>
        <p v-if="block.intro" class="a-lead">
          {{ block.intro }}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <details
          v-for="(item, i) in items"
          :key="item._key || i"
          class="group border border-border bg-surface"
          :style="{ borderRadius: 'var(--a-radius)' }">
          <summary
            class="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium text-foreground marker:content-none">
            <span>{{ item.question }}</span>
            <Icon
              name="carbon:chevron-down"
              size="1.2em"
              class="shrink-0 text-muted transition-transform group-open:rotate-180"
              aria-hidden="true" />
          </summary>
          <div class="px-5 pb-5">
            <PortableText
              v-if="item.answer"
              :portable-text="(item.answer as any)"
              class="prose-sm" />
          </div>
        </details>
      </div>
    </div>
  </section>
</template>
