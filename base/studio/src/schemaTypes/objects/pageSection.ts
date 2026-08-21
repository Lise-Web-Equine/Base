import {defineField, defineType} from '@sanity/types'
import {ThLargeIcon, ChevronRightIcon, StarIcon} from '@sanity/icons'
import {CompactSectionInput} from '../../components/CompactSectionInput'
import {appearanceReadOnly} from '../../lib/appearanceAccess'
import {buttonColorOptions, buttonVariantOptions} from './button'
import {colorSlotOptions} from '../../colorSlots'

/**
 * Section "Section de page" (PROJET). Bloc construit sur le composant
 * <UPageSection> de Nuxt UI.
 *
 * Deux onglets, à la manière des autres sections :
 *  - « Contenu »   : sur-titre, titre, description, fonctionnalités, boutons ;
 *  - « Apparence » (verrouillée pour le client) : reprend EXACTEMENT l'apparence
 *    de l'en-tête principal (style des boutons + fond au choix : couleur, image,
 *    vidéo, carrousel), puis ajoute la largeur (comme l'appel à l'action) et la
 *    disposition (Bande ou Illustration en colonne).
 *
 * Comme l'en-tête principal, cette section n'utilise pas `defineSection()` (qui
 * gère un fond « image » générique) car elle pilote son propre fond (4 types) :
 * on reproduit ici les onglets, le verrou d'apparence et le rendu compact.
 */

// Un bouton de la section : contenu uniquement (le style est dans « Apparence »).
const pageSectionButtonFields = () => [
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

// Une fonctionnalité (item <UPageFeature>) : titre + contenu optionnel.
const pageFeatureFields = () => [
  defineField({
    name: 'title',
    title: 'Titre',
    type: 'string',
    description: 'Titre de la fonctionnalité.',
    validation: (Rule) => Rule.required(),
  }),
  defineField({
    name: 'description',
    title: 'Description',
    type: 'text',
    rows: 2,
    description: 'Texte décrivant la fonctionnalité (optionnel).',
  }),
  defineField({
    name: 'icon',
    title: 'Icône',
    type: 'string',
    description:
      'Nom d’icône Nuxt UI / Iconify (ex. « i-lucide-rocket »). Optionnel.',
  }),
  defineField({
    name: 'link',
    title: 'Lien',
    type: 'link',
    description: 'Destination de la fonctionnalité (optionnel).',
  }),
]

// Types de fond disponibles (identiques à l'en-tête principal).
const isMediaBackground = (parent: any) =>
  ['image', 'video', 'carousel'].includes(parent?.type)

export const pageSection = defineType({
  name: 'pageSection',
  title: 'Section de page',
  type: 'object',
  icon: ThLargeIcon,
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
      description: 'Petit texte affiché au-dessus du titre (ex. la rubrique). Optionnel.',
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'content',
      description: 'Titre principal de la section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContent',
      group: 'content',
      description: 'Texte enrichi affiché sous le titre (optionnel).',
    }),
    defineField({
      name: 'citation',
      title: 'Citation',
      type: 'text',
      rows: 2,
      group: 'content',
      description: 'Citation mise en avant sous la description (optionnel).',
    }),
    defineField({
      name: 'features',
      title: 'Fonctionnalités',
      type: 'array',
      group: 'content',
      description: 'Liste de fonctionnalités mises en avant (optionnel).',
      of: [
        {
          type: 'object',
          name: 'pageFeature',
          title: 'Fonctionnalité',
          icon: StarIcon,
          fields: pageFeatureFields(),
          preview: {
            select: {title: 'title', subtitle: 'description'},
            prepare({title, subtitle}: any) {
              return {title: title || 'Fonctionnalité', subtitle}
            },
          },
        },
      ],
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
          name: 'pageSectionButton',
          title: 'Bouton',
          icon: ChevronRightIcon,
          fields: pageSectionButtonFields(),
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
    // Identique à l'en-tête principal : style des boutons + fond.
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
      description: 'Fond de la section : couleur, image, vidéo ou carrousel.',
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
            'Vidéo lue en boucle, sans son (idéale : MP4 court et léger). Jouée en fond de la section.',
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
    // Largeur (comme dans l'appel à l'action).
    defineField({
      name: 'width',
      title: 'Largeur',
      type: 'string',
      group: 'appearance',
      readOnly: appearanceReadOnly,
      description:
        'Contenu contraint à la largeur du site (Container) ou étendu sur toute la largeur.',
      initialValue: 'container',
      options: {
        list: [
          {title: 'Container', value: 'container'},
          {title: 'Pleine largeur', value: 'full'},
        ],
        layout: 'radio',
      },
    }),
    // Disposition (comme dans l'appel à l'action) : Bande ou Illustration en colonne.
    defineField({
      name: 'layout',
      title: 'Disposition',
      type: 'string',
      group: 'appearance',
      readOnly: appearanceReadOnly,
      description:
        'Bande : contenu pleine largeur. Illustration en colonne : image à côté du contenu.',
      initialValue: 'band',
      options: {
        list: [
          {title: 'Bande', value: 'band'},
          {title: 'Illustration en colonne', value: 'column'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'illustration',
      title: 'Illustration',
      type: 'customImage',
      group: 'appearance',
      readOnly: appearanceReadOnly,
      description: 'Image affichée à côté du contenu (disposition « Illustration en colonne »).',
      options: {collapsible: true, collapsed: true},
      hidden: ({parent}) => parent?.layout !== 'column',
      validation: (Rule) =>
        Rule.custom((value: any, context: any) => {
          if (context.parent?.layout === 'column' && !value?.asset) {
            return 'Ajoutez une illustration pour la disposition en colonne.'
          }
          return true
        }),
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
        title: title || 'Section de page',
        subtitle: ['Section de page', headline, bgType && labels[bgType]]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
