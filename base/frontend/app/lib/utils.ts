/**
 * Convertit un slot de couleur du thème (ex: "bgMain", "primary") en
 * référence à sa variable CSS Tailwind (ex: "var(--color-bg-main)").
 * Voir `app/assets/css/main.css` et le singleton `themeSettings`.
 */
export function colorSlotToCssVar(slot: string | undefined | null): string | undefined {
  if (!slot) return undefined;
  const kebab = slot.replace(/([A-Z])/g, "-$1").toLowerCase();
  return `var(--color-${kebab})`;
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
