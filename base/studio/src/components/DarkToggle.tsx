import React, {Suspense, lazy} from 'react'
import type {BooleanInputProps} from 'sanity'

/**
 * Wrapper LÉGER d'un toggle « clair / sombre » (icône soleil/lune, sans texte)
 * pour un champ booléen. Indique si un fond est sombre (→ texte clair côté
 * frontend). N'affecte QUE son propre champ ; les champs couleur restent natifs.
 *
 * N'importe QUE React (type `sanity` effacé au build) ; l'implémentation
 * (qui importe `@sanity/ui`) est chargée en `React.lazy` afin de ne pas casser
 * la génération de types du frontend. Même pattern que FontInput.
 */
const DarkToggleImpl = lazy(() => import('./DarkToggleImpl'))

export function DarkToggle(props: BooleanInputProps) {
  return (
    <Suspense fallback={null}>
      <DarkToggleImpl {...props} />
    </Suspense>
  )
}
