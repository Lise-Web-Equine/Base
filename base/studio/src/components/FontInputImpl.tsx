import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {set, unset, type StringInputProps} from 'sanity'
import {Autocomplete, Card, Stack, Text, Box} from '@sanity/ui'
import {FONT_OPTIONS} from '../fonts'

/**
 * Implémentation du champ de choix de police (voir FontInput.tsx pour le wrapper).
 *
 * Ce fichier importe `@sanity/ui` (donc du CSS) : il est chargé UNIQUEMENT via
 * `React.lazy` par le wrapper, afin de ne PAS polluer le graphe de schéma utilisé
 * par la génération de types du frontend (@nuxtjs/sanity).
 *
 * - Recherche live sur l'API Google Fonts (SANITY_STUDIO_GOOGLE_FONTS_API_KEY ;
 *   repli sur la liste embarquée sinon).
 * - Aperçu de chaque police, chargée à la volée depuis le CDN Google (Studio
 *   interne : sans incidence RGPD, qui ne concerne que le site public).
 * - Valeur stockée = chaîne CSS (`"Nom", <générique>`) → frontend inchangé.
 */

type GFont = {family: string; category: string}

const FALLBACK: Record<string, string> = {
  'sans-serif': 'sans-serif',
  serif: 'serif',
  display: 'sans-serif',
  handwriting: 'cursive',
  monospace: 'monospace',
}

const RECOMMENDED: GFont[] = [
  {family: 'Inter', category: 'sans-serif'},
  {family: 'Montserrat', category: 'sans-serif'},
  {family: 'Playfair Display', category: 'serif'},
  {family: 'Lora', category: 'serif'},
]

// Liste Google Fonts chargée une seule fois par session (mémorisée au module).
let fontsPromise: Promise<GFont[]> | null = null
function loadGoogleFonts(): Promise<GFont[]> {
  if (fontsPromise) return fontsPromise
  const key = process.env.SANITY_STUDIO_GOOGLE_FONTS_API_KEY
  const embedded: GFont[] = FONT_OPTIONS.map((o) => ({
    family: o.title,
    category: 'sans-serif',
  }))
  if (!key) {
    fontsPromise = Promise.resolve(embedded)
    return fontsPromise
  }
  fontsPromise = fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${key}`,
  )
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
    .then((d: {items: GFont[]}) =>
      d.items.map((i) => ({family: i.family, category: i.category})),
    )
    .catch(() => embedded)
  return fontsPromise
}

// Charge une police depuis le CDN Google pour l'aperçu (Studio uniquement).
const loaded = new Set<string>()
function ensureFontLoaded(family: string) {
  if (!family || loaded.has(family) || typeof document === 'undefined') return
  loaded.add(family)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

function familyFromValue(value?: string): string {
  if (!value) return ''
  const first = value.split(',')[0]?.trim() ?? ''
  return first.replace(/^["']|["']$/g, '')
}

export default function FontInputImpl(props: StringInputProps) {
  const {value, onChange, elementProps} = props
  const [fonts, setFonts] = useState<GFont[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let active = true
    loadGoogleFonts().then((list) => {
      if (!active) return
      setFonts(list)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const categoryByFamily = useMemo(() => {
    const m = new Map<string, string>()
    for (const f of [...RECOMMENDED, ...fonts]) m.set(f.family, f.category)
    return m
  }, [fonts])

  const currentFamily = familyFromValue(value)
  useEffect(() => {
    if (currentFamily) ensureFontLoaded(currentFamily)
  }, [currentFamily])

  const options = useMemo(() => {
    const all = fonts.length ? fonts.map((f) => f.family) : RECOMMENDED.map((f) => f.family)
    const q = query.trim().toLowerCase()
    let list = q ? all.filter((f) => f.toLowerCase().includes(q)) : RECOMMENDED.map((f) => f.family)
    list = list.slice(0, 25)
    if (currentFamily && !list.includes(currentFamily)) list = [currentFamily, ...list]
    return list.map((family) => ({value: family}))
  }, [fonts, query, currentFamily])

  const handleChange = useCallback(
    (family?: string) => {
      if (!family) {
        onChange(unset())
        return
      }
      const cat = categoryByFamily.get(family) || 'sans-serif'
      onChange(set(`"${family}", ${FALLBACK[cat] || 'sans-serif'}`))
    },
    [onChange, categoryByFamily],
  )

  return (
    <Stack space={3}>
      <Autocomplete
        {...elementProps}
        id={props.id || 'font-input'}
        loading={loading}
        options={options}
        value={currentFamily}
        placeholder="Rechercher une police Google…"
        openButton
        filterOption={() => true}
        onQueryChange={(q) => setQuery(q || '')}
        onChange={handleChange}
        renderOption={(option) => {
          ensureFontLoaded(option.value)
          return (
            <Card as="button" padding={3} radius={2}>
              <Text size={2} style={{fontFamily: `"${option.value}"`}}>
                {option.value}
              </Text>
            </Card>
          )
        }}
      />
      {currentFamily ? (
        <Card padding={4} radius={2} border tone="transparent">
          <Stack space={3}>
            <Text size={1} muted>
              Aperçu — {currentFamily}
            </Text>
            <Box>
              <Text size={4} style={{fontFamily: `"${currentFamily}"`}}>
                Aa Bb Cc — Titre d&apos;exemple 123
              </Text>
            </Box>
          </Stack>
        </Card>
      ) : null}
    </Stack>
  )
}
