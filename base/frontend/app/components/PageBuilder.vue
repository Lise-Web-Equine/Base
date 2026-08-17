<script lang="ts" setup>
import { sectionRegistry } from "~/lib/sections";

type PageBuilderBlock = NonNullable<
  NonNullable<PageQueryResult>["pageBuilder"]
>[number];

defineProps({
  blocks: {
    type: Array as () => PageBuilderBlock[],
    required: false,
  },
});

const isDev = import.meta.dev;
</script>

<template>
  <template v-for="(block, i) in blocks" :key="block._key">
    <component
      v-if="sectionRegistry[block._type]"
      :is="resolveComponent(sectionRegistry[block._type]!)"
      :block="block"
      :index="i"
    />
    <div
      v-else-if="isDev"
      class="container my-4 rounded border border-dashed border-red-400 p-4 text-sm text-red-500"
    >
      Section « {{ block._type }} » non enregistrée. Ajoute-la dans
      <code>app/lib/sections.ts</code>.
    </div>
  </template>
</template>
