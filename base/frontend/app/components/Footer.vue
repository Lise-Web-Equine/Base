<script setup lang="ts">
import { settingsQuery, navigationQuery } from "~/sanity/queries";

const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);
const { data: navigation } =
  useSanityQuery<NavigationQueryResult>(navigationQuery);
const year = new Date().getFullYear();

const footerLinks = computed(() => navigation.value?.footerLinks ?? []);
const socialLinks = computed(() => settings.value?.socialLinks ?? []);
</script>

<template>
  <footer class="bg-light border-border border-t">
    <div class="container">
      <div
        class="flex flex-col items-center gap-6 py-12 sm:flex-row sm:justify-between"
      >
        <span class="text-lg font-semibold text-foreground">
          {{ settings?.title }}
        </span>

        <nav v-if="footerLinks.length" class="flex flex-wrap justify-center gap-4">
          <ResolvedLink
            v-for="item in footerLinks"
            :key="item._key"
            :link="item.link"
            class-name="text-sm text-muted hover:text-primary transition-colors"
          >
            {{ item.label }}
          </ResolvedLink>
        </nav>

        <SocialLinks :links="socialLinks" />
      </div>

      <p class="pb-8 text-center text-sm text-muted">
        © {{ year }} {{ settings?.title }}. Tous droits réservés.
      </p>
    </div>
  </footer>
</template>
