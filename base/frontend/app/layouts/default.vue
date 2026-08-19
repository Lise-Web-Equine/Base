<script setup lang="ts">
import { settingsQuery, navigationQuery } from "~/sanity/queries";

// Bannière globale (Réglages du site → Apparence) : affichée en haut du site,
// avant l'en-tête, lorsque « Afficher la bannière » est activé.
const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);
const showGlobalBanner = computed(
  () => settings.value?.showBanner === true && !!settings.value?.banner
);

// En-tête superposé (Navigation → En-tête superposé) : l'en-tête transparent
// est sorti du flux et posé PAR-DESSUS le contenu. On enveloppe alors en-tête +
// contenu dans un conteneur `relative` qui sert de repère de positionnement.
const { data: navigation } =
  useSanityQuery<NavigationQueryResult>(navigationQuery);
const headerOverlay = computed(() => navigation.value?.headerOverlay === true);
</script>

<template>
  <div class="bg-background text-foreground font-sans">
    <!-- Bannière globale : avant l'en-tête, pilotée par le toggle des Réglages. -->
    <AppBanner v-if="showGlobalBanner" :banner="settings!.banner!" />
    <!-- Mode normal : UHeader sticky (renseigne --ui-header-height), puis UMain.
         Mode superposé : l'en-tête transparent (absolute) se pose par-dessus le
         contenu → on englobe en-tête + contenu dans un conteneur `relative`. -->
    <div :class="headerOverlay ? 'relative' : 'contents'">
      <Header :overlay="headerOverlay" />
      <UMain>
        <slot />
      </UMain>
    </div>
    <Footer />
  </div>
  <Toast />
</template>
