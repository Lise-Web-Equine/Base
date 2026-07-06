---
trigger: model_decision
description: À appliquer dès qu'on ajoute, modifie ou branche une section du Page Builder (nouvelle brique de contenu affichable dans une page), côté Sanity et/ou frontend Nuxt.
---

# Ajouter une section au Page Builder

Le moteur de sections est piloté par des **registres** (Cœur + Projet). Une nouvelle
section s'ajoute **sans jamais modifier** `page.ts`, `schemaTypes/index.ts`,
`sections/index.ts` ni `PageBuilder.vue`.

## Procédure complète

1. **Schéma Sanity** : créer l'objet section dans
   `studio/src/schemaTypes/objects/<maSection>.ts` (`defineType`/`defineField`,
   libellés en **français**).
2. **Registre Sanity** : importer et ajouter la section à `projectSections` dans
   `studio/src/sections/project.ts`.
3. **Composant Vue** : créer `frontend/app/components/global/<MaSection>.vue`
   (prop `block`, style **piloté par les design tokens**, aucune valeur en dur).
4. **Registre frontend** : ajouter l'entrée `<maSection>: "<MaSection>"` dans
   `projectSections` de `frontend/app/lib/sections.ts` (`_type` Sanity → nom du composant).
5. **Projection GROQ** *(seulement si la section a des références, images ou Portable
   Text)* : ajouter le bloc `_type == "<maSection>" => { ... }` à
   `projectSectionProjections` dans `frontend/app/sanity/queries.ts`.
6. **Régénérer les types** :
   - `studio` : `npm run extract-types`
   - `frontend` : `npx nuxt prepare`
7. **Vérifier** : la section apparaît dans le menu "Ajouter" du champ `pageBuilder`
   dans Sanity Studio et se rend correctement sur la page.

## Erreurs fréquentes à éviter

- Modifier un fichier du **Cœur** (`page.ts`, `PageBuilder.vue`...) → casse les updates.
- Oublier le registre frontend → section affichée comme "non enregistrée" (message dev).
- Oublier la projection GROQ → références/images `null` dans le frontend.
- Oublier de régénérer les types → `PageQueryResult` désynchronisé, erreurs TS.
- Mettre des couleurs/espacements en dur au lieu des design tokens.
