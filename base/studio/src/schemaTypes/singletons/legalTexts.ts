import {defineField, defineType} from '@sanity/types'
import {DocumentTextIcon} from '@sanity/icons'

/**
 * Singleton des textes légaux (PROJET).
 *
 * Une seule instance (documentId 'legalTexts'). Regroupe les informations
 * légales du site : informations sur l'éditeur, l'hébergeur, ainsi que les
 * pages légales (mentions légales, politique de confidentialité, CGV/CGU et
 * cookies). Verrouillé dans la structure du Studio.
 */

// --- Helper Portable Text (contenu enrichi par défaut) ---------------------
// Génère des blocs `blockContent` valides pour les `initialValue`. Les clés
// sont uniques au sein du module (un seul compteur partagé).
let ptKeyCounter = 0
const ptKey = () => `pt${(ptKeyCounter++).toString(36)}`

type BlockStyle = 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
const ptBlock = (style: BlockStyle, text: string, listItem?: 'bullet' | 'number') => ({
  _type: 'block',
  _key: ptKey(),
  style,
  markDefs: [],
  ...(listItem ? {listItem, level: 1} : {}),
  children: [{_type: 'span', _key: ptKey(), text, marks: []}],
})
const h2 = (text: string) => ptBlock('h2', text)
const p = (text: string) => ptBlock('normal', text)
const li = (text: string) => ptBlock('normal', text, 'bullet')

// --- Contenus par défaut ----------------------------------------------------

const legalNoticeIntroDefault =
  "Les présentes mentions légales ont pour objet d'informer les utilisateurs du site sur l'identité de l'éditeur, de l'hébergeur, ainsi que sur les conditions d'utilisation du site et de ses services."

const legalNoticeContentDefault = [
  h2('Propriété intellectuelle'),
  p(
    "L'ensemble des éléments présents sur ce site (textes, images, graphismes, logos, vidéos, icônes, sons, logiciels, etc.) est protégé par le droit de la propriété intellectuelle français et international. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de l'éditeur.",
  ),
  p(
    "Toute exploitation non autorisée du site ou de l'un quelconque de ses éléments est susceptible d'engager la responsabilité civile et pénale de l'utilisateur.",
  ),
  h2('Liens hypertextes'),
  p(
    "Le site peut contenir des liens hypertextes vers d'autres sites internet. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur politique de confidentialité ou leur fonctionnement.",
  ),
  h2('Cookies'),
  p(
    "Le site peut être amené à utiliser des cookies à des fins de mesure d'audience et d'amélioration de l'expérience utilisateur. L'utilisateur peut s'opposer à l'enregistrement des cookies en configurant son navigateur. Pour plus d'informations, consultez notre politique de confidentialité.",
  ),
  h2('Limitation de responsabilité'),
  p(
    "L'éditeur s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur ce site, dont il se réserve le droit de corriger, à tout moment et sans préavis, le contenu. Toutefois, l'éditeur ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.",
  ),
  p(
    "En conséquence, l'éditeur décline toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles sur le site, pour tous dommages résultant d'une intrusion frauduleuse d'un tiers ayant entraîné une modification des informations mises à disposition, et plus généralement de tout dommage direct ou indirect, quelles qu'en soient les causes, origines, natures ou conséquences.",
  ),
  h2('Droit applicable et juridiction compétente'),
  p(
    "Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut de résolution amiable, les tribunaux français seront seuls compétents.",
  ),
]

const privacyIntroDefault =
  "La présente politique de confidentialité a pour objet d'informer les utilisateurs du site sur la manière dont leurs données personnelles sont collectées et traitées, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés."

const privacyContentDefault = [
  h2('Responsable du traitement'),
  p(
    "Le responsable du traitement des données collectées sur le site est l'éditeur du site, dont les coordonnées figurent dans les mentions légales.",
  ),
  h2('Données collectées'),
  p("Les données personnelles susceptibles d'être collectées sur le site sont :"),
  li('Données d\'identification : nom, prénom, adresse email, numéro de téléphone'),
  li(
    'Données de connexion : adresse IP, type et version du navigateur, pages visitées, date et heure de connexion',
  ),
  li('Données transmises via les formulaires de contact ou de demande de devis'),
  li('Données relatives à la navigation : cookies, préférences utilisateur'),
  h2('Finalités du traitement'),
  p('Les données collectées sont utilisées pour les finalités suivantes :'),
  li('Répondre aux demandes de contact et de devis'),
  li('Assurer le suivi de la relation commerciale'),
  li('Améliorer le fonctionnement et l\'ergonomie du site'),
  li('Établir des statistiques de fréquentation'),
  li('Respecter les obligations légales et réglementaires'),
  h2('Base légale du traitement'),
  p(
    "Les traitements de données reposent sur le consentement de l'utilisateur (formulaires, cookies non essentiels), l'exécution d'un contrat ou de mesures précontractuelles (devis, prestations), et le respect d'obligations légales (facturation, archivage).",
  ),
  h2('Durée de conservation'),
  p(
    "Les données personnelles sont conservées pendant la durée strictement nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées, augmentée de la durée légale de conservation. À titre indicatif : 3 ans à compter du dernier contact pour les prospects, 10 ans pour les documents comptables, 13 mois maximum pour les cookies.",
  ),
  h2('Destinataires des données'),
  p(
    "Les données collectées sont destinées exclusivement à l'éditeur du site et, le cas échéant, à ses sous-traitants techniques (hébergeur, prestataires de services analytiques, outils de gestion). Aucune donnée n'est cédée ni vendue à des tiers à des fins commerciales.",
  ),
  h2('Vos droits'),
  p('Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :'),
  li('Droit d\'accès : obtenir la communication des données vous concernant'),
  li('Droit de rectification : faire corriger des données inexactes ou incomplètes'),
  li('Droit à l\'effacement (« droit à l\'oubli »)'),
  li('Droit à la limitation du traitement'),
  li('Droit à la portabilité des données'),
  li('Droit d\'opposition au traitement'),
  li('Droit de retirer votre consentement à tout moment'),
  li('Droit d\'introduire une réclamation auprès de la CNIL (www.cnil.fr)'),
  p(
    "Pour exercer ces droits, vous pouvez contacter l'éditeur par email ou par courrier postal aux coordonnées indiquées dans les mentions légales. Une réponse vous sera apportée dans un délai maximum d'un mois.",
  ),
  h2('Cookies'),
  p(
    "Le site utilise des cookies pour assurer son bon fonctionnement, mesurer l'audience et améliorer l'expérience utilisateur. Vous pouvez à tout moment paramétrer l'utilisation des cookies via la bannière de consentement ou directement dans les paramètres de votre navigateur.",
  ),
  h2('Sécurité'),
  p(
    "L'éditeur met en œuvre des mesures techniques et organisationnelles appropriées pour assurer la sécurité, l'intégrité et la confidentialité des données personnelles, et notamment empêcher qu'elles soient déformées, endommagées ou que des tiers non autorisés y aient accès.",
  ),
]

const termsIntroDefault =
  "Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des prestations de services proposées par l'éditeur. Toute commande implique l'acceptation sans réserve par le client des présentes CGV."

const termsContentDefault = [
  h2('Article 1 — Objet'),
  p(
    "Les présentes CGV ont pour objet de définir les conditions dans lesquelles l'éditeur fournit ses prestations de services à ses clients professionnels ou particuliers. Toute commande de prestation emporte adhésion pleine et entière du client aux présentes CGV.",
  ),
  h2('Article 2 — Devis et commande'),
  p(
    "Chaque prestation fait l'objet d'un devis détaillé établi gratuitement par l'éditeur, valable 30 jours à compter de sa date d'émission. La commande est considérée comme ferme et définitive à réception du devis signé portant la mention « bon pour accord » et du versement de l'acompte éventuellement demandé.",
  ),
  h2('Article 3 — Prix'),
  p(
    "Les prix des prestations sont indiqués en euros et établis sur la base des informations fournies par le client lors de l'élaboration du devis. Les prix sont fermes et non révisables pendant la durée de validité du devis. Toute prestation complémentaire non prévue au devis initial fera l'objet d'un avenant.",
  ),
  h2('Article 4 — Modalités de paiement'),
  p('Sauf disposition contraire prévue au devis, les modalités de paiement sont les suivantes :'),
  li('Un acompte de 30 % à 50 % à la commande'),
  li('Le solde à la livraison ou selon échéancier précisé au devis'),
  p(
    "Les paiements s'effectuent par virement bancaire ou par tout autre moyen convenu entre les parties. En cas de retard de paiement, des pénalités de retard au taux légal en vigueur seront appliquées, ainsi qu'une indemnité forfaitaire de 40 € pour frais de recouvrement (article L.441-10 du Code de commerce).",
  ),
  h2("Article 5 — Délais d'exécution"),
  p(
    "Les délais d'exécution sont indiqués à titre informatif dans le devis. L'éditeur s'engage à mettre en œuvre tous les moyens nécessaires pour respecter ces délais. Tout retard imputable au client (retard dans la fourniture des éléments, validations, etc.) entraînera un décalage équivalent du planning.",
  ),
  h2('Article 6 — Obligations des parties'),
  ptBlock('h3', "Obligations de l'éditeur"),
  p(
    "L'éditeur s'engage à mener à bien la tâche pour laquelle il a été mandaté, conformément aux règles de l'art et aux meilleurs standards de qualité. Il est tenu à une obligation de moyens et non de résultat.",
  ),
  ptBlock('h3', 'Obligations du client'),
  p(
    "Le client s'engage à fournir l'ensemble des informations, documents et accès nécessaires à la bonne exécution de la prestation. Il garantit qu'il dispose des droits sur les éléments transmis (textes, images, marques, etc.).",
  ),
  h2('Article 7 — Propriété intellectuelle'),
  p(
    "Les créations réalisées par l'éditeur restent sa propriété intellectuelle jusqu'au paiement intégral de la prestation. Une fois le paiement intégral effectué, les droits d'utilisation des livrables sont transférés au client selon les modalités précisées au devis.",
  ),
  h2('Article 8 — Droit de rétractation (consommateurs)'),
  p(
    "Conformément à l'article L.221-18 du Code de la consommation, le client consommateur dispose d'un délai de 14 jours à compter de la conclusion du contrat pour exercer son droit de rétractation, sans avoir à justifier de motifs ni à payer de pénalités. Toutefois, ce droit ne s'applique pas si l'exécution de la prestation a commencé, avec l'accord exprès du client, avant la fin du délai de rétractation.",
  ),
  h2('Article 9 — Responsabilité'),
  p(
    "La responsabilité de l'éditeur ne saurait être engagée pour tout dommage indirect subi par le client (perte d'exploitation, perte de chiffre d'affaires, perte de données, etc.). En tout état de cause, la responsabilité de l'éditeur est limitée au montant des sommes effectivement perçues au titre de la prestation concernée.",
  ),
  h2('Article 10 — Confidentialité'),
  p(
    "Chaque partie s'engage à conserver la confidentialité des informations et documents échangés dans le cadre de la prestation, et à ne pas les divulguer à des tiers sans autorisation préalable.",
  ),
  h2('Article 11 — Données personnelles'),
  p(
    "Les données personnelles collectées dans le cadre de l'exécution des prestations sont traitées conformément à la politique de confidentialité du site et à la réglementation en vigueur (RGPD).",
  ),
  h2('Article 12 — Litiges et droit applicable'),
  p(
    "Les présentes CGV sont régies par le droit français. En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, et pour les clients professionnels, les tribunaux du ressort du siège social de l'éditeur seront seuls compétents. Le client consommateur peut recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable du litige.",
  ),
]

export const legalTexts = defineType({
  name: 'legalTexts',
  title: 'Textes légaux',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'editor', title: 'Informations éditeur'},
    {name: 'host', title: 'Hébergeur'},
    {name: 'legalNotice', title: 'Mentions légales'},
    {name: 'privacy', title: 'Confidentialité'},
    {name: 'terms', title: 'CGV / CGU'},
    {name: 'cookies', title: 'Cookies'},
  ],
  fields: [
    // --- Informations éditeur ---
    defineField({
      name: 'editorName',
      title: 'Nom / Raison sociale',
      description: "Dénomination / raison sociale de l'entreprise.",
      type: 'string',
      group: 'editor',
    }),
    defineField({
      name: 'editorLegalForm',
      title: 'Forme juridique',
      description: 'Ex : SAS, SARL, EI, auto-entrepreneur, association...',
      type: 'string',
      group: 'editor',
    }),
    defineField({
      name: 'editorSiret',
      title: 'SIRET',
      type: 'string',
      group: 'editor',
    }),
    defineField({
      name: 'editorRcs',
      title: 'RCS / Immatriculation',
      type: 'string',
      group: 'editor',
    }),
    defineField({
      name: 'editorVat',
      title: 'Numéro de TVA intracommunautaire',
      type: 'string',
      group: 'editor',
    }),
    defineField({
      name: 'editorAddress',
      title: 'Adresse du siège social',
      type: 'text',
      rows: 3,
      group: 'editor',
    }),
    defineField({
      name: 'editorEmail',
      title: 'Email de contact',
      type: 'string',
      validation: (Rule) => Rule.email().warning('Veuillez saisir une adresse email valide.'),
      group: 'editor',
    }),
    defineField({
      name: 'editorPhone',
      title: 'Téléphone de contact',
      type: 'string',
      group: 'editor',
    }),
    defineField({
      name: 'editorPublicationDirector',
      title: 'Directeur / Directrice de la publication',
      type: 'string',
      group: 'editor',
    }),
    // --- Hébergeur ---
    defineField({
      name: 'hostName',
      title: "Nom de l'hébergeur",
      type: 'string',
      initialValue: 'Vercel',
      group: 'host',
    }),
    defineField({
      name: 'hostAddress',
      title: "Adresse de l'hébergeur",
      type: 'text',
      rows: 2,
      initialValue: '340 S Lemon Ave #4133, Walnut, CA 91789 - États-Unis',
      group: 'host',
    }),
    defineField({
      name: 'hostWebsite',
      title: "Site web de l'hébergeur",
      type: 'url',
      initialValue: 'https://vercel.com/',
      group: 'host',
    }),
    // --- Mentions légales ---
    defineField({
      name: 'legalNoticeTitle',
      title: 'Titre',
      type: 'string',
      initialValue: 'Mentions légales',
      group: 'legalNotice',
    }),
    defineField({
      name: 'legalNoticeIntro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      initialValue: legalNoticeIntroDefault,
      group: 'legalNotice',
    }),
    defineField({
      name: 'legalNoticeContent',
      title: 'Contenu additionnel',
      type: 'blockContent',
      initialValue: legalNoticeContentDefault,
      group: 'legalNotice',
    }),
    // --- Politique de confidentialité ---
    defineField({
      name: 'privacyTitle',
      title: 'Titre',
      type: 'string',
      initialValue: 'Politique de confidentialité',
      group: 'privacy',
    }),
    defineField({
      name: 'privacyIntro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      initialValue: privacyIntroDefault,
      group: 'privacy',
    }),
    defineField({
      name: 'privacyContent',
      title: 'Contenu',
      type: 'blockContent',
      initialValue: privacyContentDefault,
      group: 'privacy',
    }),
    // --- Conditions générales de vente / d'utilisation ---
    defineField({
      name: 'termsTitle',
      title: 'Titre',
      type: 'string',
      initialValue: 'Conditions générales',
      group: 'terms',
    }),
    defineField({
      name: 'termsIntro',
      title: 'Introduction',
      type: 'text',
      rows: 4,
      initialValue: termsIntroDefault,
      group: 'terms',
    }),
    defineField({
      name: 'termsContent',
      title: 'Contenu',
      type: 'blockContent',
      initialValue: termsContentDefault,
      group: 'terms',
    }),
    // --- Politique de cookies ---
    defineField({
      name: 'cookiesTitle',
      title: 'Titre',
      type: 'string',
      initialValue: 'Politique de cookies',
      group: 'cookies',
    }),
    defineField({
      name: 'cookiesContent',
      title: 'Contenu',
      type: 'blockContent',
      group: 'cookies',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Textes légaux'}
    },
  },
})
