---
title: Lifecycle
sidebar_position: 0
---

# Sigma.js lifecycle

This page outlines the lifecycle and rendering processes of a sigma instance. It details the steps from instantiation to termination and explains the mechanics behind data visualization in sigma.js.

## Core lifecycle of a sigma instance

### Instantiation

A sigma instance is initialized with the following components:

- **Graphology Instance**: This is essential for sigma to function. It provides the graph data structure that sigma visualizes.
- **DOM Element**: This element acts as the container for the graph visualization and remains consistent throughout the sigma instance's lifetime.
- **Settings (Optional)**: Initial settings can be provided during instantiation to configure sigma's behavior.

The graph provided during instantiation can be updated later using the `setGraph` method.

### Settings management

Settings play a pivotal role in determining sigma's behavior. They can be:

- **Provided during instantiation**: Initial settings can be passed to the constructor.
- **Updated later**: The `setSetting` and `updateSetting` methods allow for modifications to the settings after instantiation.

### Termination

To gracefully terminate a sigma instance, the `kill` method should be invoked. This method ensures that all bindings and resources are released, allowing for efficient garbage collection and cleanup of the internal components.

## Rendering in sigma

Rendering in sigma involves two primary steps: processing the data and then visualizing it.

### Two-step rendering mechanism

1. **Processing**: Before rendering, sigma must process the data. This involves tasks like invoking the `nodeReducer` and `edgeReducer` settings, and indexing data for the WebGL renderers.
2. **Rendering**: After processing, sigma visualizes the graph by generating each layer in the canvas element.

### Automatic rendering triggers

Sigma automatically invokes the processing and rendering methods in specific scenarios:

- **Graphology Events**: When the Graphology instance emits events related to data updates, sigma takes care of the necessary rendering. Developers don't need to manage this.
- **Settings Updates**: Any modification to the settings triggers a re-render.
- **User Interactions**: Interactions via mouse or touch devices lead to camera updates and subsequent rendering.

### Manual rendering triggers

In certain situations, developers might need to manually initiate the processing and rendering steps. For instance, if an external factor alters a state utilized by the `nodeReducer` or `edgeReducer`, both processing and rendering must be executed to achieve the correct visualization. Sigma provides three methods for this:

- **`Sigma#refresh`**: This method processes the data and then renders it.
- **`Sigma#scheduleRefresh`**: Schedules a `refresh` for the next frame using `requestAnimationFrame`. If a refresh is already scheduled, it avoids redundancy by not scheduling another. This method is useful for debouncing, as `refresh` can sometimes be resource-intensive.
- **`Sigma#scheduleRender`**: Schedules a render for the next frame, but only if neither a `render` nor a `refresh` is already scheduled.

**Note**: The `render` method is private. Developers should always use `scheduleRender` when a re-render is required.
