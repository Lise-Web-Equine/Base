import type {SchemaTypeDefinition} from 'sanity'

/**
 * Sections propres au PROJET client.
 *
 * SEUL fichier à modifier pour ajouter une section spécifique à un site.
 * Ne jamais toucher au cœur (`index.ts`, `page.ts`, `schemaTypes/index.ts`).
 *
 * Exemple :
 *   import {harasGallery} from '../schemaTypes/objects/harasGallery'
 *   export const projectSections: SchemaTypeDefinition[] = [harasGallery]
 */
export const projectSections: SchemaTypeDefinition[] = []
