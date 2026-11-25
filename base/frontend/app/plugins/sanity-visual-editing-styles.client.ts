/**
 * Feuille de style de l'édition visuelle Sanity (Presentation).
 *
 * Depuis `@sanity/visual-editing-standalone` v2, la feuille de style n'est plus
 * chargée automatiquement et `@nuxtjs/sanity` ne l'importe pas. On la charge
 * uniquement quand l'édition visuelle est active (aperçu dans le studio), pour
 * ne rien ajouter au site public.
 */
export default defineNuxtPlugin(() => {
  const visualEditingState = useSanityVisualEditingState()
  if (visualEditingState?.enabled) {
    import('@sanity/visual-editing-standalone/styles.css')
  }
})
