/**
 * Rognage Sanity (fractions 0→1 retirées de chaque côté), tel que stocké sur un
 * champ image avec `hotspot: true`.
 */
export interface SanityCrop {
  top?: number | null;
  bottom?: number | null;
  left?: number | null;
  right?: number | null;
}

/**
 * Construit une URL d'image Sanity (CDN) à partir de la référence d'asset
 * (`image-<id>-<largeur>x<hauteur>-<ext>`), sans dépendre de <SanityImage> /
 * @nuxt/image.
 *
 * Contournement : le wrapper <SanityImage> de @nuxtjs/sanity ne transmet pas la
 * largeur à @nuxt/image et génère un srcset dégénéré (1px), d'où des images qui
 * ne s'affichent pas. On génère donc l'URL nous-mêmes pour les images clés.
 *
 * `crop` (optionnel) applique le rognage éditorial via le paramètre `rect` :
 * la zone conservée est calculée en pixels à partir des dimensions d'origine.
 */
export function sanityImageUrl(
  ref?: string | null,
  projectId?: string,
  dataset?: string,
  params = "auto=format&fit=max&w=1600",
  crop?: SanityCrop | null
): string {
  if (!ref || !projectId || !dataset) return "";
  // Format de la référence : "image-<id>-<w>x<h>-<ext>". L'id ne contient pas de "-".
  const [, id, dimensions, ext] = ref.split("-");
  if (!id || !dimensions || !ext) return "";

  let query = params;
  if (crop && (crop.top || crop.bottom || crop.left || crop.right)) {
    const [w, h] = dimensions.split("x").map(Number);
    if (w && h) {
      const leftPx = Math.round((crop.left ?? 0) * w);
      const topPx = Math.round((crop.top ?? 0) * h);
      const rightPx = Math.round((crop.right ?? 0) * w);
      const bottomPx = Math.round((crop.bottom ?? 0) * h);
      const cropW = Math.max(1, w - leftPx - rightPx);
      const cropH = Math.max(1, h - topPx - bottomPx);
      query = `rect=${leftPx},${topPx},${cropW},${cropH}&${params}`;
    }
  }
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${ext}?${query}`;
}
