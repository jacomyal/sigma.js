# Sigma.js - Export image

This package provides various functions to capture snapshots of a [sigma.js](https://www.sigmajs.org/) instance as images, allowing easy export of your graph visualizations in different formats.

### Available Options

The following options can be used to customize the image export:

- `width` (`null | number`, default: `null`): Set the width of the output image. If `null`, the canvas will use the sigma container's width.
- `height` (`null | number`, default: `null`): Set the height of the output image. If `null`, the canvas will use the sigma container's height.
- `fileName` (`string`, default: `"graph"`): The name of the file to download.
- `format` (`"png" | "jpeg"`, default: `"png"`): The image format, either PNG or JPEG.
- `sigmaOverrides` (`Partial<{ primitives, styles, settings }>`, default: `{}`): Alter the primitives, styles, and/or settings of the temporary sigma instance used for rendering. Each entry takes either an object, whose top-level sections replace the source ones, or a function receiving the source declaration and returning the one to use (see [Overriding declarations](#overriding-declarations)).
- `cameraState` (`null | CameraState`, default: `null`): The camera state to use for the rendering. If `null`, the current camera state is used.
- `backgroundColor` (`string`, default: `"transparent"`): The background color of the image.
- `withTempRenderer` (`null | ((tmpRenderer: Sigma) => void) | ((tmpRenderer: Sigma) => Promise<void>)`, default: `null`): A callback function for custom operations using the temporary sigma renderer before rendering the image.

### Available Functions

#### `drawOnCanvas`

This function creates a new temporary sigma instance, renders it with the given options, and draws the stage canvas on a new HTML canvas element. It then returns it as a `Promise<HTMLCanvasElement>`. This function is the core function, used by all other ones.

The primitives, styles and settings declarations, as well as the node, edge and graph states, are automatically copied from the source sigma instance to the temporary renderer, so the exported image reflects what is on screen (custom shapes, style rules, hover, highlight, etc.). Use `sigmaOverrides` to render the export differently.

### Overriding declarations

Each `sigmaOverrides` entry accepts two forms. An **object** replaces the top-level sections it declares, and inherits the others from the source renderer:

```typescript
// Export with the source renderer's primitives and styles, but no stage padding:
downloadAsPNG(renderer, { sigmaOverrides: { settings: { stagePadding: 0 } } });
```

A **function** receives the source declaration and takes full control: whatever it returns is used as-is. This is the form to use when adding to what the renderer already declares, since the source cannot be forgotten:

```typescript
// Export with an extra style rule, forcing all labels to be drawn:
downloadAsPNG(renderer, {
  sigmaOverrides: {
    styles: (styles) => ({
      ...styles,
      nodes: [...(Array.isArray(styles.nodes) ? styles.nodes : [styles.nodes!]), { labelVisibility: "visible" }],
    }),
  },
});
```

#### `toBlob`

This function returns a `Promise<Blob>` that contains the image data, which can be further processed or stored, useful for integration with file storage services.

#### `toFile`

This function returns a `Promise<File>` that contains the image data as a file, ideal for direct file manipulation or uploads.

#### `downloadAsImage`

This function downloads a snapshot of the sigma instance as an image file.

#### `downloadAsPNG` / `downloadAsJPEG`

These functions are simple sugar around `downloadAsImage`, without having to specify the `"format"` option.

Please check the [website examples](https://www.sigmajs.org/examples/) for more advanced examples.
