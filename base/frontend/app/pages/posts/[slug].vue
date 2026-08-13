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

// À lire aussi : jusqu'à 3 autres articles (exclut l'article courant).
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

// « À lire aussi » : données mises en forme pour le composant Nuxt UI <UBlogPost>.
const relatedPosts = computed(() =>
  (posts.value ?? []).map((p) => ({
    title: p.title ?? "",
    // Priorité : Résumé éditorial → description SEO → extrait auto (sans « … »).
    description:
      p.excerpt ||
      p.seoDescription ||
      excerptFromContent(p.content as any).replace(/\s*…\s*$/, "") ||
      undefined,
    date: p.date ?? undefined,
    to: `/posts/${p.slug?.current}`,
    image: sanityImageUrl(
      (p.coverImage as any)?.asset?._ref,
      (sanity.config as any)?.projectId,
      (sanity.config as any)?.dataset,
      "auto=format&fit=crop&w=800&h=500"
    ),
  }))
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
    post?.value?.excerpt ||
    excerptFromContent(post?.value?.content as any),
  ogImage: post?.value?.ogImage || undefined,
  ogType: "article",
  noIndex: post?.value?.noIndex ?? false,
});
</script>

<template>
  <div v-if="post">
    <div class="container my-12 lg:my-24">
      <div class="grid gap-12 lg:grid-cols-3 lg:gap-16">
        <!-- Colonne droite (sticky) : partage + À lire aussi -->
        <aside
          class="order-2 lg:col-span-1 lg:sticky lg:top-24 lg:self-start space-y-10">
          <!-- Carte de présentation de l'organisation (composant Nuxt UI UCard,
               alimenté par les données Sanity). -->
          <UCard v-if="settings?.title">
            <template #header>
              <p class="a-h3 text-foreground">{{ settings.title }}</p>
            </template>

            <p v-if="settings.description" class="text-sm text-muted">
              {{ settings.description }}
            </p>

            <template v-if="settings.socialLinks?.length" #footer>
              <SocialLinks :links="settings.socialLinks" />
            </template>
          </UCard>

          <!-- À lire aussi : 3 dernières, affichées via <UBlogPost> (Nuxt UI),
               alimenté par les données Sanity. Vignette rendue dans le slot
               #header avec sanityImageUrl (évite le bug NuxtImg + Sanity). -->
          <div
            v-if="relatedPosts.length"
            class="border-t border-border pt-8">
            <h2 class="a-h3 mb-6">À lire aussi</h2>
            <div class="space-y-6">
              <UBlogPost
                v-for="(article, i) in relatedPosts"
                :key="i"
                :title="article.title"
                :description="article.description"
                :date="article.date"
                :image="article.image"
                :to="article.to" />
            </div>
          </div>
        </aside>

        <!-- Colonne gauche : contenu de l'article -->
        <div class="order-1 lg:col-span-2">
          <div class="pb-6 grid gap-6 mb-6 border-b border-border">
            <h1 class="a-h1">
              {{ post.title }}
            </h1>

            <!-- Date de publication : mise en avant juste sous le titre -->
            <ClientOnly>
              <p v-if="publishedAt" class="a-eyebrow">
                Publié le {{ publishedAt }}
              </p>
            </ClientOnly>

            <!-- Image mise en avant, sous le titre -->
            <img
              v-if="coverImageUrl"
              class="h-auto w-full object-cover shadow-md"
              :style="{ borderRadius: 'var(--a-radius)' }"
              :src="coverImageUrl"
              :alt="post.coverImage?.alt || ''"
              loading="eager" />

            <!-- Méta : catégorie, et partage aligné à droite -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span
                v-if="post.category"
                class="inline-flex items-center rounded-full border border-border bg-light px-3 py-1 text-xs font-medium text-primary">
                {{ post.category }}
              </span>
              <ShareArticle :title="post.title" class="ml-auto" />
            </div>
          </div>

          <article class="gap-6 grid">
            <div v-if="post.content">
              <PortableText :portableText="post.content" />
            </div>

            <!-- Galerie de l'article : le type d'affichage vient des Réglages -->
            <Gallery
              v-if="post.gallery?.length"
              class="mt-6"
              :gallery="{
                images: post.gallery,
                layout: settings?.gallery?.layout,
              }" />
          </article>
        </div>
      </div>
    </div>
  </div>
</template>
