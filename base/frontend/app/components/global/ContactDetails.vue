<script setup lang="ts">
/**
 * Section "Coordonnées" du Page Builder (brique Cœur).
 * Affiche e-mail, téléphone, adresse et réseaux sociaux depuis le singleton
 * "Réglages du site" (source unique de vérité). Les cases d'affichage viennent
 * du bloc, les données viennent de `settings`.
 */
import { settingsQuery } from "~/sanity/queries";

defineProps({
  block: {
    type: Object as PropType<ContactDetails>,
    required: true,
  },
});

const { data: settings } = await useSanityQuery<SettingsQueryResult>(
  settingsQuery
);

const addr = computed(() => settings.value?.address);
const addressLines = computed(() => {
  const a = addr.value;
  if (!a) return [];
  return [
    a.street,
    [a.postalCode, a.city].filter(Boolean).join(" "),
    a.country,
  ].filter((line): line is string => !!line && line.trim().length > 0);
});
</script>

<template>
  <section class="container my-12">
    <div class="mx-auto max-w-2xl">
      <div v-if="block.eyebrow || block.heading || block.intro" class="mb-8 flex flex-col gap-3">
        <p v-if="block.eyebrow" class="a-eyebrow">
          {{ block.eyebrow }}
        </p>
        <h2 v-if="block.heading" class="a-h1">
          {{ block.heading }}
        </h2>
        <p v-if="block.intro" class="a-lead">
          {{ block.intro }}
        </p>
      </div>

      <dl class="flex flex-col gap-6">
        <div v-if="block.showEmail && settings?.email" class="flex items-start gap-3">
          <Icon name="carbon:email" size="1.4em" class="mt-1 text-primary" aria-hidden="true" />
          <div>
            <dt class="text-sm font-medium text-muted">E-mail</dt>
            <dd>
              <a
                :href="`mailto:${settings.email}`"
                class="text-foreground hover:text-primary transition-colors">
                {{ settings.email }}
              </a>
            </dd>
          </div>
        </div>

        <div v-if="block.showPhone && settings?.phone" class="flex items-start gap-3">
          <Icon name="carbon:phone" size="1.4em" class="mt-1 text-primary" aria-hidden="true" />
          <div>
            <dt class="text-sm font-medium text-muted">Téléphone</dt>
            <dd>
              <a
                :href="`tel:${settings.phone.replace(/\s+/g, '')}`"
                class="text-foreground hover:text-primary transition-colors">
                {{ settings.phone }}
              </a>
            </dd>
          </div>
        </div>

        <div v-if="block.showAddress && addressLines.length" class="flex items-start gap-3">
          <Icon name="carbon:location" size="1.4em" class="mt-1 text-primary" aria-hidden="true" />
          <div>
            <dt class="text-sm font-medium text-muted">Adresse</dt>
            <dd class="not-italic text-foreground">
              <span v-for="(line, i) in addressLines" :key="i" class="block">{{ line }}</span>
            </dd>
          </div>
        </div>

        <div
          v-if="block.showSocial && settings?.socialLinks?.length"
          class="flex items-start gap-3">
          <Icon name="carbon:share" size="1.4em" class="mt-1 text-primary" aria-hidden="true" />
          <div>
            <dt class="text-sm font-medium text-muted">Suivez-nous</dt>
            <dd class="mt-2">
              <SocialLinks :links="settings.socialLinks" />
            </dd>
          </div>
        </div>
      </dl>
    </div>
  </section>
</template>
