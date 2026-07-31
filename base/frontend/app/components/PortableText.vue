<script setup lang="ts">
import LinkMark from './mark/LinkMark.vue';
import UnderlineMark from './mark/UnderlineMark.vue';
import CodeMark from './mark/CodeMark.vue';
import StrikethroughMark from './mark/StrikethroughMark.vue';
import HighlightMark from './mark/HighlightMark.vue';
import type { PortableTextBlock } from 'sanity';

const components = {
  marks: {
    link: LinkMark,
    underline: UnderlineMark,
    code: CodeMark,
    "strike-through": StrikethroughMark,
    highlight: HighlightMark,
  },
};

defineProps<{
  portableText: PortableTextBlock[];
}>();
</script>

<template>
  <div v-if="portableText" class="prose prose-lg max-w-none">
    <SanityContent :value="portableText" :components="components" />
  </div>
</template>
