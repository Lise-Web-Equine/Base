import {defineField, defineType} from '@sanity/types'
import {PinIcon} from '@sanity/icons'

/**
 * Section "Coordonnées". Bloc de page builder affichant les coordonnées du site
 * (e-mail, téléphone, adresse postale, réseaux sociaux).
 *
 * IMPORTANT : les coordonnées ne sont PAS saisies ici. Elles proviennent du
 * singleton "Réglages du site" (Identité & Coordonnées) afin de rester la source
 * unique de vérité (réutilisées aussi par le footer et les données structurées).
 * Cette section se contente de choisir ce qui est affiché et le texte d'accompagnement.
 */
export const contactDetails = defineType({
  name: 'contactDetails',
  title: 'Coordonnées',
  type: 'object',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'string',
      description: 'Petit texte affiché au-dessus du titre (optionnel).',
    }),
    defineField({
      name: 'heading',
      title: 'Titre',
      type: 'string',
      initialValue: 'Nos coordonnées',
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Texte affiché au-dessus des coordonnées (optionnel).',
    }),
    defineField({
      name: 'showEmail',
      title: "Afficher l'e-mail",
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showPhone',
      title: 'Afficher le téléphone',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showAddress',
      title: "Afficher l'adresse",
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showSocial',
      title: 'Afficher les réseaux sociaux',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Coordonnées',
        subtitle: 'Coordonnées (depuis Réglages du site)',
      }
    },
  },
})
