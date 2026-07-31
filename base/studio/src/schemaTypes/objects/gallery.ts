import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {ImagesIcon} from '@sanity/icons'

/**
 * Objet Galerie (CŒUR, réutilisable).
 *
 * Tableau d'images (`customImage`) + mode d'affichage. Rendu côté frontend par
 * `<Gallery>` (Swiper pour la structure/navigation) avec ouverture en plein
 * écran via `<Lightbox>`. À intégrer dans les sections des templates clients.
 */
export const gallery = defineType({
  name: 'gallery',
  title: 'Galerie',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'customImage'})],
      validation: (Rule) => Rule.min(1).error('Ajoutez au moins une image.'),
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'layout',
      title: 'Affichage',
      type: 'string',
      initialValue: 'grid',
      options: {
        list: [
          {title: 'Grille', value: 'grid'},
          {title: 'Carrousel', value: 'carousel'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'columns',
      title: 'Colonnes (grille)',
      type: 'string',
      description: 'Nombre de colonnes en mode grille (sur grand écran).',
      initialValue: '3',
      options: {
        list: [
          {title: '2', value: '2'},
          {title: '3', value: '3'},
          {title: '4', value: '4'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => parent?.layout === 'carousel',
    }),
  ],
  preview: {
    select: {images: 'images', media: 'images.0'},
    prepare({images, media}) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: 'Galerie',
        subtitle: count ? `${count} image${count > 1 ? 's' : ''}` : 'Vide',
        media,
      }
    },
  },
})
