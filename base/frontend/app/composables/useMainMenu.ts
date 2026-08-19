import type { NavigationMenuItem } from "@nuxt/ui";
import { stegaClean } from "@sanity/client/stega";
import { navigationQuery, navPagesQuery } from "~/sanity/queries";
import { linkResolver } from "~/lib/utils";

/**
 * Source UNIQUE du menu principal du site, partagée par l'en-tête et le pied de
 * page (colonne « Navigation »). Garantit des liens identiques aux deux endroits.
 *
 * `useSanityQuery` déduplique par clé : les requêtes ne sont donc exécutées
 * qu'une fois même si le composable est appelé dans plusieurs composants.
 *
 * Comportement : si le « Menu principal » (Navigation → En-tête) est configuré,
 * il fait foi tel quel ; sinon on retombe sur un menu par défaut (Accueil, les
 * pages existantes, puis Blog/Actualités si activé) — le même que celui écrit
 * par le bouton « Synchroniser » du Studio.
 */
export function useMainMenu() {
  const { data: navigation } =
    useSanityQuery<NavigationQueryResult>(navigationQuery);
  const { data: pages } = useSanityQuery<NavPagesQueryResult>(navPagesQuery);
  const { enabled: blogEnabled, label: blogLabel } = useBlog();

  // Résout un lien Sanity vers une cible NuxtLink (`to`).
  const toTarget = (link: unknown) => linkResolver(link as Link) ?? undefined;

  const menuItems = computed(() => navigation.value?.headerMenu ?? []);

  // Une entrée Sanity → item NavigationMenu (dropdowns natifs pour les enfants).
  const mapItem = (
    item: (typeof menuItems.value)[number]
  ): NavigationMenuItem => ({
    label: item.label ?? "",
    to: item.link ? toTarget(item.link) : undefined,
    children: item.children?.length
      ? item.children.map((child) => ({
          label: child.label ?? "",
          to: child.link ? toTarget(child.link) : undefined,
        }))
      : undefined,
  });

  // Menu par défaut (fallback) : Accueil, pages du site, puis Blog si activé.
  const fallbackItems = computed<NavigationMenuItem[]>(() => {
    const arr: NavigationMenuItem[] = [{ label: "Accueil", to: "/" }];
    for (const p of pages.value ?? []) {
      arr.push({ label: p.name ?? "", to: p.slug ? `/${p.slug}` : undefined });
    }
    if (blogEnabled.value) arr.push({ label: blogLabel.value, to: "/articles" });
    return arr;
  });

  // Liens affichés : menu configuré s'il existe, sinon le menu par défaut.
  const allItems = computed<NavigationMenuItem[]>(() =>
    menuItems.value.length ? menuItems.value.map(mapItem) : fallbackItems.value
  );

  // Alignement d'une entrée (gauche/droite), utilisé pour la nav des deux côtés.
  const alignOf = (item: (typeof menuItems.value)[number]) =>
    stegaClean(item.align) === "droite" ? "droite" : "gauche";

  return { navigation, menuItems, mapItem, allItems, alignOf, toTarget };
}
