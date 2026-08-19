import { stegaClean } from "@sanity/client/stega";
import { themeSettingsQuery } from "~/sanity/queries";

/**
 * Default theme used before Sanity data is available (SSR/first paint) or when a
 * field is left empty in the Studio. Keep these in sync with the fallbacks
 * declared in `app/assets/css/main.css`.
 */
const DEFAULT_THEME = {
  primary: "#ef4434",
  secondary: "#206ee9",
  accent: "#8f57ef",
  background: "#ffffff",
  surface: "#1b1d27",
  light: "#f6f6f8",
  foreground: "#0d0e12",
  muted: "#727892",
  border: "#e3e4e8",
  success: "#16a34a",
  warning: "#d97706",
  error: "#dc2626",
  fontDisplay: '"Inter", sans-serif',
  fontBody: '"Inter", sans-serif',
  fontAccent: '"Inter", sans-serif',
  fontHeadline: '"Inter", sans-serif',
  // Mise en forme (styles atomiques calculés dans main.css).
  typeScale: "1.2",
  headingWeight: "700",
  headlineWeight: "600",
  accentWeight: "600",
  displayCase: "none",
  accentCase: "uppercase",
  headlineCase: "none",
  radius: "0.75rem",
  contentWidth: "72ch",
  density: "1",
  siteMaxWidth: "1280px",
} as const;

/**
 * Fetches the global theme from Sanity (themeSettings singleton) and injects it
 * as CSS variables (--theme-*) on :root. Tailwind v4 maps these to the
 * --color-* tokens defined in main.css, so utilities like `bg-primary`,
 * `text-text` or `bg-background` reflect the configured theme dynamically.
 *
 * Injection is done through useHead so the variables are present in the SSR
 * HTML, avoiding any flash of unstyled / default colors.
 */
export async function useTheme() {
  // Do NOT await here: keep the Nuxt instance context so the useHead() call
  // below stays inside setup. `useSanityQuery` returns the reactive refs
  // synchronously (and is awaitable); we await it at the very end for SSR.
  const query = useSanityQuery<ThemeSettingsQueryResult>(themeSettingsQuery);
  const theme = query.data;

  // Visual Editing (`visualEditing.stega: true`) ajoute des caractères
  // invisibles (Content Source Maps) dans toutes les chaînes renvoyées par
  // Sanity. Utilisées telles quelles comme valeurs CSS, elles rendent les
  // déclarations invalides — le thème n'est alors PAS appliqué (surtout dans
  // l'aperçu Presentation). On nettoie donc les valeurs avant injection.
  const cleanTheme = computed(() => stegaClean(theme.value) ?? undefined);

  const cssVariables = computed(() => {
    const t = cleanTheme.value;
    return {
      "--theme-primary": t?.primary || DEFAULT_THEME.primary,
      "--theme-secondary": t?.secondary || DEFAULT_THEME.secondary,
      "--theme-accent": t?.accent || DEFAULT_THEME.accent,
      "--theme-background": t?.background || DEFAULT_THEME.background,
      "--theme-surface": t?.surface || DEFAULT_THEME.surface,
      "--theme-light": t?.light || DEFAULT_THEME.light,
      "--theme-foreground": t?.foreground || DEFAULT_THEME.foreground,
      "--theme-muted": t?.muted || DEFAULT_THEME.muted,
      "--theme-border": t?.border || DEFAULT_THEME.border,
      "--theme-success": t?.success || DEFAULT_THEME.success,
      "--theme-warning": t?.warning || DEFAULT_THEME.warning,
      "--theme-error": t?.error || DEFAULT_THEME.error,
      "--theme-font-display": t?.fontDisplay || DEFAULT_THEME.fontDisplay,
      "--theme-font-body": t?.fontBody || DEFAULT_THEME.fontBody,
      "--theme-font-accent": t?.fontAccent || DEFAULT_THEME.fontAccent,
      "--theme-font-headline": t?.fontHeadline || DEFAULT_THEME.fontHeadline,
      "--theme-type-scale": t?.typeScale || DEFAULT_THEME.typeScale,
      "--theme-heading-weight": t?.headingWeight || DEFAULT_THEME.headingWeight,
      "--theme-headline-weight": t?.headlineWeight || DEFAULT_THEME.headlineWeight,
      "--theme-accent-weight": t?.accentWeight || DEFAULT_THEME.accentWeight,
      "--theme-display-case": t?.displayCase || DEFAULT_THEME.displayCase,
      "--theme-accent-case": t?.accentCase || DEFAULT_THEME.accentCase,
      "--theme-headline-case": t?.headlineCase || DEFAULT_THEME.headlineCase,
      "--theme-radius": t?.radius || DEFAULT_THEME.radius,
      "--theme-content-width": t?.contentWidth || DEFAULT_THEME.contentWidth,
      "--theme-density": t?.density || DEFAULT_THEME.density,
      "--theme-site-max": t?.siteMaxWidth || DEFAULT_THEME.siteMaxWidth,
      // Fonds d'en-tête / pied de page : injectés SEULEMENT si choisis dans le
      // thème. Sinon la variable reste absente et main.css retombe sur la
      // couleur de fond du site (var(--color-background)).
      ...(t?.headerColor ? {"--theme-header-bg": t.headerColor} : {}),
      ...(t?.footerColor ? {"--theme-footer-bg": t.footerColor} : {}),
    };
  });

  const cssText = computed(() =>
    Object.entries(cssVariables.value)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" "),
  );

  // Chargement dynamique des polices choisies dans Sanity via le proxy local
  // (/api/fonts/css). Les polices sont donc servies depuis notre domaine — pas
  // d'appel client vers Google (RGPD) — et n'importe quelle police du thème
  // fonctionne sans rebuild. On n'extrait que le nom de famille (avant la
  // virgule de repli) et on dédoublonne.
  const familyOf = (v?: string) =>
    (v?.split(",")[0] ?? "").replace(/["']/g, "").trim();

  const fontsHref = computed(() => {
    const t = cleanTheme.value;
    const families = [
      familyOf(t?.fontDisplay),
      familyOf(t?.fontBody),
      familyOf(t?.fontAccent),
      familyOf(t?.fontHeadline),
    ].filter((f, i, arr) => f && arr.indexOf(f) === i);
    if (!families.length) return "";
    const params = new URLSearchParams();
    for (const f of families) params.append("family", f);
    return `/api/fonts/css?${params.toString()}`;
  });

  useHead({
    style: [
      {
        id: "theme-settings",
        innerHTML: computed(() => `:root { ${cssText.value} }`),
      },
    ],
  });

  // Lien séparé (forme fonction) pour ne rien émettre tant qu'aucune police
  // n'est déterminée (évite un <link href=""> qui recharge la page courante).
  useHead(() => ({
    link: fontsHref.value
      ? [{key: "theme-fonts", rel: "stylesheet", href: fontsHref.value}]
      : [],
  }));

  // useHead est déjà enregistré (contexte de setup préservé) : on peut enfin
  // attendre la requête pour que le SSR sérialise le thème réel (pas de flash
  // des couleurs par défaut au premier rendu).
  await query;

  return { theme, cssVariables };
}
