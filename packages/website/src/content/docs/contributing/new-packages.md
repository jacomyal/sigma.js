---
title: Creating new packages
description: How to add new @sigma/* packages to the monorepo.
---

From version 3, the source code of sigma.js is structured as a [monorepo](https://monorepo.tools/). We use [Preconstruct](https://preconstruct.tools/) to build the packages for development and production, and [Lerna](https://lerna.js.org/) to manage versions lifecycle. Finally, on [NPM](https://www.npmjs.com/org/sigma), sigma is split into the core `sigma` package, and various `@sigma/xxx` feature packages.

This approach allows to maintain multiple features, that are too specialized to be included in the main repository, without the cost of creating and managing multiple Git/GitHub repositories.

As of now, the features are prefixed by their general purpose:

- `@sigma/node-xxx` and `@sigma/edge-xxx` refer to node and edge renderers
- `@sigma/layer-xxx` refers to additional layers that can be added to sigma instances
- `@sigma/export-xxx` refers to packages that allow exporting somehow a sigma instance
- `@sigma/utils` stores various small specific helpers

## Creating a new package

To create a new package, you first need to get a clean local instance of sigma, with up-to-date versions of Git, Node.js and NPM. Then, go to the root of the repository, and run `npm run createPackage`. You will be prompted for the new package name (excluding the `@sigma/` namespace), after which a fresh, empty package will be created and referenced wherever necessary.

## Adding examples

Each package should have examples in the website's `packages/website/src/examples/` directory. These examples serve both as a development playground and as the public documentation showing what each package can do.

## Adding tests

Since most additional packages only handle rendering, unit-testing them is too challenging. In the future, we plan to include all examples in our end-to-end tests to detect rendering regressions.

However, some packages might export unit-testable helpers (such as `@sigma/utils`). In that case, you can colocate test suites next to the code as `src/**/*.test.ts`, and run them with the package `test` script (vitest).
