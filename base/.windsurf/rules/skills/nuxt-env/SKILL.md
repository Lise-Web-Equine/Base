---
trigger: model_decision
description: À appliquer dès qu'on lit, déclare ou modifie une variable d'environnement dans le projet Nuxt (nuxt.config.ts, runtimeConfig, process.env, NUXT_*)
license: Private
metadata:
  author: Lise Web Equine
  version: "1.0.0"
  tags: ["nuxt", "environment", "runtimeconfig"]
  stack: "Nuxt 3"
---

# Directives : Variables d'environnement (Nuxt 3)

## 🛑 Règle Principale
**Toujours privilégier `useRuntimeConfig()` plutôt que `process.env`** dans le code applicatif.
`process.env` est strictement restreint au fichier `nuxt.config.ts` (ex: configuration du module `@nuxtjs/sanity`).

## 📋 Règles de lecture rapide
- **Composants, composables, plugins** : Utiliser `const config = useRuntimeConfig()`.
- **Routes serveur (`server/`)** : Utiliser `const config = useRuntimeConfig(event)`.
- **Clés privées (Serveur)** : `runtimeConfig.maCle` (surchargée par `NUXT_MA_CLE`).
- **Clés publiques (Client)** : `runtimeConfig.public.maCle` (surchargée par `NUXT_PUBLIC_MA_CLE`). Jamais de secret ici.

> 💡 *Pour consulter le tableau des autorisations, la justification technique et les exemples de code, se référer à `references/REFERENCE.md`.*