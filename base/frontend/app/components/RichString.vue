<script setup lang="ts">
/**
 * Rend un champ texte SIMPLE en appliquant le mini-balisage éditeur :
 *  - `*mot*` → typo d'accent (italique) ;
 *  - `//`    → saut de ligne.
 *
 * Le contenu est échappé puis balisé (cf. `parseInlineMarkup`), donc sûr.
 * `stegaClean` retire les marqueurs d'édition visuelle avant analyse.
 */
import { stegaClean } from "@sanity/client/stega";
import { parseInlineMarkup } from "~/lib/richString";

const props = defineProps<{
  text?: string | null;
  /** Élément de rendu (défaut : span). */
  as?: string;
}>();

const html = computed(() => parseInlineMarkup(stegaClean(props.text)));

// On lie `innerHTML` (et NON `v-html`) dans le template : `v-html` n'est pas
// appliqué sur un composant dynamique `<component :is>`, ce qui laissait le
// contenu vide (titre/sur-titre/description du hero, etc. invisibles).
</script>

<template>
  <component :is="as || 'span'" :innerHTML="html" />
</template>
