# Workflow du Cœur — dériver et mettre à jour (Stratégie A : git upstream)

Ce document décrit **comment réutiliser le Cœur** (`Lise-Web-Equine/Base`) dans
les templates métier et les projets clients, et **comment propager les mises à
jour du Cœur** au rythme semestriel.

Il s'appuie sur la séparation **Cœur / Projet** définie dans
`.windsurf/rules/architecture-core-projet.md`. Cette séparation n'est pas
qu'une convention de propreté : c'est la **condition technique** qui rend les
mises à jour sans conflit possibles.

---

## 1. Principe

```
Base (cœur canonique, versionné par tags : v1.0, v1.1, v2.0 …)
  ├─ template-agence     (remote upstream = Base)
  │    └─ client-agence-X   (remote template = template-agence)
  └─ template-haras      (remote upstream = Base)
       └─ client-haras-Y    (remote template = template-haras)
```

- Le Cœur ne modifie **que des fichiers Cœur**.
- Un template / client ne modifie **que les points d'extension** (fichiers
  `project.ts`, `projectSections`, `projectSectionProjections`, design tokens).
- Une mise à jour du Cœur = un `git merge` d'un **tag** : les deux zones étant
  disjointes, il n'y a en principe **aucun conflit**.

> 🎯 **Règle d'or** : ne jamais éditer un fichier Cœur dans un template ou un
> client. Tout besoin spécifique passe par un point d'extension. Un fichier Cœur
> modifié en aval = conflit garanti à chaque mise à jour.

### Points d'extension autorisés (rappel)

| Besoin                     | Fichier à éditer                                  |
| -------------------------- | ------------------------------------------------- |
| Section Sanity             | `studio/src/sections/project.ts`                  |
| Section Frontend           | `frontend/app/lib/sections.ts` (`projectSections`)|
| Projection GROQ de section | `frontend/app/sanity/queries.ts` (`projectSectionProjections`) |
| Document / objet projet    | `studio/src/schemaTypes/project.ts`               |
| Structure du Studio        | `studio/src/structure/project.ts`                 |
| Design & styles            | `themeSettings` + tokens Tailwind (aucune valeur en dur) |

---

## 2. Créer un template métier depuis le Cœur

Un template (ex : `template-haras`) est un dépôt dérivé du Cœur, enrichi des
sections/documents propres au métier, mais **sans contenu client**.

```bash
# 1. Créer le dépôt template sur GitHub (Lise-Web-Equine/template-haras), vide.

# 2. Partir de l'état du Cœur à un tag précis
git clone git@github.com:Lise-Web-Equine/Base.git template-haras
cd template-haras
git checkout v1.0                 # on part d'une version figée du cœur

# 3. Rebrancher les remotes
git remote rename origin upstream                                   # le cœur
git remote add origin git@github.com:Lise-Web-Equine/template-haras.git
git branch -M main
git push -u origin main

# 4. Ajouter les briques métier UNIQUEMENT via les points d'extension,
#    puis committer sur le template.
```

## 3. Créer un projet client depuis un template

```bash
git clone git@github.com:Lise-Web-Equine/template-haras.git client-durand
cd client-durand

git remote rename origin template                                   # màj métier
git remote add upstream git@github.com:Lise-Web-Equine/Base.git     # màj cœur
git remote add origin git@github.com:Lise-Web-Equine/client-durand.git
git branch -M main
git push -u origin main
```

Le client a donc **deux sources de mises à jour** :
- `template` → évolutions métier partagées entre clients d'un même vertical.
- `upstream` → évolutions du Cœur.

---

## 4. Mise à jour semestrielle du Cœur

À chaque release du Cœur (voir §6), propager le tag dans chaque template puis
chaque client.

```bash
# Dans un template OU un client
git fetch upstream --tags
git checkout -b maj/coeur-v1.1        # branche dédiée, jamais directement sur main
git merge v1.1                        # merge du TAG, pas de 'main'

# Résoudre les éventuels conflits (voir §5), puis :
npm install
npm run build                         # frontend : vérifier que ça build
# (Studio) vérifier le démarrage + exécuter les migrations éventuelles (voir §7)

git push -u origin maj/coeur-v1.1
# → ouvrir une PR, valider en préproduction, puis merger sur main.
```

Pour un **template**, on met à jour depuis `upstream` (le Cœur).
Pour un **client**, on met à jour depuis `upstream` (Cœur) **et/ou** `template`
(métier), selon ce qui a bougé.

> Toujours passer par une **branche dédiée + PR** et valider en préprod avant
> de merger sur `main`. Ne jamais merger un tag directement sur `main` en prod.

---

## 5. Gestion des conflits

- **Cas normal** : aucun conflit (le Cœur et le projet touchent des fichiers
  différents).
- **Conflit sur un fichier `project.ts`** : normal si le Cœur a fait évoluer la
  signature d'un point d'extension. Ré-appliquer la partie projet par-dessus la
  nouvelle version.
- **Conflit sur un fichier Cœur** : ⚠️ **symptôme d'une violation de la règle
  d'or** — le projet a édité un fichier Cœur. Extraire la personnalisation vers
  le bon point d'extension, puis reprendre le fichier Cœur tel quel (`--theirs`
  côté upstream).

---

## 6. Checklist de release du Cœur (tous les 6 mois)

À faire dans le dépôt `Base` :

1. Fusionner les évolutions du Cœur sur `main`.
2. Mettre à jour `CHANGELOG.md` : déplacer « Non publié » vers la nouvelle
   version datée, en séparant `Ajouté` / `Modifié` / `Corrigé` et en listant
   toute **migration de contenu requise**.
3. Choisir le numéro selon le semver :
   - **MAJEUR** : rupture d'API ou migration de schéma obligatoire.
   - **MINEUR** : ajouts rétro-compatibles.
   - **CORRECTIF** : corrections seules.
4. Taguer et pousser :
   ```bash
   git tag -a v1.1 -m "Cœur v1.1"
   git push origin v1.1
   ```
5. Annoncer aux templates/clients la disponibilité du tag et les migrations
   éventuelles.

---

## 7. Migrations de contenu Sanity

Les mises à jour de **code** sont propagées par git. Les changements de
**schéma** impactant des documents existants (renommer/supprimer un champ,
changer un type) nécessitent une **migration exécutée sur le dataset de chaque
client** — git ne modifie pas le contenu.

- Écrire la migration avec l'outil officiel :
  `npx sanity migration create` (dans `/studio`), puis exécuter
  `npx sanity migration run <nom> --dataset <dataset> --project <id>`.
- Référencer chaque migration dans le `CHANGELOG.md` sous « ⚠️ Migration
  requise », avec le nom du script et l'ordre d'exécution.
- Exécuter d'abord sur un dataset de préproduction / une copie, jamais
  directement en production sans sauvegarde (`npx sanity dataset export`).

---

## 8. Résumé express

| Action                         | Commande clé                                   |
| ------------------------------ | ---------------------------------------------- |
| Publier une version du Cœur    | `git tag -a v1.1 -m "…" && git push origin v1.1` |
| Brancher un client sur le Cœur | `git remote add upstream …Base.git`            |
| Mettre à jour un projet        | `git fetch upstream --tags && git merge v1.1`  |
| Vérifier après màj             | `npm install && npm run build`                 |
| Migrer le contenu              | `npx sanity migration run <nom>`               |
