<script setup lang="ts">
/**
 * Route d'aperçu embarquée en iframe par l'atelier « Apparence des sections »
 * (`/sections-apparence`). Route volontairement « à plat » (et non
 * `sections-apparence/preview`) pour ne pas créer de route imbriquée avec la
 * page atelier.
 *
 * Elle ne sert qu'à rendre <SectionAppearancePreview> à partir de l'état envoyé
 * par la page parente via postMessage. L'intérêt de l'iframe : elle a son propre
 * viewport → les points de rupture responsive (`sm:`, `lg:`, `vw`) réagissent
 * réellement à la largeur du cadre (ordinateur / tablette / mobile).
 *
 * Uniquement disponible en développement (404 en production).
 */
import { playgroundSections } from "~/lib/sectionsPlayground";

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
}

definePageMeta({ layout: false });
useSiteMetadata({ title: "Aperçu section", noIndex: true });

type Payload = { sectionId: string; values: Record<string, any> };
const payload = ref<Payload | null>(null);
const section = computed(() =>
  playgroundSections.find((s) => s.id === payload.value?.sectionId)
);

const root = ref<HTMLElement | null>(null);
let ro: ResizeObserver | null = null;

// Remonte la hauteur réelle du contenu au parent → l'iframe s'y ajuste (0 scroll).
function postHeight() {
  const height = Math.ceil(
    root.value?.getBoundingClientRect().height ??
      document.documentElement.scrollHeight
  );
  window.parent?.postMessage(
    { type: "section-apparence:height", height },
    window.location.origin
  );
}

function onMessage(e: MessageEvent) {
  if (e.origin !== window.location.origin) return;
  if (e.data?.type === "section-apparence:state") {
    payload.value = { sectionId: e.data.sectionId, values: e.data.values };
  }
}

onMounted(() => {
  window.addEventListener("message", onMessage);
  // Prévient le parent qu'on est prêt à recevoir l'état.
  window.parent?.postMessage(
    { type: "section-apparence:ready" },
    window.location.origin
  );
  // Observe la hauteur du contenu (reflow responsive, images, changement d'état).
  ro = new ResizeObserver(() => postHeight());
  if (root.value) ro.observe(root.value);
  postHeight();
});
onBeforeUnmount(() => {
  window.removeEventListener("message", onMessage);
  ro?.disconnect();
});

// Après une mise à jour d'état, re-mesure au tick suivant (contenu rendu).
watch(payload, () => nextTick(postHeight), { deep: true });
</script>

<template>
  <div ref="root" class="bg-background text-foreground font-sans">
    <SectionAppearancePreview
      v-if="section && payload"
      :section="section"
      :values="payload.values" />
  </div>
</template>
