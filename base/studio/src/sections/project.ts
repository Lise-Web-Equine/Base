import type {SchemaTypeDefinition} from 'sanity'
import {bannerSection} from '../schemaTypes/objects/bannerSection'
import {heroSection} from '../schemaTypes/objects/heroSection'
import {pageSection} from '../schemaTypes/objects/pageSection'
import {referencesSection} from '../schemaTypes/objects/referencesSection'

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
export const projectSections: SchemaTypeDefinition[] = [
  bannerSection,
  heroSection,
  pageSection,
  referencesSection,
]
