# 📋 Instructions : Ajouter un nouveau champ dans un schéma Sanity

## 🎯 Objectif
Ce document décrit toutes les étapes nécessaires pour ajouter un nouveau champ dans un schéma Sanity et le rendre disponible dans le frontend.

---

## 📝 Étapes complètes

### 1. 🏗️ Modifier le schéma Sanity

#### 1.1 Localiser le fichier du schéma
```bash
# Les schémas se trouvent dans :
studio/src/schemaTypes/documents/    # Pour les documents principaux
studio/src/schemaTypes/objects/      # Pour les objets réutilisables
```

#### 1.2 Ajouter le champ au schéma
```typescript
// Exemple : Ajouter un champ "impact" au schéma portfolio
export const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  fields: [
    // ... autres champs existants
    
    // 👇 AJOUTER LE NOUVEAU CHAMP 👇
    defineField({
      name: 'impact',
      title: 'Impact',
      type: 'text',
      rows: 2,
      description: 'Impact et résultats du projet (ex: +30% de trafic, 50% de conversion en plus, etc.)',
    }),
    
    // ... autres champs existants
  ],
});
```

#### 1.3 Types de champs courants
```typescript
// Texte simple
defineField({
  name: 'nom',
  title: 'Nom',
  type: 'string',
  validation: (Rule) => Rule.required(),
})

// Texte multiligne
defineField({
  name: 'description',
  title: 'Description',
  type: 'text',
  rows: 3,
})

// Nombre
defineField({
  name: 'prix',
  title: 'Prix',
  type: 'number',
})

// Booléen
defineField({
  name: 'isActive',
  title: 'Actif',
  type: 'boolean',
  initialValue: true,
})

// Image
defineField({
  name: 'image',
  title: 'Image',
  type: 'image',
  options: {
    hotspot: true,
  },
})

// Référence à un autre document
defineField({
  name: 'service',
  title: 'Service',
  type: 'reference',
  to: [{ type: 'service' }],
})

// Tableau
defineField({
  name: 'tags',
  title: 'Tags',
  type: 'array',
  of: [{ type: 'string' }],
})
```

---

### 2. 🔄 Mettre à jour les types TypeScript

#### 2.1 Extraire le schéma
```bash
cd studio
npm run extract-types
```

#### 2.2 Regénérer les types dans le frontend
```bash
cd frontend
npm run typegen
```

#### 2.3 Vérifier les types générés
Les types sont générés dans :
```
frontend/app/sanity/types.ts
```

---

### 3. 🔍 Mettre à jour les queries Sanity

#### 3.1 Localiser la query concernée
Les queries se trouvent dans :
```
frontend/app/sanity/queries.ts
```

#### 3.2 Ajouter le champ à la query
```typescript
// Exemple : Ajouter "impact" à la homeQuery pour portfolio
"portfolioSection": portfolioSection{
  ...,
  "projects": projects[]{
    ...,
    "project": @->{
      title,
      slug,
      category,
      clientName,
      shortDescription,
      impact,  // 👇 AJOUTER LE CHAMP ICI 👇
      image,
      isActive,
      order,
      "imageUrl": image.asset->url
    }
  }
},
```

#### 3.3 Queries courantes à vérifier
- `homeQuery` : Pour les données de la page d'accueil
- `portfolioQuery` : Pour les pages de détail portfolio
- `pageQuery` : Pour les pages génériques

---

### 4. 🎨 Implémenter l'affichage dans le frontend

#### 4.1 Ajouter le champ dans le template Vue
```vue
<template>
  <!-- Affichage conditionnel du champ -->
  <div v-if="projectItem.project.impact" class="impact-section">
    <h4>Impact mesurable</h4>
    <p>{{ projectItem.project.impact }}</p>
  </div>
</template>
```

#### 4.2 Ajouter le style CSS si nécessaire
```css
.impact-section {
  @apply bg-primary-50 border-l-4 border-primary-500 p-4 rounded-lg;
}
```

---

### 5. 🧪 Tester et déboguer

#### 5.1 Vérifier dans Sanity Studio
1. Ouvrir `http://localhost:3333/`
2. Aller dans le document concerné
3. Vérifier que le nouveau champ apparaît
4. Remplir une valeur de test
5. Sauvegarder

#### 5.2 Débogage simple (si nécessaire)
```vue
<!-- Debug temporaire pour vérifier les données -->
<div class="debug">
  CHAMP: {{ projectItem.project.nouveauChamp || 'NON DÉFINI' }}
</div>
```

#### 5.3 Supprimer le débogage une fois confirmé

---

### 6. 🚀 Déploiement et synchronisation

#### 6.1 Redémarrer les serveurs
```bash
# Arrêter les serveurs (Ctrl+C)
# Redémarrer le frontend
cd frontend
npm run dev

# Redémarrer Sanity Studio si nécessaire
cd studio
npm run dev
```

#### 6.2 Vider le cache navigateur
- Hard refresh : `Ctrl+F5` (Windows) ou `Cmd+Shift+R` (Mac)
- Ou vider le cache complètement

---

## ⚠️ Points d'attention courants

### ❌ Erreurs fréquentes
1. **Oublier d'ajouter le champ à la query** → Le champ n'arrive pas au frontend
2. **Oublier de regénérer les types** → Erreurs TypeScript
3. **Oublier de redémarrer les serveurs** → Les données ne se synchronisent pas
4. **Mauvais nom de champ dans la query** → Données non récupérées

### ✅ Bonnes pratiques
1. **Toujours tester dans Sanity Studio** d'abord
2. **Regénérer les types** après chaque modification de schéma
3. **Ajouter le champ à TOUTES les queries concernées**
4. **Utiliser le débogage temporaire** pour vérifier les données
5. **Documenter les champs** avec des descriptions claires

---

## 🔄 Résumé rapide (Checklist)

- [ ] **1. Ajouter le champ** au schéma TypeScript
- [ ] **2. Extraire le schéma** (`npm run extract-types`)
- [ ] **3. Regénérer les types** (`npm run typegen`)
- [ ] **4. Ajouter le champ** à la query Sanity
- [ ] **5. Implémenter l'affichage** dans le template Vue
- [ ] **6. Tester** dans Sanity Studio
- [ ] **7. Redémarrer les serveurs**
- [ ] **8. Vérifier** le résultat final

---

## 🎉 Résultat attendu

Une fois toutes ces étapes suivies, le nouveau champ sera :
- ✅ **Disponible** dans Sanity Studio
- ✅ **Typé** correctement dans TypeScript
- ✅ **Récupéré** par les queries
- ✅ **Affiché** dans le frontend
- ✅ **Fonctionnel** pour tous les utilisateurs

---

## 📚 Références utiles

- [Documentation Sanity Schema Types](https://www.sanity.io/docs/schema-types)
- [Documentation GROQ Queries](https://www.sanity.io/docs/groq)
- [Documentation Nuxt Sanity](https://www.sanity.io/docs/nuxt)

---

*Document créé le : 27/04/2026*
*Dernière mise à jour : 27/04/2026*
