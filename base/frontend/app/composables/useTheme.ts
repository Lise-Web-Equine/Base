import { themeSettingsQuery } from "~/sanity/queries";

/**
 * Default theme used before Sanity data is available (SSR/first paint) or when a
 * field is left empty in the Studio. Keep these in sync with the fallbacks
 * declared in `app/assets/css/main.css`.
 */
const DEFAULT_THEME = {
  primary: "#ef4434",
  secondary: "#206ee9",
  background: "#ffffff",
  text: "#0d0e12",
  headingFont: '"Inter", sans-serif',
  bodyFont: '"Inter", sans-serif',
  baseFontSize: 16,
  lineHeight: 1.5,
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
  const { data: theme } = await useSanityQuery<ThemeSettingsQueryResult>(
    themeSettingsQuery,
  );

  const cssVariables = computed(() => ({
    "--theme-primary": theme.value?.primary || DEFAULT_THEME.primary,
    "--theme-secondary": theme.value?.secondary || DEFAULT_THEME.secondary,
    "--theme-background": theme.value?.background || DEFAULT_THEME.background,
    "--theme-text": theme.value?.text || DEFAULT_THEME.text,
    "--theme-heading-font": theme.value?.headingFont || DEFAULT_THEME.headingFont,
    "--theme-body-font": theme.value?.bodyFont || DEFAULT_THEME.bodyFont,
    "--theme-base-font-size": `${theme.value?.baseFontSize || DEFAULT_THEME.baseFontSize}px`,
    "--theme-line-height": String(theme.value?.lineHeight || DEFAULT_THEME.lineHeight),
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
