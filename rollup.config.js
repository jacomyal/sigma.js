import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

function library(ns) {
  return {
    input: `src/plugins/${ns}/index.js`,
    output: {
      file: `build/plugins/${ns}.js`,
      format: "umd",
      globals: {
        sigma: "sigma"
      }
    },
    plugins: [resolve(), commonjs(), terser()]
  };
}

export default [
  // browser-friendly UMD build
  {
    input: "src/core/index.js",
    output: {
      name: "sigma",
      file: "build/sigma.umd.js",
      format: "umd"
    },
    plugins: [resolve(), commonjs(), terser()]
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
    ],
    plugins: [terser()]
  },
  library("sigma.exporters.svg"),
  library("sigma.layout.noverlap"),
  library("sigma.layout.forceAtlas2"),
  library("sigma.neo4j.cypher"),
  library("sigma.parsers.gexf"),
  library("sigma.parsers.json"),
  library("sigma.pathfinding.astar"),
  library("sigma.plugins.animate"),
  library("sigma.plugins.dragNodes"),
  library("sigma.plugins.filter"),
  library("sigma.plugins.neighborhoods"),
  library("sigma.plugins.relativeSize"),
  library("sigma.renderers.customEdgeShapes"),
  library("sigma.renderers.customShapes"),
  library("sigma.renderers.edgeDots"),
  library("sigma.renderers.edgeLabels"),
  library("sigma.renderers.parallelEdges"),
  library("sigma.renderers.snapshot"),
  library("sigma.statistics.HITS")
];
