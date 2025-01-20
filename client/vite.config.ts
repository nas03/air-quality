import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "tanstack-vendor": ["@tanstack/react-query", "@tanstack/react-router"],
          "antd-vendor": ["antd", "@ant-design/icons"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
