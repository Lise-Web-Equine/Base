import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {MenuIcon, LinkIcon} from '@sanity/icons'

/**
 * Singleton de navigation (CŒUR).
 *
 * Pilote les menus du site depuis Sanity plutôt qu'en dur dans le frontend :
 * - `headerMenu` : menu principal, avec sous-menus déroulants (2 niveaux max).
 * - `footerLinks` : liens simples du pied de page.
 *
 * Les réseaux sociaux ne sont PAS ici : ils vivent dans le singleton `settings`
 * (réutilisés par le pied de page et Schema.org). Une seule instance
 * (documentId 'navigation'), verrouillée dans la structure du Studio.
 */
export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'footer', title: 'Pied de page'},
  ],
  fields: [
    defineField({
      name: 'headerMenu',
      title: 'Menu principal (en-tête)',
      type: 'array',
      group: 'header',
      description: "Entrées affichées dans l'en-tête du site, dans l'ordre.",
      of: [
        defineArrayMember({
          name: 'menuItem',
          title: 'Entrée de menu',
          type: 'object',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'label',
              title: 'Libellé',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Lien',
              type: 'link',
              description:
                "Cible de l'entrée. Laissez vide si l'entrée sert uniquement à ouvrir un sous-menu.",
            }),
            defineField({
              name: 'children',
              title: 'Sous-menu (menu déroulant)',
              type: 'array',
              description: 'Liens affichés au survol/clic de cette entrée (niveau 2).',
              of: [
                defineArrayMember({
                  name: 'subMenuItem',
                  title: 'Sous-entrée',
                  type: 'object',
                  icon: LinkIcon,
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Libellé',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Lien',
                      type: 'link',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {select: {title: 'label'}},
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'label', children: 'children'},
            prepare({title, children}) {
              const count = Array.isArray(children) ? children.length : 0
              return {
                title: title || 'Sans libellé',
                subtitle: count ? `${count} sous-lien(s)` : undefined,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footerLinks',
      title: 'Liens du pied de page',
      type: 'array',
      group: 'footer',
      description: 'Liens simples affichés dans le pied de page.',
      of: [
        defineArrayMember({
          name: 'footerLink',
          title: 'Lien',
          type: 'object',
          icon: LinkIcon,
          fields: [
            defineField({
              name: 'label',
              title: 'Libellé',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Lien',
              type: 'link',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {select: {title: 'label'}},
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
