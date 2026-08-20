import starlight from "@astrojs/starlight";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import starlightLinksValidator from "starlight-links-validator";
import starlightTypeDoc, { typeDocSidebarGroup } from "starlight-typedoc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const starlightDir = path.dirname(require.resolve("@astrojs/starlight"));

// eslint-disable-next-line no-undef
const isDev = process.argv.includes("dev");

export default defineConfig({
  site: "https://www.sigmajs.org",
  vite: {
    server: { strictPort: true },
    resolve: {
      alias: [
        // Bypass Starlight's exports map so our custom Icon can import its icon data
        { find: "@astrojs/starlight/components/Icons", replacement: path.join(starlightDir, "components/Icons.ts") },
      ],
    },
    plugins: [
      {
        // Vite's static middleware (sirv) serves ".gz" files with
        // "Content-Encoding: gzip", so browsers decompress them silently. In
        // production the CDN serves the raw bytes instead. Serve them raw in
        // dev too, so both environments behave the same:
        name: "serve-gz-raw",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const pathname = decodeURIComponent((req.url || "").split("?")[0]);
            if (!pathname.endsWith(".gz")) return next();
            const file = path.join(__dirname, "public", path.normalize(pathname));
            if (!file.startsWith(path.join(__dirname, "public", path.sep)) || !fs.existsSync(file)) return next();
            res.writeHead(200, {
              "Content-Type": "application/gzip",
              "Content-Length": fs.statSync(file).size,
            });
            fs.createReadStream(file).pipe(res);
          });
        },
      },
      {
        // Route "sigma" (exact match, subpaths untouched) through a wrapper
        // that defaults iframe-embedded examples to shared gestures. The
        // importer check lets the wrapper itself import "sigma" normally:
        name: "sigma-embed-aware",
        enforce: "pre",
        resolveId(source, importer) {
          if (source === "sigma" && !importer?.includes("sigma-embed-aware")) {
            return path.resolve(__dirname, "src/scripts/sigma-embed-aware.ts");
          }
        },
      },
      {
        name: "phosphor-icon-override",
        enforce: "pre",
        resolveId(source, importer) {
          // Intercept Starlight's internal Icon imports and redirect to our custom component
          if (importer?.includes("@astrojs/starlight") && source.endsWith("user-components/Icon.astro")) {
            return path.resolve(__dirname, "src/components/StarlightIconOverride.astro");
          }
        },
      },
    ],
  },
  redirects: {
    "/docs": "/get-started/quickstart/",
    "/docs/quickstart": "/get-started/quickstart/",
    "/docs/resources": "/get-started/quickstart/",
    "/docs/advanced/coordinate-systems": "/concepts/coordinate-systems/",
    "/docs/advanced/customization": "/how-to/nodes/colors-sizes/",
    "/docs/advanced/data": "/how-to/technical/loading-data/",
    "/get-started/loading-data": "/how-to/technical/loading-data/",
    "/how-to/data/loading-data": "/how-to/technical/loading-data/",
    "/get-started/migration-v3-v4": "/how-to/technical/migration-v3-v4/",
    "/how-to/nodes/colors-sizes-shapes": "/how-to/nodes/colors-sizes/",
    "/how-to/nodes/images-pictograms": "/how-to/nodes/fill-layers/",
    "/how-to/nodes/borders": "/how-to/nodes/fill-layers/",
    "/how-to/nodes/piecharts": "/how-to/nodes/fill-layers/",
    "/how-to/edges/labels": "/how-to/labels/styles-positioning/",
    "/how-to/labels/styles-backdrops-attachments": "/how-to/labels/styles-positioning/",
    "/how-to/interactivity/events": "/how-to/interactivity/interactions-events/",
    "/how-to/camera/controls": "/how-to/interactivity/camera-viewport/",
    "/how-to/packages/map-layers": "/how-to/layers/map-layers/",
    "/how-to/packages/webgl-layers": "/how-to/layers/webgl-layers/",
    "/how-to/packages/export-image": "/how-to/technical/export-image/",
    "/how-to/performance/large-graphs": "/how-to/interactivity/interactions-events/",
    "/reference/attributes": "/reference/style-properties/",
    "/docs/advanced/events": "/how-to/interactivity/interactions-events/",
    "/docs/advanced/lifecycle": "/concepts/lifecycle/",
    "/docs/advanced/layers": "/concepts/rendering/",
    "/concepts/layers": "/concepts/rendering/",
    "/docs/advanced/migration-v2-v3": "/how-to/technical/migration-v3-v4/",
    "/docs/advanced/renderers": "/concepts/rendering/",
    "/docs/advanced/sizes": "/concepts/sizes/",
    "/docs/advanced/new-packages": "/contributing/new-packages/",
    "/docs/advanced/publish": "/contributing/publish/",
  },
  integrations: [
    starlight({
      plugins: [
        starlightLinksValidator({
          exclude: ({ link }) => link.includes("/api/") || link.startsWith("/embed/"),
        }),
        ...(isDev
          ? []
          : [
              starlightTypeDoc({
                entryPoints: [
                  "../sigma/src/index.ts",
                  "../sigma/src/types.ts",
                  "../sigma/src/settings.ts",
                  "../sigma/src/rendering/index.ts",
                  "../sigma/src/primitives/index.ts",
                  "../sigma/src/utils/index.ts",
                  "../layer-leaflet/src/index.ts",
                  "../layer-maplibre/src/index.ts",
                  "../layer-webgl/src/index.ts",
                  "../node-border/src/index.ts",
                  "../node-image/src/index.ts",
                  "../node-piechart/src/index.ts",
                  "../export-image/src/index.ts",
                ],
                tsconfig: "./tsconfig.typedoc.json",
                sidebar: {
                  label: "API reference",
                  collapsed: true,
                },
                typeDoc: {
                  entryFileName: "index",
                  skipErrorChecking: true,
                  // Keep members tagged `@internal` out of the API reference:
                  excludeInternal: true,
                },
              }),
            ]),
      ],
      components: {
        PageFrame: "./src/components/PageFrame.astro",
      },
      title: "sigma.js",
      tagline: "A JavaScript library aimed at visualizing graphs of thousands of nodes and edges",
      favicon: "/img/favicon-32x32.png",
      logo: {
        src: "./src/assets/logo-sigma-ruby.svg",
        alt: "sigma.js",
      },
      social: {
        github: "https://github.com/jacomyal/sigma.js",
        mastodon: "https://vis.social/@sigmajs",
      },
      head: [
        {
          tag: "script",
          content: `var _paq=window._paq=window._paq||[];_paq.push(["trackPageView"]);_paq.push(["enableLinkTracking"]);(function(){var u="https://matomo.ouestware.com/";_paq.push(["setTrackerUrl",u+"matomo.php"]);_paq.push(["setSiteId","26"]);var d=document,g=d.createElement("script"),s=d.getElementsByTagName("script")[0];g.async=true;g.src=u+"matomo.js";s.parentNode.insertBefore(g,s)})();`,
        },
      ],
      customCss: ["./src/styles/base.css", "./src/styles/custom.css", "./src/styles/sigma-example.css"],
      sidebar: [
        {
          label: "Get started",
          items: [
            { slug: "get-started/quickstart" },
            { slug: "get-started/load-a-dataset" },
            { slug: "get-started/style-the-graph" },
            { slug: "get-started/add-interactivity" },
          ],
        },
        {
          label: "How-to guides",
          items: [
            {
              label: "Styling nodes",
              items: [
                { slug: "how-to/nodes/colors-sizes" },
                { slug: "how-to/nodes/shapes" },
                { slug: "how-to/nodes/fill-layers" },
                { slug: "how-to/nodes/backdrops" },
              ],
            },
            {
              label: "Styling edges",
              items: [
                { slug: "how-to/edges/types-colors" },
                { slug: "how-to/edges/extremities" },
                { slug: "how-to/edges/parallel-edges-self-loops" },
              ],
            },
            {
              label: "Styling labels",
              items: [{ slug: "how-to/labels/styles-positioning" }, { slug: "how-to/labels/attachments" }],
            },
            {
              label: "Adding interactivity",
              items: [
                { slug: "how-to/interactivity/interactions-events" },
                { slug: "how-to/interactivity/hover-search" },
                { slug: "how-to/interactivity/drag-drop" },
                { slug: "how-to/interactivity/camera-viewport" },
              ],
            },
            {
              label: "Adding layers",
              items: [
                { slug: "how-to/layers/map-layers" },
                { slug: "how-to/layers/webgl-layers" },
                { slug: "how-to/layers/sync-html-svg" },
              ],
            },
            {
              label: "Technical guides",
              items: [
                { slug: "how-to/technical/loading-data" },
                { slug: "how-to/technical/custom-sizes" },
                { slug: "how-to/technical/export-image" },
                { slug: "how-to/technical/performance" },
                { slug: "how-to/technical/migration-v3-v4" },
              ],
            },
          ],
        },
        {
          label: "Concepts",
          items: [
            { slug: "concepts/styles-and-primitives" },
            { slug: "concepts/lifecycle" },
            { slug: "concepts/rendering" },
            { slug: "concepts/depth-and-z-order" },
            { slug: "concepts/coordinate-systems" },
            { slug: "concepts/sizes" },
          ],
        },
        {
          label: "Reference",
          items: [
            { slug: "reference/sigma-api" },
            { slug: "reference/camera-api" },
            { slug: "reference/settings" },
            { slug: "reference/events" },
            { slug: "reference/style-properties" },
            { slug: "reference/style-value-types" },
            { slug: "reference/primitives-schema" },
            { slug: "reference/state-flags" },
            { slug: "reference/browser-bundle" },
          ],
        },
        {
          label: "Examples",
          items: [{ slug: "examples", label: "All examples" }],
        },
        ...(isDev ? [] : [typeDocSidebarGroup]),
        {
          label: "Contributing",
          items: [{ slug: "contributing/publish" }, { slug: "contributing/new-packages" }],
        },
      ],
    }),
    icon(),
  ],
});
