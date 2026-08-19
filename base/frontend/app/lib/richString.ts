/**
 * Mini-balisage pour les champs texte SIMPLES (titres, descriptions…).
 *
 * Règles, alignées sur la convention éditeur :
 *  - `**mot**` → gras.
 *  - `*mot*`   → typo d'accent du thème (police + épaisseur + casse d'accent).
 *  - `_mot_`   → italique.
 *  - `//`      → saut de ligne.
 *
 * Ex. : `Pour une communication//**alignée** et _rentable_`.
 *
 * Le texte est d'abord ÉCHAPPÉ (aucune injection HTML possible depuis Sanity),
 * puis seules nos balises contrôlées sont réintroduites → sûr pour `v-html`.
 */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseInlineMarkup(text?: string | null): string {
  if (!text) return "";
  let html = escapeHtml(String(text));
  // Saut de ligne forcé : `//` (mais pas `://` d'une URL).
  html = html.replace(/(?<!:)\/\//g, "<br>");
  // Gras : `**mot**` (traité avant l'accent pour ne pas confondre avec `*`).
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, "<strong>$1</strong>");
  // Typo d'accent : `*mot*` (police + épaisseur + casse d'accent du thème).
  html = html.replace(/\*([^*\n]+?)\*/g, '<span class="a-accent">$1</span>');
  // Italique : `_mot_`.
  html = html.replace(/_([^_\n]+?)_/g, "<em>$1</em>");
  return html;
}
