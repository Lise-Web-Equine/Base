import {isObjectInputProps, type InputProps} from 'sanity'
import {Flex, Stack} from '@sanity/ui'
import {FormattingHelpButton} from './FormattingHelpButton'

/**
 * Override global du rendu des champs de formulaire (CŒUR).
 *
 * Deux rôles :
 *  1. Masque l'onglet « Tous les champs » (groupe `all-fields`) ajouté
 *     automatiquement par Sanity dès qu'un schéma définit des groupes.
 *  2. Au niveau RACINE d'un document (chemin vide), ajoute en haut du
 *     formulaire un bouton « Mise en forme » avec tooltip (rappel du balisage).
 */
export function StudioFormInput(props: InputProps) {
  if (isObjectInputProps(props) && props.groups?.[0]?.name === 'all-fields') {
    const groups = props.groups as {name: string}[]
    groups.shift()
  }

  const rendered = props.renderDefault(props)

  const isDocumentRoot = isObjectInputProps(props) && (props.path?.length ?? 0) === 0
  if (!isDocumentRoot) return rendered

  return (
    <Stack space={3}>
      {/* Aligné à gauche, sur la même largeur que le formulaire. */}
      <Flex justify="flex-start" style={{width: '100%'}}>
        <FormattingHelpButton />
      </Flex>
      {rendered}
    </Stack>
  )
}
