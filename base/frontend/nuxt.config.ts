// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxtjs/sanity",
    "@nuxt/fonts",
    "@nuxtjs/seo",
    "@nuxt/image",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@vueuse/motion/nuxt",
  ],
  // Icônes (Iconify) auto-hébergées en local (perf + RGPD, pas d'appel à l'API
  // Iconify). Les collections installées (@iconify-json/*) sont servies localement.
  icon: {
    serverBundle: "local",
  },
  // Optimisation des images : <SanityImage> passe automatiquement par <NuxtImg>
  // (redimensionnement responsive, format auto, lazy-loading) via le provider
  // Sanity de Nuxt Image.
  image: {
    sanity: {
      projectId: process.env.NUXT_SANITY_PROJECT_ID || "",
      dataset: process.env.NUXT_SANITY_DATASET || "production",
    },
  },
  // Swiper est intégré via ses Web Components (<swiper-container>/<swiper-slide>) ;
  // on indique à Vue de les traiter comme des éléments personnalisés.
  // L'enregistrement se fait dans plugins/swiper.client.ts.
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith("swiper-"),
    },
  },
  // Configuration globale du site, utilisée par @nuxtjs/seo pour les URLs
  // canoniques, le sitemap, robots.txt et les balises Open Graph.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: process.env.NUXT_PUBLIC_SITE_NAME,
    defaultLocale: "fr",
  },
  // Le sitemap est alimenté dynamiquement par le contenu Sanity
  // (voir server/api/__sitemap__/urls.ts).
  sitemap: {
    sources: ["/api/__sitemap__/urls"],
  },
  robots: {
    // Empêche l'indexation des routes techniques de prévisualisation Sanity.
    disallow: ["/preview/"],
  },
  // Les images Open Graph sont gérées dans Sanity (champ ogImage), on n'utilise
  // donc pas la génération dynamique de nuxt-og-image (évite une dépendance de
  // rendu et une config interactive). Les balises og:image restent générées.
  ogImage: {
    enabled: false,
  },
  sanity: {
    projectId: process.env.NUXT_SANITY_PROJECT_ID,
    dataset: process.env.NUXT_SANITY_DATASET,
    apiVersion: process.env.NUXT_SANITY_API_VERSION || "2025-10-20",
    token: process.env.NUXT_SANITY_API_READ_TOKEN, // Only required when using a private dataset
    typegen: {
      enabled: true,
      schemaTypesPath: "../studio/src/schemaTypes/typegen",
    },
    visualEditing: {
      token: process.env.NUXT_SANITY_API_READ_TOKEN,
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
      stega: true,
      zIndex: 51,
    },
  },
  runtimeConfig: {
    // Privé (serveur uniquement) — jamais exposé au client.
    resendApiKey: process.env.RESEND_API_KEY || "",
    contactTo: process.env.CONTACT_TO || "",
    contactFrom: process.env.CONTACT_FROM || "",
    public: {
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "lodash/startCase.js",
        "@nuxtjs/sanity > @sanity/visual-editing > @sanity/insert-menu",
        "@nuxtjs/sanity > @sanity/visual-editing > @sanity/mutate > lodash/groupBy.js",
        "@nuxtjs/sanity > @sanity/visual-editing > @sanity/ui > styled-components",
        "@nuxtjs/sanity > @sanity/visual-editing > @sanity/visual-editing > react-is",
        "@nuxtjs/sanity > @sanity/visual-editing > react",
        "@nuxtjs/sanity > @sanity/visual-editing > react/jsx-runtime",
        "@nuxtjs/sanity > @sanity/visual-editing > react-dom",
        "@nuxtjs/sanity > @sanity/visual-editing > react-dom/client",
        "@nuxtjs/sanity > @sanity/visual-editing > react-compiler-runtime",
        "@sanity/client",
        "@nuxtjs/sanity > @sanity/client > @sanity/visual-editing",
        "groq",
      ],
    },
  },
});
