# sigma.renderers.customShapes

Plugin developed by:

- [Ron Peleg](https://github.com/rpeleg1970) (original idea and version)
- [Julian Bilcke](https://github.com/jbilcke) (WebGL implementation)

---
## General

This plugin let you display custom shapes, icons and images in graphs.

The most basic features are available in both Canvas and WebGL mode, as shown
in this demo:



TODO put the hybrid demo


The WebGL and Canvas renderers work differently, so it is possible that some
features have not been ported yet from one engine to the other. So please open
a ticket of you believe something important is missing (or a PR if you can know
how to fix it).


## Usage

### Quickstart

Build the Sigma.js project by typing:

    $ npm install

This should generate a `sigma.renderers.customShapes.min.js` file in `build/plugins`


Then include this file in your project, like this:

```html
<script src="path/to/plugin/sigma.renderers.customShapes.min.js"></script>
```

Then you can start defining shapes, using the `type` attribute:

```javascript
mySigma.graph.addNode({
  color: '#abcdef',
  type: 'star'
});
```

### List of shapes

#### type: 'star'

Draw a star. Example:

```javascript
{
  type: 'star',
  star: {
    numPoints: 6, // default: 5
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```

Note: defining an inner star radius is not yet supported in WebGL mode.



#### type: 'cross'

Draw a `+` shaped cross.

```javascript
{
  type: 'cross',
  star: {
    lineWeight: 0.08, // default: 0.08
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```

#### type: 'circle'

Draw a disc shaped node (you can also use 'disc', which is an alias).

```javascript
{
  type: 'circle'
}
```

#### type: 'square'

Draw a square. You can rotate it if needed.

```javascript
{
  type: 'square',
  square: {
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```

#### type: 'diamond'

Draw a diamond. This is basically a square with a 45° rotation.

```javascript
{
  type: 'diamond'
}
```

#### type: 'equilateral'

Draw an equilateral triangle

```javascript
{
  type: 'triangle',
  triangle: {
    rotate: Math.PI / 180 // must be in radians. Default: 0
  }
}
```


### Using images

You can add an image to any node, simply by adding `node.image` property, with the following content:
````javascript
node.image = {
  url: /* mandatory image URL */,
  clip: /* Ratio of image clipping disk compared to node size (def 1.0) - see example to how we adapt this to differenmt shapes */,
  scale: /* Ratio of how to scale the image, compared to node size, default 1.0 */,
  w: /* numeric width - important for correct scaling if w/h ratio is not 1.0 */,
  h: /* numeric height - important for correct scaling if w/h ratio is not 1.0 */
}
````

Notes:

 - images must be from trusted URLs: eg. same host, or permissive CORS policy
 - The shape type will then be applied to crop the image.
 - For the moment, the `w` and `h` are not supported in WebGL mode.

### Using font-icons

Custom webfonts are supported!

You just need to make sure you custom font is
actually loaded before actually using it in a graph, using the W3C CSS Font
Loading API (to support non-evergreen browsers you can use a shim like
https://github.com/zachleat/fontfaceonload or
https://github.com/bramstein/fontloader)

The syntax to use a webfont is very simple, and can even be combined with
shapes:


```javascript
{
  type: 'circle',
  color: 'rgba(255, 255, 255, 0.5)', // used for node hover
  text: {
    font: 'Arial', // or 'FontAwesome' etc..
    content: '☺', // or custom fontawesome code eg. "\uF129"
    scale: 0.7, // 70% of node size
    color: '#000000', // text color (black)
    bgColor: '#A5CFD1', // background color (pastel blue)
    x: 0.5, // adjust X position: 0.5 is the horizontal middle
    y: 0.5  // adjust Y position: 0.5 is the vertical middle
}
```


## Renderer-specific notes

### Canvas

In canvas mode it is easy to define your own node renderers. The default
renderer implemented by sigma.js is named `def` - see also [generic custom node
renderer example](../../examples/custom-node-renderer.html)

### WebGL

Current limitations:

* Fonts need to be loaded by the browser before graph is initialized
* Images must be on the same host / or CORS must be correctly configured
* Some parameters are not supported for all shapes (eg. borders)
* The Pac-man shape had a low priority and is not supported yet


#### Additional information about images & webgl

WebGL necessarily imposes stronger restrictions on the use of cross-domain media
 than other APIs (such as the 2D canvas). WebGL applications may utilize images
 and videos that come from other domains, with the cooperation of the server
 hosting the media, using Cross-Origin Resource Sharing [CORS]. In order to use
 such media, the application needs to explicitly request permission to do so,
 and the server needs to explicitly grant permission.

Please read the official documentation for more information:
http://www.khronos.org/registry/webgl/specs/latest/1.0/#4.1
