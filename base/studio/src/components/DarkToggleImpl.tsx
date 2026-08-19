import React from 'react'
import {set, type BooleanInputProps} from 'sanity'
import {Button} from '@sanity/ui'

/**
 * Implémentation du toggle « clair / sombre » (voir DarkToggle.tsx). Bouton
 * icône seule (sans texte) à deux états :
 *  - soleil = fond clair (texte foncé) ;
 *  - lune   = fond sombre (texte clair).
 * N'affecte QUE ce champ booléen ; le sélecteur de couleur associé reste natif.
 */
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </svg>
)

export default function DarkToggleImpl(props: BooleanInputProps) {
  const {value, onChange} = props
  const dark = value === true

  return (
    <Button
      mode="ghost"
      padding={2}
      tone={dark ? 'primary' : 'default'}
      icon={dark ? MoonIcon : SunIcon}
      onClick={() => onChange(set(!dark))}
      title={
        dark
          ? 'Fond sombre (texte clair) — cliquez pour repasser en clair'
          : 'Fond clair (texte foncé) — cliquez pour marquer sombre'
      }
    />
  )
}
