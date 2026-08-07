import {
  CogIcon,
  ColorWheelIcon,
  ControlsIcon,
  DocumentsIcon,
  HomeIcon,
  MenuIcon,
  TransferIcon,
} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'
import {projectExcludedTypes, projectContentItems, projectAdminItems} from './project'

/**
 * Structure du Studio : point de composition CŒUR + PROJET.
 * Pour personnaliser l'arborescence d'un site, éditer `project.ts`.
 * Doc : https://www.sanity.io/docs/structure-builder-introduction
 */

// Singletons et types techniques du cœur, gérés à part (exclus de la liste auto).
// Note : page / post / person sont volontairement exclus ; ils sont ajoutés au
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
  'person',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
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
