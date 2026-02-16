import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
     headers: {
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "frame-ancestors 'none';",
      'X-Frame-Options' :"DENY",
    },
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  base: '/forecast-friends/', // EXACT repo name
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

