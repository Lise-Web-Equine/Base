---
name: add-local-font
description: À appliquer pour ajouter une police AUTO-HÉBERGÉE (hors Google Fonts) au thème d'un projet — police de marque, sous licence propre, ou tout fichier .woff2 maison à servir depuis notre domaine.
license: Private
metadata:
  author: Lise Web Equine
  version: "1.0.0"
  tags: ["nuxt", "sanity", "fonts", "typography", "rgpd"]
  stack: "Nuxt 4 / Sanity v5"
trigger: model_decision
---

# Procédure : Ajouter une police locale (Projet)

Par défaut, les polices du thème passent par Google Fonts (proxy RGPD
`/api/fonts/css`). Pour une police **auto-hébergée**, on active la branche
« locale » — endpoint `/api/fonts/local` — via les points d'extension PROJET,
sans toucher au CŒUR.

## Étapes

1. **Fichiers `.woff2`** : déposer la police à DEUX endroits (même fichier) :
   - `frontend/public/fonts/<police>/…woff2` → rendu sur le site public.
   - `studio/static/fonts/<police>/…woff2` → aperçu dans le Studio (same-origin).
2. **Registre frontend** : ajouter une entrée dans `projectLocalFonts` de
   `frontend/shared/localFonts.ts` (`family`, `fallback`, `faces[]`).
3. **Registre Studio** : ajouter la MÊME police dans `projectLocalFonts` de
   `studio/src/localFonts.ts` → elle devient sélectionnable ET prévisualisable
   dans le thème (menu, suffixe « (locale) »).

> ⚠️ Le nom de `family` doit être **identique** dans les deux registres et
> correspondre au nom réel de la police (celui du `@font-face`).

## 🚫 À ne pas faire

- **Ne pas** ajouter la police dans `studio/src/fonts.ts` : ce fichier est
  **généré** (`npm run fonts:sync`) et serait écrasé.
- **Ne pas** toucher aux endpoints CŒUR (`server/api/fonts/css.get.ts`,
  `file.get.ts`, `local.get.ts`) ni à l'aiguillage de `useTheme.ts`.
- **Ne pas** exposer d'URL de frontend en dur ni de variable d'env pour
  l'aperçu : la police locale est servie depuis `studio/static/fonts/`.

> 💡 *Fonctionnement détaillé (endpoint, aiguillage, aperçu Studio) et exemples
> de code complets : voir `references/REFERENCE.md`.*
