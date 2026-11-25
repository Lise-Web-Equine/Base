---
name: nouveau-projet
description: Guide pas à pas la mise en place d'un nouveau projet client (ou template métier) dérivé du Cœur Lise Web Equine — remotes git, Sanity, variables d'environnement, identité, sections métier, stratégie de rendu, formulaire de contact, Presentation, déploiement. À lancer au début de chaque nouveau projet avec /nouveau-projet.
disable-model-invocation: true
---

# Nouveau projet — guide pas à pas

Tu guides l'utilisatrice dans la mise en place d'un nouveau projet dérivé du
Cœur. Tout se fait **en français**.

## Façon de travailler

- **Une étape à la fois.** Annonce l'étape (« Étape 3/12 — … »), vérifie d'abord
  dans le code ce qui est déjà fait, explique ce qui reste, fais-le ou
  guide-la, puis **attends sa validation** avant de passer à la suivante.
- Au démarrage, affiche la liste des 12 étapes et demande si on commence à
  l'étape 1 ou si certaines sont déjà faites.
- **Règle d'or du Cœur** : ne jamais modifier un fichier Cœur. Les
  changements de code se font uniquement dans les points d'extension (voir
  `docs/core-workflow.md` et `Base/.windsurf/rules/architecture-core-projet.md`).
  Si un besoin ne rentre dans aucun point d'extension, le signaler : c'est une
  évolution à faire dans le Cœur, pas dans le projet.
- Les actions en dehors du dépôt (créer un projet Sanity ou Vercel, déployer,
  créer des tokens, configurer un domaine) sont faites **par l'utilisatrice** :
  donne-lui le lien et les valeurs exactes à saisir, puis vérifie le résultat
  quand c'est possible.
- Ne jamais afficher ni committer le contenu des fichiers `.env`.
- À la fin, récapitule les décisions prises (notamment l'étape 7) pour
  qu'elle les reporte dans le cahier des charges du client.

Le code de l'application est dans `Base/` (studio dans `Base/studio`,
frontend dans `Base/frontend`).

## Les étapes

### 1. Vérifier le dépôt et les remotes git
- Vérifier qu'on n'est **pas** dans le dépôt Cœur (`Lise-Web-Equine/Base`) :
  `git remote -v`.
- Projet client : remotes `origin` (le client), `template` (template métier)
  et `upstream` (Cœur). Template métier : `origin` et `upstream`.
- Si ce n'est pas le cas, guider avec les commandes de
  `docs/core-workflow.md` §2 et §3.
- Noter le tag du Cœur d'origine (`git describe --tags`).

### 2. Node, dépendances et Dependabot
- Vérifier `node -v` par rapport à `Base/.node-version` et au champ
  `engines` de `Base/package.json`.
- Lancer `npm install` dans `Base/`.
- **Dependabot** : le fichier `.github/dependabot.yml` hérité du Cœur
  surveille les majeures des dépendances du Cœur, qui sont migrées dans le
  Cœur puis redescendent par `upstream`. Sur le projet il ferait doublon :
  - par défaut, le supprimer : `git rm .github/dependabot.yml` puis commit
    `chore: désactive Dependabot versions (suivi via le Cœur)` ;
  - exception : si le projet a une dépendance importante qui lui est propre
    (une majeure casserait une fonctionnalité), remplacer le contenu par une
    config qui ne surveille que cette dépendance (même format que le Cœur :
    `allow` limité à ces paquets, mineures et patch ignorées, rythme
    mensuel).
  - Lors des merges `upstream` ultérieurs, en cas de conflit sur ce fichier,
    garder la version du projet (`git rm` s'il avait été supprimé, sinon
    `git checkout --ours .github/dependabot.yml`).
- L'utilisatrice active les **alertes de sécurité Dependabot** sur le dépôt
  GitHub : Settings → Code security → Dependabot alerts. Elles couvrent
  toutes les dépendances, Cœur comme projet.

### 3. Projet Sanity
- L'utilisatrice crée le projet et le dataset sur https://www.sanity.io/manage
  (ou `npx sanity init` dans `Base/studio`). Récupérer le **project ID**.
- Dans le projet Sanity → API → **CORS origins** : ajouter
  `http://localhost:3000` (avec identifiants) et le domaine de production.
- Créer un token **Viewer** pour le frontend (lecture des brouillons et de
  l'aperçu).

### 4. Variables d'environnement
- Créer `Base/studio/.env` à partir de `Base/studio/.env.example`.
- Créer `Base/frontend/.env` à partir de `Base/frontend/.env.example`.
- Vérifier les variables utilisées dans `Base/frontend/nuxt.config.ts`
  (`runtimeConfig`) qui ne figurent pas dans l'exemple, notamment
  `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
- Vérifier que les deux côtés pointent vers le même project ID et dataset.
- Lancer `npm run dev` dans `Base/` et vérifier que le studio
  (http://localhost:3333) et le site (http://localhost:3000) démarrent.

### 5. Identité du site
- Dans le studio : réglages du site et `themeSettings` (couleurs,
  typographies, logo). **Aucune valeur de design en dur dans le code** : tout
  passe par les tokens.
- `NUXT_PUBLIC_SITE_NAME` et `NUXT_PUBLIC_SITE_URL` dans `Base/frontend/.env`.
- Titre du studio : `SANITY_STUDIO_TITLE`.

### 6. Sections et documents métier
- Demander quelles sections ou quels types de documents propres au client
  sont nécessaires (au-delà de ceux du Cœur et du template).
- Les ajouter uniquement via les points d'extension :
  - section Sanity : `Base/studio/src/sections/project.ts`
  - section frontend : `Base/frontend/app/lib/sections.ts` (`projectSections`)
  - projection GROQ : `Base/frontend/app/sanity/queries.ts`
    (`projectSectionProjections`)
  - document / objet : `Base/studio/src/schemaTypes/project.ts`
  - structure du studio : `Base/studio/src/structure/project.ts`
- Libellés du studio en français, styles mobile first.
- Si une section ajoute une dépendance npm importante (une majeure
  casserait la fonctionnalité), l'ajouter au `allow` de
  `.github/dependabot.yml` du projet (voir étape 2). Si la même
  fonctionnalité sert déjà à un autre client, proposer plutôt de la remonter
  dans le template métier ou le Cœur.

### 7. Stratégie de rendu
- Poser une par une les 5 questions de la section « Nouveau projet : choisir
  la stratégie de rendu » de `Base/frontend/README.md`.
- Proposer une stratégie par type de page (SSR, ISR, SWR, prérendu ou côté
  client) en justifiant chaque choix par les réponses.
- `/api/**` et `/preview/**` ne sont jamais mis en cache.
- Si le Cœur ne propose pas encore de point d'extension pour les
  `routeRules`, **ne pas modifier `nuxt.config.ts`** : noter la décision
  pour le cahier des charges et signaler qu'il manque ce point d'extension
  dans le Cœur.

### 8. Formulaire de contact
- Compte Resend : vérifier le domaine d'envoi du client, créer la clé API.
- Renseigner `RESEND_API_KEY`, `CONTACT_FROM` (adresse du domaine vérifié) et
  `CONTACT_TO` (adresse qui reçoit les messages).
- Tester un envoi en local.

### 9. Aperçu et édition visuelle (Presentation)
- `SANITY_STUDIO_PREVIEW_URL` (studio) et `NUXT_SANITY_STUDIO_URL`
  (frontend) doivent pointer l'un vers l'autre.
- Tester dans le studio : ouvrir Presentation, vérifier les cadres au survol
  et l'ouverture du document au clic.

### 10. Déploiement
- **Studio** : `npm run deploy` dans `Base/studio` (choisir le
  `studioHost`). Ajouter ensuite l'`appId` dans `sanity.cli.ts` si la CLI le
  demande.
- **Frontend sur Vercel** : l'utilisatrice crée le projet, règle le
  **Root Directory**, saisit les variables d'environnement de production, et
  vérifie la version de Node (Settings → Build and Deployment).
- Ajouter le domaine Vercel et le domaine final dans les CORS Sanity, et
  mettre à jour les URL de l'étape 9 avec les adresses de production.
- Si l'étape 7 a retenu de l'ISR avec revalidation à la publication :
  configurer le webhook Sanity correspondant.

### 11. SEO et pages légales
- Vérifier `/sitemap.xml` et `/robots.txt` sur le déploiement.
- Contenu des pages légales (mentions légales, politique de
  confidentialité, cookies, CGV si besoin) saisi dans le studio.
- Images Open Graph renseignées dans Sanity.

### 12. Vérification finale
- `npm run build` dans `Base/studio` et `Base/frontend`.
- `npx eslint .` dans `Base/studio`.
- `npm audit` : signaler les vulnérabilités high ou critical.
- Récapitulatif final des décisions et des points restant à faire.
