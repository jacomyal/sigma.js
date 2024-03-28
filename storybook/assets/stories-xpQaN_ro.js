import{G as j,S as J,o as K}from"./utils-C5QP6GGe.js";import{i as Q}from"./is-graph-constructor-C6mKuIz0.js";import{a as tt}from"./add-edge-CCsz5v3R.js";import"./_commonjsHelpers-BosuxZz1.js";var x={},et=/^\s$/,it=/\s*,\s*/,rt=/\s*\|\s*/;function nt(t){return et.test(t)}function O(t){var e,i,r,n,a=!1,h=!1,s=void 0,f=[],g="";for(r=0,n=t.length;r<n;r++)if(e=t[r],a){if(s===void 0&&(s=""),!g&&e===","){r--,a=!1;continue}if(!h&&e===g){a=!1;continue}if(e==="\\"){if(r+1<n&&(i=t[r+1],i==="r"||i==="t"||i==="n"||i==="\\")){i==="n"?s+=`
`:i==="t"?s+="	":i==="r"?s+="\r":s+="\\",h=!1,r++;continue}h=!0}else s+=e,h=!1}else{if(nt(e))continue;if(e===","){s!==void 0&&(f.push(s),s=void 0);continue}e==='"'||e==="'"?g=e:(r--,g=""),a=!0,h=!1}return s!==void 0&&f.push(s),f}function D(t,e){return!t||t==="string"?e:t==="boolean"?e==="true":t==="byte"||t==="short"||t==="integer"||t==="long"||t==="float"||t==="double"?+e:e}function at(t,e){if(t.startsWith("list")){var i=t.slice(4),r;return e.length>=2&&e[0]==="["&&e[e.length-1]==="]"?r=O(e.slice(1,-1)):e.includes("|")?r=e.split(rt):e.includes(",")?r=e.split(it):r=[e],r.map(function(n){return D(i,n)})}else return D(t,e)}x.parseListPieces=O;x.parseScalarValue=D;x.parseValue=at;var st=/["'<>&\s]/g;x.sanitizeTagName=function(e){return e.replace(st,"").trim()};var ot=Q,ht=tt.mergeEdge,ut=x,F=ut.parseValue;function lt(t){return t!==t}function dt(t){var e=t.getAttribute("hex");if(e)return e;var i=t.getAttribute("a"),r=t.getAttribute("r"),n=t.getAttribute("g"),a=t.getAttribute("b");return i?"rgba("+r+","+n+","+a+","+i+")":"rgb("+r+","+n+","+a+")"}function T(t,e){var i=t.getElementsByTagName("viz:"+e)[0];return i||(i=t.getElementsByTagNameNS("viz",e)[0]),i||(i=t.getElementsByTagName(e)[0]),i}function ft(t){for(var e={},i,r,n=0,a=t.length;n<a;n++)i=t[n],i.nodeName!=="#text"&&(r=i.textContent.trim(),r&&(e[i.tagName.toLowerCase()]=i.textContent));return e}function R(t){for(var e={},i={},r,n,a,h=0,s=t.length;h<s;h++)r=t[h],a=r.getAttribute("id")||r.getAttribute("for"),e[a]={id:a,type:r.getAttribute("type")||"string",title:lt(+a)?a:r.getAttribute("title")||a},n=r.getElementsByTagName("default")[0],n&&(i[e[a].title]=F(e[a].type,n.textContent));return[e,i]}function C(t,e,i,r){var n={},a=i.getAttribute("label"),h=i.getAttribute("weight"),s=i.getAttribute("kind");a&&(n.label=a),h&&(n.weight=+h),s&&(n.kind=s);for(var f=i.getElementsByTagName("attvalue"),g,w,m,u,p,E,A=0,_=f.length;A<_;A++){if(g=f[A],E=g.getAttribute("id")||g.getAttribute("for"),u=g.getAttribute("value"),w=t[E],w)m=w.title,p=w.type;else if(r)m=E,p="string";else throw new Error('graphology-gexf/parser: Found undeclared attribute "'+E+'"');n[m]=F(p,u)}var v;for(v in e)v in n||(n[v]=e[v]);var o=T(i,"color");o&&(n.color=dt(o)),o=T(i,"size"),o&&(n.size=+o.getAttribute("value"));var l,b,y;return o=T(i,"position"),o&&(l=o.getAttribute("x"),b=o.getAttribute("y"),y=o.getAttribute("z"),l&&(n.x=+l),b&&(n.y=+b),y&&(n.z=+y)),o=T(i,"shape"),o&&(n.shape=o.getAttribute("value")),o=T(i,"thickness"),o&&(n.thickness=+o.getAttribute("value")),n}var gt=function(e,i){return function(n,a,h){h=h||{};var s=h.addMissingNodes===!0,f=h.allowUndeclaredAttributes===!0,g=h.respectInputGraphType===!0,w,m=a,u,p,E,A,_,v,o,l,b;if(!ot(n))throw new Error("graphology-gexf/parser: invalid Graph constructor.");if(typeof a=="string"&&(m=new e().parseFromString(a,"application/xml")),!(m instanceof i))throw new Error("graphology-gexf/parser: source should either be a XML document or a string.");var y=m.getElementsByTagName("graph")[0],z=m.getElementsByTagName("meta")[0],V=z&&z.childNodes||[],L=m.getElementsByTagName("node"),S=m.getElementsByTagName("edge"),B=m.getElementsByTagName("attributes"),M=[],P=[];for(l=0,b=B.length;l<b;l++)u=B[l],u.getAttribute("class")==="node"?M=u.getElementsByTagName("attribute"):u.getAttribute("class")==="edge"&&(P=u.getElementsByTagName("attribute"));var N=y.getAttribute("defaultedgetype")||"undirected";N==="mutual"&&(N="undirected"),p=R(M);var Z=p[0],X=p[1];p=R(P);var H=p[0],$=p[1],q=S[0]?S[0].getAttribute("type")||N:"mixed",Y=g?{}:{type:q},d=new n(Y),W=ft(V),k=z&&z.getAttribute("lastmodifieddate");for(d.replaceAttributes(W),k&&d.setAttribute("lastModifiedDate",k),l=0,b=L.length;l<b;l++)u=L[l],d.addNode(u.getAttribute("id"),C(Z,X,u,f));for(l=0,b=S.length;l<b;l++){if(u=S[l],_=u.getAttribute("id"),E=u.getAttribute("type")||N,v=u.getAttribute("source"),o=u.getAttribute("target"),A=C(H,$,u,f),E!==d.type&&d.type!=="mixed"){if(g)throw new Error("graphology-gexf/parser: one of the file's edges does not respect the input graph type: "+d.type+".");d=d.copy({type:"mixed"})}if(!d.multi&&(E==="directed"&&d.hasDirectedEdge(v,o)||d.hasUndirectedEdge(v,o))){if(g)throw new Error("graphology-gexf/parser: the file contains parallel edges that the input graph type does not allow.");d=d.copy({multi:!0})}if(w=ht(d,E!=="directed",_||null,v,o,A),!s&&(w[2]||w[3]))throw new Error("graphology-gexf/parser: one of your gexf file edges points to an inexisting node. Set the parser `addMissingNodes` option to `true` if you do not care.")}return d}},ct=gt,mt=ct(DOMParser,Document);function G(t){return typeof t!="number"&&!t}function c(t){if(typeof t=="string")return t;if(typeof t=="number")return t+"";if(typeof t=="function")return t();if(t instanceof I)return t.toString();throw Error("Bad Parameter")}function I(t,e){if(!(this instanceof I))return new I;this.name_regex=/[_:A-Za-z][-._:A-Za-z0-9]*/,this.indent=!!t,this.indentString=this.indent&&typeof t=="string"?t:"    ",this.output="",this.stack=[],this.tags=0,this.attributes=0,this.attribute=0,this.texts=0,this.comment=0,this.dtd=0,this.root="",this.pi=0,this.cdata=0,this.started_write=!1,this.writer,this.writer_encoding="UTF-8",typeof e=="function"?this.writer=e:this.writer=function(i,r){this.output+=i}}I.prototype={toString:function(){return this.flush(),this.output},indenter:function(){if(this.indent){this.write(`
`);for(var t=1;t<this.tags;t++)this.write(this.indentString)}},write:function(){for(var t=0;t<arguments.length;t++)this.writer(arguments[t],this.writer_encoding)},flush:function(){for(var t=this.tags;t>0;t--)this.endElement();this.tags=0},startDocument:function(t,e,i){return this.tags||this.attributes?this:(this.startPI("xml"),this.startAttribute("version"),this.text(typeof t=="string"?t:"1.0"),this.endAttribute(),typeof e=="string"&&(this.startAttribute("encoding"),this.text(e),this.endAttribute(),this.writer_encoding=e),i&&(this.startAttribute("standalone"),this.text("yes"),this.endAttribute()),this.endPI(),this.indent||this.write(`
`),this)},endDocument:function(){return this.attributes&&this.endAttributes(),this},writeElement:function(t,e){return this.startElement(t).text(e).endElement()},writeElementNS:function(t,e,i,r){return r||(r=i),this.startElementNS(t,e,i).text(r).endElement()},startElement:function(t){if(t=c(t),!t.match(this.name_regex)||this.tags===0&&this.root&&this.root!==t)throw Error("Invalid Parameter");return this.attributes&&this.endAttributes(),++this.tags,this.texts=0,this.stack.length>0&&(this.stack[this.stack.length-1].containsTag=!0),this.stack.push({name:t,tags:this.tags}),this.started_write&&this.indenter(),this.write("<",t),this.startAttributes(),this.started_write=!0,this},startElementNS:function(t,e,i){if(t=c(t),e=c(e),!t.match(this.name_regex)||!e.match(this.name_regex))throw Error("Invalid Parameter");return this.attributes&&this.endAttributes(),++this.tags,this.texts=0,this.stack.length>0&&(this.stack[this.stack.length-1].containsTag=!0),this.stack.push({name:t+":"+e,tags:this.tags}),this.started_write&&this.indenter(),this.write("<",t+":"+e),this.startAttributes(),this.started_write=!0,this},endElement:function(){if(!this.tags)return this;var t=this.stack.pop();return this.attributes>0?(this.attribute&&(this.texts&&this.endAttribute(),this.endAttribute()),this.write("/"),this.endAttributes()):(t.containsTag&&this.indenter(),this.write("</",t.name,">")),--this.tags,this.texts=0,this},writeAttribute:function(t,e){return typeof e=="function"&&(e=e()),G(e)?this:this.startAttribute(t).text(e).endAttribute()},writeAttributeNS:function(t,e,i,r){return r||(r=i),typeof r=="function"&&(r=r()),G(r)?this:this.startAttributeNS(t,e,i).text(r).endAttribute()},startAttributes:function(){return this.attributes=1,this},endAttributes:function(){return this.attributes?(this.attribute&&this.endAttribute(),this.attributes=0,this.attribute=0,this.texts=0,this.write(">"),this):this},startAttribute:function(t){if(t=c(t),!t.match(this.name_regex))throw Error("Invalid Parameter");return!this.attributes&&!this.pi?this:this.attribute?this:(this.attribute=1,this.write(" ",t,'="'),this)},startAttributeNS:function(t,e,i){if(t=c(t),e=c(e),!t.match(this.name_regex)||!e.match(this.name_regex))throw Error("Invalid Parameter");return!this.attributes&&!this.pi?this:this.attribute?this:(this.attribute=1,this.write(" ",t+":"+e,'="'),this)},endAttribute:function(){return this.attribute?(this.attribute=0,this.texts=0,this.write('"'),this):this},text:function(t){return t=c(t),!this.tags&&!this.comment&&!this.pi&&!this.cdata?this:this.attributes&&this.attribute?(++this.texts,this.write(t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;").replace(/\t/g,"&#x9;").replace(/\n/g,"&#xA;").replace(/\r/g,"&#xD;")),this):(this.attributes&&!this.attribute&&this.endAttributes(),this.comment||this.cdata?this.write(t):this.write(t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")),++this.texts,this.started_write=!0,this)},writeComment:function(t){return this.startComment().text(t).endComment()},startComment:function(){return this.comment?this:(this.attributes&&this.endAttributes(),this.indenter(),this.write("<!--"),this.comment=1,this.started_write=!0,this)},endComment:function(){return this.comment?(this.write("-->"),this.comment=0,this):this},writeDocType:function(t,e,i,r){return this.startDocType(t,e,i,r).endDocType()},startDocType:function(t,e,i,r){if(this.dtd||this.tags)return this;if(t=c(t),e=e&&c(e),i=i&&c(i),r=r&&c(r),!t.match(this.name_regex)||e&&!e.match(/^[\w\-][\w\s\-\/\+\:\.]*/)||i&&!i.match(/^[\w\.][\w\-\/\\\:\.]*/)||r&&!r.match(/[\w\s\<\>\+\.\!\#\-\?\*\,\(\)\|]*/))throw Error("Invalid Parameter");return e=e?' PUBLIC "'+e+'"':i?" SYSTEM":"",i=i?' "'+i+'"':"",r=r?" ["+r+"]":"",this.started_write&&this.indenter(),this.write("<!DOCTYPE ",t,e,i,r),this.root=t,this.dtd=1,this.started_write=!0,this},endDocType:function(){return this.dtd?(this.write(">"),this):this},writePI:function(t,e){return this.startPI(t).text(e).endPI()},startPI:function(t){if(t=c(t),!t.match(this.name_regex))throw Error("Invalid Parameter");return this.pi?this:(this.attributes&&this.endAttributes(),this.started_write&&this.indenter(),this.write("<?",t),this.pi=1,this.started_write=!0,this)},endPI:function(){return this.pi?(this.write("?>"),this.pi=0,this):this},writeCData:function(t){return this.startCData().text(t).endCData()},startCData:function(){return this.cdata?this:(this.attributes&&this.endAttributes(),this.indenter(),this.write("<![CDATA["),this.cdata=1,this.started_write=!0,this)},endCData:function(){return this.cdata?(this.write("]]>"),this.cdata=0,this):this},writeRaw:function(t){return t=c(t),!this.tags&&!this.comment&&!this.pi&&!this.cdata?this:this.attributes&&this.attribute?(++this.texts,this.write(t.replace("&","&amp;").replace('"',"&quot;")),this):(this.attributes&&!this.attribute&&this.endAttributes(),++this.texts,this.write(t),this.started_write=!0,this)}};var pt=new Set(["color","size","x","y","z","shape","thickness"]);function U(t,e,i){var r={},n;for(n in i)n==="label"?r.label=i.label:t==="edge"&&n==="weight"?r.weight=i.weight:t==="edge"&&n==="kind"?r.kind=i.kind:pt.has(n)?(r.viz=r.viz||{},r.viz[n]=i[n]):(r.attributes=r.attributes||{},r.attributes[n]=i[n]);return r}U.bind(null,"node");U.bind(null,"edge");var bt=mt;const Et=()=>{let t=null;fetch("./arctic.gexf").then(e=>e.text()).then(e=>{const i=bt(j,e),r=document.getElementById("sigma-container"),n=document.getElementById("zoom-in"),a=document.getElementById("zoom-out"),h=document.getElementById("zoom-reset"),s=document.getElementById("labels-threshold");t=new J(i,r,{minCameraRatio:.1,maxCameraRatio:10});const f=t.getCamera();n.addEventListener("click",()=>{f.animatedZoom({duration:600})}),a.addEventListener("click",()=>{f.animatedUnzoom({duration:600})}),h.addEventListener("click",()=>{f.animatedReset({duration:600})}),s.addEventListener("input",()=>{t==null||t.setSetting("labelRenderedSizeThreshold",+s.value)}),s.value=t.getSetting("labelRenderedSizeThreshold")+""}),K(()=>{t==null||t.kill()})},vt=`<style>
  body {
    font-family: sans-serif;
  }
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
  #controls {
    position: absolute;
    right: 1em;
    top: 1em;
    text-align: right;
  }
  .input {
    position: relative;
    display: inline-block;
    vertical-align: middle;
  }
  .input:not(:hover) label {
    display: none;
  }
  .input label {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: black;
    color: white;
    padding: 0.2em;
    border-radius: 2px;
    margin-top: 0.3em;
    font-size: 0.8em;
    white-space: nowrap;
  }
  .input button {
    width: 2.5em;
    height: 2.5em;
    display: inline-block;
    text-align: center;
    background: white;
    outline: none;
    border: 1px solid dimgrey;
    border-radius: 2px;
    cursor: pointer;
  }
</style>
<div id="sigma-container"></div>
<div id="controls">
  <div class="input"><label for="zoom-in">Zoom in</label><button id="zoom-in">+</button></div>
  <div class="input"><label for="zoom-out">Zoom out</label><button id="zoom-out">-</button></div>
  <div class="input"><label for="zoom-reset">Reset zoom</label><button id="zoom-reset">⊙</button></div>
  <div class="input">
    <label for="labels-threshold">Labels threshold</label>
    <input id="labels-threshold" type="range" min="0" max="15" step="0.5" />
  </div>
</div>
`,wt=`/**
 * This example shows how to load a GEXF graph file (using the dedicated
 * graphology parser), and display it with some basic map features: Zoom in and
 * out buttons, reset zoom button, and a slider to increase or decrease the
 * quantity of labels displayed on screen.
 */
import Graph from "graphology";
import { parse } from "graphology-gexf/browser";
import Sigma from "sigma";

import { onStoryDown } from "../utils";

export default () => {
  let renderer: Sigma | null = null;

  // Load external GEXF file:
  fetch("./arctic.gexf")
    .then((res) => res.text())
    .then((gexf) => {
      // Parse GEXF string:
      const graph = parse(Graph, gexf);

      // Retrieve some useful DOM elements:
      const container = document.getElementById("sigma-container") as HTMLElement;
      const zoomInBtn = document.getElementById("zoom-in") as HTMLButtonElement;
      const zoomOutBtn = document.getElementById("zoom-out") as HTMLButtonElement;
      const zoomResetBtn = document.getElementById("zoom-reset") as HTMLButtonElement;
      const labelsThresholdRange = document.getElementById("labels-threshold") as HTMLInputElement;

      // Instanciate sigma:
      renderer = new Sigma(graph, container, {
        minCameraRatio: 0.1,
        maxCameraRatio: 10,
      });
      const camera = renderer.getCamera();

      // Bind zoom manipulation buttons
      zoomInBtn.addEventListener("click", () => {
        camera.animatedZoom({ duration: 600 });
      });
      zoomOutBtn.addEventListener("click", () => {
        camera.animatedUnzoom({ duration: 600 });
      });
      zoomResetBtn.addEventListener("click", () => {
        camera.animatedReset({ duration: 600 });
      });

      // Bind labels threshold to range input
      labelsThresholdRange.addEventListener("input", () => {
        renderer?.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
      });

      // Set proper range initial value:
      labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
    });

  onStoryDown(() => {
    renderer?.kill();
  });
};
`,_t={id:"load-gexf-file",title:"Examples"},zt={name:"Load GEXF file",render:()=>vt,play:Et,args:{},parameters:{storySource:{source:wt}}};export{_t as default,zt as story};
