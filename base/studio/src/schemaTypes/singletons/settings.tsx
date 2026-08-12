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
    {name: 'blog', title: 'Blog / Actualités'},
    {name: 'modules', title: 'Modules'},
  ],
  fieldsets: [
    {name: 'branding', title: 'Général & Branding'},
    {name: 'contact', title: 'Coordonnées'},
    {name: 'location', title: 'Localisation'},
    {name: 'social', title: 'Réseaux sociaux'},
    {name: 'author', title: 'Auteur des articles'},
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
      name: 'author',
      title: 'Auteur des articles',
      type: 'object',
      group: 'identity',
      fieldset: 'author',
      description:
        'Auteur unique affiché sur tous les articles de blog (nom + photo).',
      options: {columns: 1},
      fields: [
        defineField({
          name: 'name',
          title: 'Nom',
          type: 'string',
        }),
        defineField({
          name: 'picture',
          title: 'Photo',
          type: 'image',
          options: {hotspot: true},
        }),
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
      name: 'blog',
      title: 'Blog / Actualités',
      type: 'object',
      group: 'blog',
      options: {columns: 1},
      description:
        "Active la section blog du site. Une fois activée, l'ajout d'articles apparaît dans « Contenu » et la rubrique s'affiche sur le site.",
      fields: [
        defineField({
          name: 'enabled',
          title: 'Activer le blog / les actualités',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'label',
          title: 'Nom affiché',
          type: 'string',
          description: 'Nom de la rubrique affiché sur le site et dans le Studio.',
          initialValue: 'blog',
          options: {
            list: [
              {title: 'Blog', value: 'blog'},
              {title: 'Actualités', value: 'actualites'},
            ],
            layout: 'radio',
          },
          hidden: ({parent}) => !parent?.enabled,
          validation: (Rule) =>
            Rule.custom((value, context: any) =>
              context.parent?.enabled && !value ? 'Choisissez un nom à afficher.' : true,
            ),
        }),
        defineField({
          name: 'categories',
          title: 'Catégories',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description:
            "Catégories proposées lors de l'édition d'un article (menu déroulant du champ « Catégorie »).",
          options: {layout: 'tags'},
          hidden: ({parent}) => !parent?.enabled,
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
    defineField({
      name: 'analytics',
      title: "Analytics / Mesure d'audience",
      type: 'object',
      group: 'modules',
      description:
        "Suivi d'audience. Plausible (recommandé) et Matomo (mode sans cookie) fonctionnent sans bannière de consentement. Google Analytics dépose des cookies et doit être associé à la bannière RGPD.",
      options: {columns: 1},
      fields: [
        defineField({
          name: 'provider',
          title: 'Fournisseur',
          type: 'string',
          initialValue: 'none',
          options: {
            list: [
              {title: 'Aucun', value: 'none'},
              {title: 'Plausible (sans cookie, RGPD)', value: 'plausible'},
              {title: 'Matomo', value: 'matomo'},
              {title: 'Google Analytics 4', value: 'googleAnalytics'},
            ],
            layout: 'radio',
          },
        }),
        // --- Plausible ---
        defineField({
          name: 'plausibleDomain',
          title: 'Domaine Plausible',
          type: 'string',
          description: 'Le domaine tel que déclaré dans Plausible (ex: mon-site.fr).',
          hidden: ({parent}) => parent?.provider !== 'plausible',
          validation: (Rule) =>
            Rule.custom((value, context: any) =>
              context.parent?.provider === 'plausible' && !value
                ? 'Requis pour Plausible.'
                : true,
            ),
        }),
        defineField({
          name: 'plausibleScriptUrl',
          title: 'URL du script (optionnel)',
          type: 'url',
          description:
            "Pour une instance Plausible auto-hébergée. Laisser vide pour utiliser https://plausible.io.",
          hidden: ({parent}) => parent?.provider !== 'plausible',
        }),
        // --- Matomo ---
        defineField({
          name: 'matomoUrl',
          title: 'URL de l\u2019instance Matomo',
          type: 'url',
          description: 'Ex: https://analytics.mon-site.fr',
          hidden: ({parent}) => parent?.provider !== 'matomo',
          validation: (Rule) =>
            Rule.custom((value, context: any) =>
              context.parent?.provider === 'matomo' && !value
                ? 'Requis pour Matomo.'
                : true,
            ),
        }),
        defineField({
          name: 'matomoSiteId',
          title: 'Identifiant du site Matomo',
          type: 'string',
          description: 'Le « Site ID » du site dans Matomo (ex: 1).',
          hidden: ({parent}) => parent?.provider !== 'matomo',
          validation: (Rule) =>
            Rule.custom((value, context: any) =>
              context.parent?.provider === 'matomo' && !value
                ? 'Requis pour Matomo.'
                : true,
            ),
        }),
        defineField({
          name: 'matomoDisableCookies',
          title: 'Mode sans cookie (pas de bannière requise)',
          type: 'boolean',
          description:
            'Activé : Matomo ne dépose pas de cookie (RGPD, aucun consentement requis). Désactivé : à associer à la bannière de consentement.',
          initialValue: true,
          hidden: ({parent}) => parent?.provider !== 'matomo',
        }),
        // --- Google Analytics 4 ---
        defineField({
          name: 'gaMeasurementId',
          title: 'Identifiant de mesure (GA4)',
          type: 'string',
          description:
            'Format G-XXXXXXXXXX (Admin → Flux de données). GA se charge en Consent Mode « refusé » par défaut : pensez à activer le Google Consent Mode dans le tableau de bord Axeptio pour que le consentement soit accordé automatiquement.',
          hidden: ({parent}) => parent?.provider !== 'googleAnalytics',
          validation: (Rule) =>
            Rule.custom((value, context: any) =>
              context.parent?.provider === 'googleAnalytics' && !value
                ? 'Requis pour Google Analytics.'
                : true,
            ),
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
