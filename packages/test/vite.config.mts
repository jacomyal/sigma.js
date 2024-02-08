import { defineConfig } from "vite";

export default defineConfig({
  root: "./app",
  resolve: {
    extensions: [".ts", ".js"],
  },
  publicDir: "public",
  build: {
    outDir: "dist",
  },
});
