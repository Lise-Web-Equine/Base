import React, {useEffect, useState} from 'react'
import {set, unset, useClient, type StringInputProps} from 'sanity'
import {Select, Stack, Text} from '@sanity/ui'

/**
 * Implémentation du champ « Catégorie » (voir CategorySelectInput.tsx pour le
 * wrapper). Importe `@sanity/ui` → chargé UNIQUEMENT via `React.lazy`.
 *
 * Les options proposées sont les catégories définies dans le singleton
 * « Réglages du site » → Blog / Actualités (champ `blog.categories`). La valeur
 * stockée est la chaîne de la catégorie choisie.
 */
export default function CategorySelectInputImpl(props: StringInputProps) {
  const {value, onChange, elementProps} = props
  const client = useClient({apiVersion: '2025-10-20'})
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    client
      .fetch<string[] | null>(`*[_type == "settings"][0].blog.categories`)
      .then((list) => {
        if (!active) return
        setCategories(Array.isArray(list) ? list.filter(Boolean) : [])
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [client])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.currentTarget.value
    onChange(next ? set(next) : unset())
  }

  if (!loading && categories.length === 0) {
    return (
      <Stack space={2}>
        <Text size={1} muted>
          Aucune catégorie définie. Ajoutez-en dans « Réglages du site » → Blog / Actualités.
        </Text>
      </Stack>
    )
  }

  return (
    <Select {...elementProps} value={value || ''} onChange={handleChange}>
      <option value="">—</option>
      {value && !categories.includes(value) ? (
        <option value={value}>{value} (obsolète)</option>
      ) : null}
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </Select>
  )
}
