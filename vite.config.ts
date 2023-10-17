import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: process.env.CF_PAGES_BRANCH === "prod" ? "Memorit" : "[M]emorit",
        short_name:
          process.env.CF_PAGES_BRANCH === "prod" ? "Memorit" : "[M]emorit",
        description: "Improve your memory",
        theme_color: "#818cf8",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "regular-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "regular-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    __CF_PAGES_BRANCH__: process.env.CF_PAGES_BRANCH,
    __CF_PAGES_COMMIT_SHA__: process.env.CF_PAGES_COMMIT_SHA,
  },
});
