import { themeSettingsQuery } from "~/sanity/queries";

/**
 * Logique centralisée « fond sombre → texte clair » du thème.
 *
 * Chaque surface pilotable (en-tête, pied de page, fond principal, fond sombre)
 * porte un toggle clair/sombre dans le thème (champs `*Dark`). Ce composable en
 * dérive, pour une surface donnée :
 *  - `isDark`    : la surface est-elle sombre ?
 *  - `darkClass` : la classe à poser (`"dark"`) pour basculer le texte en clair
 *                  (voir l'override `.dark` de `main.css` + palette sombre Nuxt UI) ;
 *  - `navColor`  : couleur des liens de navigation — `neutral` sur fond sombre
 *                  (actif = clair, lisible quelle que soit la primaire), sinon
 *                  `primary`.
 *
 * En-tête / pied de page : si une couleur dédiée est définie, on suit son toggle ;
 * sinon on suit le toggle du fond principal (car ils retombent sur ce fond).
 *
 * `useSanityQuery` déduplique par clé → une seule requête, même appelé plusieurs fois.
 */
export type ThemeSurface = "header" | "footer" | "background" | "surface";

export function useSurfaceDark(surface: ThemeSurface) {
  const { data: theme } =
    useSanityQuery<ThemeSettingsQueryResult>(themeSettingsQuery);

  const isDark = computed(() => {
    const t = theme.value;
    switch (surface) {
      case "header":
        return t?.headerColor ? !!t?.headerColorDark : !!t?.backgroundDark;
      case "footer":
        return t?.footerColor ? !!t?.footerColorDark : !!t?.backgroundDark;
      case "surface":
        return !!t?.surfaceDark;
      case "background":
      default:
        return !!t?.backgroundDark;
    }
  });

  const darkClass = computed(() => (isDark.value ? "dark" : undefined));
  const navColor = computed<"neutral" | "primary">(() =>
    isDark.value ? "neutral" : "primary"
  );

  return { isDark, darkClass, navColor };
}
