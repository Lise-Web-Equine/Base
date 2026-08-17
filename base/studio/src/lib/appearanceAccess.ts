// Forme minimale de l'utilisateur courant (compatible avec le contexte des
// callbacks `readOnly`/`hidden` de Sanity, qui expose `currentUser`).
type MaybeUser = {email?: string | null} | null

/**
 * Contrôle d'accès à l'APPARENCE des sections (CŒUR).
 *
 * Objectif : le client (rôle admin, car il doit éditer le contenu) ne modifie
 * pas l'apparence, mais l'agence si — en local comme en production.
 *
 * Deux leviers (variables d'environnement `SANITY_STUDIO_*`, injectées au build
 * par la CLI Sanity) :
 *  - `SANITY_STUDIO_APPEARANCE_ADMINS` : emails autorisés (séparés par des
 *    virgules) à éditer l'apparence, quel que soit l'environnement ;
 *  - `SANITY_STUDIO_ENABLE_APPEARANCE=true` : débloque l'apparence pour tout le
 *    monde (pratique en local).
 *
 * ⚠️ Il s'agit d'un verrou d'INTERFACE (Studio), pas d'une sécurité au niveau de
 * l'API : un admin disposant d'un token pourrait contourner le champ.
 */
const ENABLE_ALL = process.env.SANITY_STUDIO_ENABLE_APPEARANCE === 'true'

const ALLOWED_EMAILS = (process.env.SANITY_STUDIO_APPEARANCE_ADMINS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export function canEditAppearance(currentUser: MaybeUser): boolean {
  if (ENABLE_ALL) return true
  const email = currentUser?.email?.toLowerCase()
  return !!email && ALLOWED_EMAILS.includes(email)
}

/**
 * `readOnly` prêt à l'emploi pour les champs d'apparence : verrouillé sauf pour
 * les emails autorisés (ou si le déblocage global est actif).
 */
export const appearanceReadOnly = (context: {currentUser: MaybeUser}): boolean =>
  !canEditAppearance(context.currentUser)
