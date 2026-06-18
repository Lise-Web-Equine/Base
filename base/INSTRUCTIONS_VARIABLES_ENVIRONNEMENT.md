# Instructions : Variables d'environnement (Nuxt)

> Ces instructions doivent être suivies à chaque fois que du code lit une variable d'environnement dans le projet Nuxt (`frontend/`).

## Règle principale

**Toujours privilégier `runtimeConfig` plutôt que `process.env`** dans le code applicatif.

`process.env` n'est autorisé **que** dans `nuxt.config.ts` (build-time / démarrage). Partout ailleurs, utiliser `useRuntimeConfig()`.

## Pourquoi

- **Disponible côté serveur ET client** de façon contrôlée : `runtimeConfig` (privé, serveur uniquement) vs `runtimeConfig.public` (exposé au navigateur). `process.env` n'est pas fiable côté client après le build.
- **Valeurs résolues au runtime, pas au build** : on peut changer une variable d'env sans rebuilder. Avec `process.env` dans le code applicatif, la valeur est figée (inlined) au build.
- **API unifiée** via `useRuntimeConfig()` dans les composants, composables et routes serveur.
- **Override automatique par variables d'env** : toute clé `runtimeConfig` peut être surchargée par une variable `NUXT_*` correspondante, sans toucher au code.

## Où utiliser quoi

| Emplacement | Méthode autorisée |
| --- | --- |
| `nuxt.config.ts` | `process.env` (OK, build-time) |
| Composants `.vue` | `useRuntimeConfig()` |
| Composables (`composables/`) | `useRuntimeConfig()` |
| Routes serveur (`server/`) | `useRuntimeConfig(event)` |
| Plugins / middleware | `useRuntimeConfig()` |

## Convention de nommage

- Clé privée (serveur) : `runtimeConfig.maCle` ← surchargée par `NUXT_MA_CLE`
- Clé publique (client) : `runtimeConfig.public.maCle` ← surchargée par `NUXT_PUBLIC_MA_CLE`
- Ne mettre dans `public` **que** ce qui peut être exposé au navigateur (jamais de token/secret).

## Exemples

### Déclaration (`nuxt.config.ts`)

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // privé : serveur uniquement
    apiSecret: process.env.NUXT_API_SECRET,
    public: {
      // public : exposé au client
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
    },
  },
});
```

### Lecture (composant / composable)

```ts
const config = useRuntimeConfig();
config.public.studioUrl; // OK côté client
```

### Lecture (route serveur)

```ts
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  config.apiSecret; // OK côté serveur uniquement
});
```

## À ne PAS faire

```ts
// ❌ Interdit hors de nuxt.config.ts
const url = process.env.NUXT_SANITY_STUDIO_URL;
```

```ts
// ✅ Correct
const url = useRuntimeConfig().public.studioUrl;
```

## Cas particulier : module `@nuxtjs/sanity`

L'usage de `process.env` dans le bloc `sanity: { ... }` de `nuxt.config.ts` est **correct et recommandé** par le module : c'est lu au build/démarrage, donc conforme à la règle principale.
