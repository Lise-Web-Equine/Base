---
trigger: always_on
---

# Architecture : base réutilisable (Cœur / Projet)

Ce dépôt est une **BASE (template)** servant à générer des sites clients sur-mesure.
Elle reçoit des **mises à jour mensuelles** qui doivent pouvoir se propager aux
projets dérivés **sans conflit**. Deux couches coexistent :

- **CŒUR (Core)** : infra Sanity/Nuxt, objets réutilisables, moteur de sections,
  singletons de config, composables, SEO. Mis à jour dans la base.
- **PROJET** : design (thème/tokens), sections métier, contenu. Propre à chaque client.

## Règle d'or

**Ne JAMAIS modifier un fichier du Cœur pour un besoin propre à un projet.**
Toujours passer par les **points d'extension** prévus. Un fichier Cœur patché à la
main casse la capacité à recevoir les updates de la base.

## Points d'extension (fichiers PROJET à éditer)

- **Sections Sanity** : `studio/src/sections/project.ts` (`projectSections`).
- **Sections frontend** : `frontend/app/lib/sections.ts` (`projectSections`).
- **Projections GROQ de sections** : `frontend/app/sanity/queries.ts` (`projectSectionProjections`).
- **Design** : uniquement via design tokens (singleton `themeSettings` + Tailwind).
  **Jamais de couleur/spacing en dur** dans les composants.

## Fichiers Cœur à NE PAS modifier pour un projet

- `studio/src/sections/index.ts`, `studio/src/schemaTypes/documents/page.ts`,
  `studio/src/schemaTypes/index.ts`.
- `frontend/app/components/PageBuilder.vue`, composables et `lib/utils.ts`,
  routes serveur SEO/sitemap.

## Avant d'agir

- Déterminer si la demande relève du **Cœur** (amélioration de la base, réutilisable)
  ou du **Projet** (spécifique client). En cas de doute, demander.
- Respecter `.windsurfinstructions` : **ne pas scanner** le projet sans accord.
- Libellés Studio en **français** (schémas + UI).
