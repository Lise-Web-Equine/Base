import {defineField, defineType} from '@sanity/types'
import {ChevronRightIcon} from '@sanity/icons'

/**
 * Objet bouton réutilisable. S'appuie sur l'objet `link` (la cible) et y ajoute
 * le libellé affiché et une variante de style. Utilisé par les sections
 * (ex: callToAction) pour leurs boutons principal / secondaire.
 */
export const button = defineType({
  name: 'button',
  title: 'Bouton',
  type: 'object',
  icon: ChevronRightIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      description: 'Texte affiché sur le bouton.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      description: 'Apparence visuelle du bouton.',
      initialValue: 'primary',
      options: {
        list: [
          {title: 'Principal (plein)', value: 'primary'},
          {title: 'Secondaire', value: 'secondary'},
          {title: 'Contour', value: 'outline'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {
      title: 'label',
      variant: 'variant',
    },
    prepare({title, variant}) {
      return {
        title: title || 'Bouton',
        subtitle: variant ? `Style : ${variant}` : undefined,
      }
    },
  },
})
