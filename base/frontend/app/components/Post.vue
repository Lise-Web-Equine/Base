<script setup lang="ts">
import { excerptFromContent } from "~/lib/excerpt";

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
</script>

<template>
  <article class="flex max-w-xl flex-col items-start justify-between">
    <div class="text-muted text-sm">
      <Date :dateString="post.date" />
    </div>

    <h3 class="a-h3 mt-3">
      <nuxt-link
        class="hover:text-primary underline transition-colors"
        :to="`/posts/${post.slug?.current}`"
      >
        {{ post.title }}
      </nuxt-link>
    </h3>
    <p class="mt-5 line-clamp-3 text-sm leading-6 text-muted">
      {{ excerpt }}
    </p>
  </article>
</template>
