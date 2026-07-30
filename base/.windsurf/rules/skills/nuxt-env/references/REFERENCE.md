# Référence Technique : Variables d'environnement Nuxt 3

## 1. Matrix des autorisations par emplacement

| Emplacement | Méthode autorisée | Justification |
| :--- | :--- | :--- |
| `nuxt.config.ts` | `process.env` | Executé au build/démarrage. Recommandé pour modules (ex: `@nuxtjs/sanity`). |
| Composants `.vue` | `useRuntimeConfig()` | Injecté dynamiquement au runtime. |
| Composables (`composables/`) | `useRuntimeConfig()` | Maintient la réactivité et la gestion du contexte Nuxt. |
| Routes serveur (`server/`) | `useRuntimeConfig(event)` | Isolé du client, passe le contexte de requête (`event`). |
| Plugins / Middleware | `useRuntimeConfig()` | Garantit que la configuration est résolue au runtime. |

---

## 2. Exemples de mise en œuvre

### Déclaration dans `nuxt.config.ts`
```ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Clé privée (Accessible serveur uniquement)
    apiSecret: process.env.NUXT_API_SECRET,
    public: {
      // Clé publique (Exposée au navigateur)
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
    },
  },
})