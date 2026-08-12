<script setup lang="ts">
defineProps({
  heading: {
    type: String,
    default: null,
  },
  subHeading: {
    type: String,
    default: null,
  },
  posts: {
    type: Array<Post>,
    default: null,
  },
});
</script>

<template>
  <div>
    <h2 v-if="heading" class="a-h1">
      {{ heading }}
    </h2>
    <p v-if="subHeading" class="a-lead mt-2">
      {{ subHeading }}
    </p>
    <div
      class="mt-6 pt-6 space-y-12 border-t border-border"
      v-for="post in posts"
      :key="post._id"
    >
      <Post :post="post" />
    </div>
  </div>
</template>
