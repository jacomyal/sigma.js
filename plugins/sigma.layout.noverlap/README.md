sigma.layout.noverlap
========================

Plugin developed by [Andrew Pitts](https://github.com/apitts) and published under the [MIT](LICENSE) license. Original algorithm by [Mathieu Jacomy](https://github.com/jacomyma) and ported to sigma.js with permission.

---

This plugin runs an algorithm which distributes nodes in the network, ensuring that they do not overlap and providing a margin where specified.

## Methods

**configure**

Changes the layout's configuration.

```js
var listener = s.configNoverlap(config);
```

**start**

Starts the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
s.startNoverlap();
```

**isRunning**

Returns whether the layout is running.

```js
s.isNoverlapRunning();
```

## Configuration

* **nodes**: *array*: the subset of nodes to apply the layout.

*Algorithm configuration*

* **nodeMargin**: *number* `5.0`: The additional minimum space to apply around each and every node.
* **scaleNodes**: *number* `1.2`: A multiplier to apply to nodes such that larger nodes will have more space around them if this multiplier is greater than zero.
* **gridSize**: *integer* `20`: The number of rows and columns to use when dividing the nodes up into cells which the algorithm is applied to. Use more rows and columns for larger graphs for a more efficient algorithm.
* **permittedExpansion** *number* `1.1`: At every step, this is the maximum ratio to apply to the bounding box, i.e. the maximum by which the network is permitted to expand.
* **rendererIndex** *integer* `0`: The index of the renderer to use to compute overlap and collisions of the nodes.
* **speed** *number* `2`: A larger value increases the speed with which the algorithm will convergence at the cost of precision.
* **maxIterations** *number* `500`: The maximum number of iterations to run the algorithm for before stopping it.

*Easing configuration*

* **easing** *string*: if specified, ease the transition between nodes positions if background is `true`. The duration is specified by the Sigma settings `animationsTime`. See [sigma.utils.easing](../../src/utils/sigma.utils.js#L723) for available values.
* **duration** *number*: duration of the transition for the easing method. Default value is Sigma setting `animationsTime`.

## Events

The plugin dispatches the following events:

- `start`: on layout start.
- `interpolate`: at the beginning of the layout animation if an *easing* function is specified and the layout is ran on background.
- `stop`: on layout stop, will be dispatched after `interpolate`.

Example:

```js

s = new sigma({
  graph: g,
  container: 'graph-container'
});

var config = {
  nodeMargin: 3.0,
  scaleNodes: 1.3
};

// Configure the algorithm
var listener = s.configNoverlap(config);

// Bind all events:
listener.bind('start stop interpolate', function(event) {
  console.log(event.type);
});

// Start the algorithm:
s.startNoverlap();
```