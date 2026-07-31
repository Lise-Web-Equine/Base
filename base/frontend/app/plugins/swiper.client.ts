import {register} from "swiper/element/bundle";

/**
 * Enregistre les Web Components de Swiper (<swiper-container>, <swiper-slide>).
 * Client uniquement (les custom elements ne s'enregistrent que dans le navigateur).
 * À appeler une seule fois — ce plugin s'en charge globalement.
 */
export default defineNuxtPlugin(() => {
  register();
});
