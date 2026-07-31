import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from '@sanity/types'
import {COLOR_SLOTS} from '../../colorSlots'
import {FontInput} from '../../components/FontInput'

/**
 * Theme Settings schema Singleton.  Stores the global color theme that is applied
 * across the whole frontend via dynamic CSS variables (e.g. --color-primary).
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 *
 * Les champs couleur sont générés à partir de `COLOR_SLOTS` (source unique de
 * vérité partagée avec les schémas qui proposent un choix de couleur du thème).
 */

const colorField = (name: string, title: string, description: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: 'simplerColor',
    description,
    initialValue: {_type: 'simplerColor', value: initialValue},
    group: 'colors',
    validation: (rule) => rule.required(),
  })

const fontField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    group: 'typography',
    // Input personnalisé : recherche Google Fonts + aperçu (voir FontInput).
    components: {input: FontInput},
    initialValue: '"Inter", sans-serif',
    validation: (rule) => rule.required(),
  })

/**
 * Réglages de mise en forme : leviers globaux qui pilotent les styles atomiques
 * (échelle des titres, arrondi, largeur de lecture, densité). Injectés en
 * variables CSS `--theme-*` par `useTheme()` et consommés par `main.css`.
 */
const layoutField = (
  name: string,
  title: string,
  description: string,
  list: {title: string; value: string}[],
  initialValue: string,
) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    group: 'layout',
    options: {list, layout: 'dropdown'},
    initialValue,
    validation: (rule) => rule.required(),
  })

export const themeSettings = defineType({
  name: 'themeSettings',
  title: 'Thème',
  type: 'document',
  icon: ColorWheelIcon,
  groups: [
    {name: 'colors', title: 'Couleurs', default: true},
    {name: 'typography', title: 'Typographie'},
    {name: 'layout', title: 'Mise en forme'},
  ],
  fields: [
    ...COLOR_SLOTS.map((slot) =>
      colorField(slot.name, slot.title, slot.description, slot.initialValue),
    ),
    fontField('fontDisplay', 'Police des Titres', 'Famille de police utilisée pour les titres.'),
    fontField(
      'fontBody',
      'Police du Texte',
      'Famille de police utilisée pour le texte courant.',
    ),
    fontField(
      'fontAccent',
      "Police d'Accent",
      "Famille de police utilisée pour les éléments d'accent.",
    ),
    layoutField(
      'typeScale',
      'Échelle typographique',
      'Rapport qui pilote les tailles des titres (Titre 2, 3, 4).',
      [
        {title: 'Compacte', value: '1.15'},
        {title: 'Standard', value: '1.2'},
        {title: 'Ample', value: '1.25'},
        {title: 'Spacieuse', value: '1.333'},
      ],
      '1.2',
    ),
    layoutField(
      'headingWeight',
      'Graisse des titres',
      'Épaisseur des titres.',
      [
        {title: 'Medium', value: '500'},
        {title: 'Semi-bold', value: '600'},
        {title: 'Bold', value: '700'},
        {title: 'Extra-bold', value: '800'},
      ],
      '700',
    ),
    layoutField(
      'radius',
      'Arrondi',
      'Rondeur globale des éléments (boutons, cartes, images).',
      [
        {title: 'Aucun', value: '0px'},
        {title: 'Léger', value: '0.375rem'},
        {title: 'Moyen', value: '0.75rem'},
        {title: 'Prononcé', value: '1.25rem'},
      ],
      '0.75rem',
    ),
    layoutField(
      'contentWidth',
      'Largeur de lecture',
      'Largeur maximale des blocs de texte (confort de lecture).',
      [
        {title: 'Étroit', value: '60ch'},
        {title: 'Standard', value: '72ch'},
        {title: 'Large', value: '88ch'},
      ],
      '72ch',
    ),
    layoutField(
      'density',
      'Densité verticale',
      'Rythme / espacement vertical des sections.',
      [
        {title: 'Compacte', value: '0.75'},
        {title: 'Normale', value: '1'},
        {title: 'Aérée', value: '1.35'},
      ],
      '1',
    ),
  ],
  preview: {
    select: {primary: 'primary'},
    prepare({primary}) {
      return {
        title: 'Thème',
        subtitle: primary ? `Couleur principale : ${primary}` : undefined,
      }
    },
  },
})
