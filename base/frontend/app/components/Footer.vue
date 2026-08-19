<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { settingsQuery, navigationQuery } from "~/sanity/queries";
import { linkResolver } from "~/lib/utils";

const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);
const { data: navigation } =
  useSanityQuery<NavigationQueryResult>(navigationQuery);

// Aspect sombre du pied de page + couleur de nav (logique centralisée, cf.
// useSurfaceDark) : fond sombre → classe `.dark` (texte clair) + liens neutres.
const { darkClass, navColor } = useSurfaceDark("footer");

// Colonne 2 : mêmes liens que le menu principal de l'en-tête (source unique).
const { allItems: mainMenu } = useMainMenu();

// Colonne 3 : pages légales existantes (singleton legalTexts).
const { items: legalPages } = useLegalLinks();

const year = new Date().getFullYear();

const toTarget = (link: unknown) => linkResolver(link as Link) ?? undefined;

// Liens du pied de page configurés manuellement (Navigation → Pied de page).
const footerLinks = computed<NavigationMenuItem[]>(() =>
  (navigation.value?.footerLinks ?? []).map((item) => ({
    label: item.label ?? "",
    to: item.link ? toTarget(item.link) : undefined,
  }))
);

// Textes légaux : liens manuels s'ils existent, sinon les pages légales auto.
const legalItems = computed<NavigationMenuItem[]>(() =>
  footerLinks.value.length ? footerLinks.value : legalPages.value
);

const socialLinks = computed(() => settings.value?.socialLinks ?? []);
const phone = computed(() => settings.value?.phone || "");
const phoneHref = computed(() =>
  phone.value ? `tel:${phone.value.replace(/\s+/g, "")}` : ""
);
</script>

<template>
  <UFooter :class="['bg-footer', darkClass]">
    <!-- Bandeau supérieur : 4 colonnes, chacune introduite par un titre. -->
    <template #top>
      <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Colonne 1 : identité (titre du site + description + tél. optionnel). -->
        <div class="flex flex-col gap-3">
          <span class="text-lg font-semibold text-foreground">
            {{ settings?.title }}
          </span>
          <p v-if="settings?.description" class="text-sm text-muted">
            {{ settings.description }}
          </p>
          <a
            v-if="phone"
            :href="phoneHref"
            class="text-sm text-muted transition-colors hover:text-primary">
            {{ phone }}
          </a>
        </div>

        <!-- Colonne 2 : navigation (mêmes liens que l'en-tête). -->
        <div class="flex flex-col gap-2">
          <p class="text-sm font-semibold text-foreground">Navigation</p>
          <UNavigationMenu
            :items="mainMenu"
            orientation="vertical"
            variant="link"
            :color="navColor"
            class="-mx-2.5" />
        </div>

        <!-- Colonne 3 : textes légaux (liens du pied de page). -->
        <div class="flex flex-col gap-2">
          <p class="text-sm font-semibold text-foreground">Textes légaux</p>
          <UNavigationMenu
            v-if="legalItems.length"
            :items="legalItems"
            orientation="vertical"
            variant="link"
            :color="navColor"
            class="-mx-2.5" />
        </div>

        <!-- Colonne 4 : personnalisation projet (vide par défaut). -->
        <FooterProjectColumn />
      </div>
    </template>

    <!-- Rangée principale : copyright (gauche) · réseaux sociaux (droite). -->
    <template #left>
      <p class="text-sm text-muted">
        © {{ year }} {{ settings?.title }}. Tous droits réservés.
      </p>
    </template>

    <template #right>
      <SocialLinks :links="socialLinks" />
    </template>
  </UFooter>
</template>
