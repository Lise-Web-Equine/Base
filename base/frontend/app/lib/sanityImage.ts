/**
 * Construit une URL d'image Sanity (CDN) à partir de la référence d'asset
 * (`image-<id>-<largeur>x<hauteur>-<ext>`), sans dépendre de <SanityImage> /
 * @nuxt/image.
 *
 * Contournement : le wrapper <SanityImage> de @nuxtjs/sanity ne transmet pas la
 * largeur à @nuxt/image et génère un srcset dégénéré (1px), d'où des images qui
 * ne s'affichent pas. On génère donc l'URL nous-mêmes pour les images clés.
 */
export function sanityImageUrl(
  ref?: string | null,
  projectId?: string,
  dataset?: string,
  params = "auto=format&fit=max&w=1600"
): string {
  if (!ref || !projectId || !dataset) return "";
  // Format de la référence : "image-<id>-<w>x<h>-<ext>". L'id ne contient pas de "-".
  const [, id, dimensions, ext] = ref.split("-");
  if (!id || !dimensions || !ext) return "";
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}?${params}`;
}
