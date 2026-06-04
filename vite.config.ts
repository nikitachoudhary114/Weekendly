import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindScrollbar from "tailwind-scrollbar";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tailwindScrollbar,
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["assets/hero2.jpg"],
      manifest: {
        name: "My App",
        short_name: "App",
        description: "Offline-capable Weekendly App",
        theme_color: "#7c3aed", // violet-ish
        icons: [],
      },
      workbox: {
        // just cache everything generated in build
        globPatterns: ["**/*.{js,ts,jsx,tsx,css,html,png,svg}"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/google-places": {
        target: "https://maps.googleapis.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/google-places/, ""),
      },
    },
  },
});
