import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from '@sanity/types'
import {COLOR_SLOTS} from '../../colorSlots'

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
