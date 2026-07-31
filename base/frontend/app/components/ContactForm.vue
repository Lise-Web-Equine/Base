<script setup lang="ts">
/**
 * Formulaire de contact (brique Cœur).
 * Poste vers /api/contact (envoi Resend côté serveur). Anti-spam : honeypot.
 * Style : @tailwindcss/forms + design tokens (arrondi, couleurs du thème).
 */
const form = reactive({ name: "", email: "", message: "", company: "" });
const status = ref<"idle" | "submitting" | "success" | "error">("idle");
const errorMessage = ref("");

async function onSubmit() {
  if (status.value === "submitting") return;
  status.value = "submitting";
  errorMessage.value = "";
  try {
    await $fetch("/api/contact", { method: "POST", body: { ...form } });
    status.value = "success";
    form.name = form.email = form.message = "";
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
      Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.
    </div>

    <template v-else>
      <div class="flex flex-col gap-2">
        <label for="cf-name" class="text-sm font-medium text-foreground">Nom</label>
        <input
          id="cf-name"
          v-model="form.name"
          type="text"
          required
          autocomplete="name"
          :class="inputClass"
          :style="{ borderRadius: 'var(--a-radius)' }" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="cf-email" class="text-sm font-medium text-foreground">Email</label>
        <input
          id="cf-email"
          v-model="form.email"
          type="email"
          required
          autocomplete="email"
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
        {{ status === "submitting" ? "Envoi…" : "Envoyer" }}
      </button>
    </template>
  </form>
</template>
