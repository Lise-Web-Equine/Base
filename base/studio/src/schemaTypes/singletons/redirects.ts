import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {TransferIcon} from '@sanity/icons'

/**
 * Singleton des redirections (CŒUR).
 *
 * Permet de gérer les redirections d'URL (ex: après une refonte ou un
 * changement de slug) directement depuis le Studio, sans redéploiement.
 * Consommé côté frontend par un middleware serveur (`server/middleware/
 * redirects.ts`) qui applique la redirection avec le bon code HTTP.
 *
 * Une seule instance (documentId 'redirects'), verrouillée dans la structure.
 */
export const redirects = defineType({
  name: 'redirects',
  title: 'Redirections',
  type: 'document',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'entries',
      title: 'Redirections',
      type: 'array',
      description:
        'Chaque règle redirige une ancienne URL (chemin source) vers une nouvelle destination.',
      of: [
        defineArrayMember({
          name: 'redirect',
          title: 'Redirection',
          type: 'object',
          icon: TransferIcon,
          fields: [
            defineField({
              name: 'source',
              title: 'Chemin source',
              type: 'string',
              description:
                "Ancien chemin à rediriger, relatif au site (ex: /ancienne-page). Doit commencer par « / ».",
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  if (typeof value !== 'string') return true
                  if (!value.startsWith('/')) return 'Le chemin source doit commencer par « / ».'
                  return true
                }),
            }),
            defineField({
              name: 'destination',
              title: 'Destination',
              type: 'string',
              description:
                "Nouvelle cible : un chemin interne (ex: /nouvelle-page) ou une URL absolue (https://...).",
              validation: (Rule) =>
                Rule.required().custom((value) => {
                  if (typeof value !== 'string') return true
                  if (value.startsWith('/') || /^https?:\/\//.test(value)) return true
                  return 'La destination doit être un chemin (« / ») ou une URL absolue (http/https).'
                }),
            }),
            defineField({
              name: 'permanent',
              title: 'Redirection permanente (301)',
              type: 'boolean',
              description:
                'Activé : redirection permanente 301 (recommandé, transmet le SEO). Désactivé : redirection temporaire 302.',
              initialValue: true,
            }),
          ],
          preview: {
            select: {source: 'source', destination: 'destination', permanent: 'permanent'},
            prepare({source, destination, permanent}) {
              return {
                title: `${source || '?'} → ${destination || '?'}`,
                subtitle: permanent === false ? 'Temporaire (302)' : 'Permanente (301)',
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Redirections'}
    },
  },
})
