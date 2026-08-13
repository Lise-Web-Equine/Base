---
trigger: always_on
---

# Architecture Socle (Cœur / Projet)

Ce dépôt est une **base réutilisable** recevant des mises à jour mensuelles. Deux couches coexistent :
- **CŒUR (Core)** : Infra Sanity/Nuxt, moteur de sections, singletons, composables, SEO. (Évolue dans le socle).
- **PROJET** : Design (tokens), sections métier, contenu client.

## 🛑 Règle d'or inviolable
**Ne JAMAIS modifier un fichier Cœur pour un besoin propre à un projet.** 
Passer exclusivement par les **points d'extension**.

## 🔌 Points d'extension (Fichiers PROJET à éditer)
- **Sections Sanity** : `studio/src/sections/project.ts` (`projectSections`)
- **Sections Frontend** : `frontend/app/lib/sections.ts` (`projectSections`)
- **Projections GROQ** : `frontend/app/sanity/queries.ts` (`projectSectionProjections`)
- **Design & Styles** : Uniquement via design tokens (`themeSettings` + Tailwind). **Aucune couleur ou espacement en dur.**

## 🚫 Fichiers Cœur interdis d'édition (Projet)
- `studio/src/sections/index.ts`
- `studio/src/schemaTypes/documents/page.ts`
- `studio/src/schemaTypes/index.ts`
- `frontend/app/components/PageBuilder.vue`
- Composables, `lib/utils.ts`, routes serveur SEO/sitemap.

## ⚙️ Directives de travail
1. **Périmètre** : Classifier l'action (Cœur vs Projet). En cas de doute, demander.
2. **Scanner** : Respecter `.windsurfinstructions` (ne pas scanner tout le dépôt sans accord).
3. **Langue** : Libellés Studio obligatoirement en **français**.
4. **Mobile first, toujours** : écrire d'abord les styles pour mobile (classes de base sans préfixe), puis ajouter les surcouches responsive (`sm:`, `md:`, `lg:`…) pour les écrans plus grands. Ne jamais partir du desktop.