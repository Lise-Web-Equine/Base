import {Tooltip, Button, Box, Stack, Text, Code} from '@sanity/ui'
import {HelpCircleIcon} from '@sanity/icons'

/**
 * Bouton « Mise en forme » avec tooltip (CŒUR).
 *
 * Injecté en haut du formulaire de chaque document (voir `StudioFormInput`),
 * il rappelle au survol le mini-balisage disponible dans les champs texte
 * SIMPLES (interprété côté frontend, cf. `frontend/app/lib/richString.ts`) et
 * le formatage des champs « Contenu enrichi ».
 */
export function FormattingHelpButton() {
  return (
    <Tooltip
      placement="bottom-end"
      portal
      content={
        <Box padding={3} style={{maxWidth: 320}}>
          <Stack space={4}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Mise en forme des champs texte
              </Text>
              <Text size={1} muted>
                Dans les champs simples (titres, descriptions…) :
              </Text>
            </Stack>
            <Stack space={2}>
              <Text size={1}>
                <Code>**mot**</Code> → gras
              </Text>
              <Text size={1}>
                <Code>*mot*</Code> → typo d’accent (police du thème)
              </Text>
              <Text size={1}>
                <Code>_mot_</Code> → italique
              </Text>
              <Text size={1}>
                <Code>//</Code> → saut de ligne
              </Text>
              <Text size={1} muted>
                Ex. <Code>Pour une communication//**alignée** et rentable</Code>
              </Text>
            </Stack>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                Champs « Contenu enrichi »
              </Text>
              <Text size={1} muted>
                Barre d’outils (gras, italique, listes, liens…). Entrée =
                paragraphe · Maj + Entrée = retour à la ligne.
              </Text>
            </Stack>
          </Stack>
        </Box>
      }>
      <Button
        icon={HelpCircleIcon}
        text="Mise en forme"
        mode="bleed"
        fontSize={1}
        padding={2}
      />
    </Tooltip>
  )
}
