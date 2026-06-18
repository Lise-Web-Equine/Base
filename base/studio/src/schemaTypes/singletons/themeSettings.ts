import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from '@sanity/types'

/**
 * Theme Settings schema Singleton.  Stores the global color theme that is applied
 * across the whole frontend via dynamic CSS variables (e.g. --color-primary).
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
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

const FONT_OPTIONS = [
  {title: 'Inter', value: '"Inter", sans-serif'},
  {title: 'System UI', value: 'system-ui, sans-serif'},
  {title: 'Roboto', value: '"Roboto", sans-serif'},
  {title: 'Open Sans', value: '"Open Sans", sans-serif'},
  {title: 'Poppins', value: '"Poppins", sans-serif'},
  {title: 'Montserrat', value: '"Montserrat", sans-serif'},
  {title: 'Lato', value: '"Lato", sans-serif'},
  {title: 'Georgia (serif)', value: 'Georgia, serif'},
  {title: 'Playfair Display (serif)', value: '"Playfair Display", serif'},
]

const fontField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    group: 'typography',
    options: {list: FONT_OPTIONS},
    initialValue: '"Inter", sans-serif',
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
  ],
  fields: [
    colorField(
      'primary',
      'Couleur Principale',
      'Couleur principale de la marque (boutons, liens, accents).',
      '#ef4434',
    ),
    colorField(
      'secondary',
      'Couleur Secondaire',
      'Couleur secondaire / complémentaire de la marque.',
      '#206ee9',
    ),
    colorField(
      'accent',
      "Couleur d'Accent",
      "Couleur d'accent pour mettre en avant certains éléments.",
      '#8f57ef',
    ),
    colorField('bgMain', 'Fond Principal', 'Couleur de fond principale des pages.', '#ffffff'),
    colorField(
      'bgSurface',
      'Fond de Surface',
      'Couleur de fond des surfaces (cartes, sections).',
      '#f6f6f8',
    ),
    colorField('textMain', 'Texte Principal', 'Couleur du texte principal.', '#0d0e12'),
    colorField(
      'textMuted',
      'Texte Secondaire',
      'Couleur du texte secondaire / atténué.',
      '#727892',
    ),
    colorField(
      'border',
      'Bordures et Séparateurs',
      'Couleur des bordures et séparateurs.',
      '#e3e4e8',
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
