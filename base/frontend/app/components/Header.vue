<script setup lang="ts">
import {
  settingsQuery,
  navigationQuery,
  contactPageQuery,
} from "~/sanity/queries";

const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);
const { data: navigation } =
  useSanityQuery<NavigationQueryResult>(navigationQuery);

const menu = computed(() => navigation.value?.headerMenu ?? []);

// Rubrique blog/actualités : lien ajouté au menu quand elle est activée.
const { enabled: blogEnabled, label: blogLabel } = useBlog();

// Page Contact : lien ajouté à la fin du menu seulement si la page existe.
const { data: contactPage } =
  useSanityQuery<ContactPageQueryResult>(contactPageQuery);
const contactLabel = computed(() => contactPage.value?.name || "Contact");

// Gestion des sous-menus déroulants (un seul ouvert à la fois).
const openKey = ref<string | null>(null);
function toggle(key: string) {
  openKey.value = openKey.value === key ? null : key;
}
function close() {
  openKey.value = null;
}

// Ferme le menu ouvert lors d'un changement de page.
const router = useRouter();
router.afterEach(() => close());
</script>

<template>
  <header
    class="fixed z-50 h-24 inset-0 bg-background/80 flex items-center backdrop-blur-lg"
  >
    <div class="container py-6 sm:px-6">
      <div class="flex items-center justify-between gap-5">
        <NuxtLink class="flex items-center gap-2" to="/">
          <span class="text-2xl pl-2 font-semibold">
            {{ settings?.title }}
          </span>
        </NuxtLink>

        <nav
          v-if="menu.length || blogEnabled || contactPage"
          class="flex items-center gap-6">
          <template v-for="item in menu" :key="item._key">
            <!-- Entrée avec sous-menu déroulant -->
            <div
              v-if="item.children && item.children.length"
              class="relative"
              @mouseenter="openKey = item._key"
              @mouseleave="close"
            >
              <button
                type="button"
                class="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                :aria-expanded="openKey === item._key"
                aria-haspopup="true"
                @click="toggle(item._key)"
              >
                {{ item.label }}
                <span
                  class="transition-transform"
                  :class="{ 'rotate-180': openKey === item._key }"
                  aria-hidden="true"
                  >&#9662;</span
                >
              </button>
              <div
                v-show="openKey === item._key"
                class="absolute left-0 top-full min-w-48 rounded-lg border border-border bg-light p-2 shadow-lg"
              >
                <ResolvedLink
                  v-for="child in item.children"
                  :key="child._key"
                  :link="child.link"
                  class-name="block rounded-md px-3 py-2 text-foreground hover:bg-background hover:text-primary transition-colors"
                >
                  {{ child.label }}
                </ResolvedLink>
              </div>
            </div>

            <!-- Entrée simple -->
            <ResolvedLink
              v-else-if="item.link"
              :link="item.link"
              class-name="text-foreground hover:text-primary transition-colors"
            >
              {{ item.label }}
            </ResolvedLink>
          </template>

          <!-- Lien vers la rubrique blog/actualités (si activée). -->
          <NuxtLink
            v-if="blogEnabled"
            to="/articles"
            class="text-foreground hover:text-primary transition-colors"
          >
            {{ blogLabel }}
          </NuxtLink>

          <!-- Lien vers la page Contact (à la fin, seulement si elle existe). -->
          <NuxtLink
            v-if="contactPage"
            to="/contact"
            class="text-foreground hover:text-primary transition-colors"
          >
            {{ contactLabel }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>
