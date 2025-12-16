// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // changed from "/H-Safe/"
  plugins: [react()],
});
