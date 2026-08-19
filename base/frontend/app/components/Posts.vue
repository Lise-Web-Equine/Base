<script setup lang="ts">
defineProps({
  heading: {
    type: String,
    default: null,
  },
  headingTag: {
    type: String,
    default: "h2",
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
    <component :is="headingTag" v-if="heading" class="a-title-2">
      {{ heading }}
    </component>
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
