/**
 * Registre des sections du Page Builder (frontend).
 *
 * Associe le `_type` Sanity d'une section au nom de son composant Vue.
 * Les composants sont auto-importés par Nuxt (dossier `components/`), on ne
 * référence donc ici que leur NOM (résolu via `resolveComponent`).
 */

/**
 * CŒUR (Core) : sections génériques communes à tous les projets.
 * Ne pas modifier pour un client — utiliser `projectSections`.
 */
const coreSections: Record<string, string> = {
  callToAction: "CallToAction",
  infoSection: "InfoSection",
  contactSection: "ContactSection",
  contactDetails: "ContactDetails",
  faqSection: "FaqSection",
};

/**
 * PROJET : sections propres au site client.
 * SEUL bloc à modifier pour brancher une nouvelle section.
 *
 * Exemple : harasGallery: "HarasGallery"
 */
const projectSections: Record<string, string> = {};

/**
 * Registre complet consommé par `PageBuilder.vue`.
 */
export const sectionRegistry: Record<string, string> = {
  ...coreSections,
  ...projectSections,
};
