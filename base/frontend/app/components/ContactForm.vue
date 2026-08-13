<script setup lang="ts">
/**
 * Formulaire de contact (brique Cœur).
 * Poste vers /api/contact (envoi Resend côté serveur). Anti-spam : honeypot.
 * Champs rendus avec les composants formulaire Nuxt UI (thémés via nos tokens).
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
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
    <UAlert
      v-if="status === 'success'"
      color="success"
      variant="soft"
      :title="props.successMessage" />

    <template v-else>
      <div class="grid gap-5 sm:grid-cols-2">
        <UFormField label="Prénom" name="firstName" required>
          <UInput
            v-model="form.firstName"
            placeholder="Ex: Claire"
            autocomplete="given-name"
            class="w-full" />
        </UFormField>

        <UFormField label="Nom" name="name" required>
          <UInput
            v-model="form.name"
            placeholder="Ex: Martin"
            autocomplete="family-name"
            class="w-full" />
        </UFormField>

        <UFormField label="Email" name="email" required>
          <UInput
            v-model="form.email"
            type="email"
            placeholder="Ex: claire.martin@email.com"
            autocomplete="email"
            class="w-full" />
        </UFormField>

        <UFormField label="Téléphone" name="phone" hint="Optionnel">
          <UInput
            v-model="form.phone"
            type="tel"
            placeholder="Ex: 06 12 34 56 78"
            autocomplete="tel"
            class="w-full" />
        </UFormField>
      </div>

      <UFormField label="Sujet" name="subject" required>
        <UInput v-model="form.subject" class="w-full" />
      </UFormField>

      <UFormField label="Message" name="message" required>
        <UTextarea v-model="form.message" :rows="5" class="w-full" />
      </UFormField>

      <div class="flex items-start gap-3">
        <UCheckbox v-model="form.consent" required class="mt-0.5" />
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

      <!-- Honeypot anti-spam : caché aux humains, rempli par les bots. -->
      <div aria-hidden="true" class="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>Ne pas remplir
          <input v-model="form.company" type="text" tabindex="-1" autocomplete="off" />
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
  </form>
</template>
