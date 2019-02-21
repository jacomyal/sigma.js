import ShapeLibrary from "./shape-library";

export default function extend(sigma) {
  if (typeof sigma === "undefined") throw new Error("sigma is not declared");

  if (typeof ShapeLibrary === "undefined")
    throw new Error("ShapeLibrary is not declared");

  // Initialize package:
  sigma.utils.pkg("sigma.canvas.nodes");
  sigma.utils.pkg("sigma.svg.nodes");

  let sigInst = undefined;
  const imgCache = {};

  const initPlugin = function(inst) {
    sigInst = inst;
  };

  const drawImage = function(node, x, y, size, context) {
    if (sigInst && node.image && node.image.url) {
      const url = node.image.url;
      const ih = node.image.h || 1; // 1 is arbitrary, anyway only the ratio counts
      const iw = node.image.w || 1;
      const scale = node.image.scale || 1;
      const clip = node.image.clip || 1;

      // create new IMG or get from imgCache
      let image = imgCache[url];
      if (!image) {
        image = document.createElement("IMG");
        image.src = url;
        image.status = "loading";
        image.onerror = function() {
          console.log("error loading", url);
          image.status = "error";
        };
        image.onload = function() {
          // TODO see how we redraw on load
          // need to provide the siginst as a parameter to the library
          console.log("redraw on image load", url);
          image.status = "ok";
          sigInst.refresh();
        };
        imgCache[url] = image;
      }

      // calculate position and draw
      const xratio = iw < ih ? iw / ih : 1;
      const yratio = ih < iw ? ih / iw : 1;
      const r = size * scale;

      // Draw the clipping disc:
      context.save(); // enter clipping mode
      context.beginPath();
      context.arc(x, y, size * clip, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      if (image.status === "ok") {
        // Draw the actual image
        context.drawImage(
          image,
          x + Math.sin(-3.142 / 4) * r * xratio,
          y - Math.cos(-3.142 / 4) * r * yratio,
          r * xratio * 2 * Math.sin(-3.142 / 4) * -1,
          r * yratio * 2 * Math.cos(-3.142 / 4)
        );
      }
      context.restore(); // exit clipping mode
    }
  };

  const drawSVGImage = function(node, group, settings) {
    if (sigInst && node.image && node.image.url) {
      const clipCircle = document.createElementNS(settings("xmlns"), "circle");

      const clipPath = document.createElementNS(settings("xmlns"), "clipPath");

      const clipPathId = `${settings("classPrefix")}-clip-path-${node.id}`;

      const def = document.createElementNS(settings("xmlns"), "defs");

      const image = document.createElementNS(settings("xmlns"), "image");

      const url = node.image.url;

      clipPath.setAttributeNS(null, "id", clipPathId);
      clipPath.appendChild(clipCircle);
      def.appendChild(clipPath);

      // angular's base tag will change the relative fragment id, so
      // #<clipPathId> doesn't work
      // HACKHACK: IE <=9 does not respect the HTML base element in SVG.
      // They don't need the current URL in the clip path reference.
      let absolutePath = /MSIE [5-9]/.test(navigator.userAgent)
        ? ""
        : document.location.href;
      // To fix cases where an anchor tag was used
      absolutePath = absolutePath.split("#")[0];
      image.setAttributeNS(
        null,
        "class",
        `${settings("classPrefix")}-node-image`
      );
      image.setAttributeNS(
        null,
        "clip-path",
        `url(${absolutePath}#${clipPathId})`
      );
      image.setAttributeNS(null, "pointer-events", "none");
      image.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        node.image.url
      );
      group.appendChild(def);
      group.appendChild(image);
    }
  };

  const register = function(name, drawShape, drawBorder) {
    sigma.canvas.nodes[name] = function(node, context, settings) {
      const args = arguments;

      const prefix = settings("prefix") || "";

      const size = node[`${prefix}size`];

      const color = node.color || settings("defaultNodeColor");

      const borderColor = node.borderColor || color;

      const x = node[`${prefix}x`];

      const y = node[`${prefix}y`];

      context.save();

      if (drawShape) {
        drawShape(node, x, y, size, color, context);
      }

      if (drawBorder) {
        drawBorder(node, x, y, size, borderColor, context);
      }

      drawImage(node, x, y, size, context);

      context.restore();
    };

    sigma.svg.nodes[name] = {
      create(node, settings) {
        const group = document.createElementNS(settings("xmlns"), "g");

        const circle = document.createElementNS(settings("xmlns"), "circle");

        group.setAttributeNS(
          null,
          "class",
          `${settings("classPrefix")}-node-group`
        );
        group.setAttributeNS(null, "data-node-id", node.id);
        // Defining the node's circle
        circle.setAttributeNS(null, "data-node-id", node.id);
        circle.setAttributeNS(null, "class", `${settings("classPrefix")}-node`);
        circle.setAttributeNS(
          null,
          "fill",
          node.color || settings("defaultNodeColor")
        );

        group.appendChild(circle);
        drawSVGImage(node, group, settings);
        return group;
      },
      update(node, group, settings) {
        const classPrefix = settings("classPrefix");

        const clip = node.image.clip || 1;

        // 1 is arbitrary, anyway only the ratio counts

        const ih = node.image.h || 1;

        const iw = node.image.w || 1;

        const prefix = settings("prefix") || "";

        const scale = node.image.scale || 1;

        const size = node[`${prefix}size`];

        const x = node[`${prefix}x`];

        const y = node[`${prefix}y`];

        const r = scale * size;

        const xratio = iw < ih ? iw / ih : 1;

        const yratio = ih < iw ? ih / iw : 1;

        for (
          let i = 0, childNodes = group.childNodes;
          i < childNodes.length;
          i++
        ) {
          const className = childNodes[i].getAttribute("class");

          switch (className) {
            case `${classPrefix}-node`:
              childNodes[i].setAttributeNS(null, "cx", x);
              childNodes[i].setAttributeNS(null, "cy", y);
              childNodes[i].setAttributeNS(null, "r", size);

              // // Updating only if not freestyle
              if (!settings("freeStyle")) {
                childNodes[i].setAttributeNS(
                  null,
                  "fill",
                  node.color || settings("defaultNodeColor")
                );
              }
              break;
            case `${classPrefix}-node-image`:
              childNodes[i].setAttributeNS(
                null,
                "x",
                x + Math.sin(-3.142 / 4) * r * xratio
              );
              childNodes[i].setAttributeNS(
                null,
                "y",
                y - Math.cos(-3.142 / 4) * r * yratio
              );
              childNodes[i].setAttributeNS(
                null,
                "width",
                r * xratio * 2 * Math.sin(-3.142 / 4) * -1
              );
              childNodes[i].setAttributeNS(
                null,
                "height",
                r * yratio * 2 * Math.cos(-3.142 / 4)
              );
              break;
            default:
              // no class name, must be the clip-path
              var clipPath = childNodes[i].firstChild;
              if (clipPath != null) {
                const clipPathId = `${classPrefix}-clip-path-${node.id}`;
                if (clipPath.getAttribute("id") === clipPathId) {
                  clipPath.firstChild.setAttributeNS(null, "cx", x);
                  clipPath.firstChild.setAttributeNS(null, "cy", y);
                  clipPath.firstChild.setAttributeNS(null, "r", clip * size);
                }
              }
              break;
          }
        }

        // showing
        group.style.display = "";
      }
    };
  };

  ShapeLibrary.enumerate().forEach(function(shape) {
    register(shape.name, shape.drawShape, shape.drawBorder);
  });
}
