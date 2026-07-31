<script setup lang="ts">
/**
 * Lightbox plein écran (maison, basé sur VueUse).
 *
 * - Ouverture contrôlée via v-model (index de l'image, ou null = fermé).
 * - Verrouillage du scroll (useScrollLock), navigation clavier (useMagicKeys),
 *   swipe tactile (useSwipe). Rendu en <Teleport> sur <body>.
 */
interface Img {
  asset?: { _ref?: string } | null;
  alt?: string | null;
  caption?: string | null;
  credit?: string | null;
}

const props = defineProps<{ images: Img[]; modelValue: number | null }>();
const emit = defineEmits<{ "update:modelValue": [number | null] }>();

const isOpen = computed(() => props.modelValue !== null);
const current = computed(() =>
  props.modelValue !== null ? props.images[props.modelValue] : null
);

// Verrouille le scroll du body tant que la lightbox est ouverte.
const body = import.meta.client ? document.body : null;
const locked = useScrollLock(body);
watch(isOpen, (v) => (locked.value = v), { immediate: false });

function close() {
  emit("update:modelValue", null);
}
function go(delta: number) {
  if (props.modelValue === null || props.images.length === 0) return;
  const n = props.images.length;
  emit("update:modelValue", (props.modelValue + delta + n) % n);
}

// Navigation clavier.
const { Escape, ArrowLeft, ArrowRight } = useMagicKeys();
watch(Escape, (v) => v && isOpen.value && close());
watch(ArrowLeft, (v) => v && isOpen.value && go(-1));
watch(ArrowRight, (v) => v && isOpen.value && go(1));

// Swipe tactile.
const swipeTarget = ref<HTMLElement | null>(null);
useSwipe(swipeTarget, {
  onSwipeEnd(_e, direction) {
    if (!isOpen.value) return;
    if (direction === "left") go(1);
    else if (direction === "right") go(-1);
  },
});
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox-fade">
      <div
        v-if="isOpen && current"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Aperçu de l'image"
        @click.self="close">
        <button
          type="button"
          class="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          aria-label="Fermer"
          @click="close">
          &times;
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
          aria-label="Image précédente"
          @click="go(-1)">
          &lsaquo;
        </button>
        <button
          v-if="images.length > 1"
          type="button"
          class="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl text-white transition hover:bg-white/20"
          aria-label="Image suivante"
          @click="go(1)">
          &rsaquo;
        </button>

        <figure ref="swipeTarget" class="m-0 flex max-h-full max-w-full flex-col items-center">
          <SanityImage
            v-if="current.asset?._ref"
            :asset-id="current.asset._ref"
            :alt="current.alt || ''"
            auto="format"
            sizes="90vw"
            class="max-h-[82vh] w-auto object-contain" />
          <figcaption
            v-if="current.caption || current.credit"
            class="mt-3 text-center text-sm text-white/80">
            <span v-if="current.caption">{{ current.caption }}</span>
            <span v-if="current.credit" class="italic">
              <template v-if="current.caption"> — </template>{{ current.credit }}
            </span>
          </figcaption>
        </figure>

        <div
          v-if="images.length > 1"
          class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
          {{ (modelValue ?? 0) + 1 }} / {{ images.length }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}
</style>
