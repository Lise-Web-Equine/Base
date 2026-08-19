/**
 * Configuration des pages légales (CŒUR).
 *
 * Le singleton `legalTexts` (PROJET) contient 4 textes (mentions légales,
 * confidentialité, CGV/CGU, cookies). Ce fichier fait le pont entre chaque texte
 * et sa route publique + les champs Sanity correspondants. Utilisé par :
 *  - le composant `LegalPage.vue` (rendu d'une page),
 *  - le composable `useLegalLinks` (liens du pied de page),
 *  - les 4 fichiers de route sous `pages/`.
 */
export type LegalType = "legalNotice" | "privacy" | "terms" | "cookies";

export interface LegalPageConfig {
  /** Type (clé des champs dans le singleton legalTexts). */
  type: LegalType;
  /** Segment d'URL (route publique, sans « / »). */
  slug: string;
  /** Libellé par défaut si le titre Sanity est vide. */
  defaultLabel: string;
  /** Champs Sanity : titre, introduction (optionnelle), contenu Portable Text. */
  fields: {title: string; intro: string | null; content: string};
}

export const LEGAL_PAGES: LegalPageConfig[] = [
  {
    type: "legalNotice",
    slug: "mentions-legales",
    defaultLabel: "Mentions légales",
    fields: {title: "legalNoticeTitle", intro: "legalNoticeIntro", content: "legalNoticeContent"},
  },
  {
    type: "privacy",
    slug: "politique-confidentialite",
    defaultLabel: "Politique de confidentialité",
    fields: {title: "privacyTitle", intro: "privacyIntro", content: "privacyContent"},
  },
  {
    type: "terms",
    slug: "conditions-generales",
    defaultLabel: "Conditions générales",
    fields: {title: "termsTitle", intro: "termsIntro", content: "termsContent"},
  },
  {
    type: "cookies",
    slug: "politique-cookies",
    defaultLabel: "Politique de cookies",
    fields: {title: "cookiesTitle", intro: null, content: "cookiesContent"},
  },
];

export const legalPageByType = (type: LegalType) =>
  LEGAL_PAGES.find((p) => p.type === type)!;
