<script setup lang="ts">
// The theme is loaded globally in app.vue via useTheme(); calling it here again
// reuses the same Sanity query (deduped) and gives us the resolved values to
// display next to each swatch.
const { theme, cssVariables } = await useTheme();

useSiteMetadata({
  title: "Charte graphique",
  description:
    "Design system de la marque : couleurs du thème administrées dynamiquement depuis Sanity.",
});

const swatches = computed(() => [
  {
    name: "Primary",
    token: "--color-primary",
    value: theme.value?.primary ?? cssVariables.value["--theme-primary"],
    swatchClass: "bg-primary",
    onColor: "text-white",
  },
  {
    name: "Secondary",
    token: "--color-secondary",
    value: theme.value?.secondary ?? cssVariables.value["--theme-secondary"],
    swatchClass: "bg-secondary",
    onColor: "text-white",
  },
  {
    name: "Background",
    token: "--color-background",
    value: theme.value?.background ?? cssVariables.value["--theme-background"],
    swatchClass: "bg-background border border-gray-200",
    onColor: "text-text",
  },
  {
    name: "Text",
    token: "--color-text",
    value: theme.value?.text ?? cssVariables.value["--theme-text"],
    swatchClass: "bg-text",
    onColor: "text-white",
  },
]);
</script>

<template>
  <div class="bg-background text-text min-h-screen transition-colors">
    <div class="container mx-auto max-w-5xl py-16 space-y-12">
      <header class="space-y-3">
        <p class="uppercase tracking-widest text-sm text-secondary">
          Design system
        </p>
        <h1 class="text-4xl md:text-5xl font-bold tracking-tight">
          Charte graphique
        </h1>
        <p class="max-w-2xl text-base opacity-80">
          Ces couleurs sont administrées dans Sanity (Theme Settings) et
          injectées dynamiquement en variables CSS. Modifie-les dans le Studio
          pour voir le rendu se mettre à jour ici.
        </p>
      </header>

      <section>
        <h2 class="text-xl font-semibold mb-6">Couleurs</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="swatch in swatches"
            :key="swatch.name"
            class="rounded-xl overflow-hidden shadow-layer">
            <div
              class="h-32 flex items-end p-4"
              :class="[swatch.swatchClass, swatch.onColor]">
              <span class="font-semibold">{{ swatch.name }}</span>
            </div>
            <div class="bg-white text-black p-4 space-y-1">
              <p class="font-mono text-sm uppercase">{{ swatch.value }}</p>
              <p class="font-mono text-xs text-gray-500">{{ swatch.token }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Typographie</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="rounded-xl border border-gray-200 p-6 space-y-2">
            <p class="text-xs uppercase tracking-widest text-gray-500">
              Police des titres
            </p>
            <p class="font-display text-3xl font-bold">Aa Bb Cc 123</p>
            <p class="font-mono text-xs text-gray-500">
              {{ theme?.headingFont ?? cssVariables["--theme-heading-font"] }}
            </p>
          </div>
          <div class="rounded-xl border border-gray-200 p-6 space-y-2">
            <p class="text-xs uppercase tracking-widest text-gray-500">
              Police du corps
            </p>
            <p class="font-sans text-lg">
              The quick brown fox jumps over the lazy dog.
            </p>
            <p class="font-mono text-xs text-gray-500">
              {{ theme?.bodyFont ?? cssVariables["--theme-body-font"] }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap gap-6 font-mono text-sm text-gray-600">
          <span>Taille de base : {{ cssVariables["--theme-base-font-size"] }}</span>
          <span>Hauteur de ligne : {{ cssVariables["--theme-line-height"] }}</span>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Composants d'exemple</h2>
        <div class="flex flex-wrap items-center gap-4">
          <button
            class="bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition">
            Bouton primaire
          </button>
          <button
            class="bg-secondary text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 transition">
            Bouton secondaire
          </button>
          <button
            class="border border-primary text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition">
            Bouton contour
          </button>
        </div>

        <div class="bg-background border border-gray-200 rounded-xl p-6 space-y-3">
          <h3 class="text-2xl font-bold text-primary">Titre d'exemple</h3>
          <p class="text-text opacity-90 max-w-2xl">
            Paragraphe de démonstration utilisant la couleur de texte du thème
            sur la couleur de fond du thème. Voici un
            <a class="text-secondary underline" href="#">lien secondaire</a>
            pour illustrer le contraste.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>
