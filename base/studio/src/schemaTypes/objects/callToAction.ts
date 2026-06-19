import {defineField, defineType} from '@sanity/types'
import {BulbOutlineIcon} from '@sanity/icons'
import {colorSlotOptions} from '../../colorSlots'

/**
 * Section "Appel à l'action". Bloc de page builder mettant en avant un message
 * fort avec un ou deux boutons, sur un fond couleur (du thème) ou une image
 * (avec overlay optionnel pour la lisibilité du texte).
 *
 * S'appuie sur les briques réutilisables : `button` (boutons), `customImage`
 * (image de fond) et `link` (via `button`). Le fond couleur référence un slot
 * du thème (`COLOR_SLOTS`) pour rester cohérent avec la charte.
 */
export const callToAction = defineType({
  name: 'callToAction',
  title: "Appel à l'action",
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'string',
      description: 'Petit texte affiché au-dessus du titre (optionnel).',
    }),
    defineField({
      name: 'heading',
      title: 'Titre principal',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Description',
      type: 'text',
    }),
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
          initialValue: 'color',
          options: {
            list: [
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
          initialValue: 'bgSurface',
          options: {list: colorSlotOptions()},
          hidden: ({parent}) => parent?.type !== 'color',
          validation: (Rule) =>
            Rule.custom((value, context: any) => {
              if (context.parent?.type === 'color' && !value) {
                return 'Choisissez une couleur de fond.'
              }
              return true
            }),
        }),
        defineField({
          name: 'image',
          title: 'Image de fond',
          type: 'customImage',
          hidden: ({parent}) => parent?.type !== 'image',
          validation: (Rule) =>
            Rule.custom((value: any, context: any) => {
              if (context.parent?.type === 'image' && !value?.asset) {
                return 'Ajoutez une image de fond.'
              }
              return true
            }),
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
      name: 'primaryButton',
      title: 'Bouton principal',
      type: 'button',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Bouton secondaire',
      type: 'button',
      description: 'Optionnel.',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'background.image',
    },
    prepare({title, media}) {
      return {
        title: title || "Appel à l'action",
        subtitle: "Appel à l'action",
        media,
      }
    },
  },
})
