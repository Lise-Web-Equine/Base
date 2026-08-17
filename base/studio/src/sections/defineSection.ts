import {defineField, defineType} from '@sanity/types'
import type {FieldDefinition, ObjectDefinition} from '@sanity/types'
import {CompactSectionInput} from '../components/CompactSectionInput'
import {BareField} from '../components/BareField'
import {appearanceReadOnly} from '../lib/appearanceAccess'

/**
 * Moule commun des sections du Page Builder (CŒUR).
 *
 * Toute section se crée via `defineSection()` : elle obtient automatiquement
 *  - deux onglets : « Contenu » et « Apparence » ;
 *  - un champ `appearance` (type `sectionAppearance`) dans l'onglet Apparence,
 *    piloté côté frontend par <SectionShell> (fond + largeur).
 *
 * Les champs métier passés en `fields` sont rangés dans l'onglet « Contenu »
 * (sauf si un `group` explicite est déjà fourni). Côté rendu, chaque section
 * s'appuie sur <SectionShell>, lui-même construit sur <UPageSection> (Nuxt UI).
 */
type SectionConfig = Pick<ObjectDefinition, 'name' | 'title' | 'icon' | 'preview' | 'initialValue'> & {
  fields: FieldDefinition[]
}

export function defineSection(config: SectionConfig) {
  // Les champs de l'onglet « Apparence » sont verrouillés (lecture seule) pour
  // le client : seuls les emails autorisés (ou le flag local) peuvent éditer.
  const contentFields = config.fields.map((field) => {
    const group = field.group ?? 'content'
    return {
      ...field,
      group,
      ...(group === 'appearance' ? {readOnly: appearanceReadOnly} : {}),
    }
  }) as FieldDefinition[]

  return defineType({
    name: config.name,
    title: config.title,
    type: 'object',
    icon: config.icon,
    groups: [
      {name: 'content', title: 'Contenu', default: true},
      {name: 'appearance', title: 'Apparence'},
    ],
    fields: [
      ...contentFields,
      defineField({
        name: 'appearance',
        title: 'Apparence',
        type: 'sectionAppearance',
        group: 'appearance',
        // Verrouillé pour le client (voir appearanceReadOnly).
        readOnly: appearanceReadOnly,
        // Rendu sans en-tête : évite un intitulé « Apparence » superflu
        // au-dessus de « Image de fond » (déjà dans l'onglet « Apparence »).
        components: {field: BareField},
      }),
    ],
    // Rendu compact du formulaire : n'affecte que les sections du Page Builder.
    components: {input: CompactSectionInput},
    preview: config.preview,
    initialValue: config.initialValue,
  })
}
