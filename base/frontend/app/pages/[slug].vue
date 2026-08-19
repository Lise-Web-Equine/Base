<script setup lang="ts">
import { pageQuery } from "~/sanity/queries";

const { data: page } = await useSanityQuery<PageQueryResult>(pageQuery, {
  slug: useRoute().params.slug,
});

// URL inconnue (aucune page publiée avec ce slug) : renvoyer un vrai 404
// afin d'afficher `error.vue` avec le bon code de statut (SEO).
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page introuvable" });
}

// This is needed to correctly set the studioUrl
const runtimeConfig = useRuntimeConfig();

useSiteMetadata({
  title: page?.value?.seoTitle || page?.value?.pageHeader?.title,
  description: page?.value?.seoDescription || page?.value?.pageHeader?.description,
  noIndex: page?.value?.noIndex ?? false,
});

// Hero collé au header : uniquement s'il n'y a pas de bandeau (pageHeader) au-
// dessus ET que la 1re section est un hero → on supprime la marge haute.
const firstIsHero = computed(
  () =>
    !page.value?.pageHeader?.title &&
    page.value?.pageBuilder?.[0]?._type === "heroSection"
);
</script>

<template>
  <div :class="firstIsHero ? 'mb-12 lg:mb-24' : 'my-12 lg:my-24'" v-if="page">
    <PageHeader :value="page.pageHeader" />
    <div>
      <div v-if="page.pageBuilder && page.pageBuilder.length > 0">
        <PageBuilder :blocks="page.pageBuilder" />
      </div>
      <div v-else>
        <h2 class="text-2xl font-semibold text-foreground">
          Cette page n'a pas encore de contenu.
        </h2>
        <p class="mt-2 text-base text-muted">
          Ouvrez la page dans le Studio pour ajouter du contenu.
        </p>
        <div v-if="runtimeConfig.public.studioUrl" class="mt-10 flex">
          <NuxtLink
            class="rounded-full flex gap-2 mr-6 items-center bg-black hover:bg-primary focus:bg-nuxt py-3 px-6 text-white transition-colors duration-200"
            :to="`${runtimeConfig.public.studioUrl}/structure/intent/edit/template=page;type=page;path=pageBuilder;id=${page._id}`"
            target="_blank"
            rel="noopener noreferrer">
            Ajouter du contenu à cette page
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
