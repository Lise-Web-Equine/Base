---
trigger: model_decision
---
# Référence : Ajout de champ Sanity

## ⚠️ Contrainte obligatoire : libellés en français

**Tous les libellés affichés dans le Studio doivent TOUJOURS être en français.**
Cela concerne les `title` (champs et groupes) ainsi que les `description`.

- Le `name` (clé technique du champ) reste en anglais / camelCase (ex. `seoTitle`).
- Le `title` et la `description` sont toujours rédigés en français (ex. `title: 'Titre SEO'`).

```typescript
// ✅ Correct
defineField({ name: 'seoTitle', title: 'Titre SEO', type: 'string' })

// ❌ Incorrect (libellé en anglais)
defineField({ name: 'seoTitle', title: 'SEO Title', type: 'string' })
```

## 📖 Nom de la page vs Titre affiché vs Adresse (URL)

Trois champs proches à ne pas confondre :

- **Nom de la page** (`name`) : nom **interne/administratif**. Sert à identifier la page
  dans le Studio et à générer l'adresse (URL). Pas forcément affiché sur le site.
- **Titre affiché** (`heading`) : le **titre visible** sur la page (le `<h1>` rendu côté site).
- **Adresse de la page (URL)** (`slug`) : la portion d'**URL** de la page, générée
  automatiquement à partir du nom de la page.

```typescript
defineField({
  name: 'name',
  title: 'Nom de la page',
  type: 'string',
  description: 'Nom interne de la page (utilisé pour générer son URL).',
  validation: (Rule) => Rule.required(),
})

defineField({
  name: 'heading',
  title: 'Titre affiché',
  type: 'string',
  validation: (Rule) => Rule.required(),
})

defineField({
  name: 'slug',
  title: 'Adresse de la page (URL)',
  type: 'slug',
  description: "Partie de l'URL identifiant la page (générée à partir du nom de la page).",
  options: { source: 'name', maxLength: 96 },
  validation: (Rule) => Rule.required(),
})
```

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