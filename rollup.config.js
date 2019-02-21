import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default [
  // browser-friendly UMD build
  {
    input: "src/core/index.js",
    output: {
      name: "sigma",
      file: "build/sigma.umd.js",
      format: "umd"
    },
    plugins: [resolve(), commonjs()]
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/core/index.js",
    external: ["ms"],
    output: [
      { file: "build/sigma.cjs.js", format: "cjs" },
      { file: "build/sigma.esm.js", format: "es" }
    ]
  },
  {
    input: "src/plugins/sigma.exporters.svg/index.js",
    output: {
      file: "build/sigma.exporters.svg.js",
      format: "umd",
      globals: {
        sigma: "sigma"
      }
    },
    plugins: [resolve(), commonjs()]
  }
];
