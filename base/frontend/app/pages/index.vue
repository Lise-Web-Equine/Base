<script setup lang="ts">
import { homeQuery } from "~/sanity/queries";

// La page d'accueil est le singleton `homePage` (sans slug), servi à la racine
// et rendu via le Page Builder. Éditable dans le Studio (entrée « Accueil »).
const { data: page } = await useSanityQuery<HomeQueryResult>(homeQuery);

const runtimeConfig = useRuntimeConfig();

useSiteMetadata({
  title: page?.value?.seoTitle || page?.value?.heading,
  description: page?.value?.seoDescription || page?.value?.subheading,
  noIndex: page?.value?.noIndex ?? false,
});
</script>

<template>
  <div class="my-12 lg:my-24" v-if="page">
    <div class="container" v-if="page.heading || page.subheading">
      <div class="pb-6 border-b border-border">
        <div class="max-w-3xl">
          <h2 v-if="page.heading" class="a-display">
            {{ page.heading }}
          </h2>
          <p v-if="page.subheading" class="a-lead mt-4 uppercase">
            {{ page.subheading }}
          </p>
        </div>
      </div>
    </div>
    <PageBuilder
      v-if="page.pageBuilder && page.pageBuilder.length > 0"
      :blocks="page.pageBuilder" />
  </div>

  <div v-else class="container my-24 text-center">
    <h1 class="text-2xl font-semibold text-foreground">
      Page d'accueil non configurée
    </h1>
    <p class="mt-2 text-base text-muted">
      Ouvrez l'entrée « Accueil » dans le Studio et ajoutez du contenu.
    </p>
    <div v-if="runtimeConfig.public.studioUrl" class="mt-8 flex justify-center">
      <NuxtLink
        class="rounded-full flex gap-2 items-center bg-black hover:bg-primary py-3 px-6 text-white transition-colors duration-200"
        :to="runtimeConfig.public.studioUrl"
        target="_blank"
        rel="noopener noreferrer">
        Ouvrir le Studio
      </NuxtLink>
    </div>
  </div>
</template>
