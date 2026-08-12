import {defineField, defineType} from '@sanity/types'
import {EnvelopeIcon} from '@sanity/icons'

/**
 * Section "Formulaire de contact". Bloc de page builder affichant un formulaire
 * de contact prédéfini (nom, prénom, email, téléphone, sujet, message + consentement).
 *
 * L'envoi se fait côté serveur via Resend (route /api/contact). Le destinataire
 * de l'email est défini dans la config serveur (CONTACT_TO) et n'est volontairement
 * PAS modifiable depuis le Studio (sécurité : évite un relais de spam).
 */
export const contactSection = defineType({
  name: 'contactSection',
  title: 'Formulaire de contact',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Sur-titre',
      type: 'string',
      description: 'Petit texte affiché au-dessus du titre (optionnel).',
    }),
    defineField({
      name: 'heading',
      title: 'Titre',
      type: 'string',
      initialValue: 'Contactez-nous',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Introduction',
      type: 'text',
      rows: 3,
      description: 'Texte affiché au-dessus du formulaire (optionnel).',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Libellé du bouton',
      type: 'string',
      initialValue: 'Envoyer',
    }),
    defineField({
      name: 'successMessage',
      title: 'Message de confirmation',
      type: 'text',
      rows: 2,
      description: 'Message affiché après un envoi réussi.',
      initialValue: 'Merci, votre message a bien été envoyé. Nous vous répondrons rapidement.',
    }),
    defineField({
      name: 'privacyUrl',
      title: 'Lien politique de confidentialité',
      type: 'url',
      description:
        'Optionnel. Si renseigné, un lien est ajouté à la case de consentement RGPD.',
      validation: (Rule) => Rule.uri({allowRelative: true, scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Formulaire de contact',
        subtitle: 'Formulaire de contact',
      }
    },
  },
})
