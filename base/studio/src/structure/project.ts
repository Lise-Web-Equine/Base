import type {StructureBuilder, ListItemBuilder} from 'sanity/structure'
import {DocumentTextIcon, DocumentsIcon} from '@sanity/icons'

/**
 * Extensions de la structure du Studio propres au PROJET.
 *
 * SEUL fichier à modifier pour personnaliser l'arborescence du Studio d'un site
 * (singletons projet, regroupements custom, pages verrouillées...).
 */

/**
 * Types de documents gérés manuellement dans la structure (ex: singletons projet)
 * et donc à EXCLURE de la liste auto-générée des types de documents.
 */
export const projectExcludedTypes: string[] = ['legalTexts']

/**
 * Éléments de structure ajoutés par le projet dans le groupe « Contenu »
 * (rendus après la liste auto des types de documents).
 * Retourner un tableau vide si aucun.
 *
 * Exemple :
 *   export const projectContentItems = (S: StructureBuilder): ListItemBuilder[] => [
 *     S.listItem().title('Accueil').child(
 *       S.document().schemaType('page').documentId('home'),
 *     ),
 *   ]
 */
export const projectContentItems = (S: StructureBuilder): ListItemBuilder[] => [
  // Liste de toutes les pages du site (bouton "+ Page" pour en créer d'autres).
  S.listItem()
    .title('Pages')
    .icon(DocumentsIcon)
    .child(S.documentTypeList('page').title('Pages')),
]

/**
 * Éléments de structure ajoutés par le projet dans le groupe « Administration »
 * (rendus après les réglages/thème/redirections).
 * Réglages et singletons de configuration définis au lancement du site.
 * Retourner un tableau vide si aucun.
 */
export const projectAdminItems = (S: StructureBuilder): ListItemBuilder[] => [
  // Singleton des textes légaux (verrouillé, une seule instance).
  S.listItem()
    .title('Textes légaux')
    .child(S.document().schemaType('legalTexts').documentId('legalTexts'))
    .icon(DocumentTextIcon),
]
