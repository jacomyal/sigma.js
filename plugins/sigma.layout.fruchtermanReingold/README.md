sigma.layout.fruchtermanReingold
========================

Plugin developed by [Sébastien Heymann](https://github.com/sheymann) for [Linkurious](https://github.com/Linkurious) and published under the [MIT](LICENSE) license.

Contact: seb@linkurio.us

---

This plugin implements the [Fruchterman-Reingold layout](http://citeseer.ist.psu.edu/viewdoc/download;jsessionid=19A8857540E8C9C26397650BBACD5311?doi=10.1.1.13.8444&rep=rep1&type=pdf)*, a force-directed layout algorithm.

* Fruchterman, T. M. J., & Reingold, E. M. (1991). Graph Drawing by Force-Directed Placement. Software: Practice and Experience, 21(11).

The Fruchterman-Reingold Algorithm is a force-directed layout algorithm. The idea of a force directed layout algorithm is to consider a force between any two nodes. In this algorithm, the nodes are represented by steel rings and the edges are springs between them. The attractive force is analogous to the spring force and the repulsive force is analogous to the electrical force. The basic idea is to minimize the energy of the system by moving the nodes and changing the forces between them. For more details refer to the Force Directed algorithm.

In this algorithm, the sum of the force vectors determines which direction a node should move. The step width, which is a constant determines how far a node moves in a single step. When the energy of the system is minimized, the nodes stop moving and the system reaches it's equilibrium state. The drawback of this is that if we define a constant step width, there is no guarantee that the system will reach equilibrium at all. T.M.J. Fruchterman and E.M. Reingold introduced a "global temperature" that controls the step width of node movements and the algorithm's termination. The step width is proportional to the temperature, so if the temperature is hot, the nodes move faster (i.e, a larger distance in each single step). This temperature is the same for all nodes, and cools down at each iteration. Once the nodes stop moving, the system terminates.

The time complexity of the algorithm is O(*N*² + *E*), where *N* is the number of nodes and *E* the number of edges in the graph. The algorithm should thus only be used on small graphs of *N* < 500 nodes.

## Methods

**configure**

Changes the layout's configuration.

```js
var listener = sigma.layouts.fruchtermanReingold.configure(sigInst, config);
```

**start**

Starts the layout. It is possible to pass a configuration if this is the first time you start the layout.

```js
var listener = sigma.layouts.fruchtermanReingold.start(sigInst, config);
```

**isRunning**

Returns whether the layout is running.

```js
sigma.layouts.fruchtermanReingold.isRunning(sigInst);
```

**progress**

Returns the percentage of iterations done, from 0 (0%) to 1 (100%).

```js
sigma.layouts.fruchtermanReingold.progress(sigInst);
```

## Configuration

*Algorithm configuration*

* **autoArea**: *boolean* `true`: if `true`, **area** will be computed as *N*².
* **area**: *number* `1`
* **gravity** *number* `1`
* **speed**: *number* `0.1`
* **iterations** *number* `1000`: the number of iterations to perform before the layout completes.

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
// Start the algorithm:
var listener = sigma.layouts.fruchtermanReingold.configure(sigInst, config);
// Bind all events:
listener.bind('start stop interpolate', function(event) {
  console.log(event.type);
});

sigma.layouts.fruchtermanReingold.start(sigInst);
```
