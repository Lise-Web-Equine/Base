<script setup lang="ts">
defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true,
  },
});
</script>

<template>
  <article class="flex max-w-xl flex-col items-start justify-between">
    <div class="text-muted text-sm">
      <Date :dateString="post.date" />
    </div>

    <h3 class="mt-3 text-2xl font-semibold">
      <nuxt-link
        class="hover:text-primary underline transition-colors"
        :to="`/posts/${post.slug?.current}`"
      >
        {{ post.title }}
      </nuxt-link>
    </h3>
    <p class="mt-5 line-clamp-3 text-sm leading-6 text-muted">
      {{ post.excerpt }}
    </p>
  </article>
</template>
