<script setup lang="ts">
import { socialIconFor } from "~/lib/socialIcons";

/**
 * Liste de liens réseaux sociaux avec icône déduite de la plateforme.
 * Icônes : @nuxt/icon (collection simple-icons, monochrome → teinte via tokens).
 * Repli : si la plateforme n'a pas d'icône, on affiche le libellé texte.
 */
interface SocialLink {
  _key?: string;
  platform?: string | null;
  url?: string | null;
  label?: string | null;
}

withDefaults(
  defineProps<{
    links?: SocialLink[] | null;
    size?: string;
  }>(),
  { size: "1.4em" }
);

const PLATFORM_LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  pinterest: "Pinterest",
  whatsapp: "WhatsApp",
  other: "Lien",
};

function labelFor(link: SocialLink): string {
  return link.label || PLATFORM_LABELS[link.platform ?? ""] || "Lien";
}
</script>

<template>
  <ul v-if="links && links.length" class="flex items-center gap-4">
    <li v-for="link in links" :key="link._key || link.url || ''">
      <a
        v-if="link.url"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="labelFor(link)"
        class="inline-flex items-center text-muted transition-colors hover:text-primary">
        <Icon
          v-if="socialIconFor(link.platform)"
          :name="socialIconFor(link.platform)!"
          :size="size"
          aria-hidden="true" />
        <span v-else class="text-sm">{{ labelFor(link) }}</span>
      </a>
    </li>
  </ul>
</template>
