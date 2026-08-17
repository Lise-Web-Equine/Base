<script setup lang="ts">
/**
 * Aperçu d'une section pour l'atelier « Apparence des sections » (OUTIL DEV).
 *
 * Rend la section via son enveloppe réelle <SectionShell> à partir d'un jeu de
 * valeurs (`values`) et de la description de la section (`section`).
 *
 * Fond du CTA :
 *  - par défaut, le `variant` d'UPageCTA fournit le fond (bande transparente) ;
 *  - si une image de fond est renseignée, elle OVERRIDE le variant : on
 *    reconstitue la bande image + voile (SectionShell n'affiche que des assets
 *    Sanity, ici l'image est simulée) et le `variant` est forcé à `naked`.
 *
 * Utilisé à la fois dans la page atelier et dans la route d'aperçu embarquée en
 * iframe (pour un rendu réellement responsive : l'iframe a son propre viewport).
 */
import type {
  PlaygroundSection,
  PlaygroundLink,
  PropControl,
} from "~/lib/sectionsPlayground";

const props = defineProps<{
  section: PlaygroundSection;
  values: Record<string, any>;
}>();

const componentControls = computed<PropControl[]>(() =>
  props.section.controls.filter((c) => (c.target ?? "component") === "component")
);

// Props du composant Nuxt UI (nettoyées : pas de chaîne/tableau vide).
const boundProps = computed(() => {
  const out: Record<string, unknown> = {};
  for (const c of componentControls.value) {
    const v = props.values[c.key];
    if (c.type === "boolean") {
      if (v) out[c.key] = true;
    } else if (c.type === "links") {
      const cleaned = ((v as PlaygroundLink[]) ?? [])
        .filter((l) => l.label?.trim())
        .map((l) => ({
          label: l.label,
          to: l.to || undefined,
          color: l.color || undefined,
          variant: l.variant || undefined,
        }));
      if (cleaned.length) out[c.key] = cleaned;
    } else if (typeof v === "string") {
      if (v.trim()) out[c.key] = v;
    } else if (v != null) {
      out[c.key] = v;
    }
  }
  return out;
});

const isHorizontal = computed(() => props.values.orientation === "horizontal");
const bgImageUrl = computed(() => (props.values.image as string) || "");
const hasImage = computed(() => !!bgImageUrl.value);

// Fond coloré (variant) uniquement en colonne ET sans image.
//  - Image renseignée → override → `variant: "naked"`.
//  - Bande (vertical) → pas de fond coloré → `variant: "naked"` (seule l'image
//    peut fournir un fond).
const finalProps = computed(() => {
  const base = { ...boundProps.value };
  if (hasImage.value || !isHorizontal.value) base.variant = "naked";
  return base;
});

const widthValue = computed(() => (props.values.width as string) || "container");
const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0, 0, 0, ${(Number(props.values.overlayOpacity ?? 40) || 0) / 100})`,
}));
const useLightText = computed(() => props.values.lightText !== false);
// Réplique la contrainte de largeur « Conteneur » de SectionShell (bande image).
const bandStyle = computed(() =>
  props.values.width === "full"
    ? {}
    : { width: "min(100% - 2 * var(--gutter), var(--site-max))", marginInline: "auto" }
);
</script>

<template>
  <!-- Override image : image de fond + voile, variant forcé naked -->
  <div
    v-if="hasImage"
    class="relative overflow-hidden"
    :class="useLightText ? 'dark' : ''"
    :style="bandStyle">
    <img
      :src="bgImageUrl"
      alt=""
      class="absolute inset-0 h-full w-full object-cover" />
    <div class="absolute inset-0" :style="overlayStyle" />
    <div class="relative">
      <SectionShell
        :base="section.baseComponent"
        :appearance="{ background: 'image', width: 'full' }"
        v-bind="finalProps">
        <template v-if="isHorizontal" #default>
          <img
            src="https://picsum.photos/704/540"
            alt=""
            class="w-full rounded-[var(--ui-radius)]"
            loading="lazy" />
        </template>
      </SectionShell>
    </div>
  </div>

  <!-- Sinon : le `variant` d'UPageCTA fournit le fond (bande transparente). -->
  <SectionShell
    v-else
    :base="section.baseComponent"
    :appearance="{ background: 'none', width: widthValue }"
    v-bind="finalProps">
    <template v-if="isHorizontal" #default>
      <img
        src="https://picsum.photos/704/540"
        alt=""
        class="w-full rounded-[var(--ui-radius)]"
        loading="lazy" />
    </template>
  </SectionShell>
</template>
