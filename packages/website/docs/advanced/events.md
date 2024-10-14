---
title: Events
sidebar_position: 7
---

# Events

Sigma.js utilizes events as a mechanism to execute specific code in response to various actions or changes within a sigma instance. This event-driven approach allows for interactive and dynamic behaviors in graph visualizations.

## Event handling API

Sigma.js's event handling API is modeled after the **[events](https://www.npmjs.com/package/events)** package in Node. However, a distinction is that events in sigma.js, along with their payloads, are typed. This design choice benefits the development experience, especially for TypeScript users, by offering clarity about the event data.

## Interaction events

All interactive events in sigma.js come with a payload that contains an `event` object. This object includes:

- `x` and `y`: Coordinates within the container where the event occurred.
- `originalEvent`: The original MouseEvent or TouchEvent.

### Node events

Node-specific events are triggered by interactions with graph nodes. The primary node events in sigma.js are:

- **enterNode**
- **leaveNode**
- **downNode**
- **clickNode**
- **rightClickNode**
- **doubleClickNode**
- **wheelNode**

The payload for these events, in addition to the `event` object, contains a `node` string, which is the ID of the associated node.

### Edge events

Edge-specific events are initiated by interactions with graph edges. The primary edge events in sigma.js are:

- **enterEdge**
- **leaveEdge**
- **downEdge**
- **clickEdge**
- **rightClickEdge**
- **doubleClickEdge**
- **wheelEdge**

For these events, the payload, in addition to the `event` object, contains an `edge` string, which is the ID of the related edge. To ensure these events function correctly, the settings `enableEdgeClickEvents`, `enableEdgeWheelEvents`, and `enableEdgeHoverEvents` must be enabled. By default, these settings are set to `false`.

### Stage events

Stage events are triggered by interactions that occur on the stage, which is the overall container of the graph. The primary stage events in sigma.js are:

- **downStage**
- **clickStage**
- **rightClickStage**
- **doubleClickStage**
- **wheelStage**

## Lifecycle events

Sigma.js also emits events at specific lifecycle stages of the sigma instance. These events offer hooks for developers to run code at key moments in the graph's lifecycle. These events are:

- **beforeRender**: Emitted just before the graph is rendered (precisely at the beginning of the inner method `render` method).
- **afterRender**: Emitted immediately after the graph has been rendered (precisely at the end of the inner method `render` method).
- **resize**: Emitted when the sigma instance undergoes resizing.
- **kill**: Emitted when the sigma instance is terminated.

These lifecycle events do not come with any payload.

## Custom events

Leveraging the `EventEmitter` nature of the sigma instance, developers can emit and listen to custom events. This capability allows for tailored interactions and behaviors beyond the built-in events.

In JavaScript:

```javascript
sigma.on("myCustomEvent", ({ data }) => console.log("data", data));
sigma.emit("myCustomEvent", { data: "something something" });
```

In TypeScript:

```typescript
import EventEmitter from "events";

// Because of the typed events, sigma must be cast to a simple EventEmitter to emit custom events:
(sigma as EventEmitter).on("myCustomEvent", ({ data }) => console.log("data", data));
(sigma as EventEmitter).emit("myCustomEvent", { data: "something something" });
```

By using custom events, developers can further enhance the interactivity and responsiveness of their graph visualizations.
