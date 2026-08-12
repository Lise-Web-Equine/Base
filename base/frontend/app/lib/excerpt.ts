import type { PortableTextBlock } from "sanity";

/** Concatène le texte brut d'un contenu Portable Text (blocs de texte). */
function toPlainText(blocks?: PortableTextBlock[] | null): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter((b: any) => b?._type === "block" && Array.isArray(b.children))
    .map((b: any) => b.children.map((c: any) => c?.text ?? "").join(""))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Dérive un extrait à partir d'un contenu Portable Text : la première phrase,
 * tronquée intelligemment (au mot près, sans couper un mot) si elle dépasse
 * `maxLength`. Remplace l'ancien champ `excerpt` saisi à la main.
 */
export function excerptFromContent(
  content?: PortableTextBlock[] | null,
  maxLength = 160
): string {
  const text = toPlainText(content);
  if (!text) return "";

  // Première phrase (jusqu'à . ! ? … inclus), sinon tout le texte.
  const match = text.match(/^.*?[.!?…](\s|$)/);
  let sentence = (match ? match[0] : text).trim();

  // Troncature au mot près si trop longue.
  if (sentence.length > maxLength) {
    const truncated = sentence.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    sentence =
      (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated).replace(
        /[.,;:!?…\s]+$/,
        ""
      ) + "…";
  }
  return sentence;
}
