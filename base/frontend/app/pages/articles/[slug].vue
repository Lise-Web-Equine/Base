<script lang="ts" setup>
import { stegaClean } from "@sanity/client/stega";
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

// Catégorie de l'article (nettoyée du stega), affichée en badge.
const category = computed(
  () => (stegaClean(post.value?.category) as string) || undefined
);

// Adresse formatée pour la carte (rue, code postal + ville).
const contactAddress = computed(() => {
  const a = settings.value?.address;
  if (!a) return "";
  return [a.street, [a.postalCode, a.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
});

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
              <p class="a-title-3 text-foreground">{{ settings.title }}</p>
            </template>

            <p v-if="settings.description" class="text-sm text-muted">
              {{ settings.description }}
            </p>

            <!-- Coordonnées (tél. + adresse), affichées seulement si activé dans
                 les Réglages → Blog (les champs proviennent d'Identité & Coordonnées). -->
            <div
              v-if="settings.blog?.showContact && (settings.phone || contactAddress)"
              class="mt-4 flex flex-col gap-2 border-t border-border pt-4 text-sm">
              <a
                v-if="settings.phone"
                :href="`tel:${settings.phone.replace(/\s+/g, '')}`"
                class="inline-flex items-center gap-2 text-foreground hover:text-primary">
                <UIcon name="i-lucide-phone" class="size-4 shrink-0 text-muted" />
                {{ settings.phone }}
              </a>
              <p
                v-if="contactAddress"
                class="inline-flex items-start gap-2 text-muted">
                <UIcon name="i-lucide-map-pin" class="mt-0.5 size-4 shrink-0" />
                <span>{{ contactAddress }}</span>
              </p>
            </div>

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
            <h2 class="a-title-3 mb-6">À lire aussi</h2>
            <div class="space-y-6">
              <UBlogPost
                v-for="(article, i) in relatedPosts"
                :key="i"
                :title="article.title"
                :badge="article.badge"
                :date="article.date"
                :image="article.image"
                :to="article.to"
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
            </div>
          </div>
        </aside>

        <!-- Colonne gauche : contenu de l'article -->
        <div class="order-1 lg:col-span-2">
          <!-- Retour vers la liste des articles -->
          <UButton
            to="/articles"
            icon="i-lucide-arrow-left"
            label="Retour"
            color="neutral"
            variant="link"
            class="mb-6 -ml-1 px-1" />

          <div class="pb-6 grid gap-6 mb-6 border-b border-border">
            <h1 class="a-title-1">
              {{ post.title }}
            </h1>

            <!-- Méta : date de publication + badge catégorie, sur la même ligne -->
            <div class="flex flex-wrap items-center gap-3">
              <ClientOnly>
                <p v-if="publishedAt" class="a-eyebrow">
                  Publié le {{ publishedAt }}
                </p>
              </ClientOnly>
              <UBadge
                v-if="category"
                :label="category"
                color="primary"
                variant="subtle" />
            </div>

            <!-- Image mise en avant, sous le titre -->
            <img
              v-if="coverImageUrl"
              class="h-auto w-full object-cover shadow-md"
              :style="{ borderRadius: 'var(--a-radius)' }"
              :src="coverImageUrl"
              :alt="post.coverImage?.alt || ''"
              loading="eager" />
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

          <!-- Partage : après l'article. -->
          <div class="mt-8 border-t border-border pt-6">
            <ShareArticle :title="post.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
