import {defineField, defineType} from '@sanity/types'

/**
 * Apparence commune d'une section (CŒUR, réutilisable).
 *
 * Décrit le FOND et la LARGEUR d'une section. Consommé par <SectionShell>
 * côté frontend.
 *
 * Fond : uniquement une IMAGE de fond (override), optionnelle. Sans image, la
 * section est transparente — c'est le fond propre du composant (ex. le
 * `variant` d'<UPageCTA>) ou du site qui s'affiche. Plus de fond clair/sombre.
 *
 * Ajouté automatiquement à chaque section via le helper `defineSection()`.
 */
export const sectionAppearance = defineType({
  name: 'sectionAppearance',
  title: 'Apparence',
  type: 'object',
  options: {columns: 1},
  fields: [
    defineField({
      name: 'image',
      title: 'Image de fond',
      type: 'customImage',
      description:
        'Optionnel. Si renseignée, elle sert de fond à la section (override). Sinon, fond transparent.',
      options: {collapsible: true, collapsed: true},
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Opacité du voile (%)',
      type: 'number',
      description: 'Voile sombre posé sur l’image pour améliorer la lisibilité du texte.',
      initialValue: 40,
      validation: (Rule) => Rule.min(0).max(100),
      hidden: ({parent}) => !parent?.image?.asset,
    }),
    defineField({
      name: 'lightText',
      title: 'Texte clair',
      type: 'boolean',
      description:
        'Active un texte clair (pour une image / un voile sombre). À désactiver si l’image est claire et nécessite un texte foncé.',
      initialValue: true,
      hidden: ({parent}) => !parent?.image?.asset,
    }),
    defineField({
      name: 'imageRatio',
      title: 'Format',
      type: 'string',
      description:
        'Ratio d’affichage du fond image. « Auto » suit la hauteur du contenu ; un ratio fixe recadre l’image (point focal respecté).',
      initialValue: 'auto',
      options: {
        list: [
          {title: 'Auto (hauteur du contenu)', value: 'auto'},
          {title: 'Panoramique 21:9', value: '21:9'},
          {title: 'Large 16:9', value: '16:9'},
          {title: 'Paysage 3:2', value: '3:2'},
          {title: 'Standard 4:3', value: '4:3'},
          {title: 'Carré 1:1', value: '1:1'},
        ],
        layout: 'dropdown',
      },
      hidden: ({parent}) => !parent?.image?.asset,
    }),
    defineField({
      name: 'width',
      title: 'Largeur',
      type: 'string',
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
  ],
})
