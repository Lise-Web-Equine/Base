import {defineField, defineType} from '@sanity/types'
import {UsersIcon} from '@sanity/icons'

/**
 * Document "Référence" (PROJET) : une entité mise en avant sous forme de logo
 * (client, partenaire, fournisseur…). Source unique, réutilisable sur plusieurs
 * pages via la section « Références » (qui affiche toutes les références d'une
 * catégorie donnée).
 *
 * Enregistré dans `schemaTypes/project.ts` (projectSchemaTypes) : il apparaît
 * automatiquement dans le Studio (« Contenu » → « Références »).
 */

// Catégories partagées : réutilisées par le champ `type` (ce document) ET par
// le sélecteur de catégorie de la section « Références ».
export const referenceTypeOptions = {
  list: [
    {title: 'Clients', value: 'client'},
    {title: 'Partenaires', value: 'partner'},
    {title: 'Fournisseurs', value: 'supplier'},
  ],
  layout: 'radio' as const,
}

export const reference = defineType({
  name: 'referenceItem',
  title: 'Référence',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      description: 'Nom de la référence (client, partenaire…).',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Catégorie',
      type: 'string',
      description: 'Type de référence. Détermine dans quelle section elle apparaît.',
      initialValue: 'client',
      options: referenceTypeOptions,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'customImage',
      description: 'Logo affiché (PNG transparent ou SVG recommandé).',
      validation: (Rule) =>
        Rule.custom((value: any) =>
          value?.asset ? true : 'Ajoutez un logo.',
        ),
    }),
    defineField({
      name: 'link',
      title: 'Lien',
      type: 'link',
      description: 'Destination au clic sur le logo (optionnel).',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      type: 'type',
      media: 'logo',
    },
    prepare({title, type, media}) {
      const labels: Record<string, string> = {
        client: 'Client',
        partner: 'Partenaire',
        supplier: 'Fournisseur',
      }
      return {
        title: title || 'Référence',
        subtitle: type ? labels[type] : undefined,
        media,
      }
    },
  },
})
