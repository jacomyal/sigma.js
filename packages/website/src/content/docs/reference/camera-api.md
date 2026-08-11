---
title: Camera API
sidebar:
  label: Camera API
---

The camera controls what portion of the graph is visible. Access it via `renderer.getCamera()`.

## State

The camera state has four properties:

```typescript
interface CameraState {
  x: number; // Horizontal position in framed graph space (0.5 = center)
  y: number; // Vertical position in framed graph space (0.5 = center)
  angle: number; // Rotation in radians
  ratio: number; // Zoom level (smaller = more zoomed in)
}
```

The camera exposes them as read-only properties too: `camera.ratio` equals `camera.getState().ratio`.
`DEFAULT_CAMERA_STATE` is `{ x: 0.5, y: 0.5, angle: 0, ratio: 1 }`.

## State access

| Method               | Returns       | Description                                 |
| -------------------- | ------------- | ------------------------------------------- |
| `getState()`         | `CameraState` | Get the current camera state                |
| `getPreviousState()` | `CameraState` | Get the state before the last actual change |

## State updates

| Method              | Returns | Description                                                       |
| ------------------- | ------- | ----------------------------------------------------------------- |
| `setState(partial)` | `this`  | Update state immediately. Emits `"updated"` event                 |
| `updateState(fn)`   | `this`  | Update state using a function: `fn(currentState) => partialState` |

These are the only ways to move the camera instantly: the state properties cannot be assigned. Both emit `"updated"`,
but only when the state actually changes.

## Animation

```typescript
await camera.animate({ x: 0.5, y: 0.5, ratio: 0.5 });

// With options
await camera.animate({ ratio: 0.2 }, { duration: 1000, easing: "cubicInOut" });
```

The promise resolves when the animation stops, whether it completed or was interrupted by a new animation or by
`cancelAnimation()`; read `completed` on `animationEnd` to tell those apart. On a disabled camera it resolves
immediately, without moving anything.

| Method              | Returns   | Description                                          |
| ------------------- | --------- | ---------------------------------------------------- |
| `cancelAnimation()` | `this`    | Stop the running animation, leaving the camera as-is |
| `isAnimating()`     | `boolean` | Whether an animation is running                      |

### AnimateOptions

| Property   | Type     | Default            | Description                 |
| ---------- | -------- | ------------------ | --------------------------- |
| `duration` | `number` | `150`              | Animation duration in ms    |
| `easing`   | `Easing` | `"quadraticInOut"` | Easing function (see below) |

### Easing options

Named: `"linear"`, `"quadraticIn"`, `"quadraticOut"`, `"quadraticInOut"`, `"cubicIn"`, `"cubicOut"`, `"cubicInOut"`,
`"exponentialIn"`, `"exponentialOut"`, `"exponentialInOut"`

Custom easing: any `(t: number) => number` function where `t` goes from 0 to 1.

## Convenience methods

| Method           | Returns         | Description                                               |
| ---------------- | --------------- | --------------------------------------------------------- |
| `zoomIn(opts?)`  | `Promise<void>` | Divide the ratio by `factor` (default: 1.5)               |
| `zoomOut(opts?)` | `Promise<void>` | Multiply the ratio by `factor` (default: 1.5)             |
| `reset(opts?)`   | `Promise<void>` | Animate to default state (x=0.5, y=0.5, angle=0, ratio=1) |

All three take the same `AnimateOptions` as `animate()`. The zoom shortcuts accept an extra `factor` option:

```typescript
camera.zoomIn({ factor: 2 }); // Divides the ratio by 2 instead of 1.5
camera.zoomIn({ factor: 2, duration: 400, easing: "cubicInOut" });
```

## Creating a camera

| Method               | Returns  | Description                                                |
| -------------------- | -------- | ---------------------------------------------------------- |
| `Camera.from(state)` | `Camera` | Static: create a new camera initialized to the given state |

Duplicating a camera is `Camera.from(camera.getState())`: only the state travels, not the bounds or the flags.

## Interaction flags

`enabled` is the master switch, checked by `setState()` and `animate()`; setting it to `false` mid-animation stops that
animation, like `cancelAnimation()`. The other three are honored by `validateState()`, so `setState()` calls and
animations both respect them.

| Property          | Type      | Default | Description                    |
| ----------------- | --------- | ------- | ------------------------------ |
| `enabled`         | `boolean` | `true`  | Accept any state change at all |
| `enabledZooming`  | `boolean` | `true`  | Accept `ratio` changes         |
| `enabledPanning`  | `boolean` | `true`  | Accept `x`/`y` changes         |
| `enabledRotation` | `boolean` | `true`  | Accept `angle` changes         |

On a sigma-owned camera, the last three are rewritten from the `enableCameraZooming`, `enableCameraPanning` and
`enableCameraRotation` settings on every `setSettings()` call: set the settings, not the flags. `enabled` is the one
flag sigma never touches.

:::note[Enabling camera vs. enabling gestures]
These flags control whether the camera _state_ can change at all, from gestures and code alike. To control whether
wheel and touch gestures over the stage belong to the graph or to the surrounding page, use the
[`gestureTarget` setting](/reference/settings/#gesture-target) instead.
:::

## Bounds

| Property   | Type             | Description                                       |
| ---------- | ---------------- | ------------------------------------------------- |
| `minRatio` | `number \| null` | Minimum zoom level, derived from `minCameraRatio` |
| `maxRatio` | `number \| null` | Maximum zoom level, derived from `maxCameraRatio` |

Like the flags, both are rewritten from the settings on every `setSettings()` call.

| Method                   | Returns       | Description                                                  |
| ------------------------ | ------------- | ------------------------------------------------------------ |
| `getBoundedRatio(ratio)` | `number`      | Constrain a ratio to min/max bounds                          |
| `validateState(partial)` | `CameraState` | Merge a partial state into the current one, and constrain it |

`validateState()` always returns a complete state: it drops what the flags forbid, bounds the ratio, then applies the
`cameraPanBoundaries` setting.

## Events

```typescript
camera.on("updated", (state: CameraState) => {
  // Camera state changed
});

camera.on("animationStart", ({ from, to }) => {
  // An animation started
});

camera.on("animationEnd", ({ from, to, completed }) => {
  // `completed` is false when interrupted, true when it reached `to`
});
```

An animation emits `updated` on every frame: prefer `animationEnd` for heavy listeners.
