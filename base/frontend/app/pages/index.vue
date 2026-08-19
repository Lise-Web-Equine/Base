<script setup lang="ts">
import { homeQuery } from "~/sanity/queries";

// La page d'accueil est le singleton `homePage` (sans slug), servi à la racine
// et rendu via le Page Builder. Éditable dans le Studio (entrée « Accueil »).
const { data: page } = await useSanityQuery<HomeQueryResult>(homeQuery);

const runtimeConfig = useRuntimeConfig();

useSiteMetadata({
  title: page?.value?.seoTitle,
  description: page?.value?.seoDescription,
  noIndex: page?.value?.noIndex ?? false,
});

// La 1re section est-elle un hero ? Si oui, on supprime la marge haute pour que
// le hero (pleine largeur) colle au header — en mode normal comme superposé.
const firstIsHero = computed(
  () => page.value?.pageBuilder?.[0]?._type === "heroSection"
);
</script>

<template>
  <div :class="firstIsHero ? 'mb-12 lg:mb-24' : 'my-12 lg:my-24'" v-if="page">
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
