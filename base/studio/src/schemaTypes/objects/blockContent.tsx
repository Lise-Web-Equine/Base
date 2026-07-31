import {defineArrayMember, defineType, defineField} from '@sanity/types'
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  StrikethroughIcon,
  CodeIcon,
} from '@sanity/icons'
import {colorSlotOptions} from '../../colorSlots'

/**
 * Définition du champ texte riche (Portable Text) réutilisable dans tout le
 * Studio via `{type: 'blockContent'}`.
 *
 * CŒUR : styles de bloc, décorateurs, listes et annotations communs à tous les
 * projets. Le style de rendu est piloté côté frontend par les design tokens.
 *
 * - Styles de bloc volontairement limités à Titre 2 → Titre 4 (le H1 est réservé
 *   au titre de page/section pour préserver la hiérarchie SEO).
 * - L'annotation « Couleur » réutilise les slots du thème (`COLOR_SLOTS`) : aucune
 *   couleur en dur, cohérence garantie avec la charte.
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export const blockContent = defineType({
  title: 'Contenu enrichi',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      // Styles de paragraphe (menu déroulant). H1 volontairement exclu (SEO).
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Titre 2', value: 'h2'},
        {title: 'Titre 3', value: 'h3'},
        {title: 'Titre 4', value: 'h4'},
        {title: 'Citation', value: 'blockquote'},
      ],
      // Listes disponibles.
      lists: [
        {title: 'Puces', value: 'bullet'},
        {title: 'Numérotée', value: 'number'},
      ],
      marks: {
        // Décorateurs (formatage d'une sélection). Les `value` correspondent aux
        // composants de rendu frontend (voir `components/mark/`).
        decorators: [
          {title: 'Gras', value: 'strong', icon: BoldIcon},
          {title: 'Italique', value: 'em', icon: ItalicIcon},
          {title: 'Souligné', value: 'underline', icon: UnderlineIcon},
          {title: 'Barré', value: 'strike-through', icon: StrikethroughIcon},
          {title: 'Code', value: 'code', icon: CodeIcon},
        ],
        annotations: [
          // Annotation « Couleur » : colore le texte ou le surligne avec une
          // couleur du thème (slot). Rendu par `components/mark/HighlightMark.vue`.
          defineField({
            name: 'highlight',
            type: 'object',
            title: 'Couleur / Surlignage',
            fields: [
              defineField({
                name: 'color',
                title: 'Couleur',
                type: 'string',
                description: 'Couleur choisie parmi les couleurs du thème.',
                initialValue: 'primary',
                options: {list: colorSlotOptions()},
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: 'mode',
                title: 'Style',
                type: 'string',
                initialValue: 'text',
                options: {
                  list: [
                    {title: 'Texte coloré', value: 'text'},
                    {title: 'Surligné (fond)', value: 'background'},
                  ],
                  layout: 'radio',
                },
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    {title: 'URL', value: 'href'},
                    {title: 'Page', value: 'page'},
                    {title: 'Post', value: 'post'},
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'href' && !value) {
                      return 'URL is required when Link Type is URL'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'page',
                title: 'Page',
                type: 'reference',
                to: [{type: 'page'}],
                hidden: ({parent}) => parent?.linkType !== 'page',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'page' && !value) {
                      return 'Page reference is required when Link Type is Page'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'post',
                title: 'Post',
                type: 'reference',
                to: [{type: 'post'}],
                hidden: ({parent}) => parent?.linkType !== 'post',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'post' && !value) {
                      return 'Post reference is required when Link Type is Post'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
  ],
})
