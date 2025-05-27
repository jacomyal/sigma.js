import{G as h,S as p,w as g}from"./sigma-BsJT_GRv.js";import{l as x}from"./index-DQHtHSz5.js";import{i as C}from"./index-Dqwe1tyM.js";import{d as k}from"./data-Bz6iBPrE.js";import{b as y,c as b}from"./index-DTz12yDi.js";import{b as E}from"./index-DlD6yKaT.js";import"./_commonjsHelpers-C4iS2aBk.js";import"./defaults-BeBqgnWC.js";import"./infer-type-BZ77ykGk.js";import"./getters-CXJ0gpj8.js";import"./is-graph-constructor-BVugt_gr.js";import"./add-edge-DJG1E9TZ.js";const w=()=>{const e=new h;e.import(k),x.assign(e,{nodeCommunityAttribute:"community"});const r=new Set;e.forEachNode((n,o)=>r.add(o.community));const t=Array.from(r),l=C(r.size).reduce((n,o,c)=>({...n,[t[c]]:o}),{});e.forEachNode((n,o)=>e.setNodeAttribute(n,"color",l[o.community]));const u=document.getElementById("sigma-container"),s=new p(e,u),a=document.createElement("div");return a.style.position="absolute",a.style.right="10px",a.style.bottom="10px",document.body.append(a),t.forEach((n,o)=>{const c=`cb-${n}`,i=document.createElement("div");i.innerHTML+=`
      <input type="checkbox" id="${c}" name="">
      <label for="${c}" style="color:${l[n]}">Community n°${n+1}</label>    
    `,a.append(i);const d=a.querySelector(`#${c}`);let m=null;const L=()=>{m?(m(),m=null):m=y(`community-${n}`,s,b(e.filterNodes((M,v)=>v.community===n),{radius:150,border:{color:l[n],thickness:8},levels:[{color:"#00000000",threshold:.5}]}))};d.addEventListener("change",L),o||(d.checked=!0,L())}),()=>{s==null||s.kill()}},S=`import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import iwanthue from "iwanthue";
import Sigma from "sigma";

import data from "../../_data/data.json";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Detect communities
  louvain.assign(graph, { nodeCommunityAttribute: "community" });
  const communities = new Set<string>();
  graph.forEachNode((_, attrs) => communities.add(attrs.community));
  const communitiesArray = Array.from(communities);

  // Determine colors, and color each node accordingly
  const palette: Record<string, string> = iwanthue(communities.size).reduce(
    (iter, color, i) => ({
      ...iter,
      [communitiesArray[i]]: color,
    }),
    {},
  );
  graph.forEachNode((node, attr) => graph.setNodeAttribute(node, "color", palette[attr.community]));

  // Retrieve some useful DOM elements
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma
  const renderer = new Sigma(graph, container);

  // Add checkboxes
  const checkboxesContainer = document.createElement("div");
  checkboxesContainer.style.position = "absolute";
  checkboxesContainer.style.right = "10px";
  checkboxesContainer.style.bottom = "10px";
  document.body.append(checkboxesContainer);

  communitiesArray.forEach((community, i) => {
    const id = \`cb-\${community}\`;
    const checkboxContainer = document.createElement("div");
    checkboxContainer.innerHTML += \`
      <input type="checkbox" id="\${id}" name="">
      <label for="\${id}" style="color:\${palette[community]}">Community n°\${community + 1}</label>    
    \`;
    checkboxesContainer.append(checkboxContainer);
    const checkbox = checkboxesContainer.querySelector(\`#\${id}\`) as HTMLInputElement;

    let clean: null | (() => void) = null;
    const toggle = () => {
      if (clean) {
        clean();
        clean = null;
      } else {
        clean = bindWebGLLayer(
          \`community-\${community}\`,
          renderer,
          createContoursProgram(
            graph.filterNodes((_, attr) => attr.community === community),
            {
              radius: 150,
              border: {
                color: palette[community],
                thickness: 8,
              },
              levels: [
                {
                  color: "#00000000",
                  threshold: 0.5,
                },
              ],
            },
          ),
        );
      }
    };

    checkbox.addEventListener("change", toggle);

    if (!i) {
      checkbox.checked = true;
      toggle();
    }
  });

  return () => {
    renderer?.kill();
  };
};
`,G=()=>{let e=null;return fetch("./arctic.gexf").then(r=>r.text()).then(r=>{const t=E.parse(h,r);x.assign(t,{nodeCommunityAttribute:"community"});const l=new Set;t.forEachNode((i,d)=>l.add(d.community));const u=Array.from(l),s=document.getElementById("sigma-container"),a=new p(t,s);e=a;const n=document.createElement("select");n.innerHTML='<option value="">No community</option>'+u.map(i=>`<option value="${i}">Community ${i}</option>`).join(""),n.style.position="absolute",n.style.right="10px",n.style.bottom="10px",document.body.append(n);let o=null;const c=()=>{o&&o();const i=n.value;i?o=y("metaball",a,b(t.filterNodes((d,m)=>m.community===+i))):o=null};n.addEventListener("change",c),n.value=u[0],c()}),()=>{e==null||e.kill()}},A=`import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import louvain from "graphology-communities-louvain";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";

export default () => {
  let globalRenderer: Sigma | null = null;

  // Load external GEXF file:
  fetch("./arctic.gexf")
    .then((res) => res.text())
    .then((gexf) => {
      // Parse GEXF string:
      const graph = parse(Graph, gexf);
      louvain.assign(graph, { nodeCommunityAttribute: "community" });
      const communities = new Set<string>();
      graph.forEachNode((_, attrs) => communities.add(attrs.community));
      const communitiesArray = Array.from(communities);

      // Retrieve some useful DOM elements:
      const container = document.getElementById("sigma-container") as HTMLElement;

      // Instantiate sigma:
      const renderer = new Sigma(graph, container);
      globalRenderer = renderer;

      // Add Select
      const select = document.createElement("select");
      select.innerHTML =
        \`<option value="">No community</option>\` +
        communitiesArray.map((str) => \`<option value="\${str}">Community \${str}</option>\`).join("");
      select.style.position = "absolute";
      select.style.right = "10px";
      select.style.bottom = "10px";
      document.body.append(select);

      // Handle metaballs layer:
      let cleanWebGLLayer: null | (() => void) = null;
      const checkSelectedOption = () => {
        if (cleanWebGLLayer) cleanWebGLLayer();

        const community = select.value;
        if (community) {
          cleanWebGLLayer = bindWebGLLayer(
            "metaball",
            renderer,
            createContoursProgram(graph.filterNodes((_node, attributes) => attributes.community === +community)),
          );
        } else {
          cleanWebGLLayer = null;
        }
      };
      select.addEventListener("change", checkSelectedOption);

      // Select first community:
      select.value = communitiesArray[0];
      checkSelectedOption();
    });

  return () => {
    globalRenderer?.kill();
  };
};
`,$=()=>{const e=new h;e.import(k);const r=document.getElementById("sigma-container"),t=new p(e,r);return y("metaball",t,b(e.nodes(),{radius:150,feather:1,border:{color:"#000000",thickness:4},levels:[{color:"#fff7f3",threshold:.9},{color:"#fde0dd",threshold:.8},{color:"#fcc5c0",threshold:.7},{color:"#fa9fb5",threshold:.6},{color:"#f768a1",threshold:.5},{color:"#dd3497",threshold:.4},{color:"#ae017e",threshold:.3},{color:"#7a0177",threshold:.2},{color:"#49006a",threshold:-.1}]})),()=>{t==null||t.kill()}},N=`import { bindWebGLLayer, createContoursProgram } from "@sigma/layer-webgl";
import Graph from "graphology";
import Sigma from "sigma";

import data from "../../_data/data.json";

export default () => {
  const graph = new Graph();
  graph.import(data);

  // Retrieve some useful DOM elements:
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Instantiate sigma:
  const renderer = new Sigma(graph, container);

  bindWebGLLayer(
    "metaball",
    renderer,
    createContoursProgram(graph.nodes(), {
      radius: 150,
      feather: 1,
      border: {
        color: "#000000",
        thickness: 4,
      },
      levels: [
        {
          color: "#fff7f3",
          threshold: 0.9,
        },
        {
          color: "#fde0dd",
          threshold: 0.8,
        },
        {
          color: "#fcc5c0",
          threshold: 0.7,
        },
        {
          color: "#fa9fb5",
          threshold: 0.6,
        },
        {
          color: "#f768a1",
          threshold: 0.5,
        },
        {
          color: "#dd3497",
          threshold: 0.4,
        },
        {
          color: "#ae017e",
          threshold: 0.3,
        },
        {
          color: "#7a0177",
          threshold: 0.2,
        },
        {
          color: "#49006a",
          threshold: -0.1,
        },
      ],
    }),
  );

  return () => {
    renderer?.kill();
  };
};
`,f=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
    font-family: sans-serif;
  }
</style>
<div id="sigma-container"></div>
`,z={id:"@sigma/layer-webgl",title:"Satellite packages/@sigma--layer-webgl"},F={name:"Metaballs",render:()=>f,play:g(G),args:{},parameters:{storySource:{source:A}}},X={name:"Highlight groups of nodes",render:()=>f,play:g(w),args:{},parameters:{storySource:{source:S}}},J={name:"Multiple levels",render:()=>f,play:g($),args:{},parameters:{storySource:{source:N}}};export{X as ContourLine,z as default,F as metaballs,J as plainContourLine};
