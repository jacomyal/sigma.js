[![Build Status](https://github.com/jacomyal/sigma.js/workflows/Tests/badge.svg)](https://github.com/jacomyal/sigma.js/actions)

# Sigma.js

[Sigma.js](https://www.sigmajs.org) is an open-source JavaScript library aimed at visualizing graphs of thousands of nodes and edges, mainly developed by [@jacomyal](https://github.com/jacomyal) and [@Yomguithereal](https://github.com/Yomguithereal).

## Overview

### Architecture

Since version `v2`, sigma.js focuses on the management of graph display: rendering, interaction... The graph model is managed in a separate library called **[graphology](https://github.com/graphology/graphology)**, which is packed with convenience methods to manage graph data structures, and a lot of satellite libraries to handle various graph-related problems (metrics, community detection, layout algorithms...).

Graphology website offers [a list](https://graphology.github.io/standard-library/) of these libraries. Most of them can help you solve problems in your sigma.js based web applications.

### Rendering

Sigma.js uses **WebGL** to render graphs. This makes it good at rendering medium to larger graphs in web pages (thousands of nodes and edges or more). It is also possible to customize rendering, but it is harder than it would be with SVG or Canvas based solutions.

Each way to draw a node or an edge is implemented as a `program`. You can develop your own, or use the owns provided by sigma. You can check [this example](./examples/custom-rendering/index.ts) to see how to use multiple programs. Also, you can check the list of available programs [here](./src/rendering/webgl/programs).

## Installation

You can install `sigma` (and `graphology` which is required for `sigma` to work) in your JavaScript or TypeScript project using `npm`:

```bash
npm install graphology sigma
```

## Examples

The [`examples`](./examples) folder contains a series of self-contained TypeScript projects that you can either browse and edit on [CodeSandbox](https://codesandbox.io/) or install locally likewise:

```bash
git clone git@github.com:jacomyal/sigma.js.git
cd sigma.js
npm install
cd examples
npm start --example=load-gexf-file # Change this to the desired example
```

_List of available examples_

- [Fetching and displaying a graph contained in a gexf file](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/load-gexf-file) ([fallback link](https://sigmajs.org/examples/load-gexf-file))
- [Using node & edge reducers to handle interactivity](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/use-reducers) ([fallback link](https://sigmajs.org/examples/use-reducers))
- [Fetching, parsing & wrangling a CSV file to create a network map](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/csv-to-network-map) ([fallback link](https://sigmajs.org/examples/csv-to-network-map))
- [Handling drag and drop of nodes as well as node & edge creation on click](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/mouse-manipulations) ([fallback link](https://sigmajs.org/examples/mouse-manipulations))
- [Displaying arbitrary elements, such as cluster labels, synchronized with the network](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/clusters-labels) ([fallback link](https://sigmajs.org/examples/clusters-labels))
- [Applying different animated layout algorithms to a network](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/layouts) ([fallback link](https://sigmajs.org/examples/layouts))
- [Displaying nodes in various custom ways](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/custom-rendering) ([fallback link](https://sigmajs.org/examples/custom-rendering))
- [Saving the graph as a PNG image](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/png-snapshot) ([fallback link](https://sigmajs.org/examples/png-snapshot))
- [Use events to implement interactions](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/events) ([fallback link](https://sigmajs.org/examples/events))
- [See how sigma behaves with larger graphs](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/large-graphs) ([fallback link](https://sigmajs.org/examples/large-graphs))

Also, a more realistic sigma.js based web application is available in the [`demo`](./demo) folder. It aims to show a real-world usecase, and is the main showcase of [sigma.js website](https://www.sigmajs.org/).

## Website

The current website is a simple manually crafted single-page website. It is located in the `website` folder. It also showcases the React.js based demo available in the [`demo`](./demo) folder in an iframe. The website itself does not need any build step, though the demo does.

It has been kindly designed by [Robin de Mourat](https://github.com/robindemourat/) from the [Sciences-Po médialab](https://medialab.sciencespo.fr/en/) team.

### Development

To start a dev server that will reload the webpage when the code is updated, run:

```bash
npm run website:watch
```

Then, open [`localhost:8080`](http://localhost:8080) in your browser. When any file in the `website` directory is saved (including the demo bundle), the page will be reloaded.

### Build

To simply build the demo and copy the bundle in the `website` folder, just run:

```bash
npm run website:all
```

## Contributing

You can contribute by submitting [issues tickets](http://github.com/jacomyal/sigma.js/issues) and proposing [pull requests](http://github.com/jacomyal/sigma.js/pulls). Make sure that tests and linting pass before submitting any pull request.

You can also browse the related documentation [here](./CONTRIBUTING.md).
