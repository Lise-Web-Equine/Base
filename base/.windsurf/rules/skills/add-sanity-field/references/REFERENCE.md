# Référence : Ajout de champ Sanity

## 1. Syntaxes courantes (`defineField`)

```typescript
// Texte simple
defineField({
  name: 'nom',
  title: 'Nom',
  type: 'string',
  validation: (Rule) => Rule.required(),
})

// Texte multiligne
defineField({
  name: 'description',
  title: 'Description',
  type: 'text',
  rows: 3,
})

// Nombre
defineField({ name: 'prix', title: 'Prix', type: 'number' })

// Booléen
defineField({
  name: 'isActive',
  title: 'Actif',
  type: 'boolean',
  initialValue: true,
})

// Image
defineField({
  name: 'image',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
})

// Référence
defineField({
  name: 'service',
  title: 'Service',
  type: 'reference',
  to: [{ type: 'service' }],
})

// Tableau
defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{ type: 'string' }],
})