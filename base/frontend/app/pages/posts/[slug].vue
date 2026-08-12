<script lang="ts" setup>
import { postQuery, somePostsQuery, settingsQuery } from "~/sanity/queries";
import { excerptFromContent } from "~/lib/excerpt";
import { sanityImageUrl } from "~/lib/sanityImage";

// Rubrique blog/actualités désactivée dans les Réglages → 404.
const { data: settings } = await useSanityQuery<SettingsQueryResult>(
  settingsQuery
);
if (settings.value?.blog?.enabled !== true) {
  throw createError({ statusCode: 404, statusMessage: "Article introuvable" });
}

const { data: post } = await useSanityQuery<PostQueryResult>(postQuery, {
  slug: useRoute().params.slug,
});

// Article inexistant : renvoyer un vrai 404 (affiche `error.vue`).
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: "Article introuvable" });
}

// Dernières actualités : jusqu'à 3 autres articles (exclut l'article courant).
const { data: posts } = await useLazySanityQuery<SomePostsQueryResult>(
  somePostsQuery,
  {
    skip: useRoute().params.slug,
    limit: 3,
  }
);

// URL de l'image de couverture (générée directement, cf. lib/sanityImage).
const sanity = useSanity();
const coverImageUrl = computed(() =>
  sanityImageUrl(
    post.value?.coverImage?.asset?._ref,
    (sanity.config as any)?.projectId,
    (sanity.config as any)?.dataset
  )
);

// Date de publication formatée en français ("12 août 2026").
const publishedAt = computed(() => {
  const d = post.value?.date;
  if (!d) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(d));
  } catch {
    return "";
  }
});

useSiteMetadata({
  title: post?.value?.seoTitle || post?.value?.title,
  description:
    post?.value?.seoDescription ||
    excerptFromContent(post?.value?.content as any),
  ogImage: post?.value?.ogImage || undefined,
  ogType: "article",
  noIndex: post?.value?.noIndex ?? false,
});
</script>

<template>
  <div v-if="post">
    <div class="container my-12 lg:my-24 grid gap-12">
      <div>
        <div class="pb-6 grid gap-6 mb-6 border-b border-border">
          <div class="max-w-3xl flex flex-col gap-6">
            <h2 class="a-display">
              {{ post.title }}
            </h2>
          </div>

          <!-- Image mise en avant, sous le titre -->
          <img
            v-if="coverImageUrl"
            class="h-auto w-full rounded-2xl object-cover shadow-md"
            :src="coverImageUrl"
            :alt="post.coverImage?.alt || ''"
            loading="eager" />

          <!-- Méta : publié le, auteur, catégorie -->
          <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
            <ClientOnly>
              <p v-if="publishedAt" class="text-sm text-muted">
                Publié le {{ publishedAt }}
              </p>
            </ClientOnly>
            <Avatar v-if="post.author" :author="post.author" />
            <span
              v-if="post.category"
              class="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-primary">
              {{ post.category }}
            </span>
          </div>
        </div>

        <article class="gap-6 grid max-w-4xl">
          <div class="prose prose-a:text-primary max-w-2xl" v-if="post.content">
            <PortableText :portableText="post.content" />
          </div>
          <div class="mt-6 border-t border-border pt-6">
            <ShareArticle :title="post.title" />
          </div>
        </article>
      </div>
    </div>

    <!-- Dernières actualités : 3 dernières, seulement s'il y a d'autres articles -->
    <div class="border-t border-border" v-if="posts && posts.length">
      <div class="container my-12 lg:my-24 grid gap-12">
        <aside>
          <Posts heading="Dernières actualités" :posts="posts" />
        </aside>
      </div>
    </div>
  </div>
</template>
