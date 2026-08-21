<script setup lang="ts">
/**
 * Section "Références" (brique Projet) du Page Builder.
 * Affiche un sur-titre puis la liste des références (logos) d'une catégorie,
 * construite sur <UPageLogos> (Nuxt UI). Un toggle « Apparence » active le
 * défilement continu (<UMarquee>).
 *
 * Les références proviennent des documents `reference` de la catégorie choisie
 * (résolus par la projection GROQ, champ `references`). Chaque logo est
 * cliquable si un lien est renseigné.
 */
import { stegaClean } from "@sanity/client/stega";

const props = defineProps({
  block: {
    type: Object as PropType<ReferencesSection>,
    required: true,
  },
  // Position dans la page (fournie par PageBuilder).
  index: {
    type: Number,
    default: 0,
  },
});

// Références résolues par la projection GROQ (absentes du type de schéma).
type ResolvedReference = {
  _id: string;
  name?: string | null;
  logoUrl?: string | null;
  logoAlt?: string | null;
  link?: any;
};
const references = computed<ResolvedReference[]>(() =>
  ((props.block as any).references ?? []).filter((r: any) => r?.logoUrl)
);

// Fondu latéral par TRANSPARENCE (masque), au lieu de l'overlay coloré natif du
// marquee (qui se dégrade vers le fond `--ui-bg` = blanc et laisse voir du blanc
// sur un fond non blanc). Le masque fond vers `transparent` → jamais de blanc,
// quel que soit le fond de la section.
const fadeMask =
  "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] " +
  "[-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]";

// Toggle marquee (+ options) → prop `marquee` d'<UPageLogos> (booléen ou objet).
const marquee = computed(() => {
  if (stegaClean(props.block.useMarquee) !== true) return false;
  return {
    pauseOnHover: stegaClean(props.block.pauseOnHover) !== false,
    reverse: stegaClean(props.block.reverse) === true,
    // On désactive l'overlay coloré natif et on applique notre fondu transparent.
    overlay: false,
    ui: { root: fadeMask },
  };
});

// Taille des logos : hauteur normalisée (cohérence entre logos de ratios
// différents) + largeur capée. `object-contain` préserve le ratio de chaque
// logo dans la boîte.
const logoClass = "h-10 w-auto max-w-[150px] object-contain shrink-0";

// Largeur : contenu contraint à la largeur du site (Container) ou pleine largeur.
const isFull = computed(() => stegaClean(props.block.width) === "full");
// Rythme vertical `--section-space` + contrainte de largeur (comme les autres sections).
const sectionStyle = computed(() => {
  const s: Record<string, string> = { paddingBlock: "var(--section-space)" };
  if (!isFull.value) {
    s.width = "min(100% - 2 * var(--gutter), var(--site-max))";
    s.marginInline = "auto";
  }
  return s;
});
const innerPadding = computed(() =>
  isFull.value
    ? "px-[var(--gutter)]"
    : "px-[clamp(var(--gutter),5vw,calc(var(--gutter)*2.5))]"
);
</script>

<template>
  <section v-if="references.length" class="relative w-full" :style="sectionStyle">
    <div class="relative" :class="innerPadding">
      <UPageLogos
        :title="block.headline || undefined"
        :marquee="marquee">
        <template #default>
          <template v-for="ref in references" :key="ref._id">
            <ResolvedLink
              v-if="ref.link?.linkType"
              :link="ref.link"
              class-name="shrink-0">
              <img
                :src="ref.logoUrl!"
                :alt="ref.logoAlt || ref.name || ''"
                :class="logoClass"
                loading="lazy" />
            </ResolvedLink>
            <img
              v-else
              :src="ref.logoUrl!"
              :alt="ref.logoAlt || ref.name || ''"
              :class="logoClass"
              loading="lazy" />
          </template>
        </template>
      </UPageLogos>
    </div>
  </section>
</template>
