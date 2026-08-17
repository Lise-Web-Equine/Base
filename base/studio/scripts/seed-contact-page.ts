/**
 * Seed : crée une page "Contact" par défaut dans le dataset.
 *
 * Idempotent : si une page de slug `contact` existe déjà, le script ne fait rien
 * (aucun écrasement des modifications du client). Sûr à ré-exécuter.
 *
 * La page est pré-remplie avec les 2 briques Cœur :
 *   - contactSection  (formulaire)
 *   - faqSection      (quelques questions d'exemple)
 *
 * Utilisation (depuis studio/) :
 *   npm run seed:contact
 *   (équivaut à : sanity exec scripts/seed-contact-page.ts --with-user-token)
 *
 * L'authentification utilise ta session Sanity CLI (`sanity login`).
 */
import {getCliClient} from 'sanity/cli'
import {randomUUID} from 'node:crypto'

const client = getCliClient({apiVersion: '2025-10-20'})

// Identifiant déterministe : la page Contact est un document "épinglé" piloté par
// la structure du Studio (comme la page d'accueil). Un id fixe permet de la
// référencer de façon fiable sur tous les sites.
const CONTACT_ID = 'page-contact'

// Clé aléatoire courte pour les éléments de tableau Portable Text / pageBuilder.
const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// Un paragraphe Portable Text simple (bloc "normal").
const paragraph = (text: string) => ({
  _key: key(),
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{_key: key(), _type: 'span', marks: [], text}],
})

async function run() {
  // Une page Contact existe-t-elle déjà ? (par id fixe ou par slug)
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type == "page" && (_id == $id || slug.current == "contact")][0]{_id}`,
    {id: CONTACT_ID},
  )

  if (existing) {
    if (existing._id !== CONTACT_ID) {
      console.log(
        `⚠ Une page Contact existe déjà avec un autre identifiant (${existing._id}).` +
          `\n  Supprime-la puis relance ce script si tu veux la version épinglée (id "${CONTACT_ID}").`,
      )
    } else {
      console.log(`ℹ La page Contact (${CONTACT_ID}) existe déjà — aucune action.`)
    }
    return
  }

  const doc = {
    _id: CONTACT_ID,
    _type: 'page',
    name: 'Contact',
    slug: {_type: 'slug', current: 'contact'},
    pageHeader: {
      _type: 'pageHeader',
      title: 'Contact',
      description: 'Une question ? Écrivez-nous, nous vous répondrons rapidement.',
    },
    seoTitle: 'Contact',
    seoDescription: 'Contactez-nous : formulaire, coordonnées et questions fréquentes.',
    noIndex: false,
    pageBuilder: [
      {
        _key: key(),
        _type: 'contactSection',
        heading: 'Contactez-nous',
        intro: 'Remplissez le formulaire ci-dessous, nous reviendrons vers vous au plus vite.',
        submitLabel: 'Envoyer',
        successMessage:
          'Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.',
      },
      {
        _key: key(),
        _type: 'faqSection',
        heading: 'Questions fréquentes',
        items: [
          {
            _key: key(),
            _type: 'faqItem',
            question: 'Quels sont vos délais de réponse ?',
            answer: [paragraph('Nous répondons généralement sous 48 heures ouvrées.')],
          },
          {
            _key: key(),
            _type: 'faqItem',
            question: 'Où êtes-vous situés ?',
            answer: [paragraph('Retrouvez notre adresse complète en bas de page, dans le pied de page du site.')],
          },
        ],
      },
    ],
  }

  const created = await client.createIfNotExists(doc)
  console.log(`✔ Page Contact créée (${created._id}).`)
}

run().catch((err) => {
  console.error('✖ Échec du seed de la page Contact :', err)
  process.exit(1)
})
