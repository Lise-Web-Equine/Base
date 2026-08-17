import {defineField, defineType} from '@sanity/types'
import {LinkIcon} from '@sanity/icons'

/**
 * Objet de schéma "link" (lien). Brique réutilisable : l'utilisateur choisit d'abord
 * le type de lien, puis renseigne l'URL, la référence de page/article, ou l'ancre,
 * selon le type sélectionné. Le libellé affiché n'appartient PAS à cet objet : il est
 * fourni par l'objet appelant (ex: callToAction), pour garder le lien comme une pure cible.
 * En savoir plus : https://www.sanity.io/docs/object-type
 */

export const link = defineType({
  name: 'link',
  title: 'Lien',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Type de lien',
      type: 'string',
      description: 'Choisissez vers quoi pointe ce lien.',
      options: {
        list: [
          {title: 'Page interne', value: 'page'},
          {title: 'Article', value: 'post'},
          {title: 'URL externe', value: 'href'},
          {title: 'Ancre sur la page', value: 'anchor'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      description: 'La page interne vers laquelle pointe ce lien.',
      to: [{type: 'page'}],
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'page' && !value) {
            return 'Une page est requise lorsque le type de lien est « Page interne ».'
          }
          return true
        }),
    }),
    defineField({
      name: 'post',
      title: 'Article',
      type: 'reference',
      description: "L'article vers lequel pointe ce lien.",
      to: [{type: 'post'}],
      hidden: ({parent}) => parent?.linkType !== 'post',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'post' && !value) {
            return 'Un article est requis lorsque le type de lien est « Article ».'
          }
          return true
        }),
    }),
    defineField({
      name: 'href',
      title: 'URL externe',
      type: 'url',
      description: 'Adresse complète (ex: https://exemple.com).',
      hidden: ({parent}) => parent?.linkType !== 'href',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'href' && !value) {
            return 'Une URL est requise lorsque le type de lien est « URL externe ».'
          }
          return true
        }),
    }),
    defineField({
      name: 'anchor',
      title: 'Ancre',
      type: 'string',
      description: 'Identifiant de section sur la page courante, sans le « # » (ex: contact).',
      hidden: ({parent}) => parent?.linkType !== 'anchor',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'anchor' && !value) {
            return 'Une ancre est requise lorsque le type de lien est « Ancre sur la page ».'
          }
          return true
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Ouvrir dans un nouvel onglet',
      type: 'boolean',
      description: 'Recommandé pour les liens externes.',
      initialValue: false,
    }),
  ],
})
