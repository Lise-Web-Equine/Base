<script setup lang="ts">
/**
 * Atelier « Apparence des sections » — OUTIL DE DÉVELOPPEMENT (local seulement).
 *
 * Deux colonnes :
 *  - Gauche : les sections du Page Builder rendues en direct, sous forme
 *    d'« options » cliquables.
 *  - Droite (drawer) : quand on sélectionne une section, ses props Nuxt UI
 *    (celles de la doc du composant de base) sont synchronisées dans un
 *    formulaire, avec la fenêtre de code `<script setup>` générée (lecture
 *    seule). On modifie les valeurs → l'aperçu de gauche se met à jour en direct.
 *
 * Cette page n'existe PAS en production (404 hors `import.meta.dev`).
 */
import { createReusableTemplate } from "@vueuse/core";
import {
  playgroundSections,
  COLOR_OPTIONS,
  VARIANT_OPTIONS,
  type PlaygroundSection,
  type PropControl,
  type PlaygroundLink,
  type PlaygroundFeature,
} from "~/lib/sectionsPlayground";

// Gabarit réutilisable d'un contrôle de formulaire (rendu par groupe).
const [DefineControl, ReuseControl] = createReusableTemplate<{
  control: PropControl;
}>();

// Disponible uniquement en local (développement). En prod : page introuvable.
if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: "Page Not Found" });
}

definePageMeta({ layout: false });
useSiteMetadata({ title: "Apparence des sections", noIndex: true });

// État réactif : { [sectionId]: { [propKey]: valeur } }, initialisé aux défauts.
// `any` volontaire : les valeurs sont hétérogènes (string/boolean/links) et
// liées via v-model, qui exige une cible assignable sans cast.
type Values = Record<string, any>;
const state = reactive<Record<string, Values>>({});
for (const section of playgroundSections) {
  const initial: Values = {};
  for (const c of section.controls) {
    initial[c.key] = structuredClone(c.default);
  }
  state[section.id] = initial;
}

const selectedId = ref<string>(playgroundSections[0]?.id ?? "");
const selected = computed<PlaygroundSection | undefined>(() =>
  playgroundSections.find((s) => s.id === selectedId.value)
);

// Drawer de droite : ouvert par défaut, refermable pour voir l'aperçu plein cadre.
const drawerOpen = ref(true);

// Mode d'aperçu (largeur du cadre de rendu) : ordinateur / tablette / mobile.
type Viewport = "desktop" | "tablet" | "mobile";
const viewport = ref<Viewport>("desktop");
const viewports: { value: Viewport; label: string; icon: string; width: number | null }[] = [
  { value: "desktop", label: "Ordinateur", icon: "i-lucide-monitor", width: null },
  { value: "tablet", label: "Tablette", icon: "i-lucide-tablet", width: 768 },
  { value: "mobile", label: "Mobile", icon: "i-lucide-smartphone", width: 390 },
];
const viewportWidth = computed(
  () => viewports.find((v) => v.value === viewport.value)?.width ?? null
);
const frameStyle = computed(() =>
  viewportWidth.value ? { width: `${viewportWidth.value}px`, maxWidth: "100%" } : { width: "100%" }
);

// Sélecteur de section (barre du haut) quand plusieurs sections sont dispo.
const sectionItems = computed(() =>
  playgroundSections.map((s) => ({ label: s.label, value: s.id }))
);

function resetSection(section: PlaygroundSection) {
  for (const c of section.controls) {
    state[section.id]![c.key] = structuredClone(c.default);
  }
}

// Un contrôle est visible si son `showIf` (le cas échéant) est satisfait.
function isVisible(section: PlaygroundSection, c: PropControl): boolean {
  return !c.showIf || c.showIf(state[section.id] ?? {});
}

// Contrôles regroupés par cible (props du composant vs apparence de l'enveloppe).
function componentControls(section: PlaygroundSection): PropControl[] {
  return section.controls.filter(
    (c) => (c.target ?? "component") === "component" && isVisible(section, c)
  );
}
function appearanceControls(section: PlaygroundSection): PropControl[] {
  return section.controls.filter(
    (c) => c.target === "appearance" && isVisible(section, c)
  );
}
function contentControls(section: PlaygroundSection): PropControl[] {
  return section.controls.filter(
    (c) => c.target === "content" && isVisible(section, c)
  );
}

// --- Aperçu : props du composant transmises à <UPageSection> via <SectionShell>.
// On nettoie les chaînes vides et les tableaux vides pour coller au rendu réel.
function boundProps(section: PlaygroundSection): Record<string, unknown> {
  const values = state[section.id] ?? {};
  const out: Record<string, unknown> = {};
  for (const c of componentControls(section)) {
    const v = values[c.key];
    if (c.type === "boolean") {
      if (v) out[c.key] = true;
    } else if (c.type === "links") {
      const links = (v as PlaygroundLink[]) ?? [];
      const cleaned = links
        .filter((l) => l.label?.trim())
        .map((l) => ({
          label: l.label,
          to: l.to || undefined,
          color: l.color || undefined,
          variant: l.variant || undefined,
        }));
      if (cleaned.length) out[c.key] = cleaned;
    } else if (c.type === "features") {
      const features = (v as PlaygroundFeature[]) ?? [];
      const cleaned = features
        .filter((f) => f.title?.trim())
        .map((f) => ({
          title: f.title,
          description: f.description || undefined,
          icon: f.icon || undefined,
        }));
      if (cleaned.length) out[c.key] = cleaned;
    } else if (typeof v === "string") {
      if (v.trim()) out[c.key] = v;
    } else if (v != null) {
      out[c.key] = v;
    }
  }
  return out;
}

// NB : le rendu de l'aperçu (dont la simulation d'image de fond) est délégué au
// composant <SectionAppearancePreview>, embarqué dans l'iframe responsive.

// Téléversement d'une image locale → URL d'objet (jamais envoyée à Sanity).
function onImagePick(section: PlaygroundSection, key: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const previous = state[section.id]?.[key] as string;
  if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
  state[section.id]![key] = URL.createObjectURL(file);
  input.value = "";
}
function clearImage(section: PlaygroundSection, key: string) {
  const previous = state[section.id]?.[key] as string;
  if (previous?.startsWith("blob:")) URL.revokeObjectURL(previous);
  state[section.id]![key] = "";
}

// Carrousel : liste d'images locales (URLs d'objet). Ajout / retrait.
function sectionImages(section: PlaygroundSection, key: string): string[] {
  return (state[section.id]?.[key] as string[]) ?? [];
}
function onImagesPick(section: PlaygroundSection, key: string, event: Event) {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  if (!files.length) return;
  const list = sectionImages(section, key);
  for (const file of files) list.push(URL.createObjectURL(file));
  input.value = "";
}
function removeImageAt(section: PlaygroundSection, key: string, index: number) {
  const list = sectionImages(section, key);
  const [removed] = list.splice(index, 1);
  if (removed?.startsWith("blob:")) URL.revokeObjectURL(removed);
}

// --- Gestion des liens (contrôle "links") : ajout / suppression.
function sectionLinks(section: PlaygroundSection): PlaygroundLink[] {
  return (state[section.id]?.links as PlaygroundLink[]) ?? [];
}
function addLink(section: PlaygroundSection) {
  sectionLinks(section).push({
    label: "Bouton",
    to: "",
    color: "primary",
    variant: "solid",
  });
}
function removeLink(section: PlaygroundSection, index: number) {
  sectionLinks(section).splice(index, 1);
}

// --- Gestion des fonctionnalités (contrôle "features") : ajout / suppression.
function sectionFeatures(
  section: PlaygroundSection,
  key: string
): PlaygroundFeature[] {
  return (state[section.id]?.[key] as PlaygroundFeature[]) ?? [];
}
function addFeature(section: PlaygroundSection, key: string) {
  sectionFeatures(section, key).push({
    title: "Fonctionnalité",
    description: "",
    icon: "",
  });
}
function removeFeature(section: PlaygroundSection, key: string, index: number) {
  sectionFeatures(section, key).splice(index, 1);
}

function selectItems(control: PropControl) {
  return (control.options ?? []).map((o) => ({
    label: o.label,
    value: o.value,
  }));
}

// --- Code ÉDITABLE (objet de props TS). Bidirectionnel : le code ↔ le
// formulaire ↔ l'aperçu partagent la même source (`state`).
//
// Sérialisation d'une valeur en littéral objet TS/JS (clés non quotées).
function toLiteral(v: unknown, indent = ""): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  if (Array.isArray(v)) {
    if (!v.length) return "[]";
    const inner = v
      .map((x) => indent + "  " + toLiteral(x, indent + "  "))
      .join(",\n");
    return `[\n${inner}\n${indent}]`;
  }
  if (v && typeof v === "object") {
    const entries = Object.entries(v as Record<string, unknown>)
      .filter(([, val]) => val !== undefined)
      .map(([k, val]) => `${indent}  ${k}: ${toLiteral(val, indent + "  ")}`);
    if (!entries.length) return "{}";
    return `{\n${entries.join(",\n")}\n${indent}}`;
  }
  return "null";
}

// Génère l'objet de props (nettoyé, comme réellement transmis au composant).
function generateCode(section: PlaygroundSection): string {
  return toLiteral(boundProps(section));
}

// Texte éditable affiché dans la fenêtre de code + éventuelle erreur de parsing.
const codeDraft = ref("");
const codeError = ref<string | null>(null);
// Empêche la boucle infinie code → state → code lorsqu'on tape dans le code.
let syncingFromCode = false;

// Le `state` (formulaire) fait foi : toute évolution régénère le code affiché,
// SAUF quand la modification vient du code lui-même (on préserve la frappe).
watch(
  [selectedId, state],
  () => {
    if (syncingFromCode || !selected.value) return;
    codeDraft.value = generateCode(selected.value);
    codeError.value = null;
  },
  { deep: true, immediate: true }
);

// Frappe dans la fenêtre de code : on évalue le littéral et on réinjecte les
// valeurs reconnues dans `state` → l'aperçu et le formulaire se mettent à jour.
function onCodeInput(value: string) {
  codeDraft.value = value;
  if (!selected.value) return;
  let parsed: Record<string, unknown>;
  try {
    // eslint-disable-next-line no-new-func
    parsed = new Function(`return (${value})`)() as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") throw new Error("Objet attendu");
  } catch (e) {
    codeError.value = (e as Error).message;
    return;
  }
  codeError.value = null;
  syncingFromCode = true;
  const values = state[selected.value.id]!;
  // On ne touche qu'aux props du composant (l'apparence est gérée à part).
  for (const c of componentControls(selected.value)) {
    if (c.key in parsed) values[c.key] = parsed[c.key];
    else if (c.type === "boolean") values[c.key] = false;
    else if (c.type === "links" || c.type === "features") values[c.key] = [];
    else if (typeof c.default === "string") values[c.key] = "";
  }
  nextTick(() => {
    syncingFromCode = false;
  });
}

// Copie du code dans le presse-papier.
const toast = useToast();
async function copyCode() {
  try {
    await navigator.clipboard.writeText(codeDraft.value);
    toast.add({ title: "Code copié", color: "success" });
  } catch {
    toast.add({ title: "Copie impossible", color: "error" });
  }
}

// --- Aperçu embarqué en iframe (viewport propre → responsive réel).
// La page envoie l'état à l'iframe via postMessage ; l'iframe met à jour son
// rendu sans rechargement.
const previewUrl = "/sections-apparence-preview";
const previewFrame = ref<HTMLIFrameElement | null>(null);
const previewReady = ref(false);
// Hauteur du contenu remontée par l'iframe → on l'y applique (pas de scroll interne).
const previewHeight = ref(0);
const iframeStyle = computed(() => ({
  ...frameStyle.value,
  height: previewHeight.value ? `${previewHeight.value}px` : "100%",
}));

function postState() {
  if (!previewReady.value || !selected.value) return;
  previewFrame.value?.contentWindow?.postMessage(
    {
      type: "section-apparence:state",
      sectionId: selected.value.id,
      // Sérialisation « plate » : retire la réactivité (structuredClone via JSON).
      values: JSON.parse(JSON.stringify(state[selected.value.id] ?? {})),
    },
    window.location.origin
  );
}

function onFrameMessage(e: MessageEvent) {
  if (e.origin !== window.location.origin) return;
  if (e.data?.type === "section-apparence:ready") {
    previewReady.value = true;
    postState();
  } else if (e.data?.type === "section-apparence:height") {
    previewHeight.value = e.data.height;
  }
}

onMounted(() => window.addEventListener("message", onFrameMessage));
onBeforeUnmount(() => window.removeEventListener("message", onFrameMessage));

// Toute modification (section, props, apparence) est repoussée dans l'iframe.
watch([selectedId, state], () => postState(), { deep: true });
</script>

<template>
  <div class="flex min-h-screen items-start bg-background text-foreground">
    <!-- ZONE PRINCIPALE : aperçu en direct, COLLÉ (sticky) pendant le défilement. -->
    <main class="sticky top-0 flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
      <header
        class="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-3">
        <div class="flex flex-wrap items-center gap-4">
          <div>
            <p class="text-[10px] uppercase tracking-widest text-muted">
              Outil de développement
            </p>
            <h1 class="text-lg font-bold tracking-tight">Apparence des sections</h1>
          </div>
          <USelect
            v-if="playgroundSections.length > 1"
            v-model="selectedId"
            :items="sectionItems"
            class="w-56" />
        </div>
        <UButton
          v-if="!drawerOpen"
          color="neutral"
          variant="outline"
          icon="i-lucide-panel-right-open"
          @click="drawerOpen = true">
          Réglages
        </UButton>
      </header>

      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div class="flex items-center justify-between gap-3 border-b border-border px-6 py-2">
          <p class="text-xs font-semibold uppercase tracking-widest text-muted">
            Aperçu en direct
          </p>
          <div class="flex items-center gap-1">
            <UButton
              v-for="v in viewports"
              :key="v.value"
              size="xs"
              :color="viewport === v.value ? 'primary' : 'neutral'"
              :variant="viewport === v.value ? 'solid' : 'ghost'"
              :icon="v.icon"
              :title="v.label"
              :aria-label="v.label"
              @click="viewport = v.value" />
          </div>
        </div>
        <div class="flex min-h-0 flex-1 items-start justify-center overflow-auto bg-elevated/40 p-4">
          <iframe
            ref="previewFrame"
            :src="previewUrl"
            title="Aperçu de la section"
            class="bg-background transition-[width,height]"
            :class="viewport !== 'desktop' ? 'rounded-xl border border-border shadow-layer' : ''"
            :style="iframeStyle" />
        </div>
      </div>
    </main>

    <!-- DRAWER DROITE : props + code éditable (ouvert par défaut). -->
    <aside
      v-if="selected && drawerOpen"
      class="w-1/3 shrink-0 self-stretch border-l border-border bg-elevated">
      <div class="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-elevated px-5 py-4">
        <div class="min-w-0 flex-1">
          <label class="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-muted">
            Section builder
          </label>
          <USelect
            v-model="selectedId"
            :items="sectionItems"
            class="w-full"
            :icon="'i-lucide-layout-template'" />
          <p class="mt-1 text-xs text-muted">
            Props de
            <code class="font-mono">{{ selected.baseComponent }}</code>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-external-link"
            :to="selected.docUrl"
            target="_blank"
            title="Documentation Nuxt UI" />
          <UButton
            size="xs"
            color="neutral"
            variant="outline"
            icon="i-lucide-rotate-ccw"
            @click="resetSection(selected)">
            Réinitialiser
          </UButton>
          <UButton
            size="xs"
            color="neutral"
            variant="ghost"
            icon="i-lucide-panel-right-close"
            title="Fermer le panneau"
            @click="drawerOpen = false" />
        </div>
      </div>

      <!-- Gabarit réutilisable d'un contrôle (défini une fois, réutilisé par
           groupe). -->
      <DefineControl v-slot="{ control }">
        <UFormField :label="control.label" :help="control.help">
          <!-- Texte -->
          <UInput
            v-if="control.type === 'text' || control.type === 'icon'"
            v-model="state[selected.id][control.key]"
            :placeholder="control.placeholder"
            class="w-full" />

          <!-- Zone de texte -->
          <UTextarea
            v-else-if="control.type === 'textarea'"
            v-model="state[selected.id][control.key]"
            :placeholder="control.placeholder"
            :rows="3"
            class="w-full" />

          <!-- Booléen -->
          <USwitch
            v-else-if="control.type === 'boolean'"
            v-model="state[selected.id][control.key]" />

          <!-- Sélection -->
          <USelect
            v-else-if="control.type === 'select'"
            v-model="state[selected.id][control.key]"
            :items="selectItems(control)"
            class="w-full" />

          <!-- Curseur (0-100) -->
          <div
            v-else-if="control.type === 'range'"
            class="flex items-center gap-3">
            <USlider
              v-model="state[selected.id][control.key]"
              :min="control.min ?? 0"
              :max="control.max ?? 100"
              :step="control.step ?? 1"
              class="w-full" />
            <span class="w-10 text-right font-mono text-xs text-muted">
              {{ state[selected.id][control.key] }}
            </span>
          </div>

          <!-- Image (upload local, façon champ image Sanity) -->
          <div v-else-if="control.type === 'image'" class="space-y-2">
            <div
              v-if="state[selected.id][control.key]"
              class="flex items-center gap-3 rounded-lg border border-border p-2">
              <img
                :src="state[selected.id][control.key]"
                alt=""
                class="h-16 w-24 shrink-0 rounded object-cover" />
              <div class="flex flex-1 flex-wrap gap-2">
                <label
                  class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-primary/50">
                  <UIcon name="i-lucide-refresh-cw" class="size-3.5" />
                  Remplacer
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="onImagePick(selected, control.key, $event)" />
                </label>
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="clearImage(selected, control.key)">
                  Retirer
                </UButton>
              </div>
            </div>
            <label
              v-else
              class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted transition-colors hover:border-primary/50">
              <UIcon name="i-lucide-image-up" class="size-6" />
              <span>Téléverser une image</span>
              <span class="text-xs">PNG, JPG…</span>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="onImagePick(selected, control.key, $event)" />
            </label>
          </div>

          <!-- Vidéo (upload local) -->
          <div v-else-if="control.type === 'video'" class="space-y-2">
            <div
              v-if="state[selected.id][control.key]"
              class="flex items-center gap-3 rounded-lg border border-border p-2">
              <video
                :src="state[selected.id][control.key]"
                class="h-16 w-24 shrink-0 rounded object-cover"
                muted
                autoplay
                loop
                playsinline />
              <div class="flex flex-1 flex-wrap gap-2">
                <label
                  class="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted transition-colors hover:border-primary/50">
                  <UIcon name="i-lucide-refresh-cw" class="size-3.5" />
                  Remplacer
                  <input
                    type="file"
                    accept="video/*"
                    class="hidden"
                    @change="onImagePick(selected, control.key, $event)" />
                </label>
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="clearImage(selected, control.key)">
                  Retirer
                </UButton>
              </div>
            </div>
            <label
              v-else
              class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted transition-colors hover:border-primary/50">
              <UIcon name="i-lucide-clapperboard" class="size-6" />
              <span>Téléverser une vidéo</span>
              <span class="text-xs">MP4, WebM…</span>
              <input
                type="file"
                accept="video/*"
                class="hidden"
                @change="onImagePick(selected, control.key, $event)" />
            </label>
          </div>

          <!-- Carrousel (plusieurs images locales) -->
          <div v-else-if="control.type === 'images'" class="space-y-2">
            <div
              v-if="sectionImages(selected, control.key).length"
              class="grid grid-cols-3 gap-2">
              <div
                v-for="(src, i) in sectionImages(selected, control.key)"
                :key="i"
                class="group relative overflow-hidden rounded-md border border-border">
                <img :src="src" alt="" class="h-16 w-full object-cover" />
                <button
                  type="button"
                  class="absolute right-1 top-1 rounded bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  @click="removeImageAt(selected, control.key, i)">
                  <UIcon name="i-lucide-x" class="size-3.5" />
                </button>
              </div>
            </div>
            <label
              class="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted transition-colors hover:border-primary/50">
              <UIcon name="i-lucide-image-up" class="size-5" />
              <span>Ajouter des images</span>
              <input
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                @change="onImagesPick(selected, control.key, $event)" />
            </label>
          </div>

          <!-- Liste de boutons -->
          <div v-else-if="control.type === 'links'" class="space-y-3">
            <div
              v-for="(link, i) in sectionLinks(selected)"
              :key="i"
              class="space-y-2 rounded-lg border border-border p-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-muted">Bouton {{ i + 1 }}</span>
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="removeLink(selected, i)" />
              </div>
              <UInput v-model="link.label" placeholder="Libellé" class="w-full" />
              <UInput v-model="link.to" placeholder="Lien (/contact)" class="w-full" />
              <div class="grid grid-cols-2 gap-2">
                <USelect v-model="link.color" :items="COLOR_OPTIONS" class="w-full" />
                <USelect v-model="link.variant" :items="VARIANT_OPTIONS" class="w-full" />
              </div>
            </div>
            <UButton
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-lucide-plus"
              @click="addLink(selected)">
              Ajouter un bouton
            </UButton>
          </div>

          <!-- Liste de fonctionnalités -->
          <div v-else-if="control.type === 'features'" class="space-y-3">
            <div
              v-for="(feature, i) in sectionFeatures(selected, control.key)"
              :key="i"
              class="space-y-2 rounded-lg border border-border p-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-muted">
                  Fonctionnalité {{ i + 1 }}
                </span>
                <UButton
                  size="xs"
                  color="error"
                  variant="ghost"
                  icon="i-lucide-trash-2"
                  @click="removeFeature(selected, control.key, i)" />
              </div>
              <UInput v-model="feature.title" placeholder="Titre" class="w-full" />
              <UTextarea
                v-model="feature.description"
                placeholder="Description (optionnel)"
                :rows="2"
                class="w-full" />
              <UInput
                v-model="feature.icon"
                placeholder="Icône (i-lucide-rocket)"
                class="w-full" />
            </div>
            <UButton
              size="xs"
              color="neutral"
              variant="outline"
              icon="i-lucide-plus"
              @click="addFeature(selected, control.key)">
              Ajouter une fonctionnalité
            </UButton>
          </div>
        </UFormField>
      </DefineControl>

      <div class="space-y-6 p-5">
        <!-- Props du composant -->
        <section class="space-y-4">
          <ReuseControl
            v-for="control in componentControls(selected)"
            :key="control.key"
            :control="control" />
        </section>

        <!-- Contenu rendu via un slot (ex. citation) -->
        <section v-if="contentControls(selected).length" class="space-y-4">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted">
            Contenu
          </h3>
          <ReuseControl
            v-for="control in contentControls(selected)"
            :key="control.key"
            :control="control" />
        </section>

        <!-- Apparence (enveloppe SectionShell) -->
        <section v-if="appearanceControls(selected).length" class="space-y-4">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted">
            Apparence
          </h3>
          <ReuseControl
            v-for="control in appearanceControls(selected)"
            :key="control.key"
            :control="control" />
        </section>

        <!-- Fenêtre de code ÉDITABLE (objet de props) -->
        <section class="space-y-2">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-semibold uppercase tracking-widest text-muted">
              Code (props, éditable)
            </h3>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-copy"
              @click="copyCode()">
              Copier
            </UButton>
          </div>
          <UTextarea
            :model-value="codeDraft"
            :rows="14"
            :ui="{ base: 'font-mono text-xs leading-relaxed' }"
            class="w-full"
            spellcheck="false"
            @update:model-value="onCodeInput" />
          <p v-if="codeError" class="text-xs text-error">
            Erreur de syntaxe : {{ codeError }}
          </p>
          <p v-else class="text-xs text-muted">
            Modifie cet objet de props : l'aperçu et le formulaire se mettent à
            jour en direct.
          </p>
        </section>
      </div>
    </aside>
  </div>
</template>
