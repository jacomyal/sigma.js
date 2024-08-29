import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      name: "Sigma",
      entry: "./src/index-bundle.ts",
      fileName: () => "sigma.min.js",
      formats: ["umd"],
    },
    commonjsOptions: {
      include: [/sigma/, /node_modules/],
    },
    emptyOutDir: false,
  },
  optimizeDeps: {
    include: ["sigma"],
  },
  resolve: {
    preserveSymlinks: true,
  },
});
