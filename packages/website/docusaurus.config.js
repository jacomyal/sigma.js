// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "sigma.js",
  tagline: "a JavaScript library aimed at visualizing graphs of thousands of nodes and edges",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://www.sigmajs.org/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "jacomyal", // Usually your GitHub org/user name.
  projectName: "sigma.js", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  plugins: [
    "docusaurus-plugin-matomo",

    [
      "docusaurus-plugin-typedoc",

      // Plugin / TypeDoc options
      {
        entryPoints: [
          "../sigma/src/index.ts",
          "../sigma/src/settings.ts",
          "../sigma/src/rendering/index.ts",
          "../sigma/src/utils/index.ts",
          "../node-image/src/index.ts",
          "../edge-curve/src/index.ts",
        ],
        watch: true,
        tsconfig: "../sigma/tsconfig.json",
        out: "typedoc",
        readme: "none",
        sidebar: {
          categoryLabel: "TypeScript documentation",
          position: 999,
          fullNames: true,
        },
      },
    ],
  ],

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: "https://github.com/jacomyal/sigma.js/tree/main/packages/website",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        items: [
          {
            href: "https://github.com/jacomyal/sigma.js",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      matomo: {
        matomoUrl: "https://matomo.ouestware.com/",
        siteId: 26,
      },
    }),
};

module.exports = config;
