# Sigma.js Leaflet background layer

This package contains a leaflet backgournd layer for [sigma.js](https://sigmajs.org).

It displays a map on the graph's background and handle the camera synchronisation. 

## How to use

First you need to install [leaflet](https://leafletjs.com/) in your application.
You can check this [page](https://leafletjs.com/download.html) to see how to do it. 

Then, within your application that uses sigma.js, you can use [`@sigma/layer-leaflet`](https://www.npmjs.com/package/@sigma/layer-leaflet) as following:

```typescript
import bindLeafletLayer from "@sigma/layer-leaflet";

const graph = new Graph();
graph.addNode("nantes", { x: 0, y: 0, lat:47.2308, lng:1.5566, size: 10, label: "nantes" });
graph.addNode("paris", {  x: 0, y: 0, lat: 48.8567, lng:2.3510, size: 10, label: "Paris" });
graph.addEdge("nantes", "paris");

const sigma = new Sigma(graph, container);
bindLeafletLayer(sigma);
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/layer-leaflet) for more advanced examples.
