<script setup lang="ts">
/**
 * Bouton réutilisable rendu à partir de l'objet Sanity `button`
 * (label + link + variant). Les couleurs proviennent du thème (variables CSS
 * --color-* administrées via le singleton themeSettings).
 */
const props = defineProps({
  button: {
    type: Object as PropType<Button>,
    required: true,
  },
});

const variantClass = computed(() => {
  switch (props.button?.variant) {
    case "secondary":
      return "bg-secondary text-white hover:opacity-90";
    case "outline":
      return "border border-primary text-primary hover:bg-primary hover:text-white";
    case "primary":
    default:
      return "bg-primary text-white hover:opacity-90";
  }
});
</script>

<template>
  <ResolvedLink
    v-if="button?.link"
    :link="button.link"
    :class="[
      'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-medium transition-all duration-200',
      variantClass,
    ]"
  >
    {{ button.label }}
  </ResolvedLink>
</template>
