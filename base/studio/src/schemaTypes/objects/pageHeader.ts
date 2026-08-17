import {defineField, defineType} from '@sanity/types'
import {TextIcon} from '@sanity/icons'

/**
 * Objet "pageHeader" (en-tête de page). Brique réutilisable qui alimente le
 * composant Nuxt UI <UPageHeader> côté front. Les champs correspondent 1:1 à
 * ses props : `title`, `headline`, `description` et `links`.
 * En savoir plus : https://ui.nuxt.com/docs/components/page-header
 */
export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'En-tête de page',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre affiché',
      type: 'string',
      description: 'Titre principal affiché en haut de la page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headline',
      title: 'En-tête',
      type: 'string',
      description: 'Petit texte affiché au-dessus du titre (ex: la rubrique).',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description: 'Texte d’introduction affiché sous le titre (optionnel).',
    }),
    defineField({
      name: 'links',
      title: 'Liens',
      type: 'array',
      of: [{type: 'button'}],
      description: 'Boutons d’action affichés à côté du titre (optionnel).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'headline',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'En-tête de page',
        subtitle: subtitle || undefined,
      }
    },
  },
})
