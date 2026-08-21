---
trigger: model_decision
---
# Référence : Extension du Page Builder

## 🔍 Checklist de vérification
- [ ] La section apparaît dans le menu "Ajouter" du champ `pageBuilder` dans Sanity Studio.
- [ ] Le composant se rend correctement sur la page côté Nuxt.
- [ ] Aucun fichier du Cœur n'a été altéré.
- [ ] Les types TypeScript sont régénérés et à jour.

---

## ⚠️ Erreurs fréquentes à éviter

* **Modifier un fichier du Cœur (`page.ts`, `PageBuilder.vue`, etc.) :**
  -> Casse la capacité à recevoir les mises à jour mensuelles du socle.
* **Oublier le registre frontend (`frontend/app/lib/sections.ts`) :**
  -> La section sera affichée comme "non enregistrée" (message d'avertissement dev).
* **Oublier la projection GROQ dans `queries.ts` :**
  -> Les références, images ou textes enrichis renverront `null` dans le frontend Nuxt.
* **Oublier de régénérer les types (`extract-types` / `nuxt prepare`) :**
  -> Entraîne un `PageQueryResult` désynchronisé et provoque des erreurs TypeScript.
* **Mettre des couleurs/espacements en dur dans le composant Vue :**
  -> Utiliser exclusivement les design tokens configurés dans Tailwind (`bg-brand-*`, etc.).