import {BellIcon} from '@sanity/icons'
import {defineSection} from '../../sections/defineSection'
import {bannerContentFields, bannerAppearanceFields} from './bannerFields'

/**
 * Section "Bannière" (PROJET). Bandeau plein largeur construit sur le composant
 * <UBanner> de Nuxt UI.
 *
 * Construite via `defineSection()` : elle obtient les onglets « Contenu » /
 * « Apparence ». Les champs de l'onglet « Apparence » (couleur de fond + style
 * des boutons) sont verrouillés pour le client, comme les autres sections.
 *
 * Les champs sont mutualisés avec la bannière GLOBALE (« Réglages du site »)
 * via `bannerFields.ts`.
 *
 * Deux modes, pilotés par le toggle « Afficher le numéro de téléphone » :
 *  - ACTIVÉ  → la bannière affiche automatiquement le numéro de téléphone des
 *    « Réglages du site » avec une icône téléphone, et devient cliquable (appel).
 *  - DÉSACTIVÉ → l'éditeur renseigne le titre, l'icône, des boutons (optionnel)
 *    et peut rendre la bannière cliquable vers un lien.
 */
export const bannerSection = defineSection({
  name: 'bannerSection',
  title: 'Bannière',
  icon: BellIcon,
  fields: [
    // --- Onglet « Contenu » ---
    ...bannerContentFields(),
    // --- Onglet « Apparence » (verrouillé pour le client) ---
    ...bannerAppearanceFields().map((field) => ({...field, group: 'appearance'})),
  ],
  preview: {
    select: {
      title: 'title',
      showPhone: 'showPhone',
      color: 'color',
    },
    prepare({title, showPhone, color}) {
      return {
        title: showPhone ? 'Numéro de téléphone' : title || 'Bannière',
        subtitle: ['Bannière', color].filter(Boolean).join(' · '),
      }
    },
  },
})
