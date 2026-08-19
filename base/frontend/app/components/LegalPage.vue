<script setup lang="ts">
import type { PortableTextBlock } from "sanity";
import { legalTextsQuery } from "~/sanity/queries";
import { legalPageByType, type LegalType } from "~/lib/legalPages";

/**
 * Rendu d'une page légale à partir du singleton `legalTexts` (CŒUR).
 * Chaque route sous `pages/` (mentions-legales, politique-confidentialite…)
 * n'est qu'un fin appel à ce composant avec le `type` correspondant.
 */
const props = defineProps<{ type: LegalType }>();
const config = legalPageByType(props.type);

const { data } = await useSanityQuery<LegalTextsQueryResult>(legalTextsQuery);
const doc = computed(() => data.value as Record<string, unknown> | null);

const title = computed(() => (doc.value?.[config.fields.title] as string) || config.defaultLabel);
const intro = computed(() =>
  config.fields.intro ? (doc.value?.[config.fields.intro] as string) || "" : ""
);
const content = computed(
  () => (doc.value?.[config.fields.content] as PortableTextBlock[] | undefined) ?? []
);

// Page inexistante / contenu vide → 404 (les liens du pied de page ne pointent
// que vers des pages renseignées, mais on protège l'accès direct).
if (!content.value.length) {
  throw createError({ statusCode: 404, statusMessage: "Page introuvable" });
}

// Bloc « Éditeur » + « Hébergeur » : uniquement sur les mentions légales.
const t = computed(() => (props.type === "legalNotice" ? doc.value : null));
const editorRows = computed(() => {
  const d = t.value;
  if (!d) return [] as { label: string; value: string }[];
  return (
    [
      { label: "Raison sociale", value: d.editorName },
      { label: "Forme juridique", value: d.editorLegalForm },
      { label: "SIRET", value: d.editorSiret },
      { label: "RCS", value: d.editorRcs },
      { label: "TVA intracommunautaire", value: d.editorVat },
      { label: "Adresse", value: d.editorAddress },
      { label: "Email", value: d.editorEmail },
      { label: "Téléphone", value: d.editorPhone },
      { label: "Directeur de la publication", value: d.editorPublicationDirector },
    ] as { label: string; value: unknown }[]
  )
    .filter((r) => !!r.value)
    .map((r) => ({ label: r.label, value: String(r.value) }));
});
const hostRows = computed(() => {
  const d = t.value;
  if (!d) return [] as { label: string; value: string }[];
  return (
    [
      { label: "Hébergeur", value: d.hostName },
      { label: "Adresse", value: d.hostAddress },
      { label: "Site web", value: d.hostWebsite },
    ] as { label: string; value: unknown }[]
  )
    .filter((r) => !!r.value)
    .map((r) => ({ label: r.label, value: String(r.value) }));
});

useSiteMetadata({
  title: title.value,
  description: intro.value || undefined,
  noIndex: false,
});
</script>

<template>
  <div class="container my-12 lg:my-24" :style="{ maxWidth: 'var(--a-content-width)' }">
    <h1 class="a-h1 mb-6">{{ title }}</h1>
    <p v-if="intro" class="a-lead mb-10">{{ intro }}</p>

    <!-- Éditeur / hébergeur (mentions légales uniquement). -->
    <template v-if="editorRows.length || hostRows.length">
      <section v-if="editorRows.length" class="mb-10">
        <h2 class="a-h3 mb-4">Éditeur du site</h2>
        <dl class="grid gap-2 text-sm">
          <div v-for="row in editorRows" :key="row.label" class="flex flex-wrap gap-x-2">
            <dt class="font-semibold text-foreground">{{ row.label }} :</dt>
            <dd class="text-muted">{{ row.value }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="hostRows.length" class="mb-10">
        <h2 class="a-h3 mb-4">Hébergement</h2>
        <dl class="grid gap-2 text-sm">
          <div v-for="row in hostRows" :key="row.label" class="flex flex-wrap gap-x-2">
            <dt class="font-semibold text-foreground">{{ row.label }} :</dt>
            <dd class="text-muted">{{ row.value }}</dd>
          </div>
        </dl>
      </section>
    </template>

    <PortableText :portableText="content" />
  </div>
</template>
