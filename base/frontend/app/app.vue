<script setup lang="ts">
// Load the global theme from Sanity and inject the --theme-* CSS variables
// on :root for the whole application (SSR-safe).
await useTheme();
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
