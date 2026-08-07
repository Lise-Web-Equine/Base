# Journal des versions du Cœur

Ce fichier documente les évolutions du **socle (Cœur)** diffusé aux templates et
projets clients. Le Cœur suit un **versionnement sémantique** (`MAJEUR.MINEUR.CORRECTIF`)
et est publié via des **tags git** (voir `docs/core-workflow.md`).

- **MAJEUR** : changement cassant (rupture d'API, renommage/suppression de champ
  Sanity nécessitant une migration de contenu, refonte d'un point d'extension).
- **MINEUR** : ajout rétro-compatible (nouvelle section, nouveau composant,
  nouveau réglage optionnel).
- **CORRECTIF** : correction de bug sans impact sur les points d'extension.

> ⚠️ **Migrations de contenu** : tout changement de schéma Sanity impactant des
> documents existants doit référencer ici un script de migration à exécuter sur
> le dataset de chaque client (voir la section « Migrations » de
> `docs/core-workflow.md`).

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Non publié]

### Ajouté
-

### Modifié
-

### Corrigé
-

### ⚠️ Migration requise
-

## [1.0.0] - 2026-08-07

Première version stable du Cœur, socle des templates (agence, haras) et des
projets clients.

### Ajouté
- **Moteur de sections (Page Builder)** avec séparation Cœur / Projet :
  `studio/src/sections/`, `frontend/app/lib/sections.ts`,
  `projectSectionProjections` dans `frontend/app/sanity/queries.ts`.
- **Sections Cœur** : `callToAction`, `infoSection`.
- **Singletons** : `settings` (identité, coordonnées, réseaux sociaux, bannière
  cookies Axeptio, analytics multi-fournisseurs), `themeSettings` (couleurs,
  typographie Google Fonts, tokens de mise en forme), `homePage`, `navigation`,
  `redirects`, `legalTexts`.
- **Documents** : `page`, `post`, `person`.
- **Objets** : `blockContent`, `link`, `button`, `customImage`,
  `sectionAppearance`, `gallery`.
- **SEO** : sitemap dynamique, robots, URLs canoniques, Open Graph, `noIndex`,
  intégration `@nuxtjs/seo`.
- **Design system** : tokens CSS dynamiques via `useTheme`, page charte
  graphique, apparence de section (fond / voile / espacement).
- **Frontend** : `PageBuilder`, `SectionWrapper`, `AppImage` (NuxtImg),
  `Gallery` / `Lightbox`, `SocialLinks`, formulaire de contact + envoi Resend,
  page `error.vue`, analytics, gestion RGPD.
- **Infra** : Visual Editing + TypeGen Sanity, redirections serveur,
  auto-hébergement des icônes (Iconify local).

[Non publié]: https://github.com/Lise-Web-Equine/Base/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/Lise-Web-Equine/Base/releases/tag/v1.0.0
