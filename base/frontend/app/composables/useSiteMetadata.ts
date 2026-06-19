type SiteMetadata = {
  title?: string;
  description?: string;
  ogImage?: string;
  /** Type Open Graph (ex: "website" pour les pages, "article" pour un post). */
  ogType?: "website" | "article";
  /** Si vrai, demande aux moteurs de recherche de ne pas indexer la page. */
  noIndex?: boolean;
};

export function useSiteMetadata({
  title,
  description,
  ogImage,
  ogType = "website",
  noIndex = false,
}: SiteMetadata) {
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType,
    twitterTitle: title,
    twitterDescription: description,
    twitterCard: ogImage ? "summary_large_image" : "summary",
    ogImage,
    robots: noIndex ? "noindex, nofollow" : undefined,
  });

  useHead({
    htmlAttrs: {
      lang: "fr",
    },
    link: [
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
    ],
  });
}
