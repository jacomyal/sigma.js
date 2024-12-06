import{E as U,f as I,G as O,S as V,o as W,w as K}from"./sigma-ByR60yAm.js";import{g as P,c as z,a as Y}from"./_commonjsHelpers-BosuxZz1.js";import{i as J}from"./is-graph-constructor-C6mKuIz0.js";import{f as Q}from"./index-B9JsIGiK.js";import{c as Z,F as ee}from"./worker-CFa0AEgu.js";import"./getters-Dzi6BvTr.js";const ne=`
precision mediump float;

varying vec4 v_color;

void main(void) {
  gl_FragColor = v_color;
}
`,te=`
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_position;

uniform mat3 u_matrix;

varying vec4 v_color;

const float bias = 255.0 / 254.0;

void main() {
  // Scale from [[-1 1] [-1 1]] to the container:
  gl_Position = vec4(
    (u_matrix * vec3(a_position, 1)).xy,
    0,
    1
  );

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`,{UNSIGNED_BYTE:j,FLOAT:re}=WebGLRenderingContext,oe=["u_matrix"];class ae extends U{getDefinition(){return{VERTICES:2,VERTEX_SHADER_SOURCE:te,FRAGMENT_SHADER_SOURCE:ne,METHOD:WebGLRenderingContext.LINES,UNIFORMS:oe,ATTRIBUTES:[{name:"a_position",size:2,type:re},{name:"a_color",size:4,type:j,normalized:!0},{name:"a_id",size:4,type:j,normalized:!0}]}}processVisibleItem(m,u,f,l,d){const c=this.array,i=f.x,e=f.y,r=l.x,o=l.y,n=I(d.color);c[u++]=i,c[u++]=e,c[u++]=n,c[u++]=m,c[u++]=r,c[u++]=o,c[u++]=n,c[u++]=m}setUniforms(m,{gl:u,uniformLocations:f}){const{u_matrix:l}=f;u.uniformMatrix3fv(l,!1,m.matrix)}}var ie=J,se=function(x,m){if(!ie(x))throw new Error("graphology-generators/random/clusters: invalid Graph constructor.");m=m||{};var u="clusterDensity"in m?m.clusterDensity:.5,f=m.rng||Math.random,l=m.order,d=m.size,c=m.clusters;if(typeof u!="number"||u>1||u<0)throw new Error("graphology-generators/random/clusters: `clusterDensity` option should be a number between 0 and 1.");if(typeof f!="function")throw new Error("graphology-generators/random/clusters: `rng` option should be a function.");if(typeof l!="number"||l<=0)throw new Error("graphology-generators/random/clusters: `order` option should be a positive number.");if(typeof d!="number"||d<=0)throw new Error("graphology-generators/random/clusters: `size` option should be a positive number.");if(typeof c!="number"||c<=0)throw new Error("graphology-generators/random/clusters: `clusters` option should be a positive number.");var i=new x;if(!l)return i;var e=new Array(c),r,o,n;for(n=0;n<c;n++)e[n]=[];for(n=0;n<l;n++)r=f()*c|0,i.addNode(n,{cluster:r}),e[r].push(n);if(!d)return i;var t,a,s;for(n=0;n<d;n++){if(f()<1-u){t=f()*l|0;do a=f()*l|0;while(t===a)}else{if(r=f()*c|0,o=e[r],s=o.length,!s||s<2)continue;t=o[f()*s|0];do a=o[f()*s|0];while(t===a)}i.multi?i.addEdge(t,a):i.mergeEdge(t,a)}return i};const ue=P(se);var q={exports:{}};q.exports;(function(x){(function(m,u,f){function l(e){var r=this,o=i();r.next=function(){var n=2091639*r.s0+r.c*23283064365386963e-26;return r.s0=r.s1,r.s1=r.s2,r.s2=n-(r.c=n|0)},r.c=1,r.s0=o(" "),r.s1=o(" "),r.s2=o(" "),r.s0-=o(e),r.s0<0&&(r.s0+=1),r.s1-=o(e),r.s1<0&&(r.s1+=1),r.s2-=o(e),r.s2<0&&(r.s2+=1),o=null}function d(e,r){return r.c=e.c,r.s0=e.s0,r.s1=e.s1,r.s2=e.s2,r}function c(e,r){var o=new l(e),n=r&&r.state,t=o.next;return t.int32=function(){return o.next()*4294967296|0},t.double=function(){return t()+(t()*2097152|0)*11102230246251565e-32},t.quick=t,n&&(typeof n=="object"&&d(n,o),t.state=function(){return d(o,{})}),t}function i(){var e=4022871197,r=function(o){o=String(o);for(var n=0;n<o.length;n++){e+=o.charCodeAt(n);var t=.02519603282416938*e;e=t>>>0,t-=e,t*=e,e=t>>>0,t-=e,e+=t*4294967296}return(e>>>0)*23283064365386963e-26};return r}u&&u.exports?u.exports=c:this.alea=c})(z,x)})(q);var le=q.exports,D={exports:{}};D.exports;(function(x){(function(m,u,f){function l(i){var e=this,r="";e.x=0,e.y=0,e.z=0,e.w=0,e.next=function(){var n=e.x^e.x<<11;return e.x=e.y,e.y=e.z,e.z=e.w,e.w^=e.w>>>19^n^n>>>8},i===(i|0)?e.x=i:r+=i;for(var o=0;o<r.length+64;o++)e.x^=r.charCodeAt(o)|0,e.next()}function d(i,e){return e.x=i.x,e.y=i.y,e.z=i.z,e.w=i.w,e}function c(i,e){var r=new l(i),o=e&&e.state,n=function(){return(r.next()>>>0)/4294967296};return n.double=function(){do var t=r.next()>>>11,a=(r.next()>>>0)/4294967296,s=(t+a)/(1<<21);while(s===0);return s},n.int32=r.next,n.quick=n,o&&(typeof o=="object"&&d(o,r),n.state=function(){return d(r,{})}),n}u&&u.exports?u.exports=c:this.xor128=c})(z,x)})(D);var ce=D.exports,F={exports:{}};F.exports;(function(x){(function(m,u,f){function l(i){var e=this,r="";e.next=function(){var n=e.x^e.x>>>2;return e.x=e.y,e.y=e.z,e.z=e.w,e.w=e.v,(e.d=e.d+362437|0)+(e.v=e.v^e.v<<4^(n^n<<1))|0},e.x=0,e.y=0,e.z=0,e.w=0,e.v=0,i===(i|0)?e.x=i:r+=i;for(var o=0;o<r.length+64;o++)e.x^=r.charCodeAt(o)|0,o==r.length&&(e.d=e.x<<10^e.x>>>4),e.next()}function d(i,e){return e.x=i.x,e.y=i.y,e.z=i.z,e.w=i.w,e.v=i.v,e.d=i.d,e}function c(i,e){var r=new l(i),o=e&&e.state,n=function(){return(r.next()>>>0)/4294967296};return n.double=function(){do var t=r.next()>>>11,a=(r.next()>>>0)/4294967296,s=(t+a)/(1<<21);while(s===0);return s},n.int32=r.next,n.quick=n,o&&(typeof o=="object"&&d(o,r),n.state=function(){return d(r,{})}),n}u&&u.exports?u.exports=c:this.xorwow=c})(z,x)})(F);var fe=F.exports,H={exports:{}};H.exports;(function(x){(function(m,u,f){function l(i){var e=this;e.next=function(){var o=e.x,n=e.i,t,a;return t=o[n],t^=t>>>7,a=t^t<<24,t=o[n+1&7],a^=t^t>>>10,t=o[n+3&7],a^=t^t>>>3,t=o[n+4&7],a^=t^t<<7,t=o[n+7&7],t=t^t<<13,a^=t^t<<9,o[n]=a,e.i=n+1&7,a};function r(o,n){var t,a=[];if(n===(n|0))a[0]=n;else for(n=""+n,t=0;t<n.length;++t)a[t&7]=a[t&7]<<15^n.charCodeAt(t)+a[t+1&7]<<13;for(;a.length<8;)a.push(0);for(t=0;t<8&&a[t]===0;++t);for(t==8?a[7]=-1:a[t],o.x=a,o.i=0,t=256;t>0;--t)o.next()}r(e,i)}function d(i,e){return e.x=i.x.slice(),e.i=i.i,e}function c(i,e){i==null&&(i=+new Date);var r=new l(i),o=e&&e.state,n=function(){return(r.next()>>>0)/4294967296};return n.double=function(){do var t=r.next()>>>11,a=(r.next()>>>0)/4294967296,s=(t+a)/(1<<21);while(s===0);return s},n.int32=r.next,n.quick=n,o&&(o.x&&d(o,r),n.state=function(){return d(r,{})}),n}u&&u.exports?u.exports=c:this.xorshift7=c})(z,x)})(H);var de=H.exports,$={exports:{}};$.exports;(function(x){(function(m,u,f){function l(i){var e=this;e.next=function(){var o=e.w,n=e.X,t=e.i,a,s;return e.w=o=o+1640531527|0,s=n[t+34&127],a=n[t=t+1&127],s^=s<<13,a^=a<<17,s^=s>>>15,a^=a>>>12,s=n[t]=s^a,e.i=t,s+(o^o>>>16)|0};function r(o,n){var t,a,s,y,S,_=[],k=128;for(n===(n|0)?(a=n,n=null):(n=n+"\0",a=0,k=Math.max(k,n.length)),s=0,y=-32;y<k;++y)n&&(a^=n.charCodeAt((y+32)%n.length)),y===0&&(S=a),a^=a<<10,a^=a>>>15,a^=a<<4,a^=a>>>13,y>=0&&(S=S+1640531527|0,t=_[y&127]^=a+S,s=t==0?s+1:0);for(s>=128&&(_[(n&&n.length||0)&127]=-1),s=127,y=4*128;y>0;--y)a=_[s+34&127],t=_[s=s+1&127],a^=a<<13,t^=t<<17,a^=a>>>15,t^=t>>>12,_[s]=a^t;o.w=S,o.X=_,o.i=s}r(e,i)}function d(i,e){return e.i=i.i,e.w=i.w,e.X=i.X.slice(),e}function c(i,e){i==null&&(i=+new Date);var r=new l(i),o=e&&e.state,n=function(){return(r.next()>>>0)/4294967296};return n.double=function(){do var t=r.next()>>>11,a=(r.next()>>>0)/4294967296,s=(t+a)/(1<<21);while(s===0);return s},n.int32=r.next,n.quick=n,o&&(o.X&&d(o,r),n.state=function(){return d(r,{})}),n}u&&u.exports?u.exports=c:this.xor4096=c})(z,x)})($);var ge=$.exports,B={exports:{}};B.exports;(function(x){(function(m,u,f){function l(i){var e=this,r="";e.next=function(){var n=e.b,t=e.c,a=e.d,s=e.a;return n=n<<25^n>>>7^t,t=t-a|0,a=a<<24^a>>>8^s,s=s-n|0,e.b=n=n<<20^n>>>12^t,e.c=t=t-a|0,e.d=a<<16^t>>>16^s,e.a=s-n|0},e.a=0,e.b=0,e.c=-1640531527,e.d=1367130551,i===Math.floor(i)?(e.a=i/4294967296|0,e.b=i|0):r+=i;for(var o=0;o<r.length+20;o++)e.b^=r.charCodeAt(o)|0,e.next()}function d(i,e){return e.a=i.a,e.b=i.b,e.c=i.c,e.d=i.d,e}function c(i,e){var r=new l(i),o=e&&e.state,n=function(){return(r.next()>>>0)/4294967296};return n.double=function(){do var t=r.next()>>>11,a=(r.next()>>>0)/4294967296,s=(t+a)/(1<<21);while(s===0);return s},n.int32=r.next,n.quick=n,o&&(typeof o=="object"&&d(o,r),n.state=function(){return d(r,{})}),n}u&&u.exports?u.exports=c:this.tychei=c})(z,x)})(B);var me=B.exports,X={exports:{}};const pe={},xe=Object.freeze(Object.defineProperty({__proto__:null,default:pe},Symbol.toStringTag,{value:"Module"})),he=Y(xe);(function(x){(function(m,u,f){var l=256,d=6,c=52,i="random",e=f.pow(l,d),r=f.pow(2,c),o=r*2,n=l-1,t;function a(g,p,b){var v=[];p=p==!0?{entropy:!0}:p||{};var h=_(S(p.entropy?[g,M(u)]:g??k(),3),v),w=new s(v),L=function(){for(var E=w.g(d),R=e,A=0;E<r;)E=(E+A)*l,R*=l,A=w.g(1);for(;E>=o;)E/=2,R/=2,A>>>=1;return(E+A)/R};return L.int32=function(){return w.g(4)|0},L.quick=function(){return w.g(4)/4294967296},L.double=L,_(M(w.S),u),(p.pass||b||function(E,R,A,C){return C&&(C.S&&y(C,w),E.state=function(){return y(w,{})}),A?(f[i]=E,R):E})(L,h,"global"in p?p.global:this==f,p.state)}function s(g){var p,b=g.length,v=this,h=0,w=v.i=v.j=0,L=v.S=[];for(b||(g=[b++]);h<l;)L[h]=h++;for(h=0;h<l;h++)L[h]=L[w=n&w+g[h%b]+(p=L[h])],L[w]=p;(v.g=function(E){for(var R,A=0,C=v.i,G=v.j,N=v.S;E--;)R=N[C=n&C+1],A=A*l+N[n&(N[C]=N[G=n&G+R])+(N[G]=R)];return v.i=C,v.j=G,A})(l)}function y(g,p){return p.i=g.i,p.j=g.j,p.S=g.S.slice(),p}function S(g,p){var b=[],v=typeof g,h;if(p&&v=="object")for(h in g)try{b.push(S(g[h],p-1))}catch{}return b.length?b:v=="string"?g:g+"\0"}function _(g,p){for(var b=g+"",v,h=0;h<b.length;)p[n&h]=n&(v^=p[n&h]*19)+b.charCodeAt(h++);return M(p)}function k(){try{var g;return t&&(g=t.randomBytes)?g=g(l):(g=new Uint8Array(l),(m.crypto||m.msCrypto).getRandomValues(g)),M(g)}catch{var p=m.navigator,b=p&&p.plugins;return[+new Date,m,b,m.screen,M(u)]}}function M(g){return String.fromCharCode.apply(0,g)}if(_(f.random(),u),x.exports){x.exports=a;try{t=he}catch{}}else f["seed"+i]=a})(typeof self<"u"?self:z,[],Math)})(X);var ve=X.exports,ye=le,be=ce,we=fe,Ee=de,Se=ge,Le=me,T=ve;T.alea=ye;T.xor128=be;T.xorwow=we;T.xorshift7=Ee;T.xor4096=Se;T.tychei=Le;var _e=T;const Ae=P(_e),Re={order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},Ce=()=>{const x=Ae("sigma"),m=new URLSearchParams(location.search).entries();for(const[t,a]of m){const s=document.getElementsByName(t);s.length===1?s[0].value=a:s.length>1&&s.forEach(y=>{const S=y;S.checked=S.value===a})}const u={...Re,order:+document.querySelector("#order").value,size:+document.querySelector("#size").value,clusters:+document.querySelector("#clusters").value,edgesRenderer:document.querySelector('[name="edges-renderer"]:checked').value},f=ue(O,{...u,rng:x});Z.assign(f,{hierarchyAttributes:["cluster"]});const l={};for(let t=0;t<+u.clusters;t++)l[t]="#"+Math.floor(x()*16777215).toString(16);let d=0;f.forEachNode((t,{cluster:a})=>{f.mergeNodeAttributes(t,{size:f.degree(t)/3,label:`Node n°${++d}, in cluster n°${a}`,color:l[a+""]})});const c=document.getElementById("sigma-container"),i=new V(f,c,{defaultEdgeColor:"#e6e6e6",defaultEdgeType:u.edgesRenderer,edgeProgramClasses:{"edges-default":W,"edges-fast":ae}}),e=document.getElementById("fa2"),r=Q.inferSettings(f),o=new ee(f,{settings:r});function n(){o.isRunning()?(o.stop(),e.innerHTML="Start layout ▶"):(o.start(),e.innerHTML="Stop layout ⏸")}return e.addEventListener("click",n),i.getCamera().setState({angle:.2}),()=>{o.kill(),i.kill()}},ze=`<style>
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
  #buttons {
    position: absolute;
    right: 1em;
    top: 1em;
    display: flex;
  }

  input[type="number"] {
    width: 5em;
  }
  h4 {
    margin: 0;
  }
  fieldset {
    border: none;
  }
  h4,
  fieldset > div {
    margin-bottom: 0.2em;
  }
  button {
    margin-right: 1em;
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
<div id="buttons">
  <form target="_top" action="./">
    <input type="hidden" name="path" value="/story/large-graphs--story" />
    <fieldset>
      <h4>Graph</h4>
      <div>
        <input type="number" id="order" name="order" min="2" step="1" value="5000" />
        <label for="order">Number of nodes</label>
      </div>
      <div>
        <input type="number" id="size" name="size" min="1" step="1" value="10000" />
        <label for="size">Number of edges</label>
      </div>
      <div>
        <input type="number" id="clusters" name="clusters" min="1" step="1" value="3" />
        <label for="clusters">Number of clusters</label>
      </div>
    </fieldset>
    <fieldset>
      <h4>Edges renderer</h4>
      <div>
        <input type="radio" name="edges-renderer" id="edges-default" value="edges-default" />
        <label for="edges-default">Default</label>
      </div>
      <div>
        <input type="radio" name="edges-renderer" id="edges-fast" value="edges-fast" checked />
        <label for="edges-fast">Faster (only 1px thick edges)</label>
      </div>
    </fieldset>
    <fieldset>
      <button type="submit">Reset graph</button>
      <button type="button" id="fa2">Start layout ▶</button>
    </fieldset>
  </form>
</div>
`,Te=`/**
 * This example aims at showcasing sigma's performances.
 */
import Graph from "graphology";
import clusters from "graphology-generators/random/clusters";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import circlepack from "graphology-layout/circlepack";
import seedrandom from "seedrandom";
import Sigma from "sigma";
import { EdgeLineProgram, EdgeRectangleProgram } from "sigma/rendering";

const DEFAULT_ARGS = {
  order: 5000,
  size: 1000,
  clusters: 3,
  edgesRenderer: "edges-default",
};

export default () => {
  const rng = seedrandom("sigma");

  // 1. Read query string, and set form values accordingly:
  const query = new URLSearchParams(location.search).entries();
  for (const [key, value] of query) {
    const domList = document.getElementsByName(key);
    if (domList.length === 1) {
      (domList[0] as HTMLInputElement).value = value;
    } else if (domList.length > 1) {
      domList.forEach((dom: HTMLElement) => {
        const input = dom as HTMLInputElement;
        input.checked = input.value === value;
      });
    }
  }

  // 2. Read form values to build a full state:
  const state = {
    ...DEFAULT_ARGS,
    order: +document.querySelector<HTMLInputElement>("#order")!.value,
    size: +document.querySelector<HTMLInputElement>("#size")!.value,
    clusters: +document.querySelector<HTMLInputElement>("#clusters")!.value,
    edgesRenderer: document.querySelector<HTMLInputElement>('[name="edges-renderer"]:checked')!.value,
  };

  // 3. Generate a graph:
  const graph = clusters(Graph, { ...state, rng });
  circlepack.assign(graph, {
    hierarchyAttributes: ["cluster"],
  });
  const colors: Record<string, string> = {};
  for (let i = 0; i < +state.clusters; i++) {
    colors[i] = "#" + Math.floor(rng() * 16777215).toString(16);
  }
  let i = 0;
  graph.forEachNode((node, { cluster }) => {
    graph.mergeNodeAttributes(node, {
      size: graph.degree(node) / 3,
      label: \`Node n°\${++i}, in cluster n°\${cluster}\`,
      color: colors[cluster + ""],
    });
  });

  // 4. Render the graph:
  const container = document.getElementById("sigma-container") as HTMLElement;
  const renderer = new Sigma(graph, container, {
    defaultEdgeColor: "#e6e6e6",
    defaultEdgeType: state.edgesRenderer,
    edgeProgramClasses: {
      "edges-default": EdgeRectangleProgram,
      "edges-fast": EdgeLineProgram,
    },
  });

  // 5. Enable FA2 button:
  const fa2Button = document.getElementById("fa2") as HTMLButtonElement;
  const sensibleSettings = forceAtlas2.inferSettings(graph);
  const fa2Layout = new FA2Layout(graph, {
    settings: sensibleSettings,
  });
  function toggleFA2Layout() {
    if (fa2Layout.isRunning()) {
      fa2Layout.stop();
      fa2Button.innerHTML = \`Start layout ▶\`;
    } else {
      fa2Layout.start();
      fa2Button.innerHTML = \`Stop layout ⏸\`;
    }
  }
  fa2Button.addEventListener("click", toggleFA2Layout);

  // Cheap trick: tilt the camera a bit to make labels more readable:
  renderer.getCamera().setState({
    angle: 0.2,
  });

  return () => {
    fa2Layout.kill();
    renderer.kill();
  };
};
`,Fe={id:"large-graphs",title:"Core library/Advanced use cases",argTypes:{order:{name:"Number of nodes",defaultValue:5e3,control:{type:"number",step:"100",min:"100"}},size:{name:"Number of edges",defaultValue:1e4,control:{type:"number",step:"100",min:"100"}},clusters:{name:"Number of clusters",defaultValue:3,control:{type:"number",step:"1",min:"1"}},edgesRenderer:{name:"Edges renderer",defaultValue:"edge-default",options:["edges-default","edges-fast"],control:{type:"radio"}}}},He={name:"Performances showcase",render:()=>ze,play:K(Ce),args:{order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},parameters:{storySource:{source:Te}}};export{Fe as default,He as story};
