# Sigma.js - Node image renderer

This package contains a node image renderer for [sigma.js](https://sigmajs.org).

Images are stored in a [textures atlas](https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html). The atlas is bound to the class and not the instance, so that it is preserved even when the sigma instance is respawned. For that reason, and to allow using different renderers (bound to different atlas), the main export is **`createNodeImageProgram`**, a factory that creates a renderer class. Also, since there is a [maximum texture size](https://www.khronos.org/opengl/wiki/Texture#:~:text=GL_MAX_TEXTURE_SIZE), the atlas can use multiple textures at once.

It also exports two core classes, built with the proper settings, to help using it in an easier way:

- `NodeImageProgram` is configured to render images, with the nodes `color` used as fallback background. It is good to render user avatars, or thumbnails, for instance;
- `NodePictogramProgram` is configured to render pictograms, with the nodes `color` used to color the image pixels. It is good to render icons within the nodes.

## How to use

Within your application that uses sigma.js, you can use [`@sigma/node-image`](https://www.npmjs.com/package/@sigma/node-image) as following:

```typescript
import { NodeImageProgram } from "@sigma/node-image";

const graph = new Graph();
graph.addNode("cat", {
  x: 0,
  y: 0,
  size: 10,
  type: "image",
  label: "Cat",
  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Sheba1.JPG/800px-Sheba1.JPG",
});

const sigma = new Sigma(graph, container, {
  nodeProgramClasses: {
    image: NodeImageProgram,
  },
});
```

Please check the related [Storybook](https://github.com/jacomyal/sigma.js/tree/main/packages/storybook/stories/3-additional-packages/node-image) for more advanced examples.

## Factory options

- `drawingMode`(`"background" | "color"`, default: `"background"`): When `"background"`, the node color is used as fallback background. When `"color"`, the node color is used to color the image pixels.
- `size` (`{ mode: "auto" } | { mode: "max"; value: number } | { mode: "force"; value: number }`, default: `{ mode: "max", value: 512 }`): If mode `"auto"`, images will always be displayed with their given size. If mode `"force"`, images will always be scaled to the given value. If mode `"max"`, images larger than the given value will be downscaled.
- `objectFit` (`"contain" | "cover" | "fill"`, default: `"cover"`): Tries to mimic the [related CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit).
- `correctCentering` (`boolean`, default: `false`): If `true`, the images are centered on the barycenter of all its non-transparent pixels.
- `keepWithinCircle`(`boolean`, default: `true`): If `true`, the images are always cropped to the circle.
- `padding` (`number`, default: `0`): The padding should be expressed as a `[0, 1]` percentage. A padding of `0.05` will always be 5% of the diameter of a node.
- `drawLabel`(`NodeLabelDrawingFunction | undefined`, default: `undefined`): Will override the `drawLabel` method from the returned class.
- `drawHover` (`NodeHoverDrawingFunction | undefined`, default: `undefined`): Will override the `drawHover` method from the returned class.
- `colorAttribute` (`string`, default: `"color"`): Allows using a different node attribute name than `"color"`.
- `imageAttribute` (`string`, default: `"image"`): Allows using a different node attribute name than `"image"`.
- `maxTextureSize` (`number`, default: `4096`): Allows specifying a custom maximum texture size.
- `debounceTimeout` (`number`, default: `500`): Allows customizing the minimal time between two consecutive textures generations.
