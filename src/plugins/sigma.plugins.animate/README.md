sigma.plugins.animate
=====================

Plugin developed by [Alexis Jacomy](https://github.com/jacomyal).

---

This plugin provides a method to animate a sigma instance by interpolating some node properties. Check the `sigma.plugins.animate` function doc or the `examples/animate.html` code sample to know more.

Interpolate coordinates as follows:

```js
sigma.plugins.animate(
    s,
    {
      x: 'target_x',
      y: 'target_y',
    }
  );
```

Interpolate colors and sizes as follows:

```js
sigma.plugins.animate(
    s,
    {
      size: 'target_size',
      color: 'target_color'
    }
  );
```

Animate a subset of nodes as follows:

```js
sigma.plugins.animate(
    s,
    {
      x: 'to_x',
      y: 'to_y',
      size: 'to_size',
      color: 'to_color'
    },
    {
      nodes: ['n0', 'n1', 'n2']
    }
  );
```

Example using all options:

```js
sigma.plugins.animate(
    s,
    {
      x: 'to_x',
      y: 'to_y',
      size: 'to_size',
      color: 'to_color'
    },
    {
      nodes: ['n0', 'n1', 'n2'],
      easing: 'cubicInOut',
      duration: 300,
      onComplete: function() {
        // do stuff here after animation is complete
      }
    }
  );
```
