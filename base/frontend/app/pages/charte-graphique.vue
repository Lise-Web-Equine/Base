<script setup lang="ts">
// The theme is loaded globally in app.vue via useTheme(); calling it here again
// reuses the same Sanity query (deduped) and gives us the resolved values to
// display next to each swatch.
const { cssVariables } = await useTheme();

useSiteMetadata({
  title: "Charte graphique",
  description:
    "Design system de la marque : couleurs du thème administrées dynamiquement depuis Sanity.",
});

const swatches = computed(() => [
  {
    name: "Couleur Principale",
    token: "--color-primary",
    value: cssVariables.value["--theme-primary"],
    swatchClass: "bg-primary",
    onColor: "text-white",
  },
  {
    name: "Couleur Secondaire",
    token: "--color-secondary",
    value: cssVariables.value["--theme-secondary"],
    swatchClass: "bg-secondary",
    onColor: "text-white",
  },
  {
    name: "Couleur d'Accent",
    token: "--color-accent",
    value: cssVariables.value["--theme-accent"],
    swatchClass: "bg-accent",
    onColor: "text-white",
  },
  {
    name: "Fond Principal",
    token: "--color-background",
    value: cssVariables.value["--theme-background"],
    swatchClass: "bg-background border border-border",
    onColor: "text-foreground",
  },
  {
    name: "Fond de Surface",
    token: "--color-surface",
    value: cssVariables.value["--theme-surface"],
    swatchClass: "bg-surface border border-border",
    onColor: "text-foreground",
  },
  {
    name: "Texte Principal",
    token: "--color-foreground",
    value: cssVariables.value["--theme-foreground"],
    swatchClass: "bg-foreground",
    onColor: "text-white",
  },
  {
    name: "Texte Secondaire",
    token: "--color-muted",
    value: cssVariables.value["--theme-muted"],
    swatchClass: "bg-muted",
    onColor: "text-white",
  },
  {
    name: "Bordures et Séparateurs",
    token: "--color-border",
    value: cssVariables.value["--theme-border"],
    swatchClass: "bg-border",
    onColor: "text-foreground",
  },
]);

const fonts = computed(() => [
  {
    name: "Police des Titres",
    value: cssVariables.value["--theme-font-display"],
    sampleClass: "font-display",
    sample: "Aa Bb Cc 123",
  },
  {
    name: "Police du Texte",
    value: cssVariables.value["--theme-font-body"],
    sampleClass: "font-sans",
    sample: "The quick brown fox jumps over the lazy dog.",
  },
  {
    name: "Police d'Accent",
    value: cssVariables.value["--theme-font-accent"],
    sampleClass: "font-accent",
    sample: "Élégance & caractère",
  },
]);

// Réglages « Mise en forme » : leviers globaux qui pilotent les styles atomiques.
const layoutTokens = computed(() => [
  { name: "Échelle typographique", value: cssVariables.value["--theme-type-scale"] },
  { name: "Graisse des titres", value: cssVariables.value["--theme-heading-weight"] },
  { name: "Arrondi", value: cssVariables.value["--theme-radius"] },
  { name: "Largeur de lecture", value: cssVariables.value["--theme-content-width"] },
  { name: "Densité verticale", value: cssVariables.value["--theme-density"] },
]);
</script>

<template>
  <div class="bg-background text-foreground min-h-screen transition-colors">
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
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="font in fonts"
            :key="font.name"
            class="rounded-xl border border-border p-6 space-y-2">
            <p class="text-xs uppercase tracking-widest text-muted">
              {{ font.name }}
            </p>
            <p :class="font.sampleClass" class="text-2xl">{{ font.sample }}</p>
            <p class="font-mono text-xs text-muted">{{ font.value }}</p>
          </div>
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

        <div class="bg-surface border border-border rounded-xl p-6 space-y-3">
          <h3 class="font-display text-2xl font-bold text-primary">Titre d'exemple</h3>
          <p class="text-foreground opacity-90 max-w-2xl">
            Paragraphe de démonstration utilisant la couleur de texte du thème
            sur la couleur de fond du thème. Voici un
            <a class="text-secondary underline" href="#">lien secondaire</a>
            et un <span class="text-accent font-semibold">accent</span> pour
            illustrer le contraste.
          </p>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Styles atomiques</h2>
        <p class="text-sm text-muted max-w-2xl">
          Définis une seule fois (classes <code>.a-*</code> + <code>.prose</code>)
          et calculés depuis les réglages « Mise en forme » du thème Sanity.
          Modifie-les dans le Studio → tout se met à jour ici.
        </p>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-xl border border-border p-6 space-y-4">
            <p class="a-eyebrow">Sur-titre</p>
            <h2 class="a-h2">Titre 2 — a-h2</h2>
            <h3 class="a-h3">Titre 3 — a-h3</h3>
            <h4 class="a-h4">Titre 4 — a-h4</h4>
            <p class="a-lead">
              Chapô : phrase d'introduction mise en avant (a-lead).
            </p>
            <p class="a-body">
              Paragraphe courant (a-body) avec un
              <span :style="{ color: 'var(--color-primary)' }">texte coloré</span>
              et un
              <span
                class="rounded px-1 py-0.5"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 22%, transparent)' }"
                >surlignage</span
              >.
            </p>
            <blockquote class="a-quote">
              Citation d'exemple illustrant le style a-quote.
            </blockquote>
            <ul class="a-body list-disc space-y-1 pl-5">
              <li>Élément de liste</li>
              <li>Autre élément</li>
            </ul>
          </div>
          <div class="rounded-xl border border-border p-6 space-y-1">
            <p class="text-xs uppercase tracking-widest text-muted mb-3">
              Réglages « Mise en forme »
            </p>
            <div
              v-for="t in layoutTokens"
              :key="t.name"
              class="flex items-center justify-between gap-4 border-b border-border py-2 last:border-0">
              <span class="text-sm">{{ t.name }}</span>
              <span class="font-mono text-xs text-muted">{{ t.value }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
