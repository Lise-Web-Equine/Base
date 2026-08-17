import {callToAction} from '../schemaTypes/objects/callToAction'
import {infoSection} from '../schemaTypes/objects/infoSection'
import {contactSection} from '../schemaTypes/objects/contactSection'
import {faqSection} from '../schemaTypes/objects/faqSection'
import {gallery} from '../schemaTypes/objects/gallery'
import {projectSections} from './project'

/**
 * Registre des sections du Page Builder.
 *
 * CŒUR (Core) : sections génériques communes à tous les projets.
 * Ne pas modifier ici pour un client — utiliser `project.ts`.
 */
const coreSections = [callToAction, infoSection, contactSection, faqSection, gallery]

/**
 * Toutes les sections disponibles dans le Page Builder
 * (cœur + sections propres au projet).
 */
export const pageBuilderSections = [...coreSections, ...projectSections]

/**
 * Noms de type des sections, consommés par le champ `pageBuilder` de `page`.
 */
export const pageBuilderTypeNames = pageBuilderSections.map((s) => s.name)
