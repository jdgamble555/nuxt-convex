import tailwindcss from "@tailwindcss/vite";

const convexUrl = process.env.NUXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

if (!convexUrl) {
  throw new Error("Missing Convex deployment URL. Set NUXT_PUBLIC_CONVEX_URL in your environment.");
}

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ["convex-nuxt"],

  convex: {
    url: convexUrl,
  },
});