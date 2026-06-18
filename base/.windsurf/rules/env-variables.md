---
trigger: model_decision
description: À appliquer dès qu'on lit, déclare ou modifie une variable d'environnement dans le projet Nuxt (nuxt.config.ts, runtimeConfig, process.env, useRuntimeConfig, clés NUXT_* / NUXT_PUBLIC_*)
---

# Variables d'environnement (Nuxt)

- Toujours privilégier `useRuntimeConfig()` plutôt que `process.env` dans le code applicatif.
- `process.env` est autorisé **uniquement** dans `nuxt.config.ts` (build-time / démarrage), y compris dans le bloc `sanity` du module `@nuxtjs/sanity`.
- Clés privées (serveur) : `runtimeConfig.maCle` ← surchargée par `NUXT_MA_CLE`.
- Clés publiques (client) : `runtimeConfig.public.maCle` ← surchargée par `NUXT_PUBLIC_MA_CLE`.
- Ne jamais mettre de secret/token dans `runtimeConfig.public`.
- Dans les routes serveur, utiliser `useRuntimeConfig(event)`.

Référence détaillée : `INSTRUCTIONS_VARIABLES_ENVIRONNEMENT.md`.
