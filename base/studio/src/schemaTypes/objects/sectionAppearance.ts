import {defineField, defineType} from '@sanity/types'
import {colorSlotOptions} from '../../colorSlots'

/**
 * Apparence commune d'une section (CŒUR, réutilisable).
 *
 * Décrit le FOND (couleur du thème, ou image + voile) et l'ESPACEMENT vertical.
 * Consommé par `<SectionWrapper>` côté frontend, qui rend le fond en pleine
 * largeur tout en contraignant le contenu à la largeur du site (token
 * `siteMaxWidth`) avec une gouttière responsive. À ajouter comme champ
 * `appearance` (type `sectionAppearance`) dans chaque section.
 */
export const sectionAppearance = defineType({
  name: 'sectionAppearance',
  title: 'Apparence',
  type: 'object',
  options: {columns: 1},
  fields: [
    defineField({
      name: 'background',
      title: 'Fond',
      type: 'object',
      options: {columns: 1},
      fields: [
        defineField({
          name: 'type',
          title: 'Type de fond',
          type: 'string',
          initialValue: 'none',
          options: {
            list: [
              {title: 'Aucun', value: 'none'},
              {title: 'Couleur du thème', value: 'color'},
              {title: 'Image', value: 'image'},
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'colorSlot',
          title: 'Couleur',
          type: 'string',
          description: 'Couleur de fond, choisie parmi les couleurs du thème.',
          initialValue: 'surface',
          options: {list: colorSlotOptions()},
          hidden: ({parent}) => parent?.type !== 'color',
        }),
        defineField({
          name: 'image',
          title: 'Image de fond',
          type: 'customImage',
          hidden: ({parent}) => parent?.type !== 'image',
        }),
        defineField({
          name: 'overlay',
          title: 'Voile (overlay)',
          type: 'string',
          description: 'Voile posé sur l\u2019image pour améliorer la lisibilité du texte.',
          initialValue: 'dark',
          options: {
            list: [
              {title: 'Aucun', value: 'none'},
              {title: 'Sombre', value: 'dark'},
              {title: 'Clair', value: 'light'},
            ],
            layout: 'radio',
          },
          hidden: ({parent}) => parent?.type !== 'image',
        }),
        defineField({
          name: 'overlayOpacity',
          title: 'Opacité du voile (%)',
          type: 'number',
          initialValue: 40,
          validation: (Rule) => Rule.min(0).max(100),
          hidden: ({parent}) => parent?.type !== 'image' || parent?.overlay === 'none',
        }),
      ],
    }),
    defineField({
      name: 'spacing',
      title: 'Espacement vertical',
      type: 'string',
      description: 'Marge haute/basse de la section (module le rythme global du thème).',
      initialValue: 'md',
      options: {
        list: [
          {title: 'Aucun', value: 'none'},
          {title: 'Compact', value: 'sm'},
          {title: 'Normal', value: 'md'},
          {title: 'Large', value: 'lg'},
        ],
        layout: 'radio',
      },
    }),
  ],
})
