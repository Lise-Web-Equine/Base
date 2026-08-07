import type {StructureBuilder, ListItemBuilder} from 'sanity/structure'
import {DocumentTextIcon} from '@sanity/icons'

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
 * Éléments de structure ajoutés par le projet (rendus avant les réglages/thème).
 * Retourner un tableau vide si aucun.
 *
 * Exemple :
 *   export const projectStructureItems = (S: StructureBuilder): ListItemBuilder[] => [
 *     S.listItem().title('Accueil').child(
 *       S.document().schemaType('page').documentId('home'),
 *     ),
 *   ]
 */
export const projectStructureItems = (S: StructureBuilder): ListItemBuilder[] => [
  // Singleton des textes légaux (verrouillé, une seule instance).
  S.listItem()
    .title('Textes légaux')
    .child(S.document().schemaType('legalTexts').documentId('legalTexts'))
    .icon(DocumentTextIcon),
]
