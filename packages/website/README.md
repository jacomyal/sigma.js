# Sigma.js - v4.sigmajs.org website

This website is built using [Astro Starlight](https://starlight.astro.build/), a modern static website generator.

### Installation

```
$ npm install
```

### Local Development

```
$ npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm build
```

This command generates static content into the `dist` directory and can be served using any static contents hosting service.

### Note on examples

When iframed in doc pages, examples run with the sigma setting `gestureTarget: "shared"`, unlike their displayed source.
See `src/scripts/sigma-embed-aware.ts` to see how it's done.
