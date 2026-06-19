import {defineField, defineType} from '@sanity/types'
import {ImageIcon} from '@sanity/icons'

/**
 * Objet image réutilisable. Brique de fondation utilisée par les sections
 * (callToAction, hero, galerie...) pour garantir partout un texte alternatif
 * (SEO + accessibilité) et le recadrage (hotspot), sans dupliquer la définition.
 *
 * Nommé `customImage` pour ne pas masquer le type natif `image` de Sanity.
 */
export const customImage = defineType({
  name: 'customImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {
    hotspot: true,
    aiAssist: {
      imageDescriptionField: 'alt',
    },
  },
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description: "Décrit l'image. Important pour le SEO et l'accessibilité.",
      validation: (Rule) =>
        Rule.custom((alt, context: any) => {
          if (context.parent?.asset?._ref && !alt) {
            return "Le texte alternatif est requis lorsqu'une image est définie."
          }
          return true
        }),
    }),
  ],
})
