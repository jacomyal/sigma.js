---
title: Quickstart Guide
sidebar_position: 2
---

# Quickstart Guide

## Installation

### Using CDN

To quickly integrate sigma.js and graphology into your project, you can use CDN links. Add the following lines to the head section of your HTML:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/[VERSION]/sigma.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/graphology/[VERSION]/graphology.umd.min.js"></script>
```

Replace `[VERSION]` with the desired version number.

### Using Package Managers

For npm or yarn:

**npm**:

```bash
npm install sigma graphology
```

**yarn**:

```bash
yarn add sigma graphology
```

## Quick Example

Here's a basic example using CDNs to create a graph with minimal data and render it using sigma.js:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Quick Sigma.js Example</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/sigma.js/2.4.0/sigma.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/graphology/0.25.4/graphology.umd.min.js"></script>
  </head>
  <body style="background: lightgrey">
    <div id="container" style="width: 800px; height: 600px; background: white"></div>
    <script>
      // Create a graphology graph
      const graph = new graphology.Graph();
      graph.addNode("1", { label: "Node 1", x: 0, y: 0, size: 10, color: "blue" });
      graph.addNode("2", { label: "Node 2", x: 1, y: 1, size: 20, color: "red" });
      graph.addEdge("1", "2", { size: 5, color: "purple" });

      // Instantiate sigma.js and render the graph
      const sigmaInstance = new Sigma(graph, document.getElementById("container"));
    </script>
  </body>
</html>
```

Load this HTML in a browser, and you'll see a simple graph with two nodes connected by an edge. This serves as a foundational step to start exploring the capabilities of sigma.js.
