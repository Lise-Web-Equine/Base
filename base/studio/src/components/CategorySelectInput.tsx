import React, {Suspense, lazy} from 'react'
import type {StringInputProps} from 'sanity'

/**
 * Wrapper LÉGER du champ « Catégorie » d'un article.
 *
 * Il n'importe QUE React (import `sanity` uniquement en type, effacé au build).
 * L'implémentation réelle — qui importe `@sanity/ui` (et donc du CSS) — est
 * chargée paresseusement via `React.lazy`, afin de ne pas casser la génération
 * de types du frontend (@nuxtjs/sanity), qui ne sait pas charger les CSS de
 * `@sanity/ui`. Même pattern que FontInput.
 */
const CategorySelectInputImpl = lazy(() => import('./CategorySelectInputImpl'))

export function CategorySelectInput(props: StringInputProps) {
  return (
    <Suspense fallback={null}>
      <CategorySelectInputImpl {...props} />
    </Suspense>
  )
}
