<script setup lang="ts">
/**
 * Formulaire de contact (brique Cœur).
 * Poste vers /api/contact (envoi Resend côté serveur). Anti-spam : honeypot.
 * Style : @tailwindcss/forms + design tokens (arrondi, couleurs du thème).
 */
const props = defineProps({
  submitLabel: { type: String, default: "Envoyer" },
  successMessage: {
    type: String,
    default:
      "Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.",
  },
  privacyUrl: { type: String, default: "" },
});

const form = reactive({
  firstName: "",
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
  company: "", // honeypot
});
const status = ref<"idle" | "submitting" | "success" | "error">("idle");
const errorMessage = ref("");

async function onSubmit() {
  if (status.value === "submitting") return;
  status.value = "submitting";
  errorMessage.value = "";
  try {
    await $fetch("/api/contact", { method: "POST", body: { ...form } });
    status.value = "success";
    form.firstName = form.name = form.email = form.phone = "";
    form.subject = form.message = "";
    form.consent = false;
  } catch (err: any) {
    status.value = "error";
    errorMessage.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      "Une erreur est survenue. Merci de réessayer.";
  }
}

const inputClass =
  "w-full border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30";
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
    <div
      v-if="status === 'success'"
      class="rounded-lg border border-border bg-surface p-4 text-foreground"
      role="status">
      {{ props.successMessage }}
    </div>

    <template v-else>
      <div class="grid gap-5 sm:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="cf-firstName" class="text-sm font-medium text-foreground">Prénom</label>
          <input
            id="cf-firstName"
            v-model="form.firstName"
            placeholder="Ex: Claire"
            type="text"
            required
            autocomplete="given-name"
            :class="inputClass"
            :style="{ borderRadius: 'var(--a-radius)' }" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="cf-name" class="text-sm font-medium text-foreground">Nom</label>
          <input
            id="cf-name"
            v-model="form.name"
            placeholder="Ex: Martin"
            type="text"
            required
            autocomplete="family-name"
            :class="inputClass"
            :style="{ borderRadius: 'var(--a-radius)' }" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="cf-email" class="text-sm font-medium text-foreground">Email</label>
          <input
            id="cf-email"
            v-model="form.email"
            placeholder="Ex: claire.martin@email.com"
            type="email"
            required
            autocomplete="email"
            :class="inputClass"
            :style="{ borderRadius: 'var(--a-radius)' }" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="cf-phone" class="text-sm font-medium text-foreground">
            Téléphone <span class="text-muted">(optionnel)</span>
          </label>
          <input
            id="cf-phone"
            v-model="form.phone"
            placeholder="Ex: 06 12 34 56 78"
            type="tel"
            autocomplete="tel"
            :class="inputClass"
            :style="{ borderRadius: 'var(--a-radius)' }" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="cf-subject" class="text-sm font-medium text-foreground">Sujet</label>
        <input
          id="cf-subject"
          v-model="form.subject"
          type="text"
          required
          :class="inputClass"
          :style="{ borderRadius: 'var(--a-radius)' }" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="cf-message" class="text-sm font-medium text-foreground">Message</label>
        <textarea
          id="cf-message"
          v-model="form.message"
          rows="5"
          required
          :class="inputClass"
          :style="{ borderRadius: 'var(--a-radius)' }" />
      </div>

      <label class="flex items-start gap-3 text-sm text-foreground">
        <input
          v-model="form.consent"
          type="checkbox"
          required
          class="mt-0.5 border-border text-primary focus:ring-2 focus:ring-primary/30" />
        <span>
          J'accepte que mes données soient utilisées pour traiter ma demande.
          <a
            v-if="props.privacyUrl"
            :href="props.privacyUrl"
            class="text-primary underline"
            target="_blank"
            rel="noopener noreferrer">
            Politique de confidentialité
          </a>
        </span>
      </label>

      <!-- Honeypot anti-spam : caché aux humains, rempli par les bots. -->
      <div aria-hidden="true" class="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>Ne pas remplir
          <input v-model="form.company" type="text" tabindex="-1" autocomplete="off" />
        </label>
      </div>

      <p v-if="status === 'error'" class="text-sm text-primary" role="alert">
        {{ errorMessage }}
      </p>

      <button
        type="submit"
        :disabled="status === 'submitting'"
        class="inline-flex items-center justify-center bg-primary px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        :style="{ borderRadius: 'var(--a-radius)' }">
        {{ status === "submitting" ? "Envoi…" : props.submitLabel }}
      </button>
    </template>
  </form>
</template>
