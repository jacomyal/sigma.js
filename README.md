[![Build Status](https://github.com/jacomyal/sigma.js/workflows/Tests/badge.svg)](https://github.com/jacomyal/sigma.js/actions)

# Sigma v2

Sigma is a JavaScript library dedicated to graph drawing, mainly developed by [@jacomyal](https://github.com/jacomyal) and [@Yomguithereal](https://github.com/Yomguithereal).

## Overview

[sigmajs.org website](http://sigmajs.org) provides a global overview of sigma.js v1.

As of version `v2`, `sigma` focuses on the management of graph display: layout, rendering, interaction... The graph model is managed in a separate library called [`graphology`](https://github.com/graphology/graphology), which is packed with convenience methods to manage graph data structures.

A set of demo examples contain various use-cases that might help you understand how to use sigma v2 (read further below).

### Status

Sigma.js v2 is a major refactoring and is currently in version alpha. The stable version is `v1.2.x`. Although not yet finalized and official, v2 is already in use in production in some organizations.

## Installation

You can install `sigma` (and `graphology` which is required for `sigma` to work) in your JavaScript or TypeScript project using `npm`:

```bash
npm install graphology sigma
```

## Examples

The `examples` folder holds a series of self-contained TypeScript projects that you can either browse and edit on [CodeSandbox](https://codesandbox.io/) or install locally likewise:

```bash
git clone git@github.com:jacomyal/sigma.js.git
cd sigma.js
npm install
cd examples
npm start --example=load-gexf-file # Change this to the desired example
```

_List of available examples_

- [Fetching and displaying a graph contained in a gexf file](https://githubbox.com/jacomyal/sigma.js/tree/main/examples/load-gexf-file)
- todo...

## Contributing

You can contribute by submitting [issues tickets](http://github.com/jacomyal/sigma.js/issues) and proposing [pull requests](http://github.com/jacomyal/sigma.js/pulls). Make sure that tests and linting pass before submitting any pull request.
