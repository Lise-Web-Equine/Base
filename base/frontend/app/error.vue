<script setup lang="ts">
import type { NuxtError } from "#app";

/**
 * Page d'erreur globale (CŒUR).
 *
 * Rendue par Nuxt à la place de `app.vue` lorsqu'une erreur est levée
 * (404 sur une URL inconnue, 500 côté serveur, etc.). Elle réinjecte donc
 * elle-même le thème (`useTheme`) et s'appuie sur la mise en page par défaut
 * (Header/Footer) pour rester cohérente avec le reste du site.
 *
 * Le style est piloté par les design tokens (variables --color-* / --a-*),
 * jamais de couleur en dur.
 */
const props = defineProps<{
  error: NuxtError;
}>();

// Réinjecte les variables CSS du thème : `error.vue` remplace `app.vue`, donc
// `useTheme()` n'y est pas appelé automatiquement.
await useTheme();

const isNotFound = computed(() => props.error?.statusCode === 404);

const heading = computed(() =>
  isNotFound.value ? "Page introuvable" : "Une erreur est survenue"
);

const message = computed(() =>
  isNotFound.value
    ? "La page que vous recherchez n'existe pas ou a été déplacée."
    : "Un problème inattendu est survenu. Veuillez réessayer dans un instant."
);

useSiteMetadata({
  title: heading.value,
  noIndex: true,
});

// Vide l'état d'erreur puis redirige vers l'accueil (SPA, sans rechargement).
const handleHome = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtLayout>
    <div class="container my-24 lg:my-32">
      <div class="max-w-2xl">
        <p class="a-eyebrow">{{ error?.statusCode || "Erreur" }}</p>
        <h1 class="a-display mt-4">
          {{ heading }}
        </h1>
        <p class="a-lead mt-4">
          {{ message }}
        </p>
        <div class="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-white transition-all duration-200 hover:opacity-90"
            @click="handleHome">
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
