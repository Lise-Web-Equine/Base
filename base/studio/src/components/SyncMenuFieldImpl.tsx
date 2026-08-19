import React, {useState} from 'react'
import {useClient, useFormValue, type ArrayFieldProps} from 'sanity'
import {Box, Button, Flex, Stack, Text, useToast} from '@sanity/ui'
import {SyncIcon} from '@sanity/icons'

/**
 * Implémentation du champ « Menu principal » (voir SyncMenuField.tsx pour le
 * wrapper). Rend le titre du champ suivi d'un bouton « Synchroniser » puis
 * l'éditeur de tableau par défaut (props.children).
 *
 * Le bouton écrit dans le document : « Accueil », une entrée par page existante
 * (hors pages masquées des moteurs), puis la rubrique Blog/Actualités si elle
 * est activée. L'ordre et les libellés restent ensuite entièrement éditables.
 * Sans configuration, le frontend affiche déjà ce même menu par défaut
 * (fallback) : ce bouton sert à matérialiser ces entrées pour les personnaliser.
 */
const genKey = () => Math.random().toString(36).slice(2, 12)

export default function SyncMenuFieldImpl(props: ArrayFieldProps) {
  const {title, description, children, value} = props
  const client = useClient({apiVersion: '2025-10-20'})
  const docId = useFormValue(['_id']) as string | undefined
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const handleSync = async () => {
    if (!docId) return
    const current = Array.isArray(value) ? value : []
    if (
      current.length &&
      !window.confirm('Remplacer le menu principal actuel par l’accueil et les pages du site ?')
    ) {
      return
    }

    setBusy(true)
    try {
      const [pages, blog] = await Promise.all([
        client.fetch<{_id: string; name: string}[]>(
          `*[_type == "page" && defined(slug.current) && !(_id in path("drafts.**")) && noIndex != true] | order(name asc){_id, name}`,
        ),
        client.fetch<{enabled?: boolean; label?: string} | null>(
          `*[_type == "settings"][0].blog`,
        ),
      ])

      const items = [
        {
          _key: genKey(),
          _type: 'menuItem',
          label: 'Accueil',
          align: 'gauche',
          link: {_type: 'link', linkType: 'href', href: '/'},
        },
        ...pages.map((page) => ({
          _key: genKey(),
          _type: 'menuItem',
          label: page.name,
          align: 'gauche',
          link: {
            _type: 'link',
            linkType: 'page',
            page: {_type: 'reference', _ref: page._id},
          },
        })),
      ]

      // Rubrique Blog / Actualités (route interne /articles), si activée.
      if (blog?.enabled) {
        items.push({
          _key: genKey(),
          _type: 'menuItem',
          label: blog.label === 'actualites' ? 'Actualités' : 'Blog',
          align: 'gauche',
          link: {_type: 'link', linkType: 'href', href: '/articles'},
        })
      }

      await client.patch(docId).set({headerMenu: items}).commit()
      toast.push({
        status: 'success',
        title: 'Menu synchronisé',
        description: `${items.length} entrée(s) depuis les pages du site.`,
      })
    } catch (err) {
      toast.push({
        status: 'error',
        title: 'Échec de la synchronisation',
        description: err instanceof Error ? err.message : String(err),
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Stack space={3}>
      <Flex align="center" gap={2}>
        <Box flex={1}>
          <Text size={1} weight="semibold">
            {title}
          </Text>
        </Box>
        <Button
          icon={SyncIcon}
          text="Synchroniser"
          mode="ghost"
          tone="primary"
          fontSize={1}
          padding={2}
          disabled={busy}
          loading={busy}
          onClick={handleSync}
        />
      </Flex>
      {description ? (
        <Text size={1} muted>
          {description}
        </Text>
      ) : null}
      {children}
    </Stack>
  )
}
