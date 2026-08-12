import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {HelpCircleIcon} from '@sanity/icons'

/**
 * Section "FAQ". Liste de questions/réponses.
 *
 * La réponse est un contenu enrichi (`blockContent`) : texte simple, liste à
 * puces, liste numérotée ou texte + liste. Le rendu frontend génère aussi les
 * données structurées Schema.org (FAQPage) pour le SEO.
 */
export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'string',
      description: 'Petit texte affiché au-dessus du titre (optionnel).',
    }),
    defineField({
      name: 'heading',
      title: 'Titre',
      type: 'string',
      initialValue: 'Questions fréquentes',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Texte affiché au-dessus de la FAQ (optionnel).',
    }),
    defineField({
      name: 'items',
      title: 'Questions / Réponses',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Question',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Réponse',
              type: 'blockContent',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'question'},
            prepare({title}) {
              return {title: title || 'Question'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      items: 'items',
    },
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'FAQ',
        subtitle: `FAQ — ${count} question${count > 1 ? 's' : ''}`,
      }
    },
  },
})
