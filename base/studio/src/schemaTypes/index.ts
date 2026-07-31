import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {settings} from './singletons/settings'
import {themeSettings} from './singletons/themeSettings'
import {homePage} from './singletons/homePage'
import {navigation} from './singletons/navigation'
import {link} from './objects/link'
import {button} from './objects/button'
import {customImage} from './objects/customImage'
import {blockContent} from './objects/blockContent'
import {sectionAppearance} from './objects/sectionAppearance'
import {pageBuilderSections} from '../sections'
import {projectSchemaTypes} from './project'

// Point de composition du schéma Sanity : CŒUR + PROJET.
// Pour ajouter un type propre à un site, éditer `project.ts` (jamais ce fichier).

// --- CŒUR (réutilisable par tous les projets) ---
const coreSingletons = [settings, themeSettings, homePage, navigation]
const coreDocuments = [page, post, person]
const coreObjects = [blockContent, link, button, customImage, sectionAppearance]

export const schemaTypes = [
  ...coreSingletons,
  ...coreDocuments,
  ...coreObjects,
  // Sections du Page Builder (cœur + projet), voir src/sections/
  ...pageBuilderSections,
  // Types propres au projet (documents/objets non-sections), voir project.ts
  ...projectSchemaTypes,
]
