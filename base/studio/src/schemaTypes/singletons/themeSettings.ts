import {ColorWheelIcon} from '@sanity/icons'
import {defineField, defineType} from '@sanity/types'
import {COLOR_SLOTS} from '../../colorSlots'
import {FontInput} from '../../components/FontInput'
import {DarkToggle} from '../../components/DarkToggle'
import {BareField} from '../../components/BareField'

/**
 * Theme Settings schema Singleton.  Stores the global color theme that is applied
 * across the whole frontend via dynamic CSS variables (e.g. --color-primary).
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 *
 * Les champs couleur sont générés à partir de `COLOR_SLOTS` (source unique de
 * vérité partagée avec les schémas qui proposent un choix de couleur du thème).
 */

const colorField = (name: string, title: string, description: string, initialValue: string) =>
  defineField({
    name,
    title,
    type: 'simplerColor',
    description,
    initialValue: {_type: 'simplerColor', value: initialValue},
    group: 'colors',
    validation: (rule) => rule.required(),
  })

// Couleur OPTIONNELLE : si laissée vide, le frontend retombe sur la couleur de
// fond (--color-background). Utilisée pour les fonds d'en-tête / pied de page.
const optionalColorField = (name: string, title: string, description: string) =>
  defineField({
    name,
    title,
    type: 'simplerColor',
    description,
    group: 'colors',
  })

// Toggle « clair / sombre » (icône soleil/lune, sans texte) associé à une
// couleur de fond, rendu JUSTE SOUS le champ couleur. `BareField` masque le
// titre/description du champ → seul le bouton s'affiche. NE touche PAS au
// sélecteur de couleur, qui reste 100 % natif. Sa valeur est lue par le frontend.
const darkToggleField = (name: string, initialValue = false) =>
  defineField({
    name,
    title: 'Aspect (clair / sombre)',
    type: 'boolean',
    initialValue,
    group: 'colors',
    components: {field: BareField, input: DarkToggle},
  })

const fontField = (name: string, description: string, fieldset: string) =>
  defineField({
    name,
    title: 'Police',
    type: 'string',
    description,
    group: 'typography',
    fieldset,
    // Input personnalisé : recherche Google Fonts + aperçu (voir FontInput).
    components: {input: FontInput},
    initialValue: '"Inter", sans-serif',
    validation: (rule) => rule.required(),
  })

// Échelle d'épaisseurs (graisse) commune, de l'ultra-léger à l'extra-gras.
const WEIGHT_OPTIONS = [
  {title: 'Ultra-léger', value: '100'},
  {title: 'Léger', value: '300'},
  {title: 'Normal', value: '400'},
  {title: 'Medium', value: '500'},
  {title: 'Semi-gras', value: '600'},
  {title: 'Gras', value: '700'},
  {title: 'Extra-gras', value: '800'},
]

// Casse (text-transform) : rendu normal, tout en majuscules ou tout en minuscules.
const CASE_OPTIONS = [
  {title: 'Normale', value: 'none'},
  {title: 'Majuscules', value: 'uppercase'},
  {title: 'Minuscules', value: 'lowercase'},
]

const weightField = (name: string, fieldset: string, initialValue: string) =>
  defineField({
    name,
    title: 'Épaisseur',
    type: 'string',
    group: 'typography',
    fieldset,
    options: {list: WEIGHT_OPTIONS, layout: 'dropdown'},
    initialValue,
    validation: (rule) => rule.required(),
  })

const caseField = (name: string, fieldset: string, initialValue: string) =>
  defineField({
    name,
    title: 'Style',
    type: 'string',
    group: 'typography',
    fieldset,
    options: {list: CASE_OPTIONS, layout: 'dropdown'},
    initialValue,
    validation: (rule) => rule.required(),
  })

/**
 * Réglages de mise en forme : leviers globaux qui pilotent les styles atomiques
 * (échelle des titres, arrondi, largeur de lecture, densité). Injectés en
 * variables CSS `--theme-*` par `useTheme()` et consommés par `main.css`.
 */
const layoutField = (
  name: string,
  title: string,
  description: string,
  list: {title: string; value: string}[],
  initialValue: string,
) =>
  defineField({
    name,
    title,
    type: 'string',
    description,
    group: 'layout',
    options: {list, layout: 'dropdown'},
    initialValue,
    validation: (rule) => rule.required(),
  })

export const themeSettings = defineType({
  name: 'themeSettings',
  title: 'Thème',
  type: 'document',
  icon: ColorWheelIcon,
  groups: [
    {name: 'colors', title: 'Couleurs', default: true},
    {name: 'typography', title: 'Typographie'},
    {name: 'layout', title: 'Mise en forme'},
  ],
  // Regroupement visuel de la typographie : chaque famille (Titres, Texte,
  // Accent, En-tête) réunit Police → Épaisseur → Style.
  fieldsets: [
    {name: 'titres', title: 'Titres'},
    {name: 'texte', title: 'Texte'},
    {name: 'accent', title: 'Accent'},
    {name: 'headline', title: 'En-tête'},
  ],
  fields: [
    // Couleurs du thème (sélecteurs natifs). « Fond principal » (background) et
    // « Fond sombre » (surface) sont suivis d'un toggle clair/sombre (icône).
    ...COLOR_SLOTS.flatMap((slot) => {
      const field = colorField(slot.name, slot.title, slot.description, slot.initialValue)
      if (slot.name === 'background') return [field, darkToggleField('backgroundDark')]
      if (slot.name === 'surface') return [field, darkToggleField('surfaceDark', true)]
      return [field]
    }),

    // Fonds d'en-tête et de pied de page (optionnels → couleur de fond si vide),
    // chacun suivi de son toggle clair/sombre (icône).
    optionalColorField(
      'headerColor',
      "Couleur de l'en-tête",
      'Fond de la barre de navigation. Si vide, la couleur de fond du site est utilisée.',
    ),
    darkToggleField('headerColorDark'),
    optionalColorField(
      'footerColor',
      'Couleur du pied de page',
      'Fond du pied de page. Si vide, la couleur de fond du site est utilisée.',
    ),
    darkToggleField('footerColorDark'),

    // --- Titres ---
    fontField('fontDisplay', 'Famille de police utilisée pour les titres.', 'titres'),
    weightField('headingWeight', 'titres', '700'),
    caseField('displayCase', 'titres', 'none'),

    // --- Texte ---
    fontField('fontBody', 'Famille de police utilisée pour le texte courant.', 'texte'),

    // --- Accent ---
    fontField('fontAccent', "Famille de police utilisée pour les éléments d'accent.", 'accent'),
    weightField('accentWeight', 'accent', '600'),
    caseField('accentCase', 'accent', 'uppercase'),

    // --- En-tête ---
    fontField(
      'fontHeadline',
      'Famille de police utilisée pour les en-têtes (sur-titres) de section.',
      'headline',
    ),
    weightField('headlineWeight', 'headline', '600'),
    caseField('headlineCase', 'headline', 'none'),

    layoutField(
      'typeScale',
      'Échelle typographique',
      'Rapport qui pilote les tailles des titres (Titre 2, 3, 4).',
      [
        {title: 'Compacte', value: '1.15'},
        {title: 'Standard', value: '1.2'},
        {title: 'Ample', value: '1.25'},
        {title: 'Spacieuse', value: '1.333'},
      ],
      '1.2',
    ),
    layoutField(
      'radius',
      'Arrondi',
      'Rondeur globale des éléments (boutons, cartes, images).',
      [
        {title: 'Aucun', value: '0px'},
        {title: 'Léger', value: '0.375rem'},
        {title: 'Moyen', value: '0.75rem'},
        {title: 'Prononcé', value: '1.25rem'},
      ],
      '0.75rem',
    ),
    layoutField(
      'contentWidth',
      'Largeur de lecture',
      'Largeur maximale des blocs de texte (confort de lecture).',
      [
        {title: 'Étroit', value: '60ch'},
        {title: 'Standard', value: '72ch'},
        {title: 'Large', value: '88ch'},
      ],
      '72ch',
    ),
    layoutField(
      'density',
      'Densité verticale',
      'Rythme / espacement vertical des sections.',
      [
        {title: 'Compacte', value: '0.75'},
        {title: 'Normale', value: '1'},
        {title: 'Aérée', value: '1.35'},
      ],
      '1',
    ),
    layoutField(
      'siteMaxWidth',
      'Largeur du site',
      'Largeur maximale du contenu. Les fonds restent pleine largeur ; seul le contenu est contraint.',
      [
        {title: 'Compact (1120px)', value: '1120px'},
        {title: 'Standard (1280px)', value: '1280px'},
        {title: 'Large (1440px)', value: '1440px'},
        {title: 'Pleine largeur', value: '100%'},
      ],
      '1280px',
    ),
  ],
  preview: {
    select: {primary: 'primary'},
    prepare({primary}) {
      return {
        title: 'Thème',
        subtitle: primary ? `Couleur principale : ${primary}` : undefined,
      }
    },
  },
})
