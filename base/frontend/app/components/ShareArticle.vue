<script setup lang="ts">
/**
 * Boutons de partage d'un article : Facebook, Messenger, Message + copie du lien.
 * Icônes : @nuxt/icon (simple-icons + carbon). Couleurs via design tokens.
 */
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

type ShareItem = {
  key: string;
  type: "link" | "copy";
  label: string;
  icon: string;
  href?: string;
};

const items = computed<ShareItem[]>(() => {
  const u = encodeURIComponent(shareUrl.value);
  const t = encodeURIComponent(props.title || "");
  return [
    {
      key: "facebook",
      type: "link",
      label: "Partager sur Facebook",
      icon: "simple-icons:facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
    {
      key: "messenger",
      type: "link",
      label: "Partager sur Messenger",
      icon: "simple-icons:messenger",
      href: `fb-messenger://share/?link=${u}`,
    },
    {
      key: "message",
      type: "link",
      label: "Partager par message",
      icon: "carbon:chat",
      href: `sms:?&body=${t}%20${u}`,
    },
    {
      key: "copy",
      type: "copy",
      label: copied.value ? "Lien copié" : "Copier le lien",
      icon: copied.value ? "carbon:checkmark" : "carbon:link",
    },
  ];
});
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <span class="text-sm font-medium text-foreground">Partager sur</span>
    <ul class="flex items-center gap-3">
      <li v-for="item in items" :key="item.key">
        <a
          v-if="item.type === 'link'"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="item.label"
          class="inline-flex items-center text-muted transition-colors hover:text-primary"
        >
          <Icon :name="item.icon" size="1.4em" aria-hidden="true" />
        </a>
        <button
          v-else
          type="button"
          :aria-label="item.label"
          class="inline-flex items-center gap-1 text-muted transition-colors hover:text-primary"
          @click="copyLink"
        >
          <Icon :name="item.icon" size="1.4em" aria-hidden="true" />
          <span v-if="copied" class="text-xs">Lien copié</span>
        </button>
      </li>
    </ul>
  </div>
</template>
