<script lang="ts" setup>
import { stegaClean } from "@sanity/client/stega";
import { postsQuery, settingsQuery } from "~/sanity/queries";
import { sanityImageUrl } from "~/lib/sanityImage";
import { excerptFromContent } from "~/lib/excerpt";

// Rubrique blog/actualités désactivée dans les Réglages → 404.
const { data: settings } = await useSanityQuery<SettingsQueryResult>(
  settingsQuery
);
if (settings.value?.blog?.enabled !== true) {
  throw createError({ statusCode: 404, statusMessage: "Page introuvable" });
}

const label =
  stegaClean(settings.value?.blog?.label) === "actualites" ? "Actualités" : "Blog";

const { data: posts } = await useSanityQuery<PostsQueryResult>(postsQuery);

// Articles mis en forme pour les composants Nuxt UI <UBlogPosts>/<UBlogPost>.
const sanity = useSanity();
const articles = computed(() =>
  (posts.value ?? []).map((p) => ({
    title: p.title ?? "",
    // Priorité : Résumé éditorial → description SEO → extrait auto (sans « … »).
    description:
      p.excerpt ||
      p.seoDescription ||
      excerptFromContent(p.content as any).replace(/\s*…\s*$/, "") ||
      undefined,
    badge: (stegaClean(p.category) as string) || undefined,
    date: p.date ?? undefined,
    to: `/articles/${p.slug?.current}`,
    image: sanityImageUrl(
      (p.coverImage as any)?.asset?._ref,
      (sanity.config as any)?.projectId,
      (sanity.config as any)?.dataset,
      "auto=format&fit=crop&w=800&h=500"
    ),
  }))
);

// Dernier article publié = mis en avant ; les suivants en grille.
const featured = computed(() => articles.value[0]);
const rest = computed(() => articles.value.slice(1));

useSiteMetadata({
  title: label,
});
</script>

<template>
  <div class="container my-12 lg:my-24">
    <h1 class="a-h1 mb-8">{{ label }}</h1>

    <!-- Dernier article publié, mis en avant : UBlogPost horizontal, variant soft. -->
    <UBlogPost
      v-if="featured"
      :title="featured.title"
      :badge="featured.badge"
      :date="featured.date"
      :image="featured.image"
      :to="featured.to"
      orientation="horizontal"
      variant="soft"
      class="group mb-8">
      <template #description>
        <span v-if="featured.description" class="block text-muted">
          {{ featured.description }}
        </span>
        <span
          class="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
          Lire l'article
          <UIcon
            name="i-lucide-arrow-right"
            class="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </template>
    </UBlogPost>

    <!-- Les autres articles : tous en horizontal (liste en une colonne). -->
    <UBlogPosts orientation="vertical">
      <UBlogPost
        v-for="(article, i) in rest"
        :key="i"
        :title="article.title"
        :badge="article.badge"
        :date="article.date"
        :image="article.image"
        :to="article.to"
        orientation="horizontal"
        class="group">
        <template #description>
          <span v-if="article.description" class="block text-muted">
            {{ article.description }}
          </span>
          <span
            class="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
            Lire l'article
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        </template>
      </UBlogPost>
    </UBlogPosts>
  </div>
</template>
