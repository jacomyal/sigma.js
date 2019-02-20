import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.js",
    output: {
      name: "sigma",
      file: "build/sigma.umd.js",
      format: "umd"
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.js",
    external: ["ms"],
    output: [
      { file: "build/sigma.cjs.js", format: "cjs" },
      { file: "build/sigma.esm.js", format: "es" }
    ]
  }
];
