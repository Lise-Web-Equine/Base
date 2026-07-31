import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from '@sanity/types'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Réglages du site',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identité & Coordonnées', default: true},
    {name: 'seo', title: 'SEO & Partage'},
    {name: 'modules', title: 'Modules'},
  ],
  fieldsets: [
    {name: 'branding', title: 'Général & Branding'},
    {name: 'contact', title: 'Coordonnées'},
    {name: 'location', title: 'Localisation'},
    {name: 'social', title: 'Réseaux sociaux'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: "Nom de l'organisation / Entreprise",
      description:
        'Nom affiché dans la navigation, utilisé comme titre SEO par défaut et dans les données structurées.',
      type: 'string',
      group: 'identity',
      fieldset: 'branding',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo de l\u2019organisation',
      type: 'image',
      group: 'identity',
      fieldset: 'branding',
      description:
        'Utilisé pour les données structurées Schema.org (logo affiché par Google). Format carré recommandé.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone principal',
      type: 'string',
      group: 'identity',
      fieldset: 'contact',
      description: 'Numéro de téléphone public (affichage + données structurées).',
    }),
    defineField({
      name: 'email',
      title: 'Adresse e-mail',
      type: 'string',
      group: 'identity',
      fieldset: 'contact',
      description: 'Adresse e-mail publique de contact.',
      validation: (Rule) =>
        Rule.custom((value: any) =>
          !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Adresse e-mail invalide.',
        ),
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'object',
      group: 'identity',
      fieldset: 'location',
      options: {columns: 1},
      fields: [
        defineField({name: 'street', title: 'Rue', type: 'string'}),
        defineField({name: 'postalCode', title: 'Code postal', type: 'string'}),
        defineField({name: 'city', title: 'Ville', type: 'string'}),
        defineField({name: 'country', title: 'Pays', type: 'string', initialValue: 'France'}),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Image de partage (Open Graph)',
      type: 'image',
      group: 'seo',
      description:
        'Affichée sur les réseaux sociaux et dans les résultats de recherche, tant qu\u2019une page ne la surcharge pas.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
    }),
    defineField({
      name: 'metaDescription',
      title: 'Description SEO par défaut',
      type: 'text',
      group: 'seo',
      rows: 3,
      description:
        "Description affichée par les moteurs de recherche lorsqu'une page n'a pas sa propre description SEO (recommandé : 150-160 caractères).",
    }),
    defineField({
      name: 'socialLinks',
      title: 'Réseaux sociaux',
      type: 'array',
      group: 'identity',
      fieldset: 'social',
      description:
        'Profils officiels. L\u2019icône est déduite de la plateforme choisie (affichage front).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          title: 'Réseau social',
          fields: [
            defineField({
              name: 'platform',
              title: 'Plateforme',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'X (Twitter)', value: 'x'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Pinterest', value: 'pinterest'},
                  {title: 'WhatsApp', value: 'whatsapp'},
                  {title: 'Autre', value: 'other'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Nom (si « Autre »)',
              type: 'string',
              hidden: ({parent}) => parent?.platform !== 'other',
            }),
            defineField({
              name: 'url',
              title: 'Lien',
              type: 'url',
              validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
            }),
          ],
          preview: {
            select: {platform: 'platform', label: 'label', url: 'url'},
            prepare({platform, label, url}) {
              return {title: label || platform || 'Réseau social', subtitle: url}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'cookieConsent',
      title: 'Bannière cookies (RGPD)',
      type: 'object',
      group: 'modules',
      description:
        "Bannière de consentement via Axeptio. À activer uniquement si le site utilise des cookies non essentiels (analytics, publicité, embeds…).",
      options: {columns: 1},
      fields: [
        defineField({
          name: 'enabled',
          title: 'Activer la bannière (Axeptio)',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'axeptioClientId',
          title: 'Identifiant client Axeptio',
          type: 'string',
          description: 'Trouvé dans ton compte Axeptio (paramètres du projet).',
          hidden: ({parent}) => !parent?.enabled,
          validation: (Rule) =>
            Rule.custom((value, context: any) =>
              context.parent?.enabled && !value
                ? "Requis lorsque la bannière est activée."
                : true,
            ),
        }),
        defineField({
          name: 'axeptioCookiesVersion',
          title: 'Version des cookies (optionnel)',
          type: 'string',
          description: 'Paramètre « cookiesVersion » d\u2019Axeptio (optionnel).',
          hidden: ({parent}) => !parent?.enabled,
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Réglages du site',
      }
    },
  },
})
