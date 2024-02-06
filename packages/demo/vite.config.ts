import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

export default defineConfig({
  base: "",
  plugins: [
    react(),
    viteTsconfigPaths(),
    checker({
      typescript: {
        buildMode: true,
      },
    }),
  ],
  server: {
    open: false,
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  resolve: {
    preserveSymlinks: true,
  },
});
