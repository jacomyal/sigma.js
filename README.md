[![Build Status](https://github.com/jacomyal/sigma.js/workflows/Tests/badge.svg)](https://github.com/jacomyal/sigma.js/actions)

<br />

![Sigma.js](packages/website/public/img/logo-sigma-text.svg)

**[Website](https://v4.sigmajs.org/)** | **[Documentation](https://v4.sigmajs.org/docs)** | <strong><a rel="me" href="https://vis.social/@sigmajs">Mastodon</a></strong>

---

[Sigma.js](https://v4.sigmajs.org) is an open-source JavaScript library aimed at visualizing graphs of thousands of
nodes and edges using WebGL, and built on top of [graphology](https://graphology.github.io/).

> **Note:** This branch tracks sigma v4, currently published as `4.0.0-alpha.x`. The stable v3 release is on the
> [`main`](https://github.com/jacomyal/sigma.js/tree/main) branch.

## Usage

To integrate sigma into your project, follow these simple steps:

1. **Installation:** Add `sigma` and `graphology` to your project by running the following command:

   ```bash
   npm install sigma graphology
   ```

2. **Usage:** Import sigma into your JavaScript or TypeScript file:

   ```javascript
   import Graph from "graphology";
   import Sigma from "sigma";
   ```

   Then, create a new `Sigma` instance with your graph data and target container:

   ```javascript
   const graph = new Graph();
   graph.addNode("1", { label: "Node 1", x: 0, y: 0, size: 10, color: "blue" });
   graph.addNode("2", { label: "Node 2", x: 1, y: 1, size: 20, color: "red" });
   graph.addEdge("1", "2", { size: 5, color: "purple" });

   const sigmaInstance = new Sigma(graph, document.getElementById("container"));
   ```

## Companion packages

Sigma ships as a family of packages living in this monorepo. Install only what you need:

- [`@sigma/node-image`](packages/node-image): node program that renders images
- [`@sigma/node-border`](packages/node-border): node program that renders concentric discs
- [`@sigma/node-piechart`](packages/node-piechart): node program that renders nodes as piecharts
- [`@sigma/layer-leaflet`](packages/layer-leaflet): plugin to set a Leaflet map in background
- [`@sigma/layer-maplibre`](packages/layer-maplibre): plugin to set a MapLibre map in background
- [`@sigma/layer-webgl`](packages/layer-webgl): helpers to draw custom WebGL layers
- [`@sigma/export-image`](packages/export-image): captures snapshots of sigma instances as images
- [`@sigma/utils`](packages/utils): utility functions to ease sigma usage

## Resources

- **GitHub Project:** The source code and collaborative development efforts for Sigma.js are hosted on
  [GitHub](https://github.com/jacomyal/sigma.js).
- **Website:** The official website, [v4.sigmajs.org](https://v4.sigmajs.org), showcases the library's capabilities.
- **Documentation:** A detailed documentation is available at [v4.sigmajs.org/docs](https://v4.sigmajs.org/docs). It
  provides extensive guides, interactive examples, and API references for users.

## Local development

To run the website locally:

```bash
git clone https://github.com/jacomyal/sigma.js.git
cd sigma.js
npm install
npm run start
```

This will open the website in your web browser (including all its live examples), which live reloads when you modify the
examples or the package sources.

## Contributing

You can contribute by submitting [issues tickets](https://github.com/jacomyal/sigma.js/issues) and proposing
[pull requests](https://github.com/jacomyal/sigma.js/pulls). Make sure that tests and linting pass before submitting any
pull request.

You can also browse the related [CONTRIBUTING.md](CONTRIBUTING.md) guide.

## Team and sponsors

Sigma is developed by [Alexis Jacomy](https://github.com/jacomyal) and [Benoît Simard](https://github.com/sim51) at
[OuestWare](https://www.ouestware.com/en/), together with [Guillaume Plique](https://github.com/Yomguithereal) from
the [Sciences Po médialab](https://medialab.sciencespo.fr/en/), who also maintains
[graphology](https://graphology.github.io/).

The project was initially supported by Sciences Po médialab through the v1 and v2 development. OuestWare has provided
continuous support since, and [gdotv](https://gdotv.com/) actively sponsored the v3 and v4 development. The current
website was designed by [Robin de Mourat](https://github.com/robindemourat/).

Since v4, sigma's development also includes help from LLMs. They are used to draft mechanical code, while the
architecture, API design, and core logic remain human-authored. Notably, they have been used for the following features:

- [GLSL](https://en.wikipedia.org/wiki/OpenGL_Shading_Language) handling in programs generations
- [Styles and primitives](https://v4.sigmajs.org/concepts/styles-and-primitives/) engines
- [Label attachments](https://v4.sigmajs.org/how-to/labels/attachments/) rendering

## Professional support

[OuestWare](https://www.ouestware.com/en/) offers professional support, custom development, and consulting around
sigma. Reach out at [contact@ouestware.com](mailto:contact@ouestware.com).
