/**
 * Chargement de l'outil de mesure d'audience (CŒUR).
 *
 * Piloté depuis Sanity (Réglages → Modules → Analytics) et basé sur le module
 * officiel `@nuxt/scripts` : chargement optimisé (onNuxtReady), proxy first-party
 * et API de consentement intégrée. Trois fournisseurs :
 * - Plausible : sans cookie, aucun consentement requis (recommandé).
 * - Matomo : mode sans cookie activable (RGPD) ou classique.
 * - Google Analytics 4 : chargé avec Consent Mode v2 (tout refusé par défaut) ;
 *   le consentement doit être accordé via la bannière (voir `consent.update`).
 *
 * Rien n'est chargé si le fournisseur est « none » ou si la configuration
 * requise est absente. À appeler dans le setup de `app.vue`.
 */
type AnalyticsSettings = {
  provider?: "none" | "plausible" | "matomo" | "googleAnalytics" | null;
  plausibleDomain?: string | null;
  plausibleScriptUrl?: string | null;
  matomoUrl?: string | null;
  matomoSiteId?: string | null;
  matomoDisableCookies?: boolean | null;
  gaMeasurementId?: string | null;
};

export function useAnalytics(
  settings: {analytics?: AnalyticsSettings | null} | null | undefined
) {
  const a = settings?.analytics;
  if (!a || !a.provider || a.provider === "none") return;

  if (a.provider === "plausible" && a.plausibleDomain) {
    // Instance auto-hébergée : fournir le script ET l'endpoint d'événements.
    const selfHosted = a.plausibleScriptUrl
      ? {
          scriptInput: {src: a.plausibleScriptUrl},
          endpoint: `${new URL(a.plausibleScriptUrl).origin}/api/event`,
        }
      : {};
    useScriptPlausibleAnalytics({
      domain: a.plausibleDomain,
      ...selfHosted,
    });
    return;
  }

  if (a.provider === "matomo" && a.matomoUrl && a.matomoSiteId) {
    useScriptMatomoAnalytics({
      matomoUrl: a.matomoUrl,
      siteId: a.matomoSiteId,
      disableCookies: a.matomoDisableCookies !== false,
    });
    return;
  }

  if (a.provider === "googleAnalytics" && a.gaMeasurementId) {
    // Consent Mode v2 : tout refusé par défaut (à accorder via la bannière avec
    // `consent.update(...)` retourné par le composable).
    useScriptGoogleAnalytics({
      id: a.gaMeasurementId,
      defaultConsent: {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      },
    });
    return;
  }
}
