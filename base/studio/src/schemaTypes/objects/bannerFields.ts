import {defineField} from '@sanity/types'
import {ChevronRightIcon} from '@sanity/icons'
import type {FieldDefinition} from '@sanity/types'
import {buttonColorOptions, buttonVariantOptions} from './button'

/**
 * Champs partagés de la bannière (CŒUR réutilisable).
 *
 * Mutualisés entre :
 *  - la section « Bannière » du Page Builder (`bannerSection`), et
 *  - la bannière GLOBALE configurée dans « Réglages du site » (affichée avant
 *    l'en-tête du site).
 *
 * `bannerContentFields()` → champs de contenu (titre, icône, boutons, lien…).
 * `bannerAppearanceFields()` → style (couleur de fond + style des boutons).
 * Les groupes/onglets et le verrouillage éventuel sont gérés par l'appelant.
 */

// Options de couleur de fond de la bannière. Mélange de couleurs du THÈME
// (accent, fonds) — appliquées via les utilitaires `bg-*` — et de couleurs
// sémantiques Nuxt UI (neutre, succès…), rendues via la prop `color` d'<UBanner>.
export const bannerColorOptions = {
  list: [
    {title: 'Accent', value: 'accent'},
    {title: 'Fond principal', value: 'background'},
    {title: 'Fond sombre', value: 'surface'},
    {title: 'Fond clair', value: 'light'},
    {title: 'Neutre', value: 'neutral'},
    {title: 'Succès', value: 'success'},
    {title: 'Info', value: 'info'},
    {title: 'Avertissement', value: 'warning'},
    {title: 'Erreur', value: 'error'},
  ],
  layout: 'dropdown' as const,
}

// Champs de CONTENU de la bannière.
export const bannerContentFields = (): FieldDefinition[] => [
  defineField({
    name: 'showPhone',
    title: 'Afficher le numéro de téléphone',
    type: 'boolean',
    description:
      'Si activé, la bannière affiche le numéro de téléphone des « Réglages du site » avec une icône téléphone, et devient cliquable (appel). Les autres champs sont alors masqués.',
    initialValue: false,
  }),
  defineField({
    name: 'title',
    title: 'Titre',
    type: 'string',
    description:
      'Message affiché dans la bannière. Si « Afficher le numéro de téléphone » est activé, le numéro est automatiquement ajouté à la suite de ce titre.',
    validation: (Rule) =>
      Rule.custom((value: any, context: any) =>
        context.parent?.showPhone !== true && !value
          ? 'Renseignez le titre de la bannière.'
          : true,
      ),
  }),
  defineField({
    name: 'icon',
    title: 'Icône',
    type: 'string',
    description:
      'Nom d’icône Lucide affiché à côté du titre (ex. « i-lucide-info », « i-lucide-sparkles »). Laissez vide pour aucune icône. Voir https://lucide.dev.',
    hidden: ({parent}: any) => parent?.showPhone === true,
  }),
  defineField({
    name: 'buttons',
    title: 'Boutons',
    type: 'array',
    description: 'Optionnel : boutons d’action affichés dans la bannière.',
    hidden: ({parent}: any) => parent?.showPhone === true,
    of: [
      {
        type: 'object',
        name: 'bannerButton',
        title: 'Bouton',
        icon: ChevronRightIcon,
        fields: [
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
        ],
        preview: {
          select: {title: 'label'},
          prepare({title}: any) {
            return {title: title || 'Bouton'}
          },
        },
      },
    ],
  }),
  defineField({
    name: 'clickable',
    title: 'Bannière cliquable',
    type: 'boolean',
    description: 'Rend toute la bannière cliquable vers un lien.',
    initialValue: false,
    hidden: ({parent}: any) => parent?.showPhone === true,
  }),
  defineField({
    name: 'link',
    title: 'Lien de la bannière',
    type: 'link',
    description: 'Destination ouverte au clic sur la bannière.',
    hidden: ({parent}: any) => parent?.showPhone === true || parent?.clickable !== true,
    validation: (Rule) =>
      Rule.custom((value: any, context: any) => {
        const parent: any = context.parent
        if (parent?.showPhone !== true && parent?.clickable === true && !value?.linkType) {
          return 'Renseignez la destination, ou désactivez « Bannière cliquable ».'
        }
        return true
      }),
  }),
]

// Champs d'APPARENCE de la bannière (couleur de fond + style des boutons).
export const bannerAppearanceFields = (): FieldDefinition[] => [
  defineField({
    name: 'color',
    title: 'Couleur de fond',
    type: 'string',
    description: 'Couleur de fond de la bannière, choisie parmi les couleurs du thème.',
    initialValue: 'surface',
    options: bannerColorOptions,
  }),
  defineField({
    name: 'buttonColor',
    title: 'Couleur des boutons',
    type: 'string',
    description: 'Couleur du thème appliquée aux boutons de la bannière.',
    initialValue: 'neutral',
    options: buttonColorOptions,
    hidden: ({parent}: any) => parent?.showPhone === true,
  }),
  defineField({
    name: 'buttonVariant',
    title: 'Variant des boutons',
    type: 'string',
    description: 'Style d’affichage des boutons de la bannière.',
    initialValue: 'solid',
    options: buttonVariantOptions,
    hidden: ({parent}: any) => parent?.showPhone === true,
  }),
]
