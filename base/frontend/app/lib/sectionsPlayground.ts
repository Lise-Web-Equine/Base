/**
 * Configuration de l'atelier « Apparence des sections » (OUTIL DEV, local).
 *
 * Utilisé UNIQUEMENT par la page `pages/sections-apparence.vue` (bloquée hors
 * développement). Décrit, pour chaque section du Page Builder, les props du
 * composant Nuxt UI sous-jacent (celles visibles dans la documentation) que
 * l'on souhaite pouvoir régler en direct pour prévisualiser le rendu.
 *
 * Ce fichier ne fait PAS partie du moteur de sections (aucun impact runtime
 * sur le site) : c'est un catalogue de terrain de jeu.
 *
 * Les clés des contrôles « props du composant » sont typées contre les types
 * réels de Nuxt UI (ex. `PageCTAProps`, ré-exporté par `@nuxt/ui`) via
 * `satisfies ComponentControl<PageCTAProps>[]` : si une prop est renommée/
 * supprimée en amont, on a une erreur de compilation ici (pas de dérive
 * silencieuse). Les métadonnées
 * (widget, libellé, défaut, aide) restent, elles, écrites à la main : elles
 * n'existent pas dans les types (effacés à l'exécution).
 */
import type { PageCTAProps } from "@nuxt/ui";

/** Type de contrôle affiché dans le formulaire du drawer. */
export type ControlType =
  | "text"
  | "textarea"
  | "boolean"
  | "select"
  | "icon"
  | "links"
  | "image"
  | "range";

export interface ControlOption {
  label: string;
  value: string;
}

/**
 * Cible d'un contrôle :
 *  - `component` : prop du composant Nuxt UI (transmise en attribut, présente
 *    dans l'objet de props éditable).
 *  - `appearance` : réglage de l'enveloppe <SectionShell> (prop `appearance`),
 *    hors de l'objet de props du composant.
 */
export type ControlTarget = "component" | "appearance";

/** Définition d'une prop réglable (1 contrôle de formulaire). */
export interface PropControl {
  /** Nom exact de la prop Nuxt UI (utilisé tel quel dans le code généré). */
  key: string;
  /** Cible du contrôle (défaut : `component`). */
  target?: ControlTarget;
  /** Libellé français affiché dans le formulaire. */
  label: string;
  type: ControlType;
  /** Valeur par défaut (sert aussi de valeur initiale de l'aperçu). */
  default: unknown;
  /** Type TS affiché à titre indicatif (colonne doc). */
  tsType?: string;
  /** Aide reprise de la documentation Nuxt UI. */
  help?: string;
  /** Options pour un contrôle `select`. */
  options?: ControlOption[];
  placeholder?: string;
  /** Bornes d'un contrôle `range`. */
  min?: number;
  max?: number;
  step?: number;
  /**
   * Affichage conditionnel : le contrôle n'apparaît (et n'est pris en compte)
   * que si ce prédicat renvoie `true`. Reçoit les valeurs de la section.
   * (Imite les champs conditionnels du Studio Sanity.)
   */
  showIf?: (values: Record<string, any>) => boolean;
}

/**
 * Contrôle dont la `key` est GARANTIE (à la compilation) être une prop du
 * composant Nuxt UI `T`. On l'utilise via `satisfies ComponentControl<T>[]`
 * sur les contrôles `target:"component"` : si une prop est renommée/supprimée
 * en amont, la compilation échoue (pas de dérive silencieuse).
 */
export type ComponentControl<T> = Omit<PropControl, "key" | "target"> & {
  key: Extract<keyof T, string>;
  target?: "component";
};

/** Un lien éditable (mappé sur `ButtonProps` de Nuxt UI). */
export interface PlaygroundLink {
  label: string;
  to?: string;
  color?: string;
  variant?: string;
}

export interface PlaygroundSection {
  /** Identifiant stable (clé de sélection). */
  id: string;
  /** Libellé affiché dans la colonne de gauche. */
  label: string;
  /** Nom du composant section (auto-importé) — ici à titre documentaire. */
  component: string;
  /** Composant Nuxt UI sur lequel la section est construite. */
  baseComponent: string;
  /** Lien vers la doc Nuxt UI du composant de base. */
  docUrl: string;
  /** Props réglables (props documentées du composant de base). */
  controls: PropControl[];
}

const COLOR_OPTIONS: ControlOption[] = [
  { label: "Primaire", value: "primary" },
  { label: "Secondaire", value: "secondary" },
  { label: "Neutre", value: "neutral" },
];

const VARIANT_OPTIONS: ControlOption[] = [
  { label: "Solid", value: "solid" },
  { label: "Outline", value: "outline" },
  { label: "Subtle", value: "subtle" },
  { label: "Soft", value: "soft" },
];

export { COLOR_OPTIONS, VARIANT_OPTIONS };

/**
 * CŒUR : sections génériques. Le composant CallToAction est construit sur
 * <SectionShell> → <UPageCTA> : on expose donc les props documentées de
 * <UPageCTA>.
 */
const coreSections: PlaygroundSection[] = [
  {
    id: "callToAction",
    label: "Appel à l'action",
    component: "CallToAction",
    baseComponent: "UPageCTA",
    docUrl: "https://ui.nuxt.com/docs/components/page-cta",
    controls: [
      // Props du composant UPageCTA — clés vérifiées contre `PageCTAProps`
      // (`satisfies` : erreur de compilation si une clé n'existe plus).
      ...([
      {
        key: "title",
        label: "Titre (title)",
        type: "text",
        default: "Prêt à démarrer votre projet ?",
        tsType: "string",
        help: "Le titre principal de la section.",
        placeholder: "Titre…",
      },
      {
        key: "description",
        label: "Description (description)",
        type: "textarea",
        default:
          "Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un accompagnement sur mesure.",
        tsType: "string",
        help: "Le texte affiché sous le titre.",
        placeholder: "Description…",
      },
      {
        key: "orientation",
        label: "Orientation (orientation)",
        type: "select",
        default: "vertical",
        tsType: "'vertical' | 'horizontal'",
        help: "Oriente la section avec le slot par défaut. Par défaut : vertical.",
        options: [
          { label: "Verticale (bande)", value: "vertical" },
          { label: "Horizontale (colonne)", value: "horizontal" },
        ],
      },
      {
        key: "reverse",
        label: "Inverser (reverse)",
        type: "boolean",
        default: false,
        tsType: "boolean",
        help: "Inverse l'ordre du slot par défaut (illustration à droite/gauche).",
      },
      {
        key: "links",
        label: "Boutons (links)",
        type: "links",
        default: [
          {
            label: "Nous contacter",
            to: "/contact",
            color: "primary",
            variant: "solid",
          },
        ] as PlaygroundLink[],
        tsType: "ButtonProps[]",
        help: "Liste de boutons (<UButton>) affichés sous la description.",
      },
      {
        key: "variant",
        label: "Variante (variant)",
        type: "select",
        default: "naked",
        tsType: "'outline' | 'solid' | 'soft' | 'subtle' | 'naked'",
        help: "Fond coloré du bloc CTA (colonne uniquement). En bande (vertical), le seul fond possible est une image. Ignoré si une image de fond est renseignée (l'image prime).",
        // En « bande » (vertical), pas de fond coloré : seule une image est
        // proposée. Le variant n'est donc dispo qu'en « colonne » (horizontal).
        showIf: (v) => v.orientation === "horizontal",
        options: [
          { label: "Naked (transparent)", value: "naked" },
          { label: "Outline", value: "outline" },
          { label: "Solid", value: "solid" },
          { label: "Soft", value: "soft" },
          { label: "Subtle", value: "subtle" },
        ],
      },
      ] satisfies ComponentControl<PageCTAProps>[]),
      // --- Apparence (enveloppe SectionShell + override d'image de fond).
      // UPageCTA n'a pas de fond « image » : on l'ajoute ici. Si une image est
      // renseignée, elle OVERRIDE le variant (fond image + variant forcé naked).
      {
        key: "image",
        target: "appearance",
        label: "Image de fond (override du variant)",
        type: "image",
        default: "",
        tsType: "SanityImage",
        help: "Si renseignée, l'image de fond remplace le variant. Téléversée localement (non envoyée à Sanity).",
      },
      {
        key: "overlayOpacity",
        target: "appearance",
        label: "Voile (opacité %)",
        type: "range",
        default: 40,
        min: 0,
        max: 100,
        step: 5,
        tsType: "number",
        help: "Assombrit l'image pour la lisibilité du texte.",
        showIf: (v) => !!v.image,
      },
      {
        key: "lightText",
        target: "appearance",
        label: "Texte clair",
        type: "boolean",
        default: true,
        tsType: "boolean",
        help: "Force un texte clair par-dessus l'image.",
        showIf: (v) => !!v.image,
      },
      {
        key: "width",
        target: "appearance",
        label: "Largeur (width)",
        type: "select",
        default: "container",
        tsType: "'container' | 'full'",
        help: "Contenu contraint à la largeur du site, ou bande pleine largeur.",
        options: [
          { label: "Conteneur (contraint)", value: "container" },
          { label: "Pleine largeur", value: "full" },
        ],
      },
    ],
  },
];

/**
 * PROJET : ajouter ici les sections propres au site client pour les tester
 * dans l'atelier. (Aucune par défaut.)
 */
const projectSections: PlaygroundSection[] = [];

export const playgroundSections: PlaygroundSection[] = [
  ...coreSections,
  ...projectSections,
];
