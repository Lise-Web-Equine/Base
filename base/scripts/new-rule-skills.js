const fs = require('fs');
const path = require('path');

const skillName = process.argv[2];

if (!skillName) {
  console.error('❌ Veuillez préciser un nom : node scripts/new-rule-skills.js <nom-du-skill>');
  process.exit(1);
}

// Remonte d'un cran depuis le dossier /scripts pour cibler la racine du projet
const projectRoot = path.resolve(__dirname, '..');

// Destination : .windsurf/rules/skills/<nom-du-skill>
const baseDir = path.join(projectRoot, '.windsurf', 'rules', 'skills', skillName);

// Création des dossiers
fs.mkdirSync(path.join(baseDir, 'references'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'scripts'), { recursive: true });

// Contenu du SKILL.md
const skillTemplate = `---
trigger: model_decision
description: Description du déclencheur pour ${skillName}...
---

# Skill : ${skillName}

## Context & Objectifs
- 

## Références & Scripts
- Références : .windsurf/rules/skills/${skillName}/references/REFERENCE.md
- Scripts : .windsurf/rules/skills/${skillName}/scripts/

## Procédure
1. 
`;

// Contenu du REFERENCE.md
const referenceTemplate = `# Références : ${skillName}

## Documentation & Exemples
- 
`;

fs.writeFileSync(path.join(baseDir, 'SKILL.md'), skillTemplate);
fs.writeFileSync(path.join(baseDir, 'references', 'REFERENCE.md'), referenceTemplate);

console.log(`✅ Skill "${skillName}" créé dans : .windsurf/rules/skills/${skillName}/`);