import{G as Ne,S as _e,w as ve}from"./sigma-CUkpdr6a.js";import{g as ea}from"./_commonjsHelpers-BosuxZz1.js";var Qt={exports:{}};/* @preserve
 * Leaflet 1.9.4, a JS library for interactive maps. https://leafletjs.com
 * (c) 2010-2023 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 * This story presents a basic use case of @sigma/layer-leaflet.
 */
import bindLeafletLayer from "@sigma/layer-leaflet";
import Graph from "graphology";
import { Attributes, SerializedGraph } from "graphology-types";
import Sigma from "sigma";

import data from "./data/airports.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const graph = Graph.from(data as SerializedGraph);
  graph.updateEachNodeAttributes((_node, attributes) => ({
    ...attributes,
    label: attributes.fullName,
    x: 0,
    y: 0,
  }));

  // initiate sigma
  const renderer = new Sigma(graph, container, {
    labelRenderedSizeThreshold: 20,
    defaultNodeColor: "#e22352",
    defaultEdgeColor: "#ffaeaf",
    minEdgeThickness: 1,
    nodeReducer: (node, attrs) => {
      return {
        ...attrs,
        size: Math.sqrt(graph.degree(node)) / 2,
      };
    },
  });

  bindLeafletLayer(renderer, {
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });

  return () => {
    renderer.kill();
  };
};
`,wa="FeatureCollection",la=[{type:"Feature",geometry:{type:"LineString",coordinates:[[-105.00341892242432,39.75383843460583],[-105.0008225440979,39.751891803969535]]},properties:{popupContent:"This is a free bus line that will take you across downtown.",underConstruction:!1},id:1},{type:"Feature",geometry:{type:"LineString",coordinates:[[-105.0008225440979,39.751891803969535],[-104.99820470809937,39.74979664004068]]},properties:{popupContent:"This is a free bus line that will take you across downtown.",underConstruction:!0},id:2},{type:"Feature",geometry:{type:"LineString",coordinates:[[-104.99820470809937,39.74979664004068],[-104.98689651489258,39.741052354709055]]},properties:{popupContent:"This is a free bus line that will take you across downtown.",underConstruction:!1},id:3}],na={type:wa,features:la},da=()=>{const k=document.getElementById("sigma-container"),n=new Ne;n.addNode("b-cycle-51",{x:0,y:0,lat:39.7471494,lng:-104.9998241,size:20,color:"#e22352"}),n.addNode("b-cycle-52",{x:0,y:0,lat:39.7502833,lng:-104.9983545,size:20,color:"#e22352"}),n.addEdge("b-cycle-51","b-cycle-52");const h=new _e(n,k),{map:_}=Ie(h);Ae.geoJSON(na).addTo(_);let c=null;return h.on("clickStage",B=>{const w=h.viewportToGraph({x:B.event.x,y:B.event.y}),U=$t(_,w);c&&c.remove(),c=Ae.marker(U),c.addTo(_)}),()=>{h.kill()}},fa=`/**
 * This story shows how to handle custom interactions with Leaflet when using @sigma/layer-leaflet.
 */
import bindLeafletLayer, { graphToLatlng } from "@sigma/layer-leaflet";
import { FeatureCollection } from "geojson";
import Graph from "graphology";
import L from "leaflet";
import Sigma from "sigma";

import geojson from "./data/sample-geojson.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const graph = new Graph();
  graph.addNode("b-cycle-51", { x: 0, y: 0, lat: 39.7471494, lng: -104.9998241, size: 20, color: "#e22352" });
  graph.addNode("b-cycle-52", { x: 0, y: 0, lat: 39.7502833, lng: -104.9983545, size: 20, color: "#e22352" });
  graph.addEdge("b-cycle-51", "b-cycle-52");

  // Initiate sigma
  const renderer = new Sigma(graph, container);
  const { map } = bindLeafletLayer(renderer);

  // Add a geojson on the map
  L.geoJSON(geojson as FeatureCollection).addTo(map);

  // When clicking on the stage of sigma,
  // create a marker on the map
  let markerOnClick: null | L.Marker = null;
  renderer.on("clickStage", (e) => {
    const graphCoords = renderer.viewportToGraph({ x: e.event.x, y: e.event.y });
    const geoCoords = graphToLatlng(map, graphCoords);
    if (markerOnClick) markerOnClick.remove();
    markerOnClick = L.marker(geoCoords);
    markerOnClick.addTo(map);
  });

  return () => {
    renderer.kill();
  };
};
`,Le=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    z-index: 500;
  }
</style>
<div id="sigma-container"></div>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
`,ma=()=>{const k=document.getElementById("sigma-container"),n=Ne.from(yr);n.updateEachNodeAttributes((B,w)=>({...w,label:w.fullName,x:0,y:0}));const h=new _e(n,k,{labelRenderedSizeThreshold:20,defaultNodeColor:"#e22352",defaultEdgeColor:"#ffaeaf",minEdgeThickness:1,nodeReducer:(B,w)=>({...w,size:Math.sqrt(n.degree(B))/2})});Ie(h,{getNodeLatLng:B=>({lat:B.latitude,lng:B.longitude})});let _=!1;const c=document.createElement("button");return c.innerText="Toggle fullscreen",c.style.position="absolute",c.style.zIndex="1",c.onclick=()=>{k.style.width=_?"100%":"50%",k.style.height=_?"100%":"50%",h.refresh({schedule:!1}),_=!_},k.appendChild(c),()=>{h.kill()}},pa=`/**
 * This story shows how to handle resizing with @sigma/layer-leaflet.
 */
import bindLeafletLayer from "@sigma/layer-leaflet";
import Graph from "graphology";
import { Attributes, SerializedGraph } from "graphology-types";
import Sigma from "sigma";

import data from "./data/airports.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const graph = Graph.from(data as SerializedGraph);
  graph.updateEachNodeAttributes((_node, attributes) => ({
    ...attributes,
    label: attributes.fullName,
    x: 0,
    y: 0,
  }));

  // initiate sigma
  const renderer = new Sigma(graph, container, {
    labelRenderedSizeThreshold: 20,
    defaultNodeColor: "#e22352",
    defaultEdgeColor: "#ffaeaf",
    minEdgeThickness: 1,
    nodeReducer: (node, attrs) => {
      return {
        ...attrs,
        size: Math.sqrt(graph.degree(node)) / 2,
      };
    },
  });

  bindLeafletLayer(renderer, {
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });

  let isSmall = false;
  const toggleButton = document.createElement("button");
  toggleButton.innerText = "Toggle fullscreen";
  toggleButton.style.position = "absolute";
  toggleButton.style.zIndex = "1";
  toggleButton.onclick = () => {
    container.style.width = isSmall ? "100%" : "50%";
    container.style.height = isSmall ? "100%" : "50%";
    renderer.refresh({ schedule: false });
    isSmall = !isSmall;
  };
  container.appendChild(toggleButton);

  return () => {
    renderer.kill();
  };
};
`,Aa=()=>{const k=document.getElementById("sigma-container"),n=Ne.from(yr);n.updateEachNodeAttributes((_,c)=>({...c,label:c.fullName,x:0,y:0}));const h=new _e(n,k,{labelRenderedSizeThreshold:20,defaultNodeColor:"#e22352",defaultEdgeColor:"#ffaeaf",minEdgeThickness:1,nodeReducer:(_,c)=>({...c,size:Math.sqrt(n.degree(_))/2})});return Ie(h,{tileLayer:{urlTemplate:"https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'},getNodeLatLng:_=>({lat:_.latitude,lng:_.longitude})}),()=>{h.kill()}},Na=`/**
 * This story shows how to use a custom tile layer with @sigma/layer-leaflet.
 */
import bindLeafletLayer from "@sigma/layer-leaflet";
import Graph from "graphology";
import { Attributes, SerializedGraph } from "graphology-types";
import Sigma from "sigma";

import data from "./data/airports.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;
  const graph = Graph.from(data as SerializedGraph);
  graph.updateEachNodeAttributes((_node, attributes) => ({
    ...attributes,
    label: attributes.fullName,
    x: 0,
    y: 0,
  }));

  // initiate sigma
  const renderer = new Sigma(graph, container, {
    labelRenderedSizeThreshold: 20,
    defaultNodeColor: "#e22352",
    defaultEdgeColor: "#ffaeaf",
    minEdgeThickness: 1,
    nodeReducer: (node, attrs) => {
      return {
        ...attrs,
        size: Math.sqrt(graph.degree(node)) / 2,
      };
    },
  });

  bindLeafletLayer(renderer, {
    tileLayer: {
      urlTemplate: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    getNodeLatLng: (attrs: Attributes) => ({ lat: attrs.latitude, lng: attrs.longitude }),
  });

  return () => {
    renderer.kill();
  };
};
`,Ia={id:"@sigma/layer-leaflet",title:"Satellite packages/@sigma--layer-leaflet"},La={name:"Basic example",render:()=>Le,play:ve(ka),parameters:{storySource:{source:ca}}},Pa={name:"Other tile layer",render:()=>Le,play:ve(Aa),parameters:{storySource:{source:Na}}},Sa={name:"Map interactions",render:()=>Le,play:ve(da),parameters:{storySource:{source:fa}}},Ca={name:"Change dimensions",render:()=>Le,play:ve(ma),parameters:{storySource:{source:pa}}};export{Ia as default,Pa as otherTileLayer,Ca as resize,La as story,Sa as withAGeoJson};