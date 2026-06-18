import {defineField, defineType} from '@sanity/types'

import {schemaTypes as studioSchemaTypes} from './index'

/**
 * Entry point used exclusively by the @nuxtjs/sanity typegen.
 *
 * The `simplerColor` type is provided at runtime by the
 * `sanity-plugin-simpler-color-input` plugin, which is registered in
 * `sanity.config.ts` but is NOT loaded during Nuxt type generation (typegen
 * only compiles the exported `schemaTypes` array, not the Studio plugins).
 *
 * Without a matching type, `Schema.compile` throws "Unknown type: simplerColor"
 * and ALL query result types fall back to `export {}`. We declare a stub here
 * (same data model as the plugin: `{ label, value }`) so GROQ types resolve.
 *
 * This file is intentionally separate from `index.ts` so the Studio does not
 * register `simplerColor` twice (which would be a duplicate-type error).
 */
const simplerColor = defineType({
  name: 'simplerColor',
  title: 'Color',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'value', type: 'string'}),
  ],
})

export const schemaTypes = [...studioSchemaTypes, simplerColor]
