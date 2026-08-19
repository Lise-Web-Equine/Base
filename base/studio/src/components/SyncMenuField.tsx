import React, {Suspense, lazy} from 'react'
import type {ArrayFieldProps} from 'sanity'

/**
 * Wrapper LÉGER du champ « Menu principal » : ajoute un bouton « Synchroniser »
 * à côté du titre pour pré-remplir le menu avec l'accueil + les pages du site.
 *
 * N'importe QUE React (le type `sanity` est effacé au build). L'implémentation
 * réelle — qui importe `@sanity/ui` (et son CSS) — est chargée paresseusement
 * via `React.lazy`, afin de ne pas casser la génération de types du frontend
 * (@nuxtjs/sanity). Même pattern que FontInput / CategorySelectInput.
 */
const SyncMenuFieldImpl = lazy(() => import('./SyncMenuFieldImpl'))

export function SyncMenuField(props: ArrayFieldProps) {
  return (
    <Suspense fallback={props.children}>
      <SyncMenuFieldImpl {...props} />
    </Suspense>
  )
}
