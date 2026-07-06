/**
 * Convertit un slot de couleur du thème (ex: "background", "primary") en
 * référence à sa variable CSS Tailwind (ex: "var(--color-background)").
 * Les slots sont nommés en un seul mot minuscule (voir `studio/src/colorSlots.ts`),
 * donc la valeur correspond directement au token `--color-<slot>`.
 * Voir `app/assets/css/main.css` et le singleton `themeSettings`.
 */
export function colorSlotToCssVar(slot: string | undefined | null): string | undefined {
  if (!slot) return undefined;
  return `var(--color-${slot})`;
}

export function linkResolver(link: Link | undefined) {
  if (!link) return null;

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = "href";
  }

  switch (link.linkType) {
    case "href":
      return link.href || null;
    case "page":
      if (link?.page && typeof link.page === "string") {
        return `/${link.page}`;
      }
      return null;
    case "post":
      if (link?.post && typeof link.post === "string") {
        return `/posts/${link.post}`;
      }
      return null;
    case "anchor":
      return link?.anchor ? `#${link.anchor}` : null;
    default:
      return null;
  }
}
