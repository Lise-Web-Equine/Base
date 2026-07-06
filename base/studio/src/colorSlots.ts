/**
 * Source unique de vérité des couleurs du thème.
 *
 * Ce tableau est consommé à la fois par :
 *  - le singleton `themeSettings` (génération des champs couleur), et
 *  - les schémas qui proposent un choix de couleur du thème (ex: section
 *    `callToAction`, fond de section), via `colorSlotOptions()`.
 *
 * Ajouter / retirer une couleur ici la propage automatiquement au thème ET à
 * toutes les listes de choix de couleur. Le `name` sert d'identifiant stable et
 * correspond à une variable CSS côté frontend (ex: `primary` -> `--color-primary`,
 * `background` -> `--color-background`). Utiliser des noms d'un seul mot en
 * minuscules pour que l'utilitaire Tailwind reste propre (ex: `bg-background`).
 */
export interface ColorSlot {
  name: string
  title: string
  description: string
  initialValue: string
}

export const COLOR_SLOTS: ColorSlot[] = [
  {
    name: 'primary',
    title: 'Couleur Principale',
    description: 'Couleur principale de la marque (boutons, liens, accents).',
    initialValue: '#ef4434',
  },
  {
    name: 'secondary',
    title: 'Couleur Secondaire',
    description: 'Couleur secondaire / complémentaire de la marque.',
    initialValue: '#206ee9',
  },
  {
    name: 'accent',
    title: "Couleur d'Accent",
    description: "Couleur d'accent pour mettre en avant certains éléments.",
    initialValue: '#8f57ef',
  },
  {
    name: 'background',
    title: 'Fond Principal',
    description: 'Couleur de fond principale des pages.',
    initialValue: '#ffffff',
  },
  {
    name: 'surface',
    title: 'Fond de Surface',
    description: 'Couleur de fond des surfaces (cartes, sections).',
    initialValue: '#f6f6f8',
  },
  {
    name: 'foreground',
    title: 'Texte Principal',
    description: 'Couleur du texte principal.',
    initialValue: '#0d0e12',
  },
  {
    name: 'muted',
    title: 'Texte Secondaire',
    description: 'Couleur du texte secondaire / atténué.',
    initialValue: '#727892',
  },
  {
    name: 'border',
    title: 'Bordures et Séparateurs',
    description: 'Couleur des bordures et séparateurs.',
    initialValue: '#e3e4e8',
  },
]

/**
 * Renvoie les options `{title, value}` pour un champ `string` à liste, où la
 * valeur stockée est le `name` du slot (identifiant stable / variable CSS).
 */
export function colorSlotOptions() {
  return COLOR_SLOTS.map((slot) => ({title: slot.title, value: slot.name}))
}
