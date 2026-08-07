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
// LocalBusiness enrichit l'entité avec les coordonnées (tél., e-mail, adresse)
// saisies dans Réglages → Identité & Coordonnées. Pour une entité non locale
// (ex. agence sans point d'accueil), on peut repasser à defineOrganization.
const addr = settings.value?.address;
const hasAddress = !!(addr && (addr.street || addr.city || addr.postalCode));

useSchemaOrg([
  defineLocalBusiness({
    name: settings.value?.title || siteConfig.name,
    logo: settings.value?.logo || settings.value?.ogImage || undefined,
    image: settings.value?.ogImage || settings.value?.logo || undefined,
    telephone: settings.value?.phone || undefined,
    email: settings.value?.email || undefined,
    ...(hasAddress
      ? {
          address: {
            streetAddress: addr?.street || undefined,
            postalCode: addr?.postalCode || undefined,
            addressLocality: addr?.city || undefined,
            addressCountry: addr?.country || undefined,
          },
        }
      : {}),
    sameAs: (settings.value?.socialLinks ?? [])
      .map((s) => s.url)
      .filter((u): u is string => !!u),
  }),
  defineWebSite({
    name: settings.value?.title || siteConfig.name,
  }),
  defineWebPage(),
]);

// Mesure d'audience (Plausible / Matomo / GA4), activable depuis Sanity
// (Réglages → Modules → Analytics). Rien n'est chargé si aucun fournisseur.
useAnalytics(settings.value);

// Bannière de consentement cookies (Axeptio), activable depuis Sanity
// (Réglages → Bannière cookies). Le SDK n'est chargé que si activé + ID fourni.
const consent = settings.value?.cookieConsent;
if (consent?.enabled && consent.axeptioClientId) {
  useHead({
    script: [
      {
        key: "axeptio-settings",
        innerHTML: `window.axeptioSettings = ${JSON.stringify({
          clientId: consent.axeptioClientId,
          cookiesVersion: consent.axeptioCookiesVersion || undefined,
        })};`,
      },
      {
        key: "axeptio-sdk",
        src: "https://static.axept.io/sdk.js",
        async: true,
      },
    ],
  });
}
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
