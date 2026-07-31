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
  surface: "#f6f6f8",
  foreground: "#0d0e12",
  muted: "#727892",
  border: "#e3e4e8",
  fontDisplay: '"Inter", sans-serif',
  fontBody: '"Inter", sans-serif',
  fontAccent: '"Inter", sans-serif',
  // Mise en forme (styles atomiques calculés dans main.css).
  typeScale: "1.2",
  headingWeight: "700",
  radius: "0.75rem",
  contentWidth: "72ch",
  density: "1",
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

  const cssVariables = computed(() => ({
    "--theme-primary": theme.value?.primary || DEFAULT_THEME.primary,
    "--theme-secondary": theme.value?.secondary || DEFAULT_THEME.secondary,
    "--theme-accent": theme.value?.accent || DEFAULT_THEME.accent,
    "--theme-background": theme.value?.background || DEFAULT_THEME.background,
    "--theme-surface": theme.value?.surface || DEFAULT_THEME.surface,
    "--theme-foreground": theme.value?.foreground || DEFAULT_THEME.foreground,
    "--theme-muted": theme.value?.muted || DEFAULT_THEME.muted,
    "--theme-border": theme.value?.border || DEFAULT_THEME.border,
    "--theme-font-display": theme.value?.fontDisplay || DEFAULT_THEME.fontDisplay,
    "--theme-font-body": theme.value?.fontBody || DEFAULT_THEME.fontBody,
    "--theme-font-accent": theme.value?.fontAccent || DEFAULT_THEME.fontAccent,
    "--theme-type-scale": theme.value?.typeScale || DEFAULT_THEME.typeScale,
    "--theme-heading-weight": theme.value?.headingWeight || DEFAULT_THEME.headingWeight,
    "--theme-radius": theme.value?.radius || DEFAULT_THEME.radius,
    "--theme-content-width": theme.value?.contentWidth || DEFAULT_THEME.contentWidth,
    "--theme-density": theme.value?.density || DEFAULT_THEME.density,
  }));

  const cssText = computed(() =>
    Object.entries(cssVariables.value)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" "),
  );

  useHead({
    style: [
      {
        id: "theme-settings",
        innerHTML: computed(() => `:root { ${cssText.value} }`),
      },
    ],
  });

  return { theme, cssVariables };
}
