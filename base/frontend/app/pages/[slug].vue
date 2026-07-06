<script setup lang="ts">
import { pageQuery } from "~/sanity/queries";

const { data: page } = await useSanityQuery<PageQueryResult>(pageQuery, {
  slug: useRoute().params.slug,
});

// This is needed to correctly set the studioUrl
const runtimeConfig = useRuntimeConfig();

useSiteMetadata({
  title: page?.value?.seoTitle || page?.value?.heading,
  description: page?.value?.seoDescription || page?.value?.subheading,
  noIndex: page?.value?.noIndex ?? false,
});
</script>

<template>
  <div class="my-12 lg:my-24" v-if="page">
    <div class="container">
      <div class="pb-6 border-b border-border">
        <div class="max-w-3xl">
          <h2
            v-if="page.heading"
            class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
            {{ page.heading }}
          </h2>
          <p
            class="mt-4 text-base lg:text-lg leading-relaxed text-muted uppercase font-light">
            {{ page.subheading }}
          </p>
        </div>
      </div>
    </div>
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
