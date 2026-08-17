import type {FieldProps} from 'sanity'

/**
 * Champ « nu » : rend l'entrée du champ SANS son en-tête (titre + description).
 *
 * Utilisé pour le champ `appearance` des sections : son titre ferait doublon
 * avec l'onglet « Apparence » et s'afficherait comme un intitulé superflu
 * au-dessus de « Image de fond ».
 *
 * N'importe que le type `FieldProps` (effacé au build) : aucune dépendance
 * runtime, donc sans impact sur la génération de types du frontend.
 */
export function BareField(props: FieldProps) {
  return props.children
}
