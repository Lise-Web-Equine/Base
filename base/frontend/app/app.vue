<script setup lang="ts">
import { settingsQuery } from "~/sanity/queries";

// Load the global theme from Sanity and inject the --theme-* CSS variables
// on :root for the whole application (SSR-safe).
await useTheme();

// Réglages globaux du site (Sanity) : image OG par défaut + données structurées.
const { data: settings } = await useSanityQuery<SettingsQueryResult>(
  settingsQuery
);
const siteConfig = useSiteConfig();

// Image Open Graph par défaut, utilisée tant qu'une page ne la surcharge pas.
useSeoMeta({
  ogImage: () => settings.value?.ogImage || undefined,
});

// Données structurées Schema.org (aident Google à comprendre l'entité du site).
useSchemaOrg([
  defineOrganization({
    name: settings.value?.title || siteConfig.name,
    logo: settings.value?.logo || settings.value?.ogImage || undefined,
    sameAs: settings.value?.socialLinks ?? [],
  }),
  defineWebSite({
    name: settings.value?.title || siteConfig.name,
  }),
  defineWebPage(),
]);
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
