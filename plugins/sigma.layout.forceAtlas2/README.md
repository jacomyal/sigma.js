sigma.layout.forceAtlas2
========================

Algorithm by [Mathieu Jacomy](https://github.com/jacomyma).

Plugin by [Guillaume Plique](https://github.com/Yomguithereal).

Filter modification by [Joakim af Sandeberg](https://github.com/jotunacorn).

---

This plugin implements [ForceAtlas2](http://www.plosone.org/article/info%3Adoi%2F10.1371%2Fjournal.pone.0098679), a force-directed layout algorithm.

For optimization purposes, the algorithm's computations are delegated to a web worker.

## Methods

**sigma.startForceAtlas2**

Starts or unpauses the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
sigmaInstance.startForceAtlas2(config);
```

**sigma.stopForceAtlas2**

Pauses the layout.

```js
sigmaInstance.stopForceAtlas2();
```

**sigma.configForceAtlas2**

Changes the layout's configuration.

```js
sigmaInstance.configForceAtlas2(config);
```

**sigma.killForceAtlas2**

Completely stops the layout and terminates the assiociated worker. You can still restart it later, but a new worker will have to initialize.

```js
sigmaInstance.killForceAtlas2();
```

**sigma.isForceAtlas2Running**

Returns whether ForceAtlas2 is running.

```js
sigmaInstance.isForceAtlas2Running();
```

## Configuration

*Algorithm configuration*

* **linLogMode** *boolean* `false`: switch ForceAtlas' model from lin-lin to lin-log (tribute to Andreas Noack). Makes clusters more tight.
* **outboundAttractionDistribution** *boolean* `false`
* **adjustSizes** *boolean* `false`
* **edgeWeightInfluence** *number* `0`: how much influence you give to the edges weight. 0 is "no influence" and 1 is "normal".
* **scalingRatio** *number* `1`: how much repulsion you want. More makes a more sparse graph.
* **strongGravityMode** *boolean* `false`
* **gravity** *number* `1`: attracts nodes to the center. Prevents islands from drifting away.
* **barnesHutOptimize** *boolean* `true`: should we use the algorithm's Barnes-Hut to improve repulsion's scalability (`O(n²)` to `O(nlog(n))`)? This is useful for large graph but harmful to small ones.
* **barnesHutTheta** *number* `0.5`
* **slowDown** *number* `1`
* **startingIterations** *integer* `1`: number of iterations to be run before the first render.
* **iterationsPerRender** *integer* `1`: number of iterations to be run before each render.
* **edgeFilter** *[string]* `[]`: Array of Strings to filter the edges on. Only edges with the filterType set to the same String as in the edgefilter will be used during the layout. If the array is empty all edges will be used.
* **nodeFilter** *[string]* `[]`: Array of Strings to filter the nodes on. Only nodes with the filterType set to the same String as in the nodeFilter will be used during the layout. If the array is empty all nodes will be used.

*Supervisor configuration*

* **worker** *boolean* `true`: should the layout use a web worker?
* **workerUrl** *string* : path to the worker file if needed because your browser does not support blob workers.

*Edge/Node configuration*

* **filterType** *String* `undefined`: String to combine with the edgeFilter/nodeFIlter in the algorithm configuration.

## Notes
1. The layout won't stop by itself, so if you want it to stop, you will have to trigger it explicitly.
