/**
 * Correspondance plateforme → icône Iconify (collection `simple-icons`).
 *
 * CŒUR : mapping standard. Ne pas modifier ici pour un client.
 * PROJET : surcharger/ajouter via `projectSocialIcons` (ex. autre collection,
 * icône personnalisée). La valeur est un nom d'icône Iconify complet
 * (ex. "simple-icons:instagram").
 */
const coreSocialIcons: Record<string, string> = {
  facebook: "simple-icons:facebook",
  instagram: "simple-icons:instagram",
  x: "simple-icons:x",
  linkedin: "simple-icons:linkedin",
  youtube: "simple-icons:youtube",
  tiktok: "simple-icons:tiktok",
  pinterest: "simple-icons:pinterest",
  whatsapp: "simple-icons:whatsapp",
};

/**
 * PROJET : surcharges propres au site (SEUL bloc à modifier par projet).
 * Exemple : { threads: "simple-icons:threads" } ou remplacer une icône.
 */
const projectSocialIcons: Record<string, string> = {};

const socialIcons: Record<string, string> = {
  ...coreSocialIcons,
  ...projectSocialIcons,
};

/** Nom d'icône Iconify pour une plateforme, ou undefined si inconnue. */
export function socialIconFor(platform?: string | null): string | undefined {
  if (!platform) return undefined;
  return socialIcons[platform];
}
