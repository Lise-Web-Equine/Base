<script setup lang="ts">
defineProps({
  block: {
    type: Object as PropType<InfoSection>,
    required: true,
  },
  // Position dans la page (fournie par PageBuilder), non utilisée ici.
  index: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <div class="container my-12">
    <div class="max-w-3xl">
      <h2 v-if="block?.heading" class="a-title-1">
        {{ block.heading }}
      </h2>
      <span
        v-if="block?.subheading"
        class="a-lead mt-4 mb-8 block uppercase"
      >
        {{ block.subheading }}
      </span>
      <div class="mt-4" v-if="block.content">
        <PortableText :portableText="block.content" />
      </div>
    </div>
  </div>
</template>
