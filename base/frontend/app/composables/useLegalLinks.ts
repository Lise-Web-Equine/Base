import type { NavigationMenuItem } from "@nuxt/ui";
import { legalLinksQuery } from "~/sanity/queries";

/**
 * Liens vers les pages légales existantes (singleton legalTexts), pour le pied
 * de page. Une page n'est listée que si son contenu est renseigné ; le libellé
 * reprend le titre Sanity (repli sur un libellé par défaut).
 */
export function useLegalLinks() {
  const { data } = useSanityQuery<LegalLinksQueryResult>(legalLinksQuery);

  const items = computed<NavigationMenuItem[]>(() => {
    const t = data.value;
    if (!t) return [];
    const out: NavigationMenuItem[] = [];
    if (t.hasLegalNotice) {
      out.push({ label: t.legalNoticeTitle || "Mentions légales", to: "/mentions-legales" });
    }
    if (t.hasPrivacy) {
      out.push({
        label: t.privacyTitle || "Politique de confidentialité",
        to: "/politique-confidentialite",
      });
    }
    if (t.hasTerms) {
      out.push({ label: t.termsTitle || "Conditions générales", to: "/conditions-generales" });
    }
    if (t.hasCookies) {
      out.push({ label: t.cookiesTitle || "Politique de cookies", to: "/politique-cookies" });
    }
    return out;
  });

  return { items };
}
