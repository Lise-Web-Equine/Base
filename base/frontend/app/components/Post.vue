<script setup lang="ts">
import { excerptFromContent } from "~/lib/excerpt";
import { sanityImageUrl } from "~/lib/sanityImage";

const props = defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true,
  },
});

// Extrait dérivé de la 1re phrase du contenu (l'ancien champ `excerpt` a été supprimé).
const excerpt = computed(() =>
  excerptFromContent(props.post?.content as any)
);

// Vignette : image de couverture de l'article (générée directement, cf. lib/sanityImage).
const sanity = useSanity();
const thumbnailUrl = computed(() =>
  sanityImageUrl(
    (props.post?.coverImage as any)?.asset?._ref,
    (sanity.config as any)?.projectId,
    (sanity.config as any)?.dataset,
    "auto=format&fit=crop&w=800&h=500"
  )
);
</script>

<template>
  <article class="flex max-w-xl flex-col items-start justify-between">
    <nuxt-link
      v-if="thumbnailUrl"
      :to="`/articles/${post.slug?.current}`"
      class="mb-4 block w-full"
    >
      <img
        class="aspect-[16/10] h-auto w-full object-cover shadow-md"
        :style="{ borderRadius: 'var(--a-radius)' }"
        :src="thumbnailUrl"
        :alt="(post.coverImage as any)?.alt || post.title || ''"
        loading="lazy"
      />
    </nuxt-link>

    <div class="text-muted text-sm">
      <Date :dateString="post.date" />
    </div>

    <h3 class="a-h3 mt-3">
      <nuxt-link
        class="hover:text-primary underline transition-colors"
        :to="`/articles/${post.slug?.current}`"
      >
        {{ post.title }}
      </nuxt-link>
    </h3>
    <p class="mt-5 line-clamp-3 text-sm leading-6 text-muted">
      {{ excerpt }}
    </p>
  </article>
</template>
