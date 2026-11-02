// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/svg",
          href: "/favicon-black.svg",
          media: "(prefers-color-scheme: light)",
        },
        {
          rel: "icon",
          type: "image/svg",
          href: "/favicon-white.svg",
          media: "(prefers-color-scheme: dark)",
        },
      ],
    },
  },
  modules: ["@nuxt/eslint", "@nuxt/ui", "@vite-pwa/nuxt"],
  pwa: {
    base: "/",
    scope: "/tools",
    filename: "tools-sw.js",
    manifestFilename: "tools.webmanifest",
    injectRegister: null,
    registerType: "prompt",
    client: { registerPlugin: false },
    manifest: {
      id: "/tools",
      name: "Tanner's Developer Tools",
      short_name: "Dev Tools",
      description: "Local developer utilities for text, data, encoding, and design.",
      start_url: "/tools",
      scope: "/tools",
      display: "standalone",
      theme_color: "#f8fafc",
      background_color: "#f8fafc",
      icons: [
        { src: "/tools/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/tools/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/tools/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    workbox: {
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      navigateFallback: null,
      globPatterns: ["**/*.{js,css,woff2}"],
      additionalManifestEntries: [{ url: "/tools", revision: new Date().toISOString() }],
      runtimeCaching: [{
        urlPattern: ({ url, request }) =>
          request.mode === "navigate"
          && url.origin === self.location.origin
          && /^\/tools(?:\/|$)/.test(url.pathname)
          && !url.search,
        handler: "NetworkFirst",
        options: {
          cacheName: "tools-pages",
          networkTimeoutSeconds: 3,
          cacheableResponse: { statuses: [200] },
          expiration: { maxEntries: 40, maxAgeSeconds: 7 * 24 * 60 * 60 },
        },
      }],
    },
  },
  css: [
    "~/assets/css/main.css",
  ],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
});
