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
  bgMain: "#ffffff",
  bgSurface: "#f6f6f8",
  textMain: "#0d0e12",
  textMuted: "#727892",
  border: "#e3e4e8",
  fontDisplay: '"Inter", sans-serif',
  fontBody: '"Inter", sans-serif',
  fontAccent: '"Inter", sans-serif',
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
    "--theme-bg-main": theme.value?.bgMain || DEFAULT_THEME.bgMain,
    "--theme-bg-surface": theme.value?.bgSurface || DEFAULT_THEME.bgSurface,
    "--theme-text-main": theme.value?.textMain || DEFAULT_THEME.textMain,
    "--theme-text-muted": theme.value?.textMuted || DEFAULT_THEME.textMuted,
    "--theme-border": theme.value?.border || DEFAULT_THEME.border,
    "--theme-font-display": theme.value?.fontDisplay || DEFAULT_THEME.fontDisplay,
    "--theme-font-body": theme.value?.fontBody || DEFAULT_THEME.fontBody,
    "--theme-font-accent": theme.value?.fontAccent || DEFAULT_THEME.fontAccent,
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
