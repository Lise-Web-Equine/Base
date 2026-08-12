import {
  CogIcon,
  ColorWheelIcon,
  ControlsIcon,
  DocumentsIcon,
  DocumentTextIcon,
  HomeIcon,
  MenuIcon,
  TransferIcon,
} from '@sanity/icons'
import type {StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'
import {projectExcludedTypes, projectContentItems, projectAdminItems} from './project'

/**
 * Structure du Studio : point de composition CŒUR + PROJET.
 * Pour personnaliser l'arborescence d'un site, éditer `project.ts`.
 * Doc : https://www.sanity.io/docs/structure-builder-introduction
 */

// Singletons et types techniques du cœur, gérés à part (exclus de la liste auto).
// Note : page / post sont volontairement exclus ; ils sont ajoutés au
// cas par cas dans les templates de projet (via projectContentItems).
const CORE_EXCLUDED_TYPES = [
  'settings',
  'themeSettings',
  'homePage',
  'navigation',
  'redirects',
  'assist.instruction.context',
  'page',
  'post',
]

// Types NON créables directement (singletons + techniques) : exclus du menu « + »
// de création de contenu. Tout le reste (page, article, personne, types projet)
// est proposé à la création.
const CORE_SINGLETON_TYPES = [
  'settings',
  'themeSettings',
  'homePage',
  'navigation',
  'redirects',
  'assist.instruction.context',
]

export const structure: StructureResolver = async (S, context) => {
  // Lecture du réglage « Blog / Actualités » (Réglages du site) pour afficher
  // ou non l'entrée Articles, et adapter son libellé (Blog vs Actualités).
  // La structure n'étant pas réactive : recharger le Studio après avoir basculé
  // le toggle pour voir le changement.
  const client = context.getClient({apiVersion: '2025-10-20'})
  const blog = await client.fetch<{enabled?: boolean; label?: string} | null>(
    `*[_type == "settings"][0].blog`,
  )
  const blogEnabled = blog?.enabled === true
  const blogLabel = blog?.label === 'actualites' ? 'Actualités' : 'Blog'

  // Types exclus du menu « + » de création : singletons + types projet gérés à la
  // main. Le type « post » (article) n'y figure que si le blog est activé.
  const createExcludedTypes = [
    ...CORE_SINGLETON_TYPES,
    ...projectExcludedTypes,
    ...(blogEnabled ? [] : ['post']),
  ]

  return S.list()
    .title('Base')
    .items([
      // === CONTENU ===
      // Ce que l'éditeur alimente au quotidien : accueil, pages, articles...
      S.listItem()
        .title('Contenu')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Contenu')
            // Bouton « + » : créer un nouveau contenu en choisissant son type
            // (page, article, personne… + types propres au projet). Les singletons
            // (réglages, thème, navigation…) en sont exclus.
            .menuItems(
              S.documentTypeListItems()
                .filter((listItem: any) => !createExcludedTypes.includes(listItem.getId()))
                .map((listItem) =>
                  S.menuItem()
                    .title(listItem.getTitle() as string)
                    .icon((listItem as any).getIcon?.() ?? DocumentsIcon)
                    .intent({type: 'create', params: {type: listItem.getId() as string}}),
                ),
            )
            .items([
              // Singleton de la page d'accueil (verrouillé, une seule instance).
              S.listItem()
                .title('Accueil')
                .child(S.document().schemaType('homePage').documentId('homePage'))
                .icon(HomeIcon),
              S.divider(),
              // Liste auto des types de documents (cœur + projet), hors singletons.
              ...S.documentTypeListItems()
                .filter(
                  (listItem: any) =>
                    ![...CORE_EXCLUDED_TYPES, ...projectExcludedTypes].includes(listItem.getId()),
                )
                // Met le titre au pluriel (optionnel).
                .map((listItem) => listItem.title(pluralize(listItem.getTitle() as string))),
              // Entrée « Blog / Actualités » (liste des articles) : visible seulement
              // si le blog est activé dans les Réglages. Le titre suit le choix.
              ...(blogEnabled
                ? [
                    S.listItem()
                      .title(blogLabel)
                      .icon(DocumentTextIcon)
                      .child(S.documentTypeList('post').title(blogLabel)),
                  ]
                : []),
              // Éléments de contenu propres au projet (singletons, regroupements custom).
              ...projectContentItems(S),
            ]),
        ),
      S.divider(),
      // === ADMINISTRATION ===
      // Configuration du site, définie surtout au lancement par le créateur.
      S.listItem()
        .title('Administration')
        .icon(ControlsIcon)
        .child(
          S.list()
            .title('Administration')
            .items([
              // Singleton de la navigation (menus en-tête / pied de page).
              S.listItem()
                .title('Navigation')
                .child(S.document().schemaType('navigation').documentId('navigation'))
                .icon(MenuIcon),
              // Singleton des réglages globaux du site.
              S.listItem()
                .title('Réglages du site')
                .child(S.document().schemaType('settings').documentId('siteSettings'))
                .icon(CogIcon),
              // Singleton du thème (couleurs + typographie).
              S.listItem()
                .title('Thème')
                .child(S.document().schemaType('themeSettings').documentId('themeSettings'))
                .icon(ColorWheelIcon),
              // Singleton des redirections d'URL.
              S.listItem()
                .title('Redirections')
                .child(S.document().schemaType('redirects').documentId('redirects'))
                .icon(TransferIcon),
              // Éléments d'administration propres au projet (ex: textes légaux).
              ...projectAdminItems(S),
            ]),
        ),
    ])
}
