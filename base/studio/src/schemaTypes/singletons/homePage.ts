import {defineField, defineType} from '@sanity/types'
import {HomeIcon} from '@sanity/icons'
import {pageBuilderTypeNames} from '../../sections'

/**
 * Singleton de la page d'accueil.
 *
 * Une seule instance (documentId 'homePage'), sans slug : elle est servie à la
 * racine "/" du site. Le contenu est assemblé via le Page Builder, comme une
 * page classique. Verrouillée dans la structure du Studio.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Accueil',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Contenu'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Titre',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'subheading',
      title: 'Sous-titre',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Sections de la page',
      type: 'array',
      of: pageBuilderTypeNames.map((type) => ({type})),
      options: {
        insertMenu: {
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
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      description:
        'Titre utilisé par les moteurs de recherche et le partage sur les réseaux (recommandé : 50-60 caractères).',
      group: 'seo',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 3,
      description:
        'Description utilisée par les moteurs de recherche et le partage sur les réseaux (recommandé : 150-160 caractères).',
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
    select: {title: 'heading'},
    prepare({title}) {
      return {
        title: 'Accueil',
        subtitle: title || undefined,
      }
    },
  },
})
