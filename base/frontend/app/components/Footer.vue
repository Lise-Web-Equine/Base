<script setup lang="ts">
import { settingsQuery } from "~/sanity/queries";

const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);
const year = new Date().getFullYear();
</script>

<template>
  <footer class="bg-surface border-border border-t">
    <div class="container">
      <div
        class="flex flex-col items-center gap-2 py-12 sm:flex-row sm:justify-between"
      >
        <span class="text-lg font-semibold text-foreground">
          {{ settings?.title }}
        </span>
        <p class="text-sm text-muted">
          © {{ year }} {{ settings?.title }}. Tous droits réservés.
        </p>
      </div>
    </div>
  </footer>
</template>
