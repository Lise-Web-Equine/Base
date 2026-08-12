<script setup lang="ts">
type Author = {
  name: string | null;
  picture: string | null;
};

defineProps({
  author: {
    type: Object as PropType<Author>,
    required: true,
  },
  date: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div class="flex items-center">
    <div v-if="author.picture" class="mr-4 h-9 w-9">
      <SanityImage
        :asset-id="author.picture"
        auto="format"
        class="h-full rounded-full object-cover"
        :alt="author.name || ''"
      />
    </div>
    <div v-else class="mr-1">Par</div>
    <div class="flex flex-col">
      <div v-if="author.name" class="font-bold">
        {{ author.name }}
      </div>
      <div v-if="date" class="text-gray-500 text-sm">
        <Date :dateString="date" />
      </div>
    </div>
  </div>
</template>
