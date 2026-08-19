import {defineField} from '@sanity/types'
import {BulbOutlineIcon, ChevronRightIcon} from '@sanity/icons'
import {defineSection} from '../../sections/defineSection'
import {buttonColorOptions, buttonVariantOptions} from './button'

/**
 * Section "Appel à l'action". Bloc de page builder mettant en avant un message
 * fort avec un ou deux boutons.
 *
 * Construite via `defineSection()` : elle obtient les onglets « Contenu » /
 * « Apparence » et le champ `appearance` (image de fond optionnelle + largeur)
 * automatiquement. Le fond est géré par <SectionShell> : image de fond
 * (override) si renseignée, sinon transparent.
 *
 * Spécificité de cette section : les boutons ne portent QUE le contenu (libellé
 * + destination). Leur STYLE (variante) se règle dans l'onglet « Apparence »
 * via `primaryButtonVariant` / `secondaryButtonVariant`.
 */

// Champs d'un bouton propre au CTA : contenu uniquement (le style est en Apparence).
const ctaButtonFields = () => [
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

export const callToAction = defineSection({
  name: 'callToAction',
  title: "Appel à l'action",
  icon: BulbOutlineIcon,
  fields: [
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
      name: 'primaryButton',
      title: 'Bouton principal',
      type: 'object',
      icon: ChevronRightIcon,
      description: 'Obligatoire : libellé + destination. Le style se règle dans « Apparence ».',
      options: {collapsible: true, collapsed: true},
      fields: ctaButtonFields(),
      validation: (Rule) =>
        Rule.custom((v: any) =>
          v?.label && v?.link?.linkType
            ? true
            : 'Renseignez le libellé et la destination du bouton principal.',
        ),
    }),
    defineField({
      name: 'secondaryButton',
      title: 'Bouton secondaire',
      type: 'object',
      icon: ChevronRightIcon,
      description: 'Optionnel : laissez vide pour n’afficher qu’un seul bouton.',
      options: {collapsible: true, collapsed: true},
      fields: ctaButtonFields(),
      validation: (Rule) =>
        Rule.custom((v: any) => {
          const used = !!(v?.label || v?.link?.linkType)
          if (used && !(v?.label && v?.link?.linkType)) {
            return 'Complétez le libellé et la destination, ou laissez le bouton vide.'
          }
          return true
        }),
    }),
    defineField({
      name: 'layout',
      title: 'Disposition',
      type: 'string',
      group: 'appearance',
      description:
        'Bande : texte centré (fond couleur/image). Illustration : image à côté du texte.',
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
      name: 'variant',
      title: 'Variante du fond',
      type: 'string',
      group: 'appearance',
      description:
        'Fond coloré du bloc (bande ou colonne). Ignoré si une image de fond est renseignée (l’image prime).',
      initialValue: 'naked',
      options: {
        list: [
          {title: 'Naked (transparent)', value: 'naked'},
          {title: 'Outline', value: 'outline'},
          {title: 'Solid', value: 'solid'},
          {title: 'Soft', value: 'soft'},
          {title: 'Subtle', value: 'subtle'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => !!parent?.appearance?.image?.asset,
    }),
    defineField({
      name: 'illustration',
      title: 'Illustration',
      type: 'customImage',
      group: 'appearance',
      description: 'Image affichée à côté du texte (disposition « Illustration en colonne »).',
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
    defineField({
      name: 'reverse',
      title: 'Illustration à gauche',
      type: 'boolean',
      group: 'appearance',
      description: 'Place l’illustration à gauche du texte (au lieu de la droite).',
      initialValue: false,
      hidden: ({parent}) => parent?.layout !== 'column',
    }),
    defineField({
      name: 'illustrationBleed',
      title: 'Illustration à bord perdu',
      type: 'boolean',
      group: 'appearance',
      description:
        'Colle l’illustration aux bords du bloc (sans padding autour d’elle). Utile avec une variante de fond colorée.',
      initialValue: false,
      hidden: ({parent}) =>
        parent?.layout !== 'column' ||
        !!parent?.appearance?.image?.asset ||
        !['solid', 'outline', 'soft', 'subtle'].includes(parent?.variant),
    }),
    // --- Apparence : style des boutons (onglet « Apparence ») ---
    defineField({
      name: 'primaryButtonColor',
      title: 'Couleur du bouton principal',
      type: 'string',
      group: 'appearance',
      description: 'Couleur du thème appliquée au bouton principal.',
      initialValue: 'primary',
      options: buttonColorOptions,
    }),
    defineField({
      name: 'primaryButtonVariant',
      title: 'Variant du bouton principal',
      type: 'string',
      group: 'appearance',
      description: 'Style d’affichage du bouton principal.',
      initialValue: 'solid',
      options: buttonVariantOptions,
    }),
    defineField({
      name: 'secondaryButtonColor',
      title: 'Couleur du bouton secondaire',
      type: 'string',
      group: 'appearance',
      description: 'Couleur du thème appliquée au bouton secondaire.',
      initialValue: 'neutral',
      options: buttonColorOptions,
      hidden: ({parent}) => !parent?.secondaryButton?.label,
    }),
    defineField({
      name: 'secondaryButtonVariant',
      title: 'Variant du bouton secondaire',
      type: 'string',
      group: 'appearance',
      description: 'Style d’affichage du bouton secondaire.',
      initialValue: 'outline',
      options: buttonVariantOptions,
      hidden: ({parent}) => !parent?.secondaryButton?.label,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      media: 'appearance.image',
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
