<script setup lang="ts">
/**
 * Section "Références" (brique Projet) du Page Builder.
 * Affiche un sur-titre puis la liste des références (logos) d'une catégorie.
 * Trois modes d'affichage (onglet « Apparence ») :
 *  - Statique           : logos alignés (<UPageLogos>) ;
 *  - Défilement continu : <UCarousel> (Embla) + plugin auto-scroll, boucle infinie ;
 *  - Carrousel auto     : <UCarousel> (Embla) + plugin autoplay, boucle infinie.
 * Les deux modes animés bouclent à l'infini (loop) : pas de retour au début.
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
  logoScale?: number | null;
  link?: any;
};
const references = computed<ResolvedReference[]>(() =>
  ((props.block as any).references ?? []).filter((r: any) => r?.logoUrl)
);

// Fondu latéral par TRANSPARENCE (masque) appliqué au viewport du carrousel :
// les logos apparaissent/disparaissent en douceur sur les bords, sans bande de
// couleur (le masque fond vers `transparent`, quel que soit le fond).
const fadeMask =
  "[mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] " +
  "[-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]";

// Mode d'affichage (onglet « Apparence »). Les deux modes ANIMÉS s'appuient sur
// le MÊME composant Embla (<UCarousel>), en boucle infinie :
//  - "static"   : logos alignés, sans animation (<UPageLogos>) ;
//  - "marquee"  : défilement continu et fluide (plugin Embla auto-scroll) ;
//  - "carousel" : carrousel automatique par pas (plugin Embla autoplay).
const mode = computed<"static" | "marquee" | "carousel">(() => {
  if (stegaClean(props.block.useMarquee) !== true) return "static";
  return stegaClean((props.block as any).animationStyle) === "carousel"
    ? "carousel"
    : "marquee";
});
const isAnimated = computed(() => mode.value !== "static");
const isContinuous = computed(() => mode.value === "marquee");

// Défilement CONTINU (Embla auto-scroll) : glissement fluide, sans arrêt.
// `speed` ≈ pixels/frame → plus bas = plus lent. `direction` selon « Sens inversé ».
const AUTO_SCROLL_SPEED = 1; // baisser pour ralentir, monter pour accélérer
const autoScroll = computed(() => ({
  speed: AUTO_SCROLL_SPEED,
  startDelay: 0,
  stopOnInteraction: false,
  stopOnMouseEnter: stegaClean(props.block.pauseOnHover) !== false,
  direction:
    stegaClean(props.block.reverse) === true ? "backward" : "forward",
}));

// Carrousel par PAS (Embla autoplay) : avance d'un cran à intervalle régulier.
const CAROUSEL_DELAY = 2500; // ms entre deux pas
const autoplay = computed(() => ({
  delay: CAROUSEL_DELAY,
  stopOnInteraction: false,
  stopOnMouseEnter: stegaClean(props.block.pauseOnHover) !== false,
}));

// Contrôles de navigation (optionnels, choisis dans le Studio).
const showArrows = computed(() => stegaClean((props.block as any).showArrows) === true);
const showDots = computed(() => stegaClean((props.block as any).showDots) === true);

// Taille des logos : baseline commun réglable (tokens `--logo-height` /
// `--logo-max-w`, voir project.css) → cohérence entre logos de ratios
// différents. `object-contain` préserve le ratio dans la boîte.
const logoClass = "w-auto object-contain shrink-0";

// Ajustement individuel par logo (« Ajustement de taille (%) » dans Sanity) :
// multiplie le baseline pour harmoniser un logo qui paraît trop grand/petit.
const logoStyle = (ref: ResolvedReference) => {
  const scale = (Number(stegaClean(ref.logoScale)) || 100) / 100;
  return {
    height: `calc(var(--logo-height, 4rem) * ${scale})`,
    maxWidth: `calc(var(--logo-max-w, 220px) * ${scale})`,
  };
};

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
      <!-- Statique : logos alignés (aucune animation) → <UPageLogos> -->
      <UPageLogos
        v-if="!isAnimated"
        :title="block.headline || undefined"
        :marquee="false">
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
                :style="logoStyle(ref)"
                loading="lazy" />
            </ResolvedLink>
            <img
              v-else
              :src="ref.logoUrl!"
              :alt="ref.logoAlt || ref.name || ''"
              :class="logoClass"
              :style="logoStyle(ref)"
              loading="lazy" />
          </template>
        </template>
      </UPageLogos>

      <!-- Animé (Embla, boucle infinie) : défilement continu (auto-scroll) OU
           carrousel par pas (autoplay), selon le « Type d'animation ». -->
      <template v-else>
        <h2
          v-if="block.headline"
          class="text-lg text-center font-semibold text-highlighted">
          {{ block.headline }}
        </h2>
        <UCarousel
          v-slot="{ item }"
          :items="references"
          :auto-scroll="isContinuous ? autoScroll : false"
          :autoplay="isContinuous ? false : autoplay"
          loop
          :dots="showDots"
          :arrows="showArrows"
          :class="block.headline ? 'mt-10' : ''"
          :ui="{
            viewport: fadeMask,
            container: 'items-center',
            item: 'basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6 flex items-center justify-center',
          }">
          <ResolvedLink v-if="item.link?.linkType" :link="item.link">
            <img
              :src="item.logoUrl"
              :alt="item.logoAlt || item.name || ''"
              :class="logoClass"
              :style="logoStyle(item)"
              loading="lazy" />
          </ResolvedLink>
          <img
            v-else
            :src="item.logoUrl"
            :alt="item.logoAlt || item.name || ''"
            :class="logoClass"
            :style="logoStyle(item)"
            loading="lazy" />
        </UCarousel>
      </template>
    </div>
  </section>
</template>
