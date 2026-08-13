import {DocumentTextIcon, BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {CategorySelectInput} from '../../components/CategorySelectInput'
import {colorSlotOptions} from '../../colorSlots'

/**
 * Post schema.  Define and edit the fields for the 'post' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const post = defineType({
  name: 'post',
  title: 'Article',
  icon: DocumentTextIcon,
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Contenu',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: "Adresse de l'article (URL)",
      type: 'slug',
      description: "Partie de l'URL identifiant l'article (générée à partir du titre).",
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      group: 'content',
      description:
        "Court résumé de l'article, affiché sur les cartes (liste du blog, « À lire aussi »). Sert aussi de description par défaut pour les moteurs de recherche si le champ SEO est vide.",
      validation: (rule) =>
        rule.max(200).warning('Recommandé : 200 caractères maximum.'),
    }),
    defineField({
      // Contenu spécifique au blog : volontairement simplifié pour l'éditeur.
      // Seuls « Normal » et « Titre » (h2) sont proposés. Le client n'a pas à
      // penser à la hiérarchie SEO des titres : le h1 est déjà le titre de
      // l'article, le h2 est donc le seul niveau de titre pertinent ici.
      name: 'content',
      title: 'Contenu',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre', value: 'h2'},
          ],
          lists: [
            {title: 'Puces', value: 'bullet'},
            {title: 'Numérotée', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Gras', value: 'strong', icon: BoldIcon},
              {title: 'Italique', value: 'em', icon: ItalicIcon},
              {title: 'Souligné', value: 'underline', icon: UnderlineIcon},
              {title: 'Barré', value: 'strike-through', icon: StrikethroughIcon},
            ],
            annotations: [
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
                title: 'Lien',
                fields: [
                  defineField({
                    name: 'linkType',
                    title: 'Type de lien',
                    type: 'string',
                    initialValue: 'href',
                    options: {
                      list: [
                        {title: 'URL', value: 'href'},
                        {title: 'Page', value: 'page'},
                        {title: 'Article', value: 'post'},
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
                          return "L'URL est requise lorsque le type de lien est « URL »."
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
                          return 'La page est requise lorsque le type de lien est « Page ».'
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'post',
                    title: 'Article',
                    type: 'reference',
                    to: [{type: 'post'}],
                    hidden: ({parent}) => parent?.linkType !== 'post',
                    validation: (Rule) =>
                      Rule.custom((value, context: any) => {
                        if (context.parent?.linkType === 'post' && !value) {
                          return "L'article est requis lorsque le type de lien est « Article »."
                        }
                        return true
                      }),
                  }),
                  defineField({
                    name: 'openInNewTab',
                    title: 'Ouvrir dans un nouvel onglet',
                    type: 'boolean',
                    initialValue: false,
                  }),
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      // Galerie de l'article : uniquement les images. Le type d'affichage
      // (grille/carrousel, colonnes) est défini une fois pour toutes dans
      // « Réglages du site » → Apparence, pour une galerie homogène sur le blog.
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'content',
      description:
        "Images affichées sous le contenu de l'article. Le type d'affichage est défini dans « Réglages du site » → Apparence.",
      of: [defineArrayMember({type: 'customImage'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'content',
      description: 'Catégories définies dans « Réglages du site » → Blog / Actualités.',
      components: {input: CategorySelectInput},
    }),
    defineField({
      name: 'coverImage',
      title: 'Image de couverture',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
          description: "Important pour le SEO et l'accessibilité.",
          validation: (rule) => {
            // Custom validation to ensure alt text is provided if the image is present. https://www.sanity.io/docs/validation
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Requis'
              }
              return true
            })
          },
        },
      ],
      validation: (rule) => rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      group: 'content',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      description:
        'Titre utilisé par les moteurs de recherche et le partage sur les réseaux sociaux (recommandé : 50-60 caractères).',
      group: 'seo',
      validation: (rule) =>
        rule.max(60).warning('Recommandé : 60 caractères maximum pour un affichage complet dans Google.'),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      description:
        'Description utilisée par les moteurs de recherche et le partage sur les réseaux sociaux (recommandé : 150-160 caractères).',
      group: 'seo',
      validation: (rule) =>
        rule.max(160).warning('Recommandé : 160 caractères maximum pour un affichage complet dans Google.'),
    }),
    defineField({
      name: 'noIndex',
      title: 'Masquer des moteurs de recherche',
      type: 'boolean',
      description:
        "Si activé, cet article ne sera pas indexé par Google (balise noindex) et sera exclu du sitemap.",
      initialValue: false,
      group: 'seo',
    }),
  ],
  // List preview configuration. https://www.sanity.io/docs/previews-list-views
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
    },
    prepare({title, media, date}) {
      const subtitle = date
        ? new Date(date).toLocaleDateString('fr-FR', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : ''
      return {title, media, subtitle}
    },
  },
})
