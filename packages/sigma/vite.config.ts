import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      name: "sigma",
      entry: "./packages/sigma/src/index-bundle.ts", // Specifies the entry point for building the library.
      fileName: () => `sigma.min.js`,
      formats: ["umd"],
    },
    commonjsOptions: {
      include: [/sigma/, /node_modules/],
    },
  },
  optimizeDeps: {
    include: ["sigma"],
  },
  resolve: {
    preserveSymlinks: true,
  },
});
