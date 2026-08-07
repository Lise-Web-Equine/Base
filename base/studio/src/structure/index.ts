import {CogIcon, ColorWheelIcon, HomeIcon, MenuIcon, TransferIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import pluralize from 'pluralize-esm'
import {projectExcludedTypes, projectStructureItems} from './project'

/**
 * Structure du Studio : point de composition CŒUR + PROJET.
 * Pour personnaliser l'arborescence d'un site, éditer `project.ts`.
 * Doc : https://www.sanity.io/docs/structure-builder-introduction
 */

// Singletons et types techniques du cœur, gérés à part (exclus de la liste auto).
const CORE_EXCLUDED_TYPES = [
  'settings',
  'themeSettings',
  'homePage',
  'navigation',
  'redirects',
  'assist.instruction.context',
]

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Contenu du site')
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
      // Éléments de structure propres au projet (singletons, regroupements custom).
      ...projectStructureItems(S),
      S.divider(),
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
    ])
