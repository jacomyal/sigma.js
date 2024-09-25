import { createNodeImageProgram } from "@sigma/node-image";
import chroma from "chroma-js";
import Graph from "graphology";
import Sigma from "sigma";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const IMAGES = [
    // Images
    "https://upload.wikimedia.org/wikipedia/commons/5/5b/6n-graf.svg",
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/R%C3%A9seaux_d%C3%A9centralis%C3%A9s.png",
    "https://upload.wikimedia.org/wikipedia/commons/4/49/Confluence_of_Erdre_and_Loire%2C_Nantes%2C_France%2C_1890s.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Johnny_Hallyday_en_2009_%C3%A0_Bruxelles.jpg/640px-Johnny_Hallyday_en_2009_%C3%A0_Bruxelles.jpg",
    // Icons
    "https://icons.getbootstrap.com/assets/icons/person.svg",
    "https://icons.getbootstrap.com/assets/icons/building.svg",
    "https://icons.getbootstrap.com/assets/icons/chat.svg",
    "https://icons.getbootstrap.com/assets/icons/database.svg",
    // Weird cases:
    undefined,
    123,
    "/404.png",
  ];
  const COLORS = chroma.scale(["yellow", "red", "teal"]).mode("lch").colors(IMAGES.length);

  const RENDERERS = [
    { type: "default", renderer: createNodeImageProgram() },
    { type: "color", renderer: createNodeImageProgram() },
    {
      type: "padding",
      renderer: createNodeImageProgram({
        padding: 0.25,
      }),
    },
    {
      type: "padding-color",
      renderer: createNodeImageProgram({
        padding: 0.25,
        drawingMode: "color",
      }),
    },
    {
      type: "center",
      renderer: createNodeImageProgram({
        keepWithinCircle: true,
        correctCentering: true,
      }),
    },
    {
      type: "scaled-no-crop",
      renderer: createNodeImageProgram({
        size: { mode: "force", value: 256 },
        drawingMode: "color",
        keepWithinCircle: false,
      }),
    },
    {
      type: "scaled-no-crop-centered",
      renderer: createNodeImageProgram({
        size: { mode: "force", value: 256 },
        drawingMode: "color",
        keepWithinCircle: false,
        correctCentering: true,
      }),
    },
    {
      type: "center-color",
      renderer: createNodeImageProgram({
        keepWithinCircle: true,
        correctCentering: true,
        drawingMode: "color",
      }),
    },
    {
      type: "scaled",
      renderer: createNodeImageProgram({
        size: { mode: "force", value: 256 },
      }),
    },
    {
      type: "scaled-color",
      renderer: createNodeImageProgram({
        size: { mode: "force", value: 256 },
        drawingMode: "color",
      }),
    },
    {
      type: "center-scaled",
      renderer: createNodeImageProgram({
        size: { mode: "force", value: 256 },
        correctCentering: true,
      }),
    },
    {
      type: "center-scaled-color",
      renderer: createNodeImageProgram({
        size: { mode: "force", value: 256 },
        correctCentering: true,
        drawingMode: "color",
      }),
    },
  ];

  const graph = new Graph();
  IMAGES.forEach((image, i) => {
    RENDERERS.forEach(({ type }, j) => {
      graph.addNode(`${i}-${j}`, {
        x: 10 * i,
        y: -10 * j,
        size: 3,
        color: COLORS[i],
        type,
        image,
      });

      if (i)
        graph.addEdge(`${i - 1}-${j}`, `${i}-${j}`, {
          color: COLORS[i - 1],
        });

      if (j)
        graph.addEdge(`${i}-${j - 1}`, `${i}-${j}`, {
          color: COLORS[i],
        });
    });
  });

  const renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    stagePadding: 50,
    itemSizesReference: "positions",
    zoomToSizeRatioFunction: (x) => x,
    nodeProgramClasses: RENDERERS.reduce(
      (iter, { type, renderer }) => ({
        ...iter,
        [type]: renderer,
      }),
      {},
    ),
  });

  return () => {
    renderer.kill();
  };
};
