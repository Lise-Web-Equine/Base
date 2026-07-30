---
name: add-sanity-field
description: Add a new field to a Sanity schema and make it available in the frontend.
license: Private
metadata:
  author: Lise Web Equine
  version: "1.0.0"
  tags: ["sanity", "nuxt", "page-builder"]
  stack: "Nuxt 3 / Sanity v3"
---

# Procédure : Ajouter un champ Sanity (Core)

1. **Schéma Sanity** : Déclarer le champ via `defineField` dans `studio/src/schemaTypes/`.
2. **Synchroniser les types** : Exécuter `./scripts/sync-types.sh`.
3. **Requêtes GROQ** : Ajouter le champ dans `frontend/app/sanity/queries.ts`.
4. **Composant Vue** : Implémenter le rendu avec protection `v-if`.

> 💡 *En cas de doute sur la syntaxe, les types ou un bug `null`, consulter `references/REFERENCE.md`.*