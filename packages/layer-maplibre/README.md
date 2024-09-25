# Sigma.js - Maplibre background layer

This package contains a maplibre background layer for [sigma.js](https://sigmajs.org).

It displays a map on the graph's background and handle the camera synchronisation.

## How to use

First you need to install [maplibre](https://maplibre.org/) in your application.
You can check this [page](https://maplibre.org/maplibre-gl-js/docs/) to see how to do it.
Especially, don't forget to load `maplibre-gl.css` in your application.

Then, within your application that uses sigma.js, you can use [`@sigma/layer-maplibre`](https://www.npmjs.com/package/@sigma/layer-maplibre) as following:

```typescript
import bindLeafletLayer from "@sigma/layer-maplibre";

const graph = new Graph();
graph.addNode("nantes", { x: 0, y: 0, lat: 47.2308, lng: 1.5566, size: 10, label: "Nantes" });
graph.addNode("paris", { x: 0, y: 0, lat: 48.8567, lng: 2.351, size: 10, label: "Paris" });
graph.addEdge("nantes", "paris");

const sigma = new Sigma(graph, container);
bindMaplibreLayer(sigma);
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/layer-maplibre) for more advanced examples.
