<script setup lang="ts">
/**
 * Section "Formulaire de contact" du Page Builder (brique Cœur).
 * Affiche un en-tête (sur-titre, titre, intro) suivi du formulaire <ContactForm>.
 */
defineProps({
  block: {
    type: Object as PropType<ContactSection>,
    required: true,
  },
  // Position dans la page (fournie par PageBuilder), non utilisée ici.
  index: {
    type: Number,
    default: 0,
  },
});
</script>

<template>
  <section class="container my-12">
    <div class="mx-auto max-w-2xl">
      <div
        v-if="block.showHeader !== false"
        class="mb-8 flex flex-col gap-3">
        <p v-if="block.eyebrow" class="a-eyebrow">
          {{ block.eyebrow }}
        </p>
        <h2 v-if="block.heading" class="a-title-1">
          {{ block.heading }}
        </h2>
        <p v-if="block.intro" class="a-lead">
          {{ block.intro }}
        </p>
      </div>

      <ContactForm
        :submit-label="block.submitLabel || 'Envoyer'"
        :success-message="block.successMessage || undefined"
        :privacy-url="block.privacyUrl || ''" />
    </div>
  </section>
</template>
