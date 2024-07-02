import{g as o}from"./factory-CzukJLPY.js";import{G as c,S as g,o as m,c as b,b as y}from"./utils-Bhbjx1g-.js";import{c as u}from"./chroma-CKzHTTCE.js";import"./_commonjsHelpers-BosuxZz1.js";const z=o(),E=o({keepWithinCircle:!1,size:{mode:"force",value:256},drawingMode:"color",correctCentering:!0}),l=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
<div id="sigma-container"></div>
`,w=()=>{const r=document.getElementById("sigma-container"),e=new c;e.addNode("a",{x:0,y:0,size:20,label:"Jim",image:"https://upload.wikimedia.org/wikipedia/commons/7/7f/Jim_Morrison_1969.JPG"}),e.addNode("b",{x:1,y:-1,size:40,label:"Johnny",image:"https://upload.wikimedia.org/wikipedia/commons/a/a8/Johnny_Hallyday_%E2%80%94_Milan%2C_1973.jpg"}),e.addNode("c",{x:3,y:-2,size:20,label:"Jimi",image:"https://upload.wikimedia.org/wikipedia/commons/6/6c/Jimi-Hendrix-1967-Helsinki-d.jpg"}),e.addNode("d",{x:1,y:-3,size:20,label:"Bob",image:"https://upload.wikimedia.org/wikipedia/commons/c/c5/Bob-Dylan-arrived-at-Arlanda-surrounded-by-twenty-bodyguards-and-assistants-391770740297_%28cropped%29.jpg"}),e.addNode("e",{x:3,y:-4,size:40,label:"Eric",image:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Eric_Clapton_1.jpg"}),e.addNode("f",{x:4,y:-5,size:20,label:"Mick",image:"https://upload.wikimedia.org/wikipedia/commons/6/66/Mick-Jagger-1965b.jpg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const a=new g(e,r,{defaultNodeType:"image",nodeProgramClasses:{image:z}});m(()=>{a.kill()})},N=`import { NodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "Jim",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Jim_Morrison_1969.JPG",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "Johnny",
    image: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Johnny_Hallyday_%E2%80%94_Milan%2C_1973.jpg",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "Jimi",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/6c/Jimi-Hendrix-1967-Helsinki-d.jpg",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "Bob",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Bob-Dylan-arrived-at-Arlanda-surrounded-by-twenty-bodyguards-and-assistants-391770740297_%28cropped%29.jpg",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "Eric",
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Eric_Clapton_1.jpg",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "Mick",
    image: "https://upload.wikimedia.org/wikipedia/commons/6/66/Mick-Jagger-1965b.jpg",
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "image",
    nodeProgramClasses: {
      image: NodeImageProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,f=()=>{const r=document.getElementById("sigma-container"),e=new c;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"red",image:"https://icons.getbootstrap.com/assets/icons/person.svg"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"red",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"red",image:"https://icons.getbootstrap.com/assets/icons/chat.svg"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"blue",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const a=new g(e,r,{defaultNodeType:"pictogram",nodeProgramClasses:{pictogram:E}});m(()=>{a.kill()})},C=()=>{const r=document.getElementById("sigma-container"),e=new c;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/person.svg"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/chat.svg"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"yellow",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const a=o({padding:.15,size:{mode:"force",value:256},drawingMode:"color",colorAttribute:"pictoColor"}),t=b([y,a]),i=new g(e,r,{defaultNodeType:"pictogram",nodeProgramClasses:{pictogram:t}});m(()=>{i.kill()})},k=`import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";
import { NodeCircleProgram, createNodeCompoundProgram } from "sigma/rendering";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    color: "pink",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/person.svg",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "yellow",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    color: "yellow",
    pictoColor: "red",
    image: "https://icons.getbootstrap.com/assets/icons/chat.svg",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    color: "pink",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    color: "pink",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    color: "yellow",
    pictoColor: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const NodePictogramCustomProgram = createNodeImageProgram({
    padding: 0.15,
    size: { mode: "force", value: 256 },
    drawingMode: "color",
    colorAttribute: "pictoColor",
  });

  const NodeProgram = createNodeCompoundProgram([NodeCircleProgram, NodePictogramCustomProgram]);

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "pictogram",
    nodeProgramClasses: {
      pictogram: NodeProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,P=`import { NodePictogramProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    color: "red",
    image: "https://icons.getbootstrap.com/assets/icons/person.svg",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "red",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    color: "red",
    image: "https://icons.getbootstrap.com/assets/icons/chat.svg",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    color: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    color: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/building.svg",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    color: "blue",
    image: "https://icons.getbootstrap.com/assets/icons/database.svg",
  });

  graph.addEdge("a", "b", { size: 10 });
  graph.addEdge("b", "c", { size: 10 });
  graph.addEdge("b", "d", { size: 10 });
  graph.addEdge("c", "b", { size: 10 });
  graph.addEdge("c", "e", { size: 10 });
  graph.addEdge("d", "c", { size: 10 });
  graph.addEdge("d", "e", { size: 10 });
  graph.addEdge("e", "d", { size: 10 });
  graph.addEdge("f", "e", { size: 10 });

  const renderer = new Sigma(graph, container, {
    defaultNodeType: "pictogram",
    nodeProgramClasses: {
      pictogram: NodePictogramProgram,
    },
  });

  onStoryDown(() => {
    renderer.kill();
  });
};
`,v=()=>{const r=document.getElementById("sigma-container"),e=["https://upload.wikimedia.org/wikipedia/commons/5/5b/6n-graf.svg","https://upload.wikimedia.org/wikipedia/commons/a/ae/R%C3%A9seaux_d%C3%A9centralis%C3%A9s.png","https://upload.wikimedia.org/wikipedia/commons/4/49/Confluence_of_Erdre_and_Loire%2C_Nantes%2C_France%2C_1890s.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Johnny_Hallyday_en_2009_%C3%A0_Bruxelles.jpg/640px-Johnny_Hallyday_en_2009_%C3%A0_Bruxelles.jpg","https://icons.getbootstrap.com/assets/icons/person.svg","https://icons.getbootstrap.com/assets/icons/building.svg","https://icons.getbootstrap.com/assets/icons/chat.svg","https://icons.getbootstrap.com/assets/icons/database.svg",void 0,123,"/404.png"],a=u.scale(["yellow","red","teal"]).mode("lch").colors(e.length),t=[{type:"default",renderer:o()},{type:"color",renderer:o()},{type:"padding",renderer:o({padding:.25})},{type:"padding-color",renderer:o({padding:.25,drawingMode:"color"})},{type:"center",renderer:o({keepWithinCircle:!0,correctCentering:!0})},{type:"scaled-no-crop",renderer:o({size:{mode:"force",value:256},drawingMode:"color",keepWithinCircle:!1})},{type:"scaled-no-crop-centered",renderer:o({size:{mode:"force",value:256},drawingMode:"color",keepWithinCircle:!1,correctCentering:!0})},{type:"center-color",renderer:o({keepWithinCircle:!0,correctCentering:!0,drawingMode:"color"})},{type:"scaled",renderer:o({size:{mode:"force",value:256}})},{type:"scaled-color",renderer:o({size:{mode:"force",value:256},drawingMode:"color"})},{type:"center-scaled",renderer:o({size:{mode:"force",value:256},correctCentering:!0})},{type:"center-scaled-color",renderer:o({size:{mode:"force",value:256},correctCentering:!0,drawingMode:"color"})}],i=new c;e.forEach((s,n)=>{t.forEach(({type:p},d)=>{i.addNode(`${n}-${d}`,{x:10*n,y:-10*d,size:3,color:a[n],type:p,image:s}),n&&i.addEdge(`${n-1}-${d}`,`${n}-${d}`,{color:a[n-1]}),d&&i.addEdge(`${n}-${d-1}`,`${n}-${d}`,{color:a[n]})})});const h=new g(i,r,{allowInvalidContainer:!0,stagePadding:50,itemSizesReference:"positions",zoomToSizeRatioFunction:s=>s,nodeProgramClasses:t.reduce((s,{type:n,renderer:p})=>({...s,[n]:p}),{})});m(()=>{h.kill()})},x=`import { createNodeImageProgram } from "@sigma/node-image";
import chroma from "chroma-js";
import Graph from "graphology";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

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
      graph.addNode(\`\${i}-\${j}\`, {
        x: 10 * i,
        y: -10 * j,
        size: 3,
        color: COLORS[i],
        type,
        image,
      });

      if (i)
        graph.addEdge(\`\${i - 1}-\${j}\`, \`\${i}-\${j}\`, {
          color: COLORS[i - 1],
        });

      if (j)
        graph.addEdge(\`\${i}-\${j - 1}\`, \`\${i}-\${j}\`, {
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

  onStoryDown(() => {
    renderer.kill();
  });
};
`,R={id:"node-image",title:"node-image"},B={name:"NodeImageRenderer",render:()=>l,play:w,args:{},parameters:{storySource:{source:N}}},A={name:"NodePictogramRenderer",render:()=>l,play:f,args:{},parameters:{storySource:{source:P}}},J={name:"NodePictogramRenderer with background colors",render:()=>l,play:C,args:{},parameters:{storySource:{source:k}}},$={name:"Options showcase",render:()=>l,play:v,args:{},parameters:{storySource:{source:x}}};export{R as default,B as nodeImages,A as nodePictograms,J as nodePictogramsWithBackground,$ as optionsShowcase};
