<script setup lang="ts">
import { settingsQuery } from "~/sanity/queries";

const { data: settings } =
   useSanityQuery<SettingsQueryResult>(settingsQuery);
</script>

<template>
  <header
    class="fixed z-50 h-24 inset-0 bg-background/80 flex items-center backdrop-blur-lg"
  >
    <div class="container py-6 sm:px-6">
      <div class="flex items-center justify-between gap-5">
        <NuxtLink class="flex items-center gap-2" to="/">
          <span class="text-2xl pl-2 font-semibold">
            {{ settings?.title }}
          </span>
        </NuxtLink>

        <!-- Navigation : à piloter depuis Sanity (singleton navigation, Phase B). -->
        <nav></nav>
      </div>
    </div>
  </header>
</template>
