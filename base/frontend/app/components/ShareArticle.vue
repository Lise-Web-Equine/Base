<script setup lang="ts">
/**
 * Boutons de partage d'un article.
 * Réseaux choisis dans les Réglages (Sanity → SEO & Partage) ; icônes
 * @nuxt/icon (simple-icons/carbon) pour une cohérence totale avec <SocialLinks>.
 * Le bouton « Copier le lien » complète la liste. Couleurs via design tokens.
 */
import { stegaClean } from "@sanity/client/stega";
import { settingsQuery } from "~/sanity/queries";

const props = withDefaults(
  defineProps<{
    /** Titre de l'article (texte partagé). */
    title?: string | null;
    /** URL à partager. Par défaut : l'URL absolue de la page courante. */
    url?: string;
  }>(),
  { title: "", url: undefined }
);

const route = useRoute();
const siteConfig = useSiteConfig();

const shareUrl = computed(() => {
  if (props.url) return props.url;
  const origin =
    siteConfig.url || (import.meta.client ? window.location.origin : "");
  return `${origin}${route.path}`;
});

// Titre nettoyé du stega (caractères invisibles du Visual Editing).
const shareTitle = computed(() => stegaClean(props.title) || "");

// Réseaux choisis dans les Réglages, nettoyés du stega, avec repli par défaut.
const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);
const networks = computed(() => {
  const list = stegaClean(settings.value?.shareNetworks) as string[] | undefined;
  return list && list.length ? list : ["facebook", "linkedin", "whatsapp", "email"];
});

// Icône (même jeu que SocialLinks) + libellé + lien de partage par réseau.
const ICONS: Record<string, string> = {
  facebook: "simple-icons:facebook",
  x: "simple-icons:x",
  twitter: "simple-icons:x",
  linkedin: "simple-icons:linkedin",
  whatsapp: "simple-icons:whatsapp",
  telegram: "simple-icons:telegram",
  pinterest: "simple-icons:pinterest",
  reddit: "simple-icons:reddit",
  email: "carbon:email",
};
const LABELS: Record<string, string> = {
  facebook: "Partager sur Facebook",
  x: "Partager sur X",
  twitter: "Partager sur X",
  linkedin: "Partager sur LinkedIn",
  whatsapp: "Partager sur WhatsApp",
  telegram: "Partager sur Telegram",
  pinterest: "Partager sur Pinterest",
  reddit: "Partager sur Reddit",
  email: "Partager par e-mail",
};

function hrefFor(network: string, u: string, t: string): string {
  const url = encodeURIComponent(u);
  const title = encodeURIComponent(t);
  switch (network) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case "x":
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "whatsapp":
      return `https://wa.me/?text=${title}%20${url}`;
    case "telegram":
      return `https://t.me/share/url?url=${url}&text=${title}`;
    case "pinterest":
      return `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
    case "reddit":
      return `https://www.reddit.com/submit?url=${url}&title=${title}`;
    case "email":
      return `mailto:?subject=${title}&body=${url}`;
    default:
      return u;
  }
}

const items = computed(() =>
  networks.value
    .filter((n) => ICONS[n])
    .map((n) => ({
      network: n,
      icon: ICONS[n]!,
      label: LABELS[n] || `Partager sur ${n}`,
      href: hrefFor(n, shareUrl.value, shareTitle.value),
    }))
);

// Copie du lien de l'article dans le presse-papiers.
const copied = ref(false);
async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    // Presse-papiers indisponible : on ignore.
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <span class="text-sm font-medium text-foreground">Partager sur</span>

    <div class="flex items-center gap-3 text-muted">
      <a
        v-for="item in items"
        :key="item.network"
        :href="item.href"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="item.label"
        class="inline-flex items-center transition-colors hover:text-primary">
        <Icon :name="item.icon" size="1.4em" aria-hidden="true" />
      </a>

      <!-- Copier le lien -->
      <button
        type="button"
        :aria-label="copied ? 'Lien copié' : 'Copier le lien'"
        class="inline-flex items-center gap-1.5 transition-colors hover:text-primary"
        @click="copyLink">
        <span class="text-sm">{{ copied ? "Lien copié" : "Copier le lien" }}</span>
        <Icon
          :name="copied ? 'carbon:checkmark' : 'carbon:link'"
          size="1.4em"
          aria-hidden="true" />
      </button>
    </div>
  </div>
</template>
