import {defineField, defineType} from '@sanity/types'
import {DocumentIcon} from '@sanity/icons'
import {pageBuilderTypeNames} from '../../sections'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {
      name: 'content',
      title: 'Contenu',
      default: true,
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Content fields
    defineField({
      name: 'name',
      title: 'Nom de la page',
      type: 'string',
      description: 'Nom interne de la page (utilisé pour générer son URL).',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),

    defineField({
      name: 'slug',
      title: 'Adresse de la page (URL)',
      type: 'slug',
      description: "Partie de l'URL identifiant la page (générée à partir du nom de la page).",
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
      group: 'content',
    }),
    defineField({
      name: 'pageHeader',
      title: 'En-tête de la page',
      type: 'pageHeader',
      description: 'Titre affiché, en-tête, description et liens affichés en haut de la page.',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Sections de la page',
      type: 'array',
      of: pageBuilderTypeNames.map((type) => ({type})),
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
      group: 'content',
    }),

    // SEO fields
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
        "Si activé, cette page ne sera pas indexée par Google (balise noindex) et sera exclue du sitemap.",
      initialValue: false,
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'pageHeader.title',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Page sans nom',
        subtitle: subtitle || undefined,
      }
    },
  },
})
