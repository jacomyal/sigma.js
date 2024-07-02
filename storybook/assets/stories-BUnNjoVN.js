import{S as w,G as R,o as S}from"./utils-Bhbjx1g-.js";import{F as k}from"./worker-BlBYgLo0.js";import{c as g,g as A}from"./_commonjsHelpers-BosuxZz1.js";import"./defaults-9mJNxk8k.js";var x={exports:{}};(function(m,n){(function(p,l){l()})(g,function(){function p(e,t){return typeof t>"u"?t={autoBom:!1}:typeof t!="object"&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\uFEFF",e],{type:e.type}):e}function l(e,t,i){var a=new XMLHttpRequest;a.open("GET",e),a.responseType="blob",a.onload=function(){d(a.response,t,i)},a.onerror=function(){console.error("could not download file")},a.send()}function r(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch{}return 200<=t.status&&299>=t.status}function s(e){try{e.dispatchEvent(new MouseEvent("click"))}catch{var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var o=typeof window=="object"&&window.window===window?window:typeof self=="object"&&self.self===self?self:typeof g=="object"&&g.global===g?g:void 0,h=o.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),d=o.saveAs||(typeof window!="object"||window!==o?function(){}:"download"in HTMLAnchorElement.prototype&&!h?function(e,t,i){var a=o.URL||o.webkitURL,c=document.createElement("a");t=t||e.name||"download",c.download=t,c.rel="noopener",typeof e=="string"?(c.href=e,c.origin===location.origin?s(c):r(c.href)?l(e,t,i):s(c,c.target="_blank")):(c.href=a.createObjectURL(e),setTimeout(function(){a.revokeObjectURL(c.href)},4e4),setTimeout(function(){s(c)},0))}:"msSaveOrOpenBlob"in navigator?function(e,t,i){if(t=t||e.name||"download",typeof e!="string")navigator.msSaveOrOpenBlob(p(e,i),t);else if(r(e))l(e,t,i);else{var a=document.createElement("a");a.href=e,a.target="_blank",setTimeout(function(){s(a)})}}:function(e,t,i,a){if(a=a||open("","_blank"),a&&(a.document.title=a.document.body.innerText="downloading..."),typeof e=="string")return l(e,t,i);var c=e.type==="application/octet-stream",E=/constructor/i.test(o.HTMLElement)||o.safari,v=/CriOS\/[\d]+/.test(navigator.userAgent);if((v||c&&E||h)&&typeof FileReader<"u"){var f=new FileReader;f.onloadend=function(){var u=f.result;u=v?u:u.replace(/^data:[^;]*;/,"data:attachment/file;"),a?a.location.href=u:location=u,a=null},f.readAsDataURL(e)}else{var b=o.URL||o.webkitURL,y=b.createObjectURL(e);a?a.location=y:location.href=y,a=null,setTimeout(function(){b.revokeObjectURL(y)},4e4)}});o.saveAs=d.saveAs=d,m.exports=d})})(x);var N=x.exports;const L=A(N);async function C(m,n){const{width:p,height:l}=m.getDimensions(),r=window.devicePixelRatio||1,s=document.createElement("DIV");s.style.width=`${p}px`,s.style.height=`${l}px`,s.style.position="absolute",s.style.right="101%",s.style.bottom="101%",document.body.appendChild(s);const o=new w(m.getGraph(),s,m.getSettings());o.getCamera().setState(m.getCamera().getState()),o.refresh();const h=document.createElement("CANVAS");h.setAttribute("width",p*r+""),h.setAttribute("height",l*r+"");const d=h.getContext("2d");d.fillStyle="#fff",d.fillRect(0,0,p*r,l*r);const e=o.getCanvases();(n?n.filter(i=>!!e[i]):Object.keys(e)).forEach(i=>{d.drawImage(e[i],0,0,p*r,l*r,0,0,p*r,l*r)}),h.toBlob(i=>{i&&L.saveAs(i,"graph.png"),o.kill(),s.remove()},"image/png")}const z=()=>{const m=document.getElementById("sigma-container"),n=new R,p="#FA4F40",l="#727EE0",r="#5DB346";n.addNode("John",{size:15,label:"John",color:p}),n.addNode("Mary",{size:15,label:"Mary",color:p}),n.addNode("Suzan",{size:15,label:"Suzan",color:p}),n.addNode("Nantes",{size:15,label:"Nantes",color:l}),n.addNode("New-York",{size:15,label:"New-York",color:l}),n.addNode("Sushis",{size:7,label:"Sushis",color:r}),n.addNode("Falafels",{size:7,label:"Falafels",color:r}),n.addNode("Kouign Amann",{size:7,label:"Kouign Amann",color:r}),n.addEdge("John","Mary",{type:"line",label:"works with",size:5}),n.addEdge("Mary","Suzan",{type:"line",label:"works with",size:5}),n.addEdge("Mary","Nantes",{type:"arrow",label:"lives in",size:5}),n.addEdge("John","New-York",{type:"arrow",label:"lives in",size:5}),n.addEdge("Suzan","New-York",{type:"arrow",label:"lives in",size:5}),n.addEdge("John","Falafels",{type:"arrow",label:"eats",size:5}),n.addEdge("Mary","Sushis",{type:"arrow",label:"eats",size:5}),n.addEdge("Suzan","Kouign Amann",{type:"arrow",label:"eats",size:5}),n.nodes().forEach((d,e)=>{const t=e*2*Math.PI/n.order;n.setNodeAttribute(d,"x",100*Math.cos(t)),n.setNodeAttribute(d,"y",100*Math.sin(t))});const s=new w(n,m,{renderEdgeLabels:!0}),o=new k(n);o.start(),document.getElementById("save-as-png").addEventListener("click",()=>{const d=["edges","nodes","edgeLabels","labels"].filter(e=>!!document.getElementById(`layer-${e}`).checked);C(s,d)}),S(()=>{o.kill(),s.kill()})},F=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sigma example: PNG snapshot</title>
  </head>
  <body>
    <style>
      html,
      body,
      #storybook-root,
      #sigma-container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
        font-family: sans-serif;
      }
      #controls {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100%;
        max-height: 100%;
        padding: 1em;
        background: #ffffff99;
      }
    </style>
    <div id="sigma-container"></div>
    <div id="controls">
      <h3>Layers to save</h3>
      <div>
        <input type="checkbox" id="layer-edges" checked />
        <label for="layer-edges">Edges</label>
      </div>
      <div>
        <input type="checkbox" id="layer-nodes" checked />
        <label for="layer-nodes">Nodes</label>
      </div>
      <div>
        <input type="checkbox" id="layer-edgeLabels" checked />
        <label for="layer-edgeLabels">Edge labels</label>
      </div>
      <div>
        <input type="checkbox" id="layer-labels" checked />
        <label for="layer-labels">Node labels</label>
      </div>
      <br />
      <button type="button" id="save-as-png">Save as PNG</button>
    </div>
    <script src="build/bundle.js"><\/script>
  </body>
</html>
`,M=`import FileSaver from "file-saver";
import Sigma from "sigma";

/**
 * There is a bug I can't find sources about, that makes it impossible to render
 * WebGL canvases using \`#drawImage\` as long as they appear onscreen. There are
 * basically two solutions:
 * 1. Use \`webGLContext#readPixels\`, transform it to an ImageData, put that
 *    ImageData in another canvas, and draw this canvas properly using
 *    \`#drawImage\`
 * 2. Hide the sigma instance
 * 3. Create a new sigma instance similar to the initial one (dimensions,
 *    settings, graph, camera...), use it and kill it
 * This exemple uses this last solution.
 */
export default async function saveAsPNG(renderer: Sigma, inputLayers?: string[]) {
  const { width, height } = renderer.getDimensions();

  // This pixel ratio is here to deal with retina displays.
  // Indeed, for dimensions W and H, on a retina display, the canvases
  // dimensions actually are 2 * W and 2 * H. Sigma properly deals with it, but
  // we need to readapt here:
  const pixelRatio = window.devicePixelRatio || 1;

  const tmpRoot = document.createElement("DIV");
  tmpRoot.style.width = \`\${width}px\`;
  tmpRoot.style.height = \`\${height}px\`;
  tmpRoot.style.position = "absolute";
  tmpRoot.style.right = "101%";
  tmpRoot.style.bottom = "101%";
  document.body.appendChild(tmpRoot);

  // Instantiate sigma:
  const tmpRenderer = new Sigma(renderer.getGraph(), tmpRoot, renderer.getSettings());

  // Copy camera and force to render now, to avoid having to wait the schedule /
  // debounce frame:
  tmpRenderer.getCamera().setState(renderer.getCamera().getState());
  tmpRenderer.refresh();

  // Create a new canvas, on which the different layers will be drawn:
  const canvas = document.createElement("CANVAS") as HTMLCanvasElement;
  canvas.setAttribute("width", width * pixelRatio + "");
  canvas.setAttribute("height", height * pixelRatio + "");
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // Draw a white background first:
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width * pixelRatio, height * pixelRatio);

  // For each layer, draw it on our canvas:
  const canvases = tmpRenderer.getCanvases();
  const layers = inputLayers ? inputLayers.filter((id) => !!canvases[id]) : Object.keys(canvases);
  layers.forEach((id) => {
    ctx.drawImage(
      canvases[id],
      0,
      0,
      width * pixelRatio,
      height * pixelRatio,
      0,
      0,
      width * pixelRatio,
      height * pixelRatio,
    );
  });

  // Save the canvas as a PNG image:
  canvas.toBlob((blob) => {
    if (blob) FileSaver.saveAs(blob, "graph.png");

    // Cleanup:
    tmpRenderer.kill();
    tmpRoot.remove();
  }, "image/png");
}
`,G={id:"png-snapshot",title:"Examples"},T={name:" PNG snapshot",render:()=>F,play:z,args:{},parameters:{storySource:{source:M}}};export{G as default,T as story};
