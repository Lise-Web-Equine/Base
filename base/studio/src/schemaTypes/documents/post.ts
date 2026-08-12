import {DocumentTextIcon} from '@sanity/icons'
import {defineField, defineType} from '@sanity/types'
import {CategorySelectInput} from '../../components/CategorySelectInput'

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
      name: 'content',
      title: 'Contenu',
      type: 'blockContent',
      group: 'content',
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
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      description:
        'Description utilisée par les moteurs de recherche et le partage sur les réseaux sociaux (recommandé : 150-160 caractères).',
      group: 'seo',
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
