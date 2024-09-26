# Sigma.js - Export image

This package provides various functions to capture snapshots of a [sigma.js](https://www.sigmajs.org/) instance as images, allowing easy export of your graph visualizations in different formats.

### Available Options

The following options can be used to customize the image export:

- `layers` (`null | string[]`, default: `null`): Specify the graph layers to render (from `sigma.getCanvases()`). If `null`, all layers are rendered.
- `width` (`null | number`, default: `null`): Set the width of the output image. If `null`, the canvas will use the sigma container's width.
- `height` (`null | number`, default: `null`): Set the height of the output image. If `null`, the canvas will use the sigma container's height.
- `fileName` (`string`, default: `"graph"`): The name of the file to download.
- `format` (`"png" | "jpeg"`, default: `"png"`): The image format, either PNG or JPEG.
- `sigmaSettings` (`Partial<Settings>`, default: `{}`): Custom settings for the sigma instance used during rendering.
- `cameraState` (`null | CameraState`, default: `null`): The camera state to use for the rendering. If `null`, the current camera state is used.
- `backgroundColor` (`string`, default: `"transparent"`): The background color of the image.
- `withTempRenderer` (`null | ((tmpRenderer: Sigma) => void) | ((tmpRenderer: Sigma) => Promise<void>)`, default: `null`): A callback function for custom operations using the temporary sigma renderer before rendering the image.

### Available Functions

#### `drawOnCanvas`

This function creates a new temporary sigma instance, renders it with the given options, and draws its layers (or the selected layers) on a new HTML canvas element. It then returns it as a `Promise<HTMLCanvasElement>`. This function is the core function, used by all other ones.

#### `toBlob`

This function returns a `Promise<Blob>` that contains the image data, which can be further processed or stored, useful for integration with file storage services.

#### `toFile`

This function returns a `Promise<File>` that contains the image data as a file, ideal for direct file manipulation or uploads.

#### `downloadAsImage`

This function downloads a snapshot of the sigma instance as an image file.

#### `downloadAsPNG` / `downloadAsJPEG`

These functions are simple sugar around `downloadAsImage`, without having to specify the `"format"` option.

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/export-image) for more advanced examples.
