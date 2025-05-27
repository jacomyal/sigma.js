import{G as t,S as g,h as w,i as z,w as c}from"./sigma-BsJT_GRv.js";import{a as b,N as u}from"./index-CsK5g7ah.js";import{c as n}from"./factory-C5ffFMeX.js";import{c as E}from"./index-DUfPS_J0.js";import"./_commonjsHelpers-C4iS2aBk.js";const m=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
</style>
<div id="sigma-container"></div>
`,N=""+new URL("dice-D0MsjWNN.png",import.meta.url).href,A=""+new URL("flower-C92N8yPj.jpg",import.meta.url).href,C="data:image/svg+xml,%3csvg%20fill='%23000000'%20stroke-width='0'%20viewBox='0%200%20320%20512'%20height='200px'%20width='200px'%20xmlns='http://www.w3.org/2000/svg'%20%3e%3cpath%20d='M0%20192C0%20103.6%2071.6%2032%20160%2032s160%2071.6%20160%20160V320c0%2088.4-71.6%20160-160%20160S0%20408.4%200%20320V192zM160%2096c-53%200-96%2043-96%2096V320c0%2053%2043%2096%2096%2096s96-43%2096-96V192c0-53-43-96-96-96z'%20%3e%3c/path%3e%3c/svg%3e",f=`<svg
  fill="#000000"
  stroke-width="0"
  viewBox="0 0 256 512"
  height="200px"
  width="200px"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M160 64c0-11.8-6.5-22.6-16.9-28.2s-23-5-32.8 1.6l-96 64C-.5 111.2-4.4 131 5.4 145.8s29.7 18.7 44.4 8.9L96 123.8V416H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H160V64z"
  ></path>
</svg>
`,k=`<svg
  fill="#000000"
  stroke-width="0"
  viewBox="0 0 320 512"
  height="200px"
  width="200px"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M142.9 96c-21.5 0-42.2 8.5-57.4 23.8L54.6 150.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L40.2 74.5C67.5 47.3 104.4 32 142.9 32C223 32 288 97 288 177.1c0 38.5-15.3 75.4-42.5 102.6L109.3 416H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9L200.2 234.5c15.2-15.2 23.8-35.9 23.8-57.4c0-44.8-36.3-81.1-81.1-81.1z"
  ></path>
</svg>`,x="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";function h(a){const e=new Blob([a],{type:"image/svg+xml"});return URL.createObjectURL(e)}const P=()=>{const a=document.getElementById("sigma-container"),e=new t;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"red",image:N,type:"image"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"red",image:A,type:"image"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"red",image:C,type:"pictogram"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"blue",image:h(f),type:"pictogram"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"blue",image:h(k),type:"pictogram"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"blue",image:x,type:"image"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const r=new g(e,a,{nodeProgramClasses:{image:u,pictogram:b}});return()=>{r.kill()}},v=`import { NodeImageProgram, NodePictogramProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";

// Gives a URL usable at runtime
import PNG_IMAGE from "./images/dice.png";
// Gives a URL usable at runtime
import JPG_IMAGE from "./images/flower.jpg";
// Gives a URL usable at runtime
import SVG_ICON from "./images/icon-0.svg";
// Gives the string content of the SVG image
import RAW_SVG_ICON from "./images/icon-1.svg?raw";

const STRING_SVG_ICON = \`<svg
  fill="#000000"
  stroke-width="0"
  viewBox="0 0 320 512"
  height="200px"
  width="200px"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M142.9 96c-21.5 0-42.2 8.5-57.4 23.8L54.6 150.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L40.2 74.5C67.5 47.3 104.4 32 142.9 32C223 32 288 97 288 177.1c0 38.5-15.3 75.4-42.5 102.6L109.3 416H288c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9L200.2 234.5c15.2-15.2 23.8-35.9 23.8-57.4c0-44.8-36.3-81.1-81.1-81.1z"
  ></path>
</svg>\`;

const BASE_64_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=";

function svgToDataURI(svg: string): string {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  return URL.createObjectURL(blob);
}

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();

  graph.addNode("a", {
    x: 0,
    y: 0,
    size: 20,
    label: "A",
    color: "red",
    image: PNG_IMAGE,
    type: "image",
  });
  graph.addNode("b", {
    x: 1,
    y: -1,
    size: 40,
    label: "B",
    color: "red",
    image: JPG_IMAGE,
    type: "image",
  });
  graph.addNode("c", {
    x: 3,
    y: -2,
    size: 20,
    label: "C",
    color: "red",
    image: SVG_ICON,
    type: "pictogram",
  });
  graph.addNode("d", {
    x: 1,
    y: -3,
    size: 20,
    label: "D",
    color: "blue",
    image: svgToDataURI(RAW_SVG_ICON),
    type: "pictogram",
  });
  graph.addNode("e", {
    x: 3,
    y: -4,
    size: 40,
    label: "E",
    color: "blue",
    image: svgToDataURI(STRING_SVG_ICON),
    type: "pictogram",
  });
  graph.addNode("f", {
    x: 4,
    y: -5,
    size: 20,
    label: "F",
    color: "blue",
    image: BASE_64_IMAGE,
    type: "image",
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
    nodeProgramClasses: {
      image: NodeImageProgram,
      pictogram: NodePictogramProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
`,I=()=>{const a=document.getElementById("sigma-container"),e=new t;e.addNode("a",{x:0,y:0,size:20,label:"Jim",image:"https://upload.wikimedia.org/wikipedia/commons/7/7f/Jim_Morrison_1969.JPG"}),e.addNode("b",{x:1,y:-1,size:40,label:"Johnny",image:"https://upload.wikimedia.org/wikipedia/commons/a/a8/Johnny_Hallyday_%E2%80%94_Milan%2C_1973.jpg"}),e.addNode("c",{x:3,y:-2,size:20,label:"Jimi",image:"https://upload.wikimedia.org/wikipedia/commons/6/6c/Jimi-Hendrix-1967-Helsinki-d.jpg"}),e.addNode("d",{x:1,y:-3,size:20,label:"Bob",image:"https://upload.wikimedia.org/wikipedia/commons/c/c5/Bob-Dylan-arrived-at-Arlanda-surrounded-by-twenty-bodyguards-and-assistants-391770740297_%28cropped%29.jpg"}),e.addNode("e",{x:3,y:-4,size:40,label:"Eric",image:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Eric_Clapton_1.jpg"}),e.addNode("f",{x:4,y:-5,size:20,label:"Mick",image:"https://upload.wikimedia.org/wikipedia/commons/6/66/Mick-Jagger-1965b.jpg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const r=new g(e,a,{defaultNodeType:"image",nodeProgramClasses:{image:u}});return()=>{r.kill()}},S=`import { NodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";

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

  return () => {
    renderer.kill();
  };
};
`,R=()=>{const a=document.getElementById("sigma-container"),e=new t;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"red",image:"https://icons.getbootstrap.com/assets/icons/person.svg"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"red",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"red",image:"https://icons.getbootstrap.com/assets/icons/chat.svg"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"blue",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const r=new g(e,a,{defaultNodeType:"pictogram",nodeProgramClasses:{pictogram:b}});return()=>{r.kill()}},B=()=>{const a=document.getElementById("sigma-container"),e=new t;e.addNode("a",{x:0,y:0,size:20,label:"A",color:"pink",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/person.svg"}),e.addNode("b",{x:1,y:-1,size:40,label:"B",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("c",{x:3,y:-2,size:20,label:"C",color:"yellow",pictoColor:"red",image:"https://icons.getbootstrap.com/assets/icons/chat.svg"}),e.addNode("d",{x:1,y:-3,size:20,label:"D",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addNode("e",{x:3,y:-4,size:40,label:"E",color:"pink",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/building.svg"}),e.addNode("f",{x:4,y:-5,size:20,label:"F",color:"yellow",pictoColor:"blue",image:"https://icons.getbootstrap.com/assets/icons/database.svg"}),e.addEdge("a","b",{size:10}),e.addEdge("b","c",{size:10}),e.addEdge("b","d",{size:10}),e.addEdge("c","b",{size:10}),e.addEdge("c","e",{size:10}),e.addEdge("d","c",{size:10}),e.addEdge("d","e",{size:10}),e.addEdge("e","d",{size:10}),e.addEdge("f","e",{size:10});const r=n({padding:.15,size:{mode:"force",value:256},drawingMode:"color",colorAttribute:"pictoColor"}),l=w([z,r]),i=new g(e,a,{defaultNodeType:"pictogram",nodeProgramClasses:{pictogram:l}});return()=>{i.kill()}},_=`import { createNodeImageProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";
import { NodeCircleProgram, createNodeCompoundProgram } from "sigma/rendering";

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

  return () => {
    renderer.kill();
  };
};
`,M=`import { NodePictogramProgram } from "@sigma/node-image";
import Graph from "graphology";
import Sigma from "sigma";

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

  return () => {
    renderer.kill();
  };
};
`,G=()=>{const a=document.getElementById("sigma-container"),e=["https://upload.wikimedia.org/wikipedia/commons/5/5b/6n-graf.svg","https://upload.wikimedia.org/wikipedia/commons/a/ae/R%C3%A9seaux_d%C3%A9centralis%C3%A9s.png","https://upload.wikimedia.org/wikipedia/commons/4/49/Confluence_of_Erdre_and_Loire%2C_Nantes%2C_France%2C_1890s.jpg","https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Johnny_Hallyday_en_2009_%C3%A0_Bruxelles.jpg/640px-Johnny_Hallyday_en_2009_%C3%A0_Bruxelles.jpg","https://icons.getbootstrap.com/assets/icons/person.svg","https://icons.getbootstrap.com/assets/icons/building.svg","https://icons.getbootstrap.com/assets/icons/chat.svg","https://icons.getbootstrap.com/assets/icons/database.svg",void 0,123,"/404.png"],r=E.scale(["yellow","red","teal"]).mode("lch").colors(e.length),l=[{type:"default",renderer:n()},{type:"color",renderer:n()},{type:"padding",renderer:n({padding:.25})},{type:"padding-color",renderer:n({padding:.25,drawingMode:"color"})},{type:"center",renderer:n({keepWithinCircle:!0,correctCentering:!0})},{type:"scaled-no-crop",renderer:n({size:{mode:"force",value:256},drawingMode:"color",keepWithinCircle:!1})},{type:"scaled-no-crop-centered",renderer:n({size:{mode:"force",value:256},drawingMode:"color",keepWithinCircle:!1,correctCentering:!0})},{type:"center-color",renderer:n({keepWithinCircle:!0,correctCentering:!0,drawingMode:"color"})},{type:"scaled",renderer:n({size:{mode:"force",value:256}})},{type:"scaled-color",renderer:n({size:{mode:"force",value:256},drawingMode:"color"})},{type:"center-scaled",renderer:n({size:{mode:"force",value:256},correctCentering:!0})},{type:"center-scaled-color",renderer:n({size:{mode:"force",value:256},correctCentering:!0,drawingMode:"color"})}],i=new t;e.forEach((s,o)=>{l.forEach(({type:p},d)=>{i.addNode(`${o}-${d}`,{x:10*o,y:-10*d,size:3,color:r[o],type:p,image:s}),o&&i.addEdge(`${o-1}-${d}`,`${o}-${d}`,{color:r[o-1]}),d&&i.addEdge(`${o}-${d-1}`,`${o}-${d}`,{color:r[o]})})});const y=new g(i,a,{allowInvalidContainer:!0,stagePadding:50,itemSizesReference:"positions",zoomToSizeRatioFunction:s=>s,nodeProgramClasses:l.reduce((s,{type:o,renderer:p})=>({...s,[o]:p}),{})});return()=>{y.kill()}},j=`import { createNodeImageProgram } from "@sigma/node-image";
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

  return () => {
    renderer.kill();
  };
};
`,T={id:"@sigma/node-image",title:"Satellite packages/@sigma--node-image"},V={name:"NodeImageRenderer",render:()=>m,play:c(I),args:{},parameters:{storySource:{source:S}}},W={name:"NodePictogramRenderer",render:()=>m,play:c(R),args:{},parameters:{storySource:{source:M}}},U={name:"NodePictogramRenderer with background colors",render:()=>m,play:c(B),args:{},parameters:{storySource:{source:_}}},Y={name:"Displaying local images",render:()=>m,play:c(P),args:{},parameters:{storySource:{source:v}}},J={name:"Options showcase",render:()=>m,play:c(G),args:{},parameters:{storySource:{source:j}}};export{T as default,Y as localImages,V as nodeImages,W as nodePictograms,U as nodePictogramsWithBackground,J as optionsShowcase};
