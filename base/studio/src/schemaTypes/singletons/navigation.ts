import {defineArrayMember, defineField, defineType} from '@sanity/types'
import {MenuIcon, LinkIcon} from '@sanity/icons'
import {SyncMenuField} from '../../components/SyncMenuField'

/**
 * Disposition de l'en-tête : contenu de chacune des 3 colonnes de <UHeader>
 * (gauche / centre / droite). Lu par le composant Header pour placer logo,
 * navigation et boutons. Sur mobile, l'affichage reste logo + menu hamburger
 * quel que soit le réglage.
 */
const HEADER_COLUMN_OPTIONS = [
  {title: 'Logo', value: 'logo'},
  {title: 'Navigation', value: 'nav'},
  {title: 'Boutons', value: 'buttons'},
  {title: 'Vide', value: 'none'},
]

const columnField = (name: string, title: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: 'string',
    group: 'header',
    fieldset: 'layout',
    options: {list: HEADER_COLUMN_OPTIONS, layout: 'dropdown'},
    initialValue,
    validation: (Rule) => Rule.required(),
  })

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
  fieldsets: [
    {
      name: 'layout',
      title: 'Disposition des colonnes',
      description:
        "Contenu de chaque colonne de l'en-tête (sur grand écran). Mettez « Navigation » à gauche ET à droite pour répartir les liens de part et d'autre (via leur alignement).",
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'headerOverlay',
      title: 'En-tête superposé au contenu',
      type: 'boolean',
      group: 'header',
      description:
        "Si activé, l'en-tête devient transparent et se superpose au contenu (hero de l'accueil, bandeau des autres pages) au lieu d'occuper sa propre bande. Idéal avec un hero en image ou vidéo (texte clair).",
      initialValue: false,
    }),
    columnField('headerColLeft', 'Colonne gauche', 'logo'),
    columnField('headerColCenter', 'Colonne centrale', 'nav'),
    columnField('headerColRight', 'Colonne droite', 'buttons'),
    defineField({
      name: 'headerMenu',
      title: 'Menu principal (en-tête)',
      type: 'array',
      group: 'header',
      description: "Entrées affichées dans l'en-tête du site, dans l'ordre.",
      // Bouton « Synchroniser » à côté du titre : pré-remplit avec l'accueil +
      // les pages du site (ensuite éditable).
      components: {field: SyncMenuField},
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
              name: 'align',
              title: 'Alignement',
              type: 'string',
              description:
                "Utilisé uniquement quand la navigation est présente à gauche ET à droite.",
              options: {
                list: [
                  {title: 'Gauche', value: 'gauche'},
                  {title: 'Droite', value: 'droite'},
                ],
                layout: 'radio',
              },
              initialValue: 'gauche',
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
      name: 'headerButtons',
      title: "Boutons d'en-tête",
      type: 'array',
      group: 'header',
      description:
        "Boutons d'action affichés dans l'en-tête (ex. « Contact », « Devis »). Leur position est réglée dans le Thème → Mise en forme → Agencement de l'en-tête.",
      of: [defineArrayMember({type: 'button'})],
      validation: (Rule) => Rule.max(2),
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
