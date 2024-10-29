[![Build Status](https://github.com/jacomyal/sigma.js/workflows/Tests/badge.svg)](https://github.com/jacomyal/sigma.js/actions)

<br />

![Sigma.js](packages/website/static/img/logo-sigma-text.svg)

**[Website](https://www.sigmajs.org/)** | **[Documentation](https://www.sigmajs.org/docs)** | **[Storybook](https://www.sigmajs.org/storybook)** | <strong><a rel="me" href="https://vis.social/@sigmajs">Mastodon</a></strong>

---

[Sigma.js](https://www.sigmajs.org) is an open-source JavaScript library aimed at visualizing graphs of thousands of nodes and edges using WebGL, mainly developed by [@jacomyal](https://github.com/jacomyal) and [@Yomguithereal](https://github.com/Yomguithereal), and built on top of [graphology](https://graphology.github.io/).

## How to use in your project

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

## How to develop locally

To run the [Storybook](https://storybook.js.org/) locally:

```bash
git clone git@github.com:jacomyal/sigma.js.git
cd sigma.js
npm install
npm run start
```

This will open the Storybook in your web browser, which live reloads when you modify the stories or the package sources.

## Resources

- **GitHub Project:** The source code and collaborative development efforts for Sigma.js are hosted on [GitHub](https://github.com/jacomyal/sigma.js).
- **Website:** The official website, [sigmajs.org](https://sigmajs.org), kindly designed by [Robin de Mourat](https://github.com/robindemourat/) from the [Sciences-Po médialab](https://medialab.sciencespo.fr/en/) team, showcases the library's capabilities.
- **Documentation:** A detailed documentation, built with [Docusaurus](https://docusaurus.io/), is available at [sigmajs.org/docs](https://sigmajs.org/docs). It provides extensive guides and API references for users.
- **Storybook:** Interactive examples can be found at [sigmajs.org/storybook](https://sigmajs.org/storybook).
- **Demo:** A comprehensive demo, available at [sigmajs.org/demo](https://sigmajs.org/demo), features a full-featured React-based web application utilizing Sigma.js.

## How to contribute

You can contribute by submitting [issues tickets](http://github.com/jacomyal/sigma.js/issues) and proposing [pull requests](http://github.com/jacomyal/sigma.js/pulls). Make sure that tests and linting pass before submitting any pull request.

You can also browse the related documentation [here](https://github.com/jacomyal/sigma.js/tree/main/CONTRIBUTING.md).

## How to start a new package

Run `npm run createPackage` from the project root. It will:

- Ask you the new package name
- Copy the `packages/template` folder
- Update the new package `package.json` entries (name, description, exports)
- Update various other files (buildable packages list in `tsconfig.json`, Preconstruct compatible packages list in `package.json`...)
