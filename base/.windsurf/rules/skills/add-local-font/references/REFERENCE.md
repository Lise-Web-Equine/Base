---
trigger: model_decision
---
# Référence : Polices locales (auto-hébergées, hors Google)

## Principe

Le thème (`themeSettings`) stocke chaque police comme une chaîne CSS
(`"Nom", <générique>`). Le frontend extrait le nom de famille et **aiguille** :

- famille présente dans le registre local → `/api/fonts/local` (génère le
  `@font-face` à partir des fichiers de `frontend/public/fonts/`) ;
- sinon → `/api/fonts/css` (proxy Google RGPD existant).

Aucun appel externe pour une police locale : les fichiers sont déjà sur notre
domaine. Aucun rebuild du CŒUR n'est nécessaire pour ajouter une police.

## Où se passe tout

| Rôle | Fichier | Couche |
|---|---|---|
| Endpoint `@font-face` local | `frontend/server/api/fonts/local.get.ts` | CŒUR |
| Aiguillage local vs Google | `frontend/app/composables/useTheme.ts` | CŒUR |
| Registre rendu (site) | `frontend/shared/localFonts.ts` (`projectLocalFonts`) | **PROJET** |
| Fichiers police (site) | `frontend/public/fonts/<police>/` | PROJET |
| Registre + aperçu Studio | `studio/src/localFonts.ts` (`projectLocalFonts`) | **PROJET** |
| Fichiers police (aperçu) | `studio/static/fonts/<police>/` | PROJET |
| Sélecteur + aperçu Studio | `studio/src/components/FontInputImpl.tsx` | CŒUR |
| Liste Google (générée) | `studio/src/fonts.ts` | CŒUR (généré) |

> `studio/src/fonts.ts` est régénéré par `npm run fonts:sync` : ne JAMAIS y
> ajouter de police projet. Tout passe par les deux `localFonts.ts`.

## Registre frontend : `frontend/shared/localFonts.ts`

Module partagé app↔serveur (importé via `#shared/localFonts`).

```typescript
interface LocalFontFace {
  weight: number                     // 100–900
  style?: "normal" | "italic"        // défaut "normal"
  file: string                       // sous public/fonts/, ex. "haras-sans/regular.woff2"
}
interface LocalFont {
  family: string                     // nom exact (identique côté Studio)
  fallback: string                   // "sans-serif" | "serif" | "monospace"…
  faces: LocalFontFace[]
}
```

Ajouter dans le bloc PROJET :

```typescript
const projectLocalFonts: LocalFont[] = [
  {
    family: "Haras Sans",
    fallback: "sans-serif",
    faces: [
      { weight: 400, file: "haras-sans/regular.woff2" },
      { weight: 700, file: "haras-sans/bold.woff2" },
    ],
  },
]
```

## Registre Studio : `studio/src/localFonts.ts`

Même structure (les `file` pointent sous `studio/static/fonts/`, servis à
`/static/fonts/`). Ajouter la même police dans `projectLocalFonts` :

```typescript
const projectLocalFonts: StudioLocalFont[] = [
  {
    family: "Haras Sans",
    fallback: "sans-serif",
    faces: [
      { weight: 400, file: "haras-sans/regular.woff2" },
      { weight: 700, file: "haras-sans/bold.woff2" },
    ],
  },
]
```

La police apparaît alors en tête du sélecteur (`FontInputImpl`), suffixée
« (locale) », avec aperçu chargé depuis `/static/fonts/…`.

## Pourquoi dupliquer le fichier (site + Studio)

Le Studio et le site sont deux applications d'**origines différentes**. Pour un
aperçu sans variable d'environnement, la police doit être joignable depuis
l'origine du Studio → copie dans `studio/static/fonts/`. Le site, lui, sert sa
propre copie depuis `frontend/public/fonts/`.

## Pièges

- **`family` divergent** entre les deux registres ou vs le vrai nom de la
  police → l'aiguillage échoue (retombe sur Google, ou @font-face non appliqué).
- **Chemin `file`** relatif au dossier de polices correspondant (pas de `/`
  initial) : `haras-sans/regular.woff2`.
- **Format** : le code déclare `format("woff2")`. Fournir des `.woff2`.
- **Graisses** : une entrée `faces` par graisse/style réellement fournie ; ne
  pas déclarer une graisse sans fichier associé.
