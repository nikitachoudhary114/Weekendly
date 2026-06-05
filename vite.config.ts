import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tailwindScrollbar from "tailwind-scrollbar";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  // Load .env files; CI hosts often only set process.env at build time
  const env = loadEnv(mode, process.cwd(), "");
  const googleMapsApiKey =
    env.VITE_GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || "";

  return {
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
          theme_color: "#7c3aed",
          icons: [],
        },
        workbox: {
          globPatterns: ["**/*.{js,ts,jsx,tsx,css,html,png,svg}"],
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    define: {
      "import.meta.env.VITE_GOOGLE_MAPS_API_KEY":
        JSON.stringify(googleMapsApiKey),
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
  };
});
