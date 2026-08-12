import { settingsQuery } from "~/sanity/queries";

/**
 * État de la rubrique Blog / Actualités, piloté depuis les Réglages du site
 * (Réglages → Blog / Actualités).
 *
 * - `enabled` : la rubrique est-elle activée ?
 * - `label`   : nom affiché sur le site (« Blog » ou « Actualités »).
 *
 * Utilisé par la page liste, la page article et le menu d'en-tête pour afficher
 * la rubrique et 404 les pages `/posts` lorsque le blog est désactivé.
 */
export function useBlog() {
  const { data: settings } = useSanityQuery<SettingsQueryResult>(settingsQuery);

  const enabled = computed(() => settings.value?.blog?.enabled === true);
  const label = computed(() =>
    settings.value?.blog?.label === "actualites" ? "Actualités" : "Blog"
  );

  return { enabled, label };
}
