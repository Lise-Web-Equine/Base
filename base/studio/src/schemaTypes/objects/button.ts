import {defineField, defineType} from '@sanity/types'
import {ChevronRightIcon} from '@sanity/icons'

/**
 * Objet bouton réutilisable. S'appuie sur l'objet `link` (la cible) et y ajoute
 * le libellé affiché, une couleur et une variante de style. Utilisé par les
 * sections (ex: pageHeader) pour leurs boutons.
 *
 * Style = deux réglages, mappés 1:1 sur <UButton> (Nuxt UI), qui applique le
 * thème du site :
 *  - `color`   : Primaire / Secondaire / Neutre (couleurs du thème) ;
 *  - `variant` : Solid / Outline / Subtle / Soft.
 *
 * Validation « tout ou rien » : un bouton est soit vide (autorisé — utile pour
 * un bouton secondaire optionnel), soit complet (libellé + destination). Le
 * caractère obligatoire d'un bouton (ex. bouton principal) se règle au niveau
 * du champ qui l'utilise, pas ici.
 */
const isButtonUsed = (parent: any) => !!(parent?.label || parent?.link?.linkType)

// Options de style partagées (réutilisées par les boutons du CTA).
// Alignées sur le playground `sections-apparence` et le thème Nuxt UI.
export const buttonColorOptions = {
  list: [
    {title: 'Primaire', value: 'primary'},
    {title: 'Secondaire', value: 'secondary'},
    {title: 'Neutre', value: 'neutral'},
  ],
  layout: 'radio' as const,
}

export const buttonVariantOptions = {
  list: [
    {title: 'Solid', value: 'solid'},
    {title: 'Outline', value: 'outline'},
    {title: 'Subtle', value: 'subtle'},
    {title: 'Soft', value: 'soft'},
  ],
  layout: 'radio' as const,
}

export const button = defineType({
  name: 'button',
  title: 'Bouton',
  type: 'object',
  icon: ChevronRightIcon,
  // Replié par défaut : tout bouton s'affiche fermé, ouvrable via son toggle.
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      description: 'Texte affiché sur le bouton.',
      validation: (Rule) =>
        Rule.custom((label: any, context: any) =>
          isButtonUsed(context.parent) && !label ? 'Ajoutez un libellé.' : true,
        ),
    }),
    defineField({
      name: 'link',
      title: 'Destination',
      type: 'link',
      validation: (Rule) =>
        Rule.custom((link: any, context: any) =>
          isButtonUsed(context.parent) && !link?.linkType ? 'Ajoutez une destination.' : true,
        ),
    }),
    defineField({
      name: 'color',
      title: 'Couleur',
      type: 'string',
      description: 'Couleur du thème appliquée au bouton.',
      initialValue: 'primary',
      options: buttonColorOptions,
    }),
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      description: 'Style d’affichage du bouton.',
      initialValue: 'solid',
      options: buttonVariantOptions,
    }),
  ],
  preview: {
    select: {
      title: 'label',
      color: 'color',
      variant: 'variant',
    },
    prepare({title, color, variant}) {
      const style = [color, variant].filter(Boolean).join(' · ')
      return {
        title: title || 'Bouton',
        subtitle: style || undefined,
      }
    },
  },
})
