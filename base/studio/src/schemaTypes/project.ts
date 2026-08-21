import type {SchemaTypeDefinition} from 'sanity'
import {legalTexts} from './singletons/legalTexts'
import {reference} from './documents/reference'

/**
 * Types de schéma propres au PROJET client (documents et objets NON-sections).
 *
 * SEUL fichier à modifier pour ajouter un type spécifique à un site
 * (ex: collection `service`, `haras`, un objet réutilisable propre au projet).
 *
 * Pour une SECTION du Page Builder, utiliser plutôt `src/sections/project.ts`.
 *
 * Exemple :
 *   import {service} from './documents/service'
 *   export const projectSchemaTypes: SchemaTypeDefinition[] = [service]
 */
export const projectSchemaTypes: SchemaTypeDefinition[] = [legalTexts, reference]
