import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {ImagesIcon} from '@sanity/icons'

/**
 * Section Galerie (CŒUR, réutilisable).
 *
 * Section du Page Builder : tableau d'images (`customImage`) + mode d'affichage
 * (Grille ou Carrousel). Rendue côté frontend par `<Gallery>` (Swiper pour la
 * structure/navigation) avec ouverture en plein écran via `<Lightbox>`.
 *
 * Le STYLE détaillé (type de carrousel, nombre de colonnes) n'est PAS exposé à
 * l'éditeur : il est défini une fois dans le code (`frontend/app/lib/
 * carouselStyles.ts`) et surchargeable par projet.
 */
export const gallery = defineType({
  name: 'gallery',
  title: 'Galerie',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Titre (optionnel)',
      type: 'string',
      description: 'Titre affiché au-dessus de la galerie (optionnel).',
    }),
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
