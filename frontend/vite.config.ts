import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,

    // ✅ Add this proxy section to forward API calls to FastAPI
    proxy: {
      "/image-insights": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/audio-insights": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/text-insights": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },

  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
