import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" — чтобы приложение работало и на корне домена, и в подпапке (GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: "./",
});
