---
title: Integrate with a framework
sidebar:
  label: "Integrate with a framework"
description: How to use sigma.js in React, Vue, Angular, or any other component framework.
---

Sigma.js has no dependency on any UI framework, so it works with React, Vue, Angular, or any other component library.
A sigma instance is not a component though: it renders in a DOM element you give it, and it manages its own canvases,
WebGL resources and event listeners, outside your framework's rendering cycle. Your framework only needs to handle the
lifecycle of the instance, following the lifecycle of the DOM element.

This integration always follows the same pattern:

1. Render an empty element
2. Create the sigma instance once this element is in the DOM
3. Call `kill()` before the element is removed, to release WebGL resources and event listeners

## Examples by framework

Each example takes a `graph` prop, built as shown in [Load graph data](/how-to/technical/loading-data/). Create it once
and keep the same object across renders, as passing a new one triggers a full refresh each time.

Each example keeps the sigma instance in a ref or a signal, to access its methods. It stays empty until sigma is
created, so bind events (`sigma.on("clickNode", …)`) right after `new Sigma`.

The container must have a size, for instance:

```css
.sigma-container {
  width: 800px;
  height: 600px;
}
```

### React

The official way to use sigma with React is [react-sigma](https://sim51.github.io/react-sigma), which provides
ready-made components and hooks on top of sigma.

If you only need to mount sigma in a React component and prefer to handle everything else yourself, here is the bare
pattern, without react-sigma:

```tsx
import type Graph from "graphology";
import { useEffect, useRef } from "react";
import Sigma from "sigma";

export function GraphView({ graph }: { graph: Graph }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);

  useEffect(() => {
    sigmaRef.current = new Sigma(graph, containerRef.current!);
    return () => {
      sigmaRef.current?.kill();
      sigmaRef.current = null;
    };
  }, []);

  useEffect(() => {
    sigmaRef.current?.setGraph(graph);
  }, [graph]);

  return <div ref={containerRef} className="sigma-container" />;
}
```

### Vue

```vue
<script setup lang="ts">
import type Graph from "graphology";
import Sigma from "sigma";
import { onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";

const props = defineProps<{ graph: Graph }>();

const container = ref<HTMLDivElement | null>(null);
const sigma = shallowRef<Sigma | null>(null);

onMounted(() => {
  sigma.value = new Sigma(props.graph, container.value!);
});

watch(
  () => props.graph,
  (graph) => sigma.value?.setGraph(graph),
);

onBeforeUnmount(() => {
  sigma.value?.kill();
  sigma.value = null;
});
</script>

<template>
  <div ref="container" class="sigma-container" />
</template>
```

Use `shallowRef` rather than `ref` here, as sigma doesn't need Vue to track its internals. If a parent component stores
the graph, use `shallowRef` there too.

### Angular

```typescript
import { afterNextRender, Component, effect, ElementRef, input, OnDestroy, signal, viewChild } from "@angular/core";
import type Graph from "graphology";
import Sigma from "sigma";

@Component({
  selector: "app-graph-view",
  template: `<div #container class="sigma-container"></div>`,
})
export class GraphViewComponent implements OnDestroy {
  graph = input.required<Graph>();
  container = viewChild.required<ElementRef<HTMLDivElement>>("container");

  sigma = signal<Sigma | null>(null);

  constructor() {
    afterNextRender(() => {
      this.sigma.set(new Sigma(this.graph(), this.container().nativeElement));
    });

    effect(() => {
      this.sigma()?.setGraph(this.graph());
    });
  }

  ngOnDestroy() {
    this.sigma()?.kill();
    this.sigma.set(null);
  }
}
```

## Common pitfalls

### Server-side rendering

Sigma needs browser APIs as soon as its module is evaluated, so even a static `import Sigma from "sigma"` fails on the
server. Only load it in the browser:

- With Next.js, load your component with `next/dynamic` and the `ssr: false` option, from a client component.
- With Nuxt, add the `.client.vue` suffix to your component file.
- Otherwise, including with Angular SSR, import sigma from code that only runs in the browser:

```typescript
const { default: Sigma } = await import("sigma");
```

If the component gets unmounted while sigma is loading, do not create the instance.

`import type` statements are removed at compile time, so they are safe on the server.

### Container size

Sigma throws an error if its container has no width or height, when it is created and at every later render. A
container hidden with `display: none`, for instance in a collapsed panel, triggers this error on the next render. Either
create sigma when the element becomes visible and kill it when it gets hidden, or set the `allowInvalidContainer`
[setting](/reference/settings/) to `true` and call `refresh()` when the element becomes visible again.

### Container content

`kill()` removes all the children of the container. Do not let your framework render anything inside it, and place
overlays such as legends or buttons in a sibling element.

### Graph updates

Sigma listens to the graph, and re-renders when it changes. To reflect your application data, update the graph instead
of creating a new instance. To swap the graph without losing the instance, call `setGraph()`. For selections and other
UI states, use `setNodeState`, `setEdgeState` and `setGraphState`.
