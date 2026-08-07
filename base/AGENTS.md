# Notes projet (socle)

Base réutilisable Sanity (Studio) + Nuxt (frontend), monorepo npm workspaces
(`studio`, `frontend`). Architecture CŒUR / PROJET : voir
`.windsurf/rules/architecture-core-projet.md`. Ne pas modifier un fichier CŒUR
pour un besoin de projet — passer par les points d'extension `project.ts`.

## Vérification

- Studio : `cd studio && npx tsc --noEmit -p tsconfig.json && npx sanity schema extract --enforce-required-fields`
- Frontend : `cd frontend && npx nuxi typecheck`
  - 3 erreurs de types **préexistantes** connues (non liées aux ajouts récents) :
    `Header.vue`, `Footer.vue` (type `Link` : `page: string | null`) et
    `Lightbox.vue` (`ComputedRef`). À corriger séparément.

## Briques CŒUR ajoutées

### Pages d'erreur
- `frontend/app/error.vue` : page 404 / erreur brandée (réinjecte `useTheme`).
- `frontend/app/pages/[slug].vue` et `pages/posts/[slug].vue` lèvent un vrai
  `createError({ statusCode: 404 })` quand le document Sanity est absent.

### Redirections
- Singleton Studio `redirects` (`studio/src/schemaTypes/singletons/redirects.ts`),
  enregistré dans `schemaTypes/index.ts` + `structure/index.ts` (verrouillé).
- Middleware `frontend/server/middleware/redirects.ts` : applique 301/302,
  interroge Sanity avec cache 60 s. Créer le document « Redirections » dans le
  Studio pour l'activer.

### Analytics / mesure d'audience
- Config Sanity : Réglages → Modules → Analytics (champ `analytics` dans
  `settings.tsx`). Fournisseurs : Plausible, Matomo, Google Analytics 4.
- Frontend : composable `frontend/app/composables/useAnalytics.ts` basé sur
  `@nuxt/scripts` (`useScriptPlausibleAnalytics` / `useScriptMatomoAnalytics` /
  `useScriptGoogleAnalytics`), appelé dans `app.vue`.
- **Consentement (Option A retenue)** :
  - Plausible + Matomo en mode sans cookie → aucun consentement requis.
  - GA4 chargé en **Consent Mode v2** (`analytics_storage: 'denied'` par défaut).
    Le consentement est accordé par **Axeptio** de façon autonome : activer le
    **Google Consent Mode dans le tableau de bord Axeptio** (aucun code de pont à
    écrire côté frontend). Axeptio appelle lui-même `gtag('consent','update', …)`.
  - Ne pas, en parallèle, faire injecter GA par Axeptio en tant que « vendor » :
    cela chargerait GA deux fois.
