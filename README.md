# Sigma v2

Sigma is a JavaScript library dedicated to graph drawing, mainly developed by [@jacomyal](https://github.com/jacomyal) and [@Yomguithereal](https://github.com/Yomguithereal).

## Overview

[sigmajs.org website](http://sigmajs.org) provides a global overview of sigma.js v1.

As of version `v2`, `sigma` focuses on the management of graph display: layout, rendering, interaction... The graph model is managed in a separate library called [`graphology`](https://github.com/graphology/graphology), which is packed with convenience methods to manage graph data structures.

A set of demo examples contain various use-cases that might help you understand how to use sigma v2 (read further below).

### Status

Sigma.js v2 is a major refactoring and is currently in version alpha. The stable version is `v1.2.x`. Although not yet finalized and official, v2 is already in use in production in some organizations.

## Installation

Sigma is a javascript library, it is available in `npm` package manager.

    npm install sigma

## Examples

A development server can be spawned locally to view the examples. Visit `localhost:8000` after executing the following commands:

    npm install
    npm run examples

You can play around with the files in directory `examples`, the web pages are live-reloaded whenever the code gets changed.

## Contributing

You can contribute by submitting [issues tickets](http://github.com/jacomyal/sigma.js/issues) and proposing [pull requests](http://github.com/jacomyal/sigma.js/pulls). Make sure that tests and linting pass before submitting any pull request.
