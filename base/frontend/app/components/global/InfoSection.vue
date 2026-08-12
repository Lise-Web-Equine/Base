<script setup lang="ts">
defineProps({
  block: {
    type: Object as PropType<InfoSection>,
    required: true,
  },
});
</script>

<template>
  <div class="container my-12">
    <div class="max-w-3xl">
      <h2 v-if="block?.heading" class="a-h1">
        {{ block.heading }}
      </h2>
      <span
        v-if="block?.subheading"
        class="a-lead mt-4 mb-8 block uppercase"
      >
        {{ block.subheading }}
      </span>
      <div class="prose prose-a:text-primary mt-4" v-if="block.content">
        <PortableText :portableText="block.content" />
      </div>
    </div>
  </div>
</template>
