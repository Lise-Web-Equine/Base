import React from 'react'
import type {ObjectInputProps} from 'sanity'
import {styled} from 'styled-components'

/**
 * Rendu « compact » du formulaire d'une section du Page Builder (CŒUR).
 *
 * Branché comme `components.input` par `defineSection()`, il n'affecte donc que
 * les sections (pas le reste du Studio). Réduit l'écart vertical entre les
 * champs pour un formulaire plus dense.
 *
 * On scope le style au wrapper via styled-components : aucun import de CSS, donc
 * sans impact sur la génération de types (contrairement à `@sanity/ui`).
 */
const CompactWrapper = styled.div`
  /* Écart vertical entre les champs de la section (défaut Sanity ≈ 1.25rem) */
  [data-ui='Grid'],
  [data-ui='Stack'] {
    row-gap: 0.625rem;
  }
`

export function CompactSectionInput(props: ObjectInputProps) {
  return <CompactWrapper>{props.renderDefault(props)}</CompactWrapper>
}
