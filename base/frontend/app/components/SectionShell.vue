<script setup lang="ts">
/**
 * Enveloppe commune des sections du Page Builder (CŒUR).
 *
 * Rend un composant Nuxt UI (par défaut <UPageSection>, configurable via la
 * prop `base` — ex. <UPageCTA>) et applique l'« Apparence » pilotée depuis
 * Sanity (objet `sectionAppearance`) :
 *  - Fond : image de fond (override) + voile réglable, sinon transparent (le
 *    fond propre du composant — ex. le `variant` d'<UPageCTA> — s'affiche).
 *    Classe `dark` (texte clair) appliquée au-dessus d'une image.
 *  - Largeur : contenu contraint (`container`) ou pleine largeur.
 *  - Rythme vertical : `--section-space` (défaut du thème, non exposé à l'éditeur).
 *
 * Toutes les props/slots supplémentaires sont transmis au composant de base
 * (title, headline, description, links, orientation, slots…).
 */
import { stegaClean } from "@sanity/client/stega";
import imageUrlBuilder from "@sanity/image-url";
// Références directes aux composants (auto-importés). `resolveComponent(nom)`
// échoue à l'exécution pour les composants Nuxt UI (auto-import = compile-time),
// d'où l'import explicite depuis `#components`.
import { UPageSection, UPageCTA } from "#components";

interface Appearance {
  // Conservé pour compat (ignoré) : le fond est désormais déterminé par la
  // présence (ou non) d'une image, plus de clair/sombre.
  background?: "light" | "dark" | "image" | "none" | null;
  image?: {
    asset?: { _ref?: string } | null;
    alt?: string | null;
    crop?: unknown;
    hotspot?: unknown;
  } | null;
  overlayOpacity?: number | null;
  lightText?: boolean | null;
  width?: "container" | "full" | null;
  imageRatio?: string | null;
}

const props = defineProps<{
  appearance?: Appearance | null;
  /**
   * Composant Nuxt UI rendu à l'intérieur de la bande (par NOM, auto-importé).
   * Défaut : `UPageSection`. Ex. `UPageCTA` pour l'appel à l'action.
   * Les slots `ui` communs (root/container/title…) reçoivent `uiConfig`.
   */
  base?: string;
  /**
   * Section prioritaire (généralement la 1re de la page) : l'image de fond est
   * alors chargée en `eager` + `fetchpriority=high` pour ne pas dégrader le LCP.
   * Sinon `lazy` (défaut) pour les sections plus bas dans la page.
   */
  priority?: boolean;
}>();

// Composant de base résolu (nom → référence de composant).
const BASE_COMPONENTS = { UPageSection, UPageCTA } as const;
const BaseComponent = computed(
  () => BASE_COMPONENTS[props.base as keyof typeof BASE_COMPONENTS] || UPageSection
);

defineOptions({ inheritAttrs: false });

// Builder officiel @sanity/image-url : il « cuit » le rognage (crop) ET le
// point focal (hotspot) directement dans l'URL (rect + fp-x/fp-y). Pas de
// srcset dégénéré (contrairement à <SanityImage>).
const sanity = useSanity();
const builder = imageUrlBuilder({
  projectId: (sanity.config as any)?.projectId,
  dataset: (sanity.config as any)?.dataset,
});

// Ratio d'affichage choisi (« Format ») → recadrage serveur au point focal.
const RATIOS: Record<string, number> = {
  "21:9": 21 / 9,
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "1:1": 1,
};
const ratio = computed(() => {
  const r = stegaClean(props.appearance?.imageRatio);
  return r && RATIOS[r] ? RATIOS[r] : null;
});

const imageUrl = computed(() => {
  const img = props.appearance?.image;
  if (!img?.asset?._ref) return "";
  const width = 1920;
  let b = builder.image(img as any).width(width).auto("format");
  if (ratio.value) {
    // Ratio fixe : recadrage serveur focalpoint (comme l'exemple Sanity).
    b = b.height(Math.round(width / ratio.value)).fit("crop");
  } else {
    // Auto : on garde le rognage éditorial, la hauteur suit le contenu (cover).
    b = b.fit("max");
  }
  return b.url();
});

// Fond : plus de « clair/sombre ». Le SEUL fond de bande est une image
// (override). Hors image, la bande est transparente : c'est le fond propre du
// composant (ex. le `variant` d'<UPageCTA>) ou du site qui s'affiche.
const isImage = computed(() => !!props.appearance?.image?.asset?._ref);
// Image => texte clair selon le réglage « Texte clair » (activé par défaut).
// La classe `dark` fait basculer la palette Nuxt UI.
const isDark = computed(
  () => isImage.value && stegaClean(props.appearance?.lightText) !== false
);
const isFull = computed(() => stegaClean(props.appearance?.width) === "full");

const rootStyle = computed(
  () => ({ paddingBlock: "var(--section-space)" } as Record<string, string>)
);

const overlayStyle = computed(() => {
  const opacity = (props.appearance?.overlayOpacity ?? 40) / 100;
  return { backgroundColor: `rgba(0, 0, 0, ${opacity})` };
});

// Style de la section : rythme vertical + fond, ratio fixe le cas échéant, et
// largeur « Container » : bande contrainte à la largeur du site ET détachée des
// bords (marge --gutter) à toutes les tailles, mobile compris ; centrée.
const sectionStyle = computed(() => {
  const s = { ...rootStyle.value } as Record<string, string>;
  if (ratio.value) s.aspectRatio = String(ratio.value);
  if (!isFull.value) {
    s.width = "min(100% - 2 * var(--gutter), var(--site-max))";
    s.marginInline = "auto";
  }
  return s;
});

// Mode Auto (cover pleine hauteur) : point focal via object-position, re-projeté
// dans la zone rognée (le hotspot Sanity est relatif à l'image d'origine).
// En mode ratio, le recadrage focalpoint est déjà cuit dans l'URL → centre.
const objectPosition = computed(() => {
  const img = props.appearance?.image as any;
  const hs = img?.hotspot;
  let x = typeof hs?.x === "number" ? hs.x : 0.5;
  let y = typeof hs?.y === "number" ? hs.y : 0.5;
  const crop = img?.crop;
  if (crop) {
    const cropW = 1 - (crop.left ?? 0) - (crop.right ?? 0);
    const cropH = 1 - (crop.top ?? 0) - (crop.bottom ?? 0);
    if (cropW > 0) x = Math.min(1, Math.max(0, (x - (crop.left ?? 0)) / cropW));
    if (cropH > 0) y = Math.min(1, Math.max(0, (y - (crop.top ?? 0)) / cropH));
  }
  return `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
});

// Sur fond sombre, les boutons passent en neutre clair (blanc) pour le contraste.
const attrs = useAttrs();

// <UPageCTA> avec une variante COLORÉE (solid/outline/soft/subtle) rend un bloc
// (fond + arrondi) qui a besoin de son padding interne. Avec « naked » (ou tout
// autre base sans bloc), on neutralise ce padding : le rythme est géré par la
// gouttière (--gutter) et `--section-space` de la section, sans doublon.
const CTA_BLOCK_VARIANTS = new Set(["solid", "outline", "soft", "subtle"]);
const hasBlockBackground = computed(() =>
  CTA_BLOCK_VARIANTS.has(stegaClean(attrs.variant as string) ?? "")
);

// Override `ui` éventuellement transmis par la section (fusionné par slot avec
// nos réglages ; tailwind-merge en aval, côté Nuxt UI, tranche les conflits).
const uiOverride = computed(
  () => (attrs.ui as Record<string, string> | undefined) ?? {}
);
const mergeSlot = (base: string, extra?: string) =>
  [base, extra].filter(Boolean).join(" ");

// Overrides du composant de base : titre/headline aux polices du thème, et
// neutralisation (conditionnelle) du padding interne du conteneur.
const uiConfig = computed(() => {
  const o = uiOverride.value;
  return {
    ...o,
    container: mergeSlot(
      [
        "w-full max-w-none mx-0 gap-8 sm:gap-16",
        // Bloc coloré → on garde le padding interne du thème ; sinon on l'annule.
        hasBlockBackground.value ? "" : "p-0 sm:p-0 lg:p-0",
      ]
        .filter(Boolean)
        .join(" "),
      o.container
    ),
    // Titre : police + graisse + casse « Titres » du thème (remplace le
    // font-bold / police par défaut de Nuxt UI).
    title: mergeSlot(
      "font-display [font-weight:var(--a-heading-weight)] [text-transform:var(--a-display-case)]",
      o.title
    ),
    // En-tête : police + graisse + casse « En-tête » du thème.
    headline: mergeSlot(
      "text-muted a-headline [font-weight:var(--a-headline-weight)]",
      o.headline
    ),
    // Bloc coloré en pleine largeur → bord à bord, sans coins arrondis.
    root: mergeSlot(
      hasBlockBackground.value && isFull.value ? "rounded-none" : "",
      o.root
    ),
  };
});

// Gouttière latérale du contenu. Pour un bloc coloré (variant), on la SUPPRIME :
// c'est le bloc lui-même qui porte la largeur (padding interne géré par le bloc),
// donc « pleine largeur » = bord à bord et « container » = largeur du site.
const innerPadding = computed(() => {
  if (hasBlockBackground.value) return "px-0";
  return isFull.value
    ? "px-[var(--gutter)]"
    : "px-[clamp(var(--gutter),5vw,calc(var(--gutter)*2.5))]";
});
const forwardedAttrs = computed(() => {
  // `ui` est consommé par uiConfig : on l'exclut des attrs re-transmis.
  const { ui: _ui, ...rest } = attrs;
  const links = rest.links;
  if (!isDark.value || !Array.isArray(links)) return rest;
  return {
    ...rest,
    links: links.map((link: any) => ({ ...link, color: "neutral" })),
  };
});
</script>

<template>
  <!-- La LARGEUR s'applique à la section (voir sectionStyle) : Container =
       contrainte à la largeur du site + détachée des bords ; Pleine largeur =
       bord à bord. -->
  <section
    class="relative w-full overflow-hidden"
    :class="[isDark ? 'dark' : '', ratio ? 'flex items-center' : '']"
    :style="sectionStyle">
    <!-- Fond image + voile -->
    <template v-if="isImage && imageUrl">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        :src="imageUrl"
        :alt="appearance?.image?.alt || ''"
        :style="ratio ? undefined : { objectPosition }"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : undefined" />
      <div class="absolute inset-0" :style="overlayStyle" />
    </template>

    <!-- Gouttière latérale (le contenu ne colle pas aux bords de la bande).
         Container : gouttière plus généreuse, FLUIDE (mobile-first, sans palier) :
         de --gutter (mobile) jusqu'à ~2.5×--gutter (grands écrans). -->
    <div class="relative w-full" :class="innerPadding">
      <component :is="BaseComponent" v-bind="forwardedAttrs" :ui="uiConfig">
        <template v-for="(_, name) in $slots" #[name]="slotProps">
          <slot :name="name" v-bind="slotProps ?? {}" />
        </template>
      </component>
    </div>
  </section>
</template>
