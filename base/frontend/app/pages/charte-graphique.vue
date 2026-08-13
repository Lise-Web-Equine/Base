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
    name: "Fond sombre",
    token: "--color-surface",
    value: cssVariables.value["--theme-surface"],
    swatchClass: "bg-surface border border-border",
    onColor: "text-white",
  },
  {
    name: "Fond Clair",
    token: "--color-light",
    value: cssVariables.value["--theme-light"],
    swatchClass: "bg-light border border-border",
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

// Couleurs d'états (feedback UI) : succès / avertissement / erreur.
const feedbackSwatches = computed(() => [
  {
    name: "Succès",
    token: "--color-success",
    value: cssVariables.value["--theme-success"],
    swatchClass: "bg-success",
    onColor: "text-white",
  },
  {
    name: "Avertissement",
    token: "--color-warning",
    value: cssVariables.value["--theme-warning"],
    swatchClass: "bg-warning",
    onColor: "text-white",
  },
  {
    name: "Erreur",
    token: "--color-error",
    value: cssVariables.value["--theme-error"],
    swatchClass: "bg-error",
    onColor: "text-white",
  },
]);

// Variantes d'interaction (survol) dérivées automatiquement des couleurs d'action.
const hoverTokens = [
  { name: "Survol principal", token: "--color-primary-hover", swatchClass: "bg-primary-hover" },
  { name: "Survol secondaire", token: "--color-secondary-hover", swatchClass: "bg-secondary-hover" },
  { name: "Survol accent", token: "--color-accent-hover", swatchClass: "bg-accent-hover" },
];

const fonts = computed(() => [
  {
    name: "Police des Titres",
    role: "Titres et grands intitulés (h1–h4, display).",
    value: cssVariables.value["--theme-font-display"],
    sampleClass: "font-display",
    sample: "Aa Bb Cc 123",
  },
  {
    name: "Police du Texte",
    role: "Texte courant, paragraphes, listes.",
    value: cssVariables.value["--theme-font-body"],
    sampleClass: "font-sans",
    sample: "The quick brown fox jumps over the lazy dog.",
  },
  {
    name: "Police d'Accent",
    role: "Éléments distinctifs : sur-titres, citations, chapô. Idéalement une écriture cursive, manuscrite ou une Serif élégante — à différencier de la police de texte.",
    value: cssVariables.value["--theme-font-accent"],
    sampleClass: "font-accent",
    sample: "Élégance & caractère",
  },
]);

// Données d'exemple (statiques) pour l'aperçu du pied de page.
const footerPreview = {
  title: "Nom du site",
  links: ["Accueil", "À propos", "Services", "Contact"],
  legal: ["Mentions légales", "Politique de confidentialité"],
  social: [
    { _key: "ig", platform: "instagram", url: "#" },
    { _key: "fb", platform: "facebook", url: "#" },
  ],
};

// État de démonstration du bouton « Chargement » (purement visuel).
const year = new Date().getFullYear();

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
      <!-- POC Nuxt UI : ces composants adoptent la charte via le pont de thème. -->
      <section class="space-y-4 rounded-lg border border-border p-6">
        <h2 class="text-xl font-bold">POC Nuxt UI</h2>
        <div class="flex flex-wrap items-center gap-3">
          <UButton color="primary">Primary</UButton>
          <UButton color="secondary" variant="solid">Secondary</UButton>
          <UButton color="primary" variant="outline">Outline</UButton>
          <UButton color="success" variant="soft">Succès</UButton>
          <UButton color="error" variant="subtle">Erreur</UButton>
          <UBadge color="primary">Badge</UBadge>
        </div>
        <UAlert
          color="primary"
          title="Thème client appliqué"
          description="Les couleurs Nuxt UI sont dérivées des tokens du thème (color-mix)." />
      </section>

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

      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Couleurs</h2>

        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">Couleurs de marque</h3>
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
        </div>

        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">
            Couleurs d'états (feedback UI)
          </h3>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="swatch in feedbackSwatches"
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
        </div>

        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">
            Variantes de survol (hover)
          </h3>
          <p class="text-sm text-muted max-w-2xl">
            Déclinaison plus sombre des couleurs d'action, calculée
            automatiquement en CSS (aucun réglage Sanity). À utiliser sur les
            états <code>:hover</code> / <code>:focus</code> des boutons et liens.
          </p>
          <div class="flex flex-wrap gap-4">
            <div
              v-for="h in hoverTokens"
              :key="h.token"
              class="flex items-center gap-3 rounded-lg border border-border p-3">
              <span class="h-10 w-10 rounded-md" :class="h.swatchClass" />
              <div>
                <p class="text-sm">{{ h.name }}</p>
                <p class="font-mono text-xs text-muted">{{ h.token }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Typographie</h2>
        <p class="text-sm text-muted max-w-2xl">
          Les polices sont chargées dynamiquement depuis Sanity (thème →
          Typographie) via un proxy local — l'aperçu ci-dessous utilise donc la
          police réelle du site, pas un repli générique.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="font in fonts"
            :key="font.name"
            class="rounded-xl border border-border p-6 space-y-3">
            <p class="text-xs uppercase tracking-widest text-muted">
              {{ font.name }}
            </p>
            <p :class="font.sampleClass" class="text-2xl">{{ font.sample }}</p>
            <p class="font-mono text-xs text-muted">{{ font.value }}</p>
            <p class="text-xs text-muted border-t border-border pt-3">
              {{ font.role }}
            </p>
          </div>
        </div>
      </section>

      <section class="space-y-8">
        <h2 class="text-xl font-semibold">Composants d'exemple</h2>

        <!-- Boutons + états -->
        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">Boutons &amp; états</h3>
          <div class="flex flex-wrap items-center gap-4">
            <button
              type="button"
              class="bg-primary text-white px-5 py-2.5 font-medium transition-colors hover:bg-primary-hover"
              :style="{ borderRadius: 'var(--a-radius)' }">
              Primaire
            </button>
            <button
              type="button"
              class="bg-secondary text-white px-5 py-2.5 font-medium transition-colors hover:bg-secondary-hover"
              :style="{ borderRadius: 'var(--a-radius)' }">
              Secondaire
            </button>
            <button
              type="button"
              class="border border-primary text-primary px-5 py-2.5 font-medium transition-colors hover:bg-primary hover:text-white"
              :style="{ borderRadius: 'var(--a-radius)' }">
              Contour
            </button>
            <!-- Aperçu figé de l'état survol (le survol réel ne se voit pas sur capture). -->
            <button
              type="button"
              class="bg-primary-hover text-white px-5 py-2.5 font-medium"
              :style="{ borderRadius: 'var(--a-radius)' }">
              Survol (aperçu)
            </button>
            <button
              type="button"
              disabled
              class="bg-primary text-white px-5 py-2.5 font-medium opacity-50 cursor-not-allowed"
              :style="{ borderRadius: 'var(--a-radius)' }">
              Inactif
            </button>
            <button
              type="button"
              disabled
              class="bg-primary text-white px-5 py-2.5 font-medium inline-flex items-center gap-2 cursor-progress"
              :style="{ borderRadius: 'var(--a-radius)' }">
              <span
                class="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin"
                aria-hidden="true" />
              Chargement…
            </button>
          </div>
        </div>

        <!-- Formulaires -->
        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">Formulaires</h3>
          <div class="grid gap-6 sm:grid-cols-3">
            <div class="space-y-1.5">
              <label for="cg-name" class="block text-sm font-medium">Nom</label>
              <input
                id="cg-name"
                type="text"
                placeholder="Votre nom"
                class="w-full border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                :style="{ borderRadius: 'var(--a-radius)' }" />
            </div>
            <div class="space-y-1.5">
              <label for="cg-email" class="block text-sm font-medium">E-mail</label>
              <input
                id="cg-email"
                type="email"
                value="adresse-invalide"
                aria-invalid="true"
                class="w-full border border-error bg-background px-3 py-2 text-sm outline-none"
                :style="{ borderRadius: 'var(--a-radius)' }" />
              <p class="text-xs text-error">Merci de saisir une adresse e-mail valide.</p>
            </div>
            <div class="space-y-1.5">
              <label for="cg-topic" class="block text-sm font-medium">Sujet</label>
              <select
                id="cg-topic"
                class="w-full border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
                :style="{ borderRadius: 'var(--a-radius)' }">
                <option>Renseignement</option>
                <option>Réservation</option>
                <option>Autre</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Badges & tags -->
        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">Badges &amp; tags</h3>
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-success px-3 py-1 text-xs font-semibold text-white">
              Disponible
            </span>
            <span class="rounded-full bg-warning px-3 py-1 text-xs font-semibold text-white">
              Dernières places
            </span>
            <span class="rounded-full bg-error px-3 py-1 text-xs font-semibold text-white">
              Complet
            </span>
            <!-- Variante « douce » : fond teinté transparent + texte coloré. -->
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold text-success"
              :style="{ backgroundColor: 'color-mix(in srgb, var(--color-success) 15%, transparent)' }">
              Validé
            </span>
            <span
              class="rounded-full border border-border px-3 py-1 text-xs text-muted">
              #tag
            </span>
            <span
              class="rounded-full px-3 py-1 text-xs font-semibold text-primary"
              :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }">
              Nouveau
            </span>
          </div>
        </div>

        <!-- Carte d'exemple -->
        <div class="space-y-3">
          <h3 class="text-sm uppercase tracking-widest text-muted">Carte</h3>
          <div
            class="max-w-sm overflow-hidden border border-border bg-background shadow-layer"
            :style="{ borderRadius: 'var(--a-radius)' }">
            <div class="aspect-video bg-gradient-to-br from-primary to-accent" />
            <div class="space-y-3 p-5">
              <span
                class="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary"
                :style="{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 15%, transparent)' }">
                Catégorie
              </span>
              <h4 class="font-display text-xl font-bold text-foreground">
                Titre de la carte
              </h4>
              <p class="text-sm text-muted">
                Courte description illustrant l'ombre, l'arrondi et le texte de
                carte, tous pilotés par les tokens du thème.
              </p>
              <button
                type="button"
                class="bg-primary text-white px-4 py-2 text-sm font-medium transition-colors hover:bg-primary-hover"
                :style="{ borderRadius: 'var(--a-radius)' }">
                En savoir plus
              </button>
            </div>
          </div>
        </div>

        <!-- Rappel typographique sur fond clair -->
        <div
          class="bg-light border border-border p-6 space-y-3"
          :style="{ borderRadius: 'var(--a-radius)' }">
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

      <section class="space-y-6">
        <h2 class="text-xl font-semibold">Pied de page</h2>
        <p class="text-sm text-muted max-w-2xl">
          Aperçu de la mise en page du footer (fond <code>--color-light</code>) :
          intitulé du site, liens de navigation, réseaux sociaux et mentions
          légales / copyright.
        </p>
        <footer
          class="bg-light border border-border overflow-hidden"
          :style="{ borderRadius: 'var(--a-radius)' }">
          <div class="p-8">
            <div
              class="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              <span class="text-lg font-semibold text-foreground">
                {{ footerPreview.title }}
              </span>
              <nav class="flex flex-wrap justify-center gap-4">
                <a
                  v-for="link in footerPreview.links"
                  :key="link"
                  href="#"
                  class="text-sm text-muted transition-colors hover:text-primary">
                  {{ link }}
                </a>
              </nav>
              <SocialLinks :links="footerPreview.social" />
            </div>

            <div
              class="mt-8 flex flex-col items-center gap-3 border-t border-border pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
              <p class="text-sm text-muted">
                © {{ year }} {{ footerPreview.title }}. Tous droits réservés.
              </p>
              <div class="flex flex-wrap justify-center gap-4">
                <a
                  v-for="item in footerPreview.legal"
                  :key="item"
                  href="#"
                  class="text-xs text-muted transition-colors hover:text-primary">
                  {{ item }}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  </div>
</template>
