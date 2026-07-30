---
name: add-page-builder
description: Add a new section to the Page Builder and make it available in the frontend.
license: Private
metadata:
  author: Lise Web Equine
  version: "1.0.0"
  tags: ["sanity", "nuxt", "page-builder"]
  stack: "Nuxt 3 / Sanity v3"
trigger: model_decision
---
# Procédure : Ajouter une section au Page Builder

> ⚠️ **Règle d'or** : Ne JAMAIS modifier un fichier du Cœur (`page.ts`, `PageBuilder.vue`, `schemaTypes/index.ts`, `sections/index.ts`).

1. **Schéma Sanity** : Créer l'objet section dans `studio/src/schemaTypes/objects/<maSection>.ts` (`defineType`/`defineField`, libellés en français).
2. **Registre Sanity** : Importer et ajouter la section à `projectSections` dans `studio/src/sections/project.ts`.
3. **Composant Vue** : Créer `frontend/app/components/global/<MaSection>.vue` (prop `block`, style piloté par les design tokens, aucune valeur en dur).
4. **Registre Frontend** : Ajouter l'entrée `<maSection>: "<MaSection>"` dans `projectSections` de `frontend/app/lib/sections.ts` (`_type` Sanity → nom du composant).
5. **Projection GROQ** *(si refs, images ou Portable Text)* : Ajouter le bloc `_type == "<maSection>" => { ... }` à `projectSectionProjections` dans `frontend/app/sanity/queries.ts`.
6. **Régénérer les types** : Exécuter `./scripts/sync-types.sh`.

> 💡 *En cas d'erreur TS, de problème de rendu ou pour vérifier la checklist complète, consulter `references/REFERENCE.md`.*