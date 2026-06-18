import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from '@sanity/types'

/**
 * Theme Settings schema Singleton.  Stores the global color theme that is applied
 * across the whole frontend via dynamic CSS variables (e.g. --color-primary).
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

const HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

const colorField = (name: string, title: string, description: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    initialValue,
    group: 'colors',
    validation: (rule) =>
      rule
        .required()
        .regex(HEX_COLOR, {name: 'hex color'})
        .error('Use a valid hex color, e.g. #ef4434 or #fff'),
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
    colorField('primary', 'Primary', 'Main brand color (buttons, links, accents).', '#ef4434'),
    colorField(
      'secondary',
      'Secondary',
      'Secondary / complementary brand color.',
      '#206ee9',
    ),
    colorField('background', 'Background', 'Global page background color.', '#ffffff'),
    colorField('text', 'Text', 'Default text color.', '#0d0e12'),
    defineField({
      name: 'headingFont',
      title: 'Police des titres',
      type: 'string',
      description: 'Famille de police utilisée pour les titres (font-display).',
      group: 'typography',
      options: {list: FONT_OPTIONS},
      initialValue: '"Inter", sans-serif',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bodyFont',
      title: 'Police du corps',
      type: 'string',
      description: 'Famille de police utilisée pour le texte courant (font-sans).',
      group: 'typography',
      options: {list: FONT_OPTIONS},
      initialValue: '"Inter", sans-serif',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'baseFontSize',
      title: 'Taille de police de base',
      type: 'number',
      description: 'Taille de police racine en pixels (appliquée à <html>). Ex: 16.',
      group: 'typography',
      initialValue: 16,
      validation: (rule) => rule.required().min(10).max(24),
    }),
    defineField({
      name: 'lineHeight',
      title: 'Hauteur de ligne',
      type: 'number',
      description: 'Hauteur de ligne par défaut (sans unité). Ex: 1.5.',
      group: 'typography',
      initialValue: 1.5,
      validation: (rule) => rule.required().min(1).max(2.5),
    }),
  ],
  preview: {
    select: {primary: 'primary'},
    prepare({primary}) {
      return {
        title: 'Thème',
        subtitle: primary ? `Primary: ${primary}` : undefined,
      }
    },
  },
})
