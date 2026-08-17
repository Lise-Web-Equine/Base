<script setup lang="ts">
/**
 * Formulaire de contact (brique Cœur).
 * Poste vers /api/contact (envoi Resend côté serveur). Anti-spam : honeypot.
 * Construit avec le composant <UForm> de Nuxt UI : validation par champ
 * (fonction `validate`) et messages d'erreur affichés dans chaque <UFormField>.
 */
import type { FormError, FormSubmitEvent } from "@nuxt/ui";

const props = defineProps({
  submitLabel: { type: String, default: "Envoyer" },
  successMessage: {
    type: String,
    default:
      "Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.",
  },
  privacyUrl: { type: String, default: "" },
});

const state = reactive({
  firstName: "",
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  consent: false,
  company: "", // honeypot
});
type Schema = typeof state;

const status = ref<"idle" | "submitting" | "success" | "error">("idle");
const errorMessage = ref("");

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Validation côté client, alignée sur les règles de /api/contact.
function validate(state: Schema): FormError[] {
  const errors: FormError[] = [];
  if (!state.firstName.trim())
    errors.push({ name: "firstName", message: "Votre prénom est requis." });
  if (!state.name.trim())
    errors.push({ name: "name", message: "Votre nom est requis." });
  if (!state.email.trim())
    errors.push({ name: "email", message: "Votre email est requis." });
  else if (!isEmail(state.email.trim()))
    errors.push({ name: "email", message: "Cet email n'est pas valide." });
  if (!state.subject.trim())
    errors.push({ name: "subject", message: "Le sujet est requis." });
  if (state.message.trim().length < 10)
    errors.push({
      name: "message",
      message: "Votre message doit contenir au moins 10 caractères.",
    });
  if (!state.consent)
    errors.push({
      name: "consent",
      message: "Merci d'accepter l'utilisation de vos données.",
    });
  return errors;
}

async function onSubmit(_event: FormSubmitEvent<Schema>) {
  if (status.value === "submitting") return;
  status.value = "submitting";
  errorMessage.value = "";
  try {
    await $fetch("/api/contact", { method: "POST", body: { ...state } });
    status.value = "success";
    state.firstName = state.name = state.email = state.phone = "";
    state.subject = state.message = "";
    state.consent = false;
  } catch (err: any) {
    status.value = "error";
    errorMessage.value =
      err?.data?.statusMessage ||
      err?.statusMessage ||
      "Une erreur est survenue. Merci de réessayer.";
  }
}
</script>

<template>
  <UForm
    :state="state"
    :validate="validate"
    class="flex flex-col gap-5"
    @submit="onSubmit">
    <UAlert
      v-if="status === 'success'"
      color="success"
      variant="soft"
      :title="props.successMessage" />

    <template v-else>
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField label="Prénom" name="firstName" required>
          <UInput
            v-model="state.firstName"
            placeholder="Ex: Claire"
            autocomplete="given-name"
            class="w-full" />
        </UFormField>

        <UFormField label="Nom" name="name" required>
          <UInput
            v-model="state.name"
            placeholder="Ex: Martin"
            autocomplete="family-name"
            class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Ex: claire.martin@email.com"
            autocomplete="email"
            class="w-full" />
        </UFormField>

        <UFormField label="Téléphone" name="phone" hint="Optionnel">
          <UInput
            v-model="state.phone"
            type="tel"
            placeholder="Ex: 06 12 34 56 78"
            autocomplete="tel"
            class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Sujet" name="subject" required>
        <UInput v-model="state.subject" class="w-full" />
      </UFormField>

      <UFormField label="Message" name="message" required>
        <UTextarea v-model="state.message" :rows="5" class="w-full" />
      </UFormField>

      <UFormField name="consent">
        <div class="flex items-start gap-3">
          <UCheckbox v-model="state.consent" class="mt-0.5" />
          <span class="text-sm text-foreground">
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
        </div>
      </UFormField>

      <!-- Honeypot anti-spam : caché aux humains, rempli par les bots. -->
      <div aria-hidden="true" class="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>Ne pas remplir
          <input v-model="state.company" type="text" tabindex="-1" autocomplete="off" />
        </label>
      </div>

      <UAlert
        v-if="status === 'error'"
        color="error"
        variant="soft"
        :description="errorMessage" />

      <UButton
        type="submit"
        size="lg"
        class="justify-center"
        :loading="status === 'submitting'"
        :label="status === 'submitting' ? 'Envoi…' : props.submitLabel" />
    </template>
  </UForm>
</template>
