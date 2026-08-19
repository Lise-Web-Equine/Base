<script setup lang="ts">
/**
 * Bannière (présentiel) construite sur <UBanner> (Nuxt UI).
 *
 * Composant partagé, utilisé :
 *  - par la section « Bannière » du Page Builder (<BannerSection>), et
 *  - par la bannière GLOBALE affichée avant l'en-tête (layout par défaut).
 *
 * Deux modes, pilotés par `banner.showPhone` :
 *  - ACTIVÉ  → titre = numéro de téléphone des « Réglages du site », icône
 *    téléphone, bannière cliquable (lien `tel:`). Pas de boutons.
 *  - DÉSACTIVÉ → titre / icône / boutons saisis ; bannière éventuellement
 *    cliquable (`clickable`) vers le lien renseigné.
 *
 * La couleur de fond (`color`) et le style des boutons (`buttonColor` /
 * `buttonVariant`) proviennent de l'« Apparence » de la bannière.
 */
import type { BannerProps, ButtonProps } from "@nuxt/ui";
import { stegaClean } from "@sanity/client/stega";
import { settingsQuery } from "~/sanity/queries";
import { linkResolver } from "~/lib/utils";

// Lien permissif : accepte aussi bien le type de schéma (`Link`, section) que
// le lien résolu par GROQ (Réglages du site), tous deux passés à `linkResolver`.
type MaybeLink = Record<string, any> | null | undefined;
interface BannerButton {
  label?: string | null;
  link?: MaybeLink;
}
interface BannerData {
  showPhone?: boolean | null;
  title?: string | null;
  icon?: string | null;
  buttons?: (BannerButton | null)[] | null;
  clickable?: boolean | null;
  link?: MaybeLink;
  color?: string | null;
  buttonColor?: string | null;
  buttonVariant?: string | null;
}

const props = defineProps<{ banner: BannerData }>();

// Réglages du site : source du numéro de téléphone en mode « showPhone ».
const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);

const showPhone = computed(() => props.banner.showPhone === true);

const phone = computed(() => settings.value?.phone || "");
const phoneHref = computed(() =>
  phone.value ? `tel:${phone.value.replace(/\s+/g, "")}` : ""
);

// Titre : en mode « showPhone », le titre saisi (optionnel) SUIVI du numéro de
// téléphone. Sinon, le titre saisi seul.
const title = computed(() => {
  if (showPhone.value) {
    return [props.banner.title, phone.value].filter(Boolean).join(" ");
  }
  return props.banner.title || "";
});

// Icône : aucune en mode « showPhone » (numéro sans icône), sinon l'icône saisie.
const icon = computed(() =>
  showPhone.value ? undefined : stegaClean(props.banner.icon) || undefined
);

// Couleur de fond. Deux familles :
//  - couleurs du THÈME (accent, fonds) → surcharge du fond via `bg-*` + texte
//    adapté (pas de couleur Nuxt UI native pour elles) ;
//  - couleurs sémantiques Nuxt UI (neutral, success…) → prop `color` d'<UBanner>.
const THEME_BG: Record<string, { root: string; text: string }> = {
  accent: { root: "bg-accent hover:bg-accent", text: "text-white" },
  background: { root: "bg-background hover:bg-background", text: "text-foreground" },
  surface: { root: "bg-surface hover:bg-surface", text: "text-white" },
  light: { root: "bg-light hover:bg-light", text: "text-foreground" },
};
const colorSlug = computed(() => stegaClean(props.banner.color) || "surface");
const themeBg = computed(() => THEME_BG[colorSlug.value]);

// Prop `color` d'<UBanner> : uniquement pour les couleurs Nuxt UI (sinon la
// couleur de thème est appliquée via `ui`).
const color = computed(() =>
  themeBg.value ? undefined : (colorSlug.value as BannerProps["color"])
);
// Surcharge `ui` pour une couleur du thème : fond + couleur de texte (titre/icône).
const bannerUi = computed(() =>
  themeBg.value
    ? {
        root: themeBg.value.root,
        title: themeBg.value.text,
        icon: themeBg.value.text,
      }
    : undefined
);

// Lien de la bannière cliquable : appel téléphonique en mode « showPhone »,
// sinon le lien renseigné si « Bannière cliquable » est activé.
const to = computed(() => {
  if (showPhone.value) return phoneHref.value || undefined;
  if (props.banner.clickable && props.banner.link) {
    return linkResolver(props.banner.link as Link) || undefined;
  }
  return undefined;
});
const target = computed(() =>
  !showPhone.value && props.banner.link?.openInNewTab ? "_blank" : undefined
);

// Boutons (masqués en mode « showPhone »). Le style (couleur + variant)
// s'applique à tous les boutons.
const actions = computed<ButtonProps[]>(() => {
  if (showPhone.value) return [];
  const btnColor = (stegaClean(props.banner.buttonColor) ||
    "neutral") as ButtonProps["color"];
  const btnVariant = (stegaClean(props.banner.buttonVariant) ||
    "solid") as ButtonProps["variant"];
  return (props.banner.buttons ?? [])
    .filter((b): b is BannerButton => !!b?.label)
    .map((b) => {
      const dest = b.link ? linkResolver(b.link as Link) : null;
      return {
        label: b.label!,
        to: dest || undefined,
        target: b.link?.openInNewTab ? "_blank" : undefined,
        color: btnColor,
        variant: btnVariant,
      } as ButtonProps;
    });
});
</script>

<template>
  <UBanner
    :title="title"
    :icon="icon"
    :color="color"
    :ui="bannerUi"
    :to="to"
    :target="target"
    :actions="actions.length ? actions : undefined">
    <template v-if="title" #title>
      <RichString :text="title" />
    </template>
  </UBanner>
</template>
