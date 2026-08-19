import {defineField, defineType} from '@sanity/types'
import {StarIcon, ChevronRightIcon} from '@sanity/icons'
import {CompactSectionInput} from '../../components/CompactSectionInput'
import {appearanceReadOnly} from '../../lib/appearanceAccess'
import {buttonColorOptions, buttonVariantOptions} from './button'
import {colorSlotOptions} from '../../colorSlots'

/**
 * Section "En-tête principal" (PROJET). Grand en-tête (hero) construit sur le
 * composant <UPageHero> de Nuxt UI.
 *
 * Deux onglets, à la manière des autres sections :
 *  - « Contenu »   : sur-titre, titre, description, boutons ;
 *  - « Apparence » (verrouillée pour le client) : style des boutons + fond de la
 *    section, au choix parmi : couleur du thème, image, vidéo ou carrousel.
 *
 * Cette section n'utilise pas `defineSection()` (qui ajoute un fond « image »
 * générique) car elle gère son propre fond (4 types) : on reproduit ici les
 * onglets, le verrou d'apparence et le rendu compact.
 */

// Un bouton du hero : contenu uniquement (le style est dans « Apparence »).
const heroButtonFields = () => [
  defineField({
    name: 'label',
    title: 'Libellé',
    type: 'string',
    description: 'Texte affiché sur le bouton.',
  }),
  defineField({
    name: 'link',
    title: 'Destination',
    type: 'link',
  }),
]

// Types de fond disponibles pour l'en-tête.
const isMediaBackground = (parent: any) =>
  ['image', 'video', 'carousel'].includes(parent?.type)

export const heroSection = defineType({
  name: 'heroSection',
  title: 'En-tête principal',
  type: 'object',
  icon: StarIcon,
  groups: [
    {name: 'content', title: 'Contenu', default: true},
    {name: 'appearance', title: 'Apparence'},
  ],
  components: {input: CompactSectionInput},
  fields: [
    // --- Onglet « Contenu » ---
    defineField({
      name: 'headline',
      title: 'Sur-titre',
      type: 'string',
      group: 'content',
      description: 'Petit texte affiché au-dessus du titre (ex. la rubrique).',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      description: 'Titre principal de l’en-tête.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Texte d’introduction affiché sous le titre (optionnel).',
    }),
    defineField({
      name: 'buttons',
      title: 'Boutons',
      type: 'array',
      group: 'content',
      description: 'Boutons d’action affichés sous la description (optionnel).',
      of: [
        {
          type: 'object',
          name: 'heroButton',
          title: 'Bouton',
          icon: ChevronRightIcon,
          fields: heroButtonFields(),
          preview: {
            select: {title: 'label'},
            prepare({title}: any) {
              return {title: title || 'Bouton'}
            },
          },
        },
      ],
    }),
    // --- Onglet « Apparence » (verrouillé pour le client) ---
    defineField({
      name: 'buttonColor',
      title: 'Couleur des boutons',
      type: 'string',
      group: 'appearance',
      readOnly: appearanceReadOnly,
      description: 'Couleur du thème appliquée aux boutons.',
      initialValue: 'primary',
      options: buttonColorOptions,
    }),
    defineField({
      name: 'buttonVariant',
      title: 'Variant des boutons',
      type: 'string',
      group: 'appearance',
      readOnly: appearanceReadOnly,
      description: 'Style d’affichage des boutons.',
      initialValue: 'solid',
      options: buttonVariantOptions,
    }),
    defineField({
      name: 'background',
      title: 'Fond',
      type: 'object',
      group: 'appearance',
      readOnly: appearanceReadOnly,
      description: 'Fond de l’en-tête : couleur, image, vidéo ou carrousel.',
      options: {columns: 1},
      fields: [
        defineField({
          name: 'type',
          title: 'Type de fond',
          type: 'string',
          initialValue: 'color',
          options: {
            list: [
              {title: 'Couleur', value: 'color'},
              {title: 'Image', value: 'image'},
              {title: 'Vidéo', value: 'video'},
              {title: 'Carrousel', value: 'carousel'},
            ],
            layout: 'radio',
          },
        }),
        defineField({
          name: 'color',
          title: 'Couleur de fond',
          type: 'string',
          description: 'Couleur de fond choisie parmi les couleurs du thème.',
          initialValue: 'surface',
          options: {list: colorSlotOptions(), layout: 'dropdown'},
          hidden: ({parent}) => parent?.type !== 'color',
        }),
        defineField({
          name: 'image',
          title: 'Image de fond',
          type: 'customImage',
          hidden: ({parent}) => parent?.type !== 'image',
          validation: (Rule) =>
            Rule.custom((value: any, context: any) =>
              context.parent?.type === 'image' && !value?.asset
                ? 'Ajoutez une image de fond.'
                : true,
            ),
        }),
        defineField({
          name: 'video',
          title: 'Vidéo de fond',
          type: 'file',
          description:
            'Vidéo lue en boucle, sans son (idéale : MP4 court et léger). Jouée en fond de l’en-tête.',
          options: {accept: 'video/*'},
          hidden: ({parent}) => parent?.type !== 'video',
          validation: (Rule) =>
            Rule.custom((value: any, context: any) =>
              context.parent?.type === 'video' && !value?.asset
                ? 'Ajoutez une vidéo de fond.'
                : true,
            ),
        }),
        defineField({
          name: 'poster',
          title: 'Image d’aperçu de la vidéo',
          type: 'customImage',
          description:
            'Affichée pendant le chargement de la vidéo (recommandé pour la performance).',
          hidden: ({parent}) => parent?.type !== 'video',
        }),
        defineField({
          name: 'carousel',
          title: 'Images du carrousel',
          type: 'array',
          of: [{type: 'customImage'}],
          options: {layout: 'grid'},
          hidden: ({parent}) => parent?.type !== 'carousel',
          validation: (Rule) =>
            Rule.custom((value: any, context: any) =>
              context.parent?.type === 'carousel' && (!value || value.length < 1)
                ? 'Ajoutez au moins une image au carrousel.'
                : true,
            ),
        }),
        defineField({
          name: 'overlay',
          title: 'Opacité du voile (%)',
          type: 'number',
          description:
            'Voile sombre posé sur le média pour améliorer la lisibilité du texte.',
          initialValue: 40,
          validation: (Rule) => Rule.min(0).max(100),
          hidden: ({parent}) => !isMediaBackground(parent),
        }),
        defineField({
          name: 'lightText',
          title: 'Texte clair',
          type: 'boolean',
          description:
            'Active un texte clair (sur fond sombre / média). À désactiver sur un fond clair.',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      headline: 'headline',
      bgType: 'background.type',
      media: 'background.image',
    },
    prepare({title, headline, bgType, media}) {
      const labels: Record<string, string> = {
        color: 'Couleur',
        image: 'Image',
        video: 'Vidéo',
        carousel: 'Carrousel',
      }
      return {
        title: title || 'En-tête principal',
        subtitle: ['En-tête principal', headline, bgType && labels[bgType]]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
