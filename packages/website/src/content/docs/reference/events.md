---
title: Events reference
description: Complete list of all sigma.js events and their payloads.
---

Sigma utilizes events as a mechanism to execute specific code in response to various actions or changes within a
sigma instance.

## Event handling API

Sigma's event handling API is modeled after the **[events](https://www.npmjs.com/package/events)** package in Node.
Events and their payloads are typed, which benefits TypeScript users.

## Interaction events

All interactive events come with a payload that contains:

- `event`: a `MouseCoords` object with:
  - `x` and `y`: Coordinates within the container where the event occurred.
  - `original`: The original `MouseEvent` or `TouchEvent`.
  - `sigmaDefaultPrevented`: `true` after `preventSigmaDefault()` has been called.
  - `preventSigmaDefault()`: Stops sigma's own reaction to the event (e.g. camera pan, zoom, node drag).
- `preventSigmaDefault()`: Shortcut at the payload top level, equivalent to `event.preventSigmaDefault()`.

### Node events

- **enterNode**: mouse enters a node
- **leaveNode**: mouse leaves a node
- **downNode**: mouse button pressed on a node
- **upNode**: mouse button released on a node
- **clickNode**: node clicked
- **rightClickNode**: node right-clicked
- **doubleClickNode**: node double-clicked
- **wheelNode**: mouse wheel on a node

Payload: `{ node: string, event, preventSigmaDefault() }` where `node` is the node ID.

### Edge events

- **enterEdge**: mouse enters an edge
- **leaveEdge**: mouse leaves an edge
- **downEdge**: mouse button pressed on an edge
- **upEdge**: mouse button released on an edge
- **clickEdge**: edge clicked
- **rightClickEdge**: edge right-clicked
- **doubleClickEdge**: edge double-clicked
- **wheelEdge**: mouse wheel on an edge

Payload: `{ edge: string, event, preventSigmaDefault() }` where `edge` is the edge ID.

To enable edge events, set `enableEdgeEvents: true` in the sigma settings.

### Stage events

- **enterStage**: mouse enters the stage
- **leaveStage**: mouse leaves the stage
- **downStage**: mouse button pressed on the background
- **upStage**: mouse button released on the background
- **clickStage**: background clicked
- **rightClickStage**: background right-clicked
- **doubleClickStage**: background double-clicked
- **wheelStage**: mouse wheel on the background
- **moveBody**: mouse or touch moves over the stage (regardless of target)

Payload: `{ event, preventSigmaDefault() }`.

:::note
We don't observe `moveStage` events and instead emit `moveBody` events, because interactions such as panning or nodes
dragging should not stop when the mouse leaves the stage.
:::

### Label events

Label events fire for clicks and hovers over rendered labels. They are disabled by default, and configured separately
for node and edge labels via `nodeLabelEvents` and `edgeLabelEvents`. Each accepts one of:

- `false`: label hits are ignored.
- `"extend"`: label hits are routed to the parent node/edge event (e.g. clicking a node's label fires `clickNode`).
- `"separate"`: labels become independent targets and their own label events fire instead.
- a `Record` keyed by interaction (`click`, `rightClick`, `doubleClick`, `wheel`, `down`, `up`, `enter`, `leave`), each
  mapped to one of the modes above. An optional `default` entry applies to any interaction not listed; interactions
  with no entry and no `default` resolve to `false`.

The `Record` form lets a single label area behave differently per interaction. For example, clicks routed to the parent
node while hovers fire dedicated label events:

```ts
nodeLabelEvents: {
  click: "extend",
  enter: "separate",
  leave: "separate",
  default: false,
}
```

Node and edge labels emit distinct events so handlers don't have to branch on a parent-type discriminator:

#### Node label events

- **clickNodeLabel**, **rightClickNodeLabel**, **doubleClickNodeLabel**
- **wheelNodeLabel**
- **downNodeLabel**, **upNodeLabel**
- **enterNodeLabel**, **leaveNodeLabel**

Payload: `{ node: string, event, preventSigmaDefault() }`. Emitted only for interactions resolved to `"separate"`.

#### Edge label events

- **clickEdgeLabel**, **rightClickEdgeLabel**, **doubleClickEdgeLabel**
- **wheelEdgeLabel**
- **downEdgeLabel**, **upEdgeLabel**
- **enterEdgeLabel**, **leaveEdgeLabel**

Payload: `{ edge: string, event, preventSigmaDefault() }`. Emitted only for interactions resolved to `"separate"`.

## Lifecycle events

- **beforeClear**: emitted before the rendering state is cleared
- **afterClear**: emitted after the rendering state is cleared
- **beforeProcess**: emitted before graph data is processed
- **afterProcess**: emitted after graph data is processed
- **beforeRender**: emitted just before the graph is rendered
- **afterRender**: emitted immediately after the graph has been rendered
- **resize**: emitted when the sigma instance undergoes resizing
- **kill**: emitted when the sigma instance is terminated

These lifecycle events do not come with any payload.

## Drag events

- **nodeDragStart**: a node drag begins
- **nodeDrag**: a node is being dragged
- **nodeDragEnd**: a node drag ends

Payload for `nodeDragStart` and `nodeDragEnd`: `{ node: string, allDraggedNodes: string[], event, preventSigmaDefault() }`.
Payload for `nodeDrag`: `{ node: string, allDraggedNodes: string[], event }`.

## Custom events

The sigma instance is a typed event emitter. To emit and listen to your own, untyped events, use the `rawEmitter` escape
hatch:

```javascript
sigma.rawEmitter.on("myCustomEvent", ({ data }) => console.log("data", data));
sigma.rawEmitter.emit("myCustomEvent", { data: "something something" });
```

`rawEmitter` is the same object as `sigma`, typed as a plain `EventEmitter` from the
[events](https://www.npmjs.com/package/events) package, so any API from that package works.
