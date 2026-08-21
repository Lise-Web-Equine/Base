import {defineField, defineType} from '@sanity/types'
import {ImagesIcon} from '@sanity/icons'
import {CompactSectionInput} from '../../components/CompactSectionInput'
import {appearanceReadOnly} from '../../lib/appearanceAccess'
import {referenceTypeOptions} from '../documents/reference'

/**
 * Section "Références" (PROJET). Affiche un sur-titre puis la liste des
 * références (clients, partenaires…) d'une catégorie donnée, sous forme de
 * logos. Construite sur le composant <UPageLogos> de Nuxt UI.
 *
 * Les logos ne sont PAS saisis ici : la section pointe vers une CATÉGORIE et
 * affiche automatiquement toutes les références (documents `referenceItem`) de ce
 * type. On gère la source de vérité une seule fois (« Contenu » → « Références »)
 * et on la réutilise sur autant de pages que voulu.
 *
 * Deux onglets, comme les autres sections :
 *  - « Contenu »   : sur-titre + catégorie ;
 *  - « Apparence » : défilement (marquee) — éditable par le client — et largeur
 *    (verrouillée pour le client, comme les autres sections).
 */
export const referencesSection = defineType({
  name: 'referencesSection',
  title: 'Références',
  type: 'object',
  icon: ImagesIcon,
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
      description: 'Texte affiché au-dessus des logos (optionnel).',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'content',
      description: 'Affiche toutes les références de cette catégorie.',
      initialValue: 'client',
      options: referenceTypeOptions,
      validation: (Rule) => Rule.required(),
    }),
    // --- Onglet « Apparence » (verrouillé pour le client) ---
    // Choix éditable par le client (contrairement aux autres champs d'apparence) :
    // faire défiler ou non les logos.
    defineField({
      name: 'useMarquee',
      title: 'Défilement continu (marquee)',
      type: 'boolean',
      group: 'appearance',
      description:
        'Fait défiler les logos en boucle (<UMarquee>). Sinon, ils sont alignés statiquement.',
      initialValue: false,
    }),
    defineField({
      name: 'pauseOnHover',
      title: 'Pause au survol',
      type: 'boolean',
      group: 'appearance',
      description: 'Met le défilement en pause quand la souris survole les logos.',
      initialValue: true,
      hidden: ({parent}) => parent?.useMarquee !== true,
    }),
    defineField({
      name: 'reverse',
      title: 'Sens inversé',
      type: 'boolean',
      group: 'appearance',
      description: 'Inverse le sens du défilement.',
      initialValue: false,
      hidden: ({parent}) => parent?.useMarquee !== true,
    }),
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
  ],
  preview: {
    select: {
      headline: 'headline',
      category: 'category',
    },
    prepare({headline, category}) {
      const labels: Record<string, string> = {
        client: 'Clients',
        partner: 'Partenaires',
        supplier: 'Fournisseurs',
      }
      return {
        title: headline || 'Références',
        subtitle: ['Références', category && labels[category]]
          .filter(Boolean)
          .join(' · '),
      }
    },
  },
})
