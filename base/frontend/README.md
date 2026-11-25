# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Nouveau projet : choisir la stratégie de rendu

À chaque nouveau projet client, répondre à ces questions pour choisir le rendu
de chaque page (`routeRules` de Nuxt : SSR, ISR, SWR, prérendu ou côté client) :

1. **Délai de mise en ligne** : en combien de temps une publication doit-elle
   apparaître sur le site ? Quelques minutes → ISR. Immédiatement → ISR
   revalidé à la publication (webhook Sanity) ou SSR.
2. **Trafic** : combien de visites attendues ? Plus il y en a, plus le cache
   (ISR) est utile pour limiter les appels à Sanity et à Vercel.
3. **Données en temps réel** : y a-t-il des stocks, prix, places ou plannings
   qui doivent être exacts ? → SSR ou SWR court sur ces pages seulement.
4. **Pages personnalisées ou privées** : panier, compte, espace client ?
   → SSR ou `ssr: false`, jamais de cache partagé.
5. **Nombre de pages** : utile seulement si on prérend tout au build.

Quel que soit le choix : `/api/**` et `/preview/**` ne sont jamais mis en cache,
et l'édition visuelle dans Presentation doit être retestée après tout ajout de
cache.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
