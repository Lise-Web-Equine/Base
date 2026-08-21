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
import type { PageCTAProps, PageHeroProps, PageSectionProps } from "@nuxt/ui";

/** Type de contrôle affiché dans le formulaire du drawer. */
export type ControlType =
  | "text"
  | "textarea"
  | "boolean"
  | "select"
  | "icon"
  | "links"
  | "features"
  | "image"
  | "video"
  | "images"
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
 *  - `content` : contenu rendu via un SLOT (pas une prop du composant) — ex.
 *    la citation. Exclu de l'objet de props / du code généré.
 */
export type ControlTarget = "component" | "appearance" | "content";

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

/** Une fonctionnalité éditable (mappée sur `PageFeatureProps` de Nuxt UI). */
export interface PlaygroundFeature {
  title: string;
  description?: string;
  icon?: string;
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
        help: "Fond coloré du bloc CTA (bande ou colonne). Ignoré si une image de fond est renseignée (l'image prime).",
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
 * dans l'atelier.
 *
 * En-tête principal (heroSection) : construit sur <UPageHero>. On expose les
 * props documentées d'<UPageHero> (contenu + orientation) et, côté « Apparence »,
 * l'image de fond de l'enveloppe <SectionShell> (couleur/vidéo/carrousel étant
 * gérés par le contenu réel dans le Studio, hors de cet atelier de props).
 */
const projectSections: PlaygroundSection[] = [
  {
    id: "heroSection",
    label: "En-tête principal",
    component: "HeroSection",
    baseComponent: "UPageHero",
    docUrl: "https://ui.nuxt.com/docs/components/page-hero",
    controls: [
      ...([
        {
          key: "headline",
          label: "Sur-titre (headline)",
          type: "text",
          default: "Nouveau",
          tsType: "string",
          help: "Petit texte affiché au-dessus du titre.",
          placeholder: "Sur-titre…",
        },
        {
          key: "title",
          label: "Titre (title)",
          type: "text",
          default: "Un titre qui capte l'attention",
          tsType: "string",
          help: "Le titre principal de l'en-tête.",
          placeholder: "Titre…",
        },
        {
          key: "description",
          label: "Description (description)",
          type: "textarea",
          default:
            "Une phrase d'introduction claire qui présente votre offre et invite à passer à l'action.",
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
          help: "Verticale (centré) ou horizontale (illustration à côté du texte).",
          options: [
            { label: "Verticale (centré)", value: "vertical" },
            { label: "Horizontale (illustration)", value: "horizontal" },
          ],
        },
        {
          key: "reverse",
          label: "Inverser (reverse)",
          type: "boolean",
          default: false,
          tsType: "boolean",
          help: "Inverse l'ordre du slot par défaut (illustration à gauche/droite).",
          showIf: (v) => v.orientation === "horizontal",
        },
        {
          key: "links",
          label: "Boutons (links)",
          type: "links",
          default: [
            {
              label: "Commencer",
              to: "/contact",
              color: "primary",
              variant: "solid",
            },
            {
              label: "En savoir plus",
              to: "/",
              color: "neutral",
              variant: "subtle",
            },
          ] as PlaygroundLink[],
          tsType: "ButtonProps[]",
          help: "Liste de boutons (<UButton>) affichés sous la description.",
        },
      ] satisfies ComponentControl<PageHeroProps>[]),
      // --- Apparence : FOND, au choix comme dans le Studio Sanity
      // (couleur du thème / image / vidéo / carrousel).
      {
        key: "bgType",
        target: "appearance",
        label: "Type de fond",
        type: "select",
        default: "color",
        tsType: "'color' | 'image' | 'video' | 'carousel'",
        help: "Fond de l'en-tête : couleur, image, vidéo ou carrousel.",
        options: [
          { label: "Couleur", value: "color" },
          { label: "Image", value: "image" },
          { label: "Vidéo", value: "video" },
          { label: "Carrousel", value: "carousel" },
        ],
      },
      {
        key: "bgColor",
        target: "appearance",
        label: "Couleur de fond",
        type: "select",
        default: "surface",
        tsType: "string",
        help: "Couleur du thème utilisée comme fond.",
        showIf: (v) => (v.bgType ?? "color") === "color",
        options: [
          { label: "Accent", value: "accent" },
          { label: "Fond principal", value: "background" },
          { label: "Fond sombre", value: "surface" },
          { label: "Fond clair", value: "light" },
          { label: "Primaire", value: "primary" },
          { label: "Secondaire", value: "secondary" },
          { label: "Succès", value: "success" },
          { label: "Avertissement", value: "warning" },
          { label: "Erreur", value: "error" },
        ],
      },
      {
        key: "image",
        target: "appearance",
        label: "Image de fond",
        type: "image",
        default: "",
        tsType: "SanityImage",
        help: "Téléversée localement (non envoyée à Sanity).",
        showIf: (v) => v.bgType === "image",
      },
      {
        key: "video",
        target: "appearance",
        label: "Vidéo de fond",
        type: "video",
        default: "",
        tsType: "SanityFile",
        help: "Vidéo lue en boucle, sans son. Téléversée localement.",
        showIf: (v) => v.bgType === "video",
      },
      {
        key: "carousel",
        target: "appearance",
        label: "Images du carrousel",
        type: "images",
        default: [] as string[],
        tsType: "SanityImage[]",
        help: "Plusieurs images enchaînées en fondu. Téléversées localement.",
        showIf: (v) => v.bgType === "carousel",
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
        help: "Assombrit le média pour la lisibilité du texte.",
        showIf: (v) => ["image", "video", "carousel"].includes(v.bgType),
      },
      {
        key: "lightText",
        target: "appearance",
        label: "Texte clair",
        type: "boolean",
        default: true,
        tsType: "boolean",
        help: "Texte clair (sur fond sombre / média).",
      },
    ],
  },
  {
    id: "pageSection",
    label: "Section de page",
    component: "PageSection",
    baseComponent: "UPageSection",
    docUrl: "https://ui.nuxt.com/docs/components/page-section",
    controls: [
      ...([
        {
          key: "headline",
          label: "Sur-titre (headline)",
          type: "text",
          default: "Nos services",
          tsType: "string",
          help: "Petit texte affiché au-dessus du titre.",
          placeholder: "Sur-titre…",
        },
        {
          key: "title",
          label: "Titre (title)",
          type: "text",
          default: "Une section riche et modulable",
          tsType: "string",
          help: "Le titre principal de la section.",
          placeholder: "Titre…",
        },
        {
          key: "description",
          label: "Description (description)",
          type: "textarea",
          default:
            "Présentez votre contenu avec des fonctionnalités, une citation et des boutons d'action.",
          tsType: "string",
          help: "Le texte affiché sous le titre.",
          placeholder: "Description…",
        },
        {
          key: "orientation",
          label: "Disposition (orientation)",
          type: "select",
          default: "vertical",
          tsType: "'vertical' | 'horizontal'",
          help: "Bande (vertical) ou illustration en colonne (horizontal).",
          options: [
            { label: "Bande (vertical)", value: "vertical" },
            { label: "Illustration en colonne (horizontal)", value: "horizontal" },
          ],
        },
        {
          key: "reverse",
          label: "Inverser (reverse)",
          type: "boolean",
          default: false,
          tsType: "boolean",
          help: "Inverse l'ordre du slot par défaut (illustration à gauche/droite).",
          showIf: (v) => v.orientation === "horizontal",
        },
        {
          key: "features",
          label: "Fonctionnalités (features)",
          type: "features",
          default: [
            {
              title: "Rapide",
              description: "Des performances optimisées de bout en bout.",
              icon: "i-lucide-rocket",
            },
            {
              title: "Accessible",
              description: "Pensé pour tous les utilisateurs.",
              icon: "i-lucide-accessibility",
            },
          ] as PlaygroundFeature[],
          tsType: "PageFeatureProps[]",
          help: "Liste de fonctionnalités (<UPageFeature>) affichées sous la description.",
        },
        {
          key: "links",
          label: "Boutons (links)",
          type: "links",
          default: [
            {
              label: "Découvrir",
              to: "/contact",
              color: "primary",
              variant: "solid",
            },
          ] as PlaygroundLink[],
          tsType: "ButtonProps[]",
          help: "Liste de boutons (<UButton>) affichés sous la description.",
        },
      ] satisfies ComponentControl<PageSectionProps>[]),
      // --- Contenu rendu via un slot (pas une prop UPageSection).
      {
        key: "citation",
        target: "content",
        label: "Citation",
        type: "textarea",
        default: "« Un outil qui a transformé notre façon de travailler. »",
        tsType: "string",
        help: "Citation mise en avant sous la description (slot #body).",
        placeholder: "Citation…",
      },
      // --- Apparence : FOND au choix comme dans le Studio Sanity
      // (couleur du thème / image / vidéo / carrousel), identique à l'en-tête.
      {
        key: "bgType",
        target: "appearance",
        label: "Type de fond",
        type: "select",
        default: "color",
        tsType: "'color' | 'image' | 'video' | 'carousel'",
        help: "Fond de la section : couleur, image, vidéo ou carrousel.",
        options: [
          { label: "Couleur", value: "color" },
          { label: "Image", value: "image" },
          { label: "Vidéo", value: "video" },
          { label: "Carrousel", value: "carousel" },
        ],
      },
      {
        key: "bgColor",
        target: "appearance",
        label: "Couleur de fond",
        type: "select",
        default: "surface",
        tsType: "string",
        help: "Couleur du thème utilisée comme fond.",
        showIf: (v) => (v.bgType ?? "color") === "color",
        options: [
          { label: "Accent", value: "accent" },
          { label: "Fond principal", value: "background" },
          { label: "Fond sombre", value: "surface" },
          { label: "Fond clair", value: "light" },
          { label: "Primaire", value: "primary" },
          { label: "Secondaire", value: "secondary" },
          { label: "Succès", value: "success" },
          { label: "Avertissement", value: "warning" },
          { label: "Erreur", value: "error" },
        ],
      },
      {
        key: "image",
        target: "appearance",
        label: "Image de fond",
        type: "image",
        default: "",
        tsType: "SanityImage",
        help: "Téléversée localement (non envoyée à Sanity).",
        showIf: (v) => v.bgType === "image",
      },
      {
        key: "video",
        target: "appearance",
        label: "Vidéo de fond",
        type: "video",
        default: "",
        tsType: "SanityFile",
        help: "Vidéo lue en boucle, sans son. Téléversée localement.",
        showIf: (v) => v.bgType === "video",
      },
      {
        key: "carousel",
        target: "appearance",
        label: "Images du carrousel",
        type: "images",
        default: [] as string[],
        tsType: "SanityImage[]",
        help: "Plusieurs images enchaînées en fondu. Téléversées localement.",
        showIf: (v) => v.bgType === "carousel",
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
        help: "Assombrit le média pour la lisibilité du texte.",
        showIf: (v) => ["image", "video", "carousel"].includes(v.bgType),
      },
      {
        key: "lightText",
        target: "appearance",
        label: "Texte clair",
        type: "boolean",
        default: true,
        tsType: "boolean",
        help: "Texte clair (sur fond sombre / média).",
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

export const playgroundSections: PlaygroundSection[] = [
  ...coreSections,
  ...projectSections,
];
