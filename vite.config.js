import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: "react",
      "react-dom": "react-dom",
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@clerk/clerk-react",
      "@mui/material",
      "@mui/icons-material",
      "framer-motion",
      "recharts",
    ],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
