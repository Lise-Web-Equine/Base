import React, {Suspense, lazy} from 'react'
import type {StringInputProps} from 'sanity'

/**
 * Wrapper LÉGER du champ de choix de police.
 *
 * Il n'importe QUE React (import `sanity` uniquement en type, effacé au build).
 * L'implémentation réelle — qui importe `@sanity/ui` (et donc du CSS) — est
 * chargée paresseusement via `React.lazy`. Ainsi elle n'est jamais évaluée
 * pendant la génération de types du frontend (@nuxtjs/sanity), qui ne sait pas
 * charger les fichiers `.css` importés par `@sanity/ui`.
 */
const FontInputImpl = lazy(() => import('./FontInputImpl'))

export function FontInput(props: StringInputProps) {
  return (
    <Suspense fallback={null}>
      <FontInputImpl {...props} />
    </Suspense>
  )
}
