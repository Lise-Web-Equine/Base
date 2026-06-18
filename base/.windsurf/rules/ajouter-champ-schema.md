---
trigger: model_decision
description: À appliquer dès qu'on ajoute/modifie un champ dans un schéma Sanity ou qu'on doit le rendre disponible dans le frontend (schémas, types, queries GROQ, templates Vue)
---

# Ajouter un champ dans un schéma Sanity

Suivre cette procédure complète à chaque ajout de champ :

1. **Schéma** : ajouter le `defineField` dans `studio/src/schemaTypes/documents/` ou `objects/`.
2. **Types** : `cd studio && npm run extract-types`, puis `cd frontend && npm run typegen` (types générés dans `frontend/app/sanity/types.ts`).
3. **Queries** : ajouter le champ dans TOUTES les queries concernées de `frontend/app/sanity/queries.ts` (`homeQuery`, `portfolioQuery`, `pageQuery`...).
4. **Affichage** : implémenter le rendu dans le template Vue (affichage conditionnel `v-if`).
5. **Test** : vérifier dans Sanity Studio (`http://localhost:3333/`), remplir une valeur, sauvegarder.
6. **Redémarrage** : relancer `npm run dev` (frontend et studio si besoin), hard refresh navigateur.

## Erreurs fréquentes à éviter
- Oublier d'ajouter le champ à la query → champ absent du frontend.
- Oublier de regénérer les types → erreurs TypeScript.
- Oublier de redémarrer les serveurs → données non synchronisées.

Référence détaillée : `INSTRUCTIONS_AJOUTER_CHAMP_SCHEMA.md`.
