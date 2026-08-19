<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { stegaClean } from "@sanity/client/stega";
import { settingsQuery } from "~/sanity/queries";

const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);

// Aspect sombre de l'en-tête + couleur de nav (logique centralisée, cf.
// useSurfaceDark) : fond sombre → classe `.dark` (texte clair) + liens neutres.
const { darkClass, navColor } = useSurfaceDark("header");

// Menu principal partagé avec le pied de page (source unique, cf. useMainMenu).
const { navigation, menuItems, mapItem, allItems, alignOf, toTarget } =
  useMainMenu();

// --- Boutons d'action (contenu Sanity : Navigation → Boutons d'en-tête) ----
const buttons = computed(() =>
  (navigation.value?.headerButtons ?? [])
    .filter((b) => b?.label && b?.link)
    .map((b) => ({
      key: b._key,
      label: b.label ?? "",
      to: toTarget(b.link),
      color: (stegaClean(b.color) as string) || "primary",
      variant: (stegaClean(b.variant) as string) || "solid",
      target: b.link?.openInNewTab ? "_blank" : undefined,
    }))
);

// --- Disposition (Navigation → En-tête → Disposition des colonnes) ---------
// Contenu de chaque colonne de <UHeader>. La zone centrale (default) est celle
// que UHeader replie dans le menu mobile ; les zones gauche/droite restent
// visibles sur grand écran et sont masquées sur mobile (relais par le toggle).
type Slot = "logo" | "nav" | "buttons" | "none";
const cols = computed(() => ({
  left: (stegaClean(navigation.value?.headerColLeft) as Slot) || "logo",
  center: (stegaClean(navigation.value?.headerColCenter) as Slot) || "nav",
  right: (stegaClean(navigation.value?.headerColRight) as Slot) || "buttons",
}));

// La nav est-elle demandée à la fois à gauche ET à droite ? Si oui, on répartit
// les liens selon leur champ « Alignement » ; sinon une seule nav affiche tout.
const splitNav = computed(
  () => cols.value.left === "nav" && cols.value.right === "nav"
);
// Disposition « centrée » : le logo occupe la colonne centrale. Les navs
// latérales se collent alors aux bords (gauche → début, droite → fin) pour
// garder le logo réellement au centre.
const centered = computed(() => cols.value.center === "logo");

function navItems(column: "left" | "center" | "right"): NavigationMenuItem[] {
  if (!splitNav.value) return allItems.value;
  // Nav des deux côtés : on répartit le menu configuré selon l'alignement.
  // Sans menu configuré (menu par défaut), pas d'alignement → tout à gauche.
  if (!menuItems.value.length) {
    return column === "left" ? allItems.value : [];
  }
  if (column === "left") {
    return menuItems.value.filter((i) => alignOf(i) === "gauche").map(mapItem);
  }
  // Droite (et centre, cas rare) : les liens marqués « droite ».
  return menuItems.value.filter((i) => alignOf(i) === "droite").map(mapItem);
}
</script>

<template>
  <UHeader :class="['bg-header', darkClass]">
    <!-- Zone gauche : visible sur mobile (logo). -->
    <template #left>
      <!-- Logo « mobile » quand le logo n'occupe pas déjà cette colonne. -->
      <NuxtLink
        v-if="cols.left !== 'logo'"
        to="/"
        :aria-label="settings?.title || ''"
        class="flex items-center lg:hidden">
        <span class="text-2xl font-semibold">{{ settings?.title }}</span>
      </NuxtLink>
      <!-- Contenu desktop de la colonne gauche. -->
      <NuxtLink
        v-if="cols.left === 'logo'"
        to="/"
        :aria-label="settings?.title || ''"
        class="flex items-center">
        <span class="text-2xl font-semibold">{{ settings?.title }}</span>
      </NuxtLink>
      <UNavigationMenu
        v-else-if="cols.left === 'nav'"
        :items="navItems('left')"
        :color="navColor"
        :class="['hidden lg:flex', centered && 'w-full justify-start']" />
      <div v-else-if="cols.left === 'buttons'" class="hidden items-center gap-2 lg:flex">
        <UButton
          v-for="b in buttons"
          :key="b.key"
          :to="b.to"
          :label="b.label"
          :color="b.color"
          :variant="b.variant"
          :target="b.target" />
      </div>
    </template>

    <!-- Zone centrale (default) : repliée dans le menu hamburger sur mobile. -->
    <NuxtLink
      v-if="cols.center === 'logo'"
      to="/"
      :aria-label="settings?.title || ''"
      class="flex items-center">
      <span class="text-2xl font-semibold">{{ settings?.title }}</span>
    </NuxtLink>
    <UNavigationMenu
      v-else-if="cols.center === 'nav'"
      :items="navItems('center')"
      :color="navColor" />
    <div v-else-if="cols.center === 'buttons'" class="flex items-center gap-2">
      <UButton
        v-for="b in buttons"
        :key="b.key"
        :to="b.to"
        :label="b.label"
        :color="b.color"
        :variant="b.variant"
        :target="b.target" />
    </div>

    <!-- Zone droite : masquée sur mobile (le toggle prend le relais). -->
    <template #right>
      <NuxtLink
        v-if="cols.right === 'logo'"
        to="/"
        :aria-label="settings?.title || ''"
        class="hidden items-center lg:flex">
        <span class="text-2xl font-semibold">{{ settings?.title }}</span>
      </NuxtLink>
      <UNavigationMenu
        v-else-if="cols.right === 'nav'"
        :items="navItems('right')"
        :color="navColor"
        :class="['hidden lg:flex', centered && 'w-full justify-end']" />
      <div v-else-if="cols.right === 'buttons'" class="hidden items-center gap-2 lg:flex">
        <UButton
          v-for="b in buttons"
          :key="b.key"
          :to="b.to"
          :label="b.label"
          :color="b.color"
          :variant="b.variant"
          :target="b.target" />
      </div>
    </template>

    <!-- Corps du menu mobile : tous les liens + boutons empilés. -->
    <template #body>
      <UNavigationMenu :items="allItems" orientation="vertical" class="-mx-2.5" />
      <div v-if="buttons.length" class="mt-4 flex flex-col gap-2">
        <UButton
          v-for="b in buttons"
          :key="b.key"
          :to="b.to"
          :label="b.label"
          :color="b.color"
          :variant="b.variant"
          :target="b.target"
          block />
      </div>
    </template>
  </UHeader>
</template>
