import{E as O,f as q,G as V,S as I,j as W,o as K}from"./utils-Bhbjx1g-.js";import{g as U,c as z,a as Y}from"./_commonjsHelpers-BosuxZz1.js";import{i as J}from"./is-graph-constructor-C6mKuIz0.js";import{f as Q}from"./index-DgZnfk8M.js";import{c as Z,F as ee}from"./circlepack-4fMIXYqf.js";import"./defaults-9mJNxk8k.js";const ne=`
precision mediump float;

varying vec4 v_color;

void main(void) {
  gl_FragColor = v_color;
}
`,re=`
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
`,{UNSIGNED_BYTE:P,FLOAT:te}=WebGLRenderingContext,oe=["u_matrix"];class ie extends O{getDefinition(){return{VERTICES:2,VERTEX_SHADER_SOURCE:re,FRAGMENT_SHADER_SOURCE:ne,METHOD:WebGLRenderingContext.LINES,UNIFORMS:oe,ATTRIBUTES:[{name:"a_position",size:2,type:te},{name:"a_color",size:4,type:P,normalized:!0},{name:"a_id",size:4,type:P,normalized:!0}]}}processVisibleItem(p,c,s,f,g){const l=this.array,i=s.x,e=s.y,t=f.x,o=f.y,n=q(g.color);l[c++]=i,l[c++]=e,l[c++]=n,l[c++]=p,l[c++]=t,l[c++]=o,l[c++]=n,l[c++]=p}setUniforms(p,{gl:c,uniformLocations:s}){const{u_matrix:f}=s;c.uniformMatrix3fv(f,!1,p.matrix)}}var ae=J,se=function(x,p){if(!ae(x))throw new Error("graphology-generators/random/clusters: invalid Graph constructor.");p=p||{};var c="clusterDensity"in p?p.clusterDensity:.5,s=p.rng||Math.random,f=p.order,g=p.size,l=p.clusters;if(typeof c!="number"||c>1||c<0)throw new Error("graphology-generators/random/clusters: `clusterDensity` option should be a number between 0 and 1.");if(typeof s!="function")throw new Error("graphology-generators/random/clusters: `rng` option should be a function.");if(typeof f!="number"||f<=0)throw new Error("graphology-generators/random/clusters: `order` option should be a positive number.");if(typeof g!="number"||g<=0)throw new Error("graphology-generators/random/clusters: `size` option should be a positive number.");if(typeof l!="number"||l<=0)throw new Error("graphology-generators/random/clusters: `clusters` option should be a positive number.");var i=new x;if(!f)return i;var e=new Array(l),t,o,n;for(n=0;n<l;n++)e[n]=[];for(n=0;n<f;n++)t=s()*l|0,i.addNode(n,{cluster:t}),e[t].push(n);if(!g)return i;var r,a,u;for(n=0;n<g;n++){if(s()<1-c){r=s()*f|0;do a=s()*f|0;while(r===a)}else{if(t=s()*l|0,o=e[t],u=o.length,!u||u<2)continue;r=o[s()*u|0];do a=o[s()*u|0];while(r===a)}i.multi?i.addEdge(r,a):i.mergeEdge(r,a)}return i};const ce=U(se);var k={exports:{}};k.exports;(function(x){(function(p,c,s){function f(e){var t=this,o=i();t.next=function(){var n=2091639*t.s0+t.c*23283064365386963e-26;return t.s0=t.s1,t.s1=t.s2,t.s2=n-(t.c=n|0)},t.c=1,t.s0=o(" "),t.s1=o(" "),t.s2=o(" "),t.s0-=o(e),t.s0<0&&(t.s0+=1),t.s1-=o(e),t.s1<0&&(t.s1+=1),t.s2-=o(e),t.s2<0&&(t.s2+=1),o=null}function g(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function l(e,t){var o=new f(e),n=t&&t.state,r=o.next;return r.int32=function(){return o.next()*4294967296|0},r.double=function(){return r()+(r()*2097152|0)*11102230246251565e-32},r.quick=r,n&&(typeof n=="object"&&g(n,o),r.state=function(){return g(o,{})}),r}function i(){var e=4022871197,t=function(o){o=String(o);for(var n=0;n<o.length;n++){e+=o.charCodeAt(n);var r=.02519603282416938*e;e=r>>>0,r-=e,r*=e,e=r>>>0,r-=e,e+=r*4294967296}return(e>>>0)*23283064365386963e-26};return t}c&&c.exports?c.exports=l:s&&s.amd?s(function(){return l}):this.alea=l})(z,x,!1)})(k);var ue=k.exports,N={exports:{}};N.exports;(function(x){(function(p,c,s){function f(i){var e=this,t="";e.x=0,e.y=0,e.z=0,e.w=0,e.next=function(){var n=e.x^e.x<<11;return e.x=e.y,e.y=e.z,e.z=e.w,e.w^=e.w>>>19^n^n>>>8},i===(i|0)?e.x=i:t+=i;for(var o=0;o<t.length+64;o++)e.x^=t.charCodeAt(o)|0,e.next()}function g(i,e){return e.x=i.x,e.y=i.y,e.z=i.z,e.w=i.w,e}function l(i,e){var t=new f(i),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,a=(t.next()>>>0)/4294967296,u=(r+a)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&g(o,t),n.state=function(){return g(t,{})}),n}c&&c.exports?c.exports=l:s&&s.amd?s(function(){return l}):this.xor128=l})(z,x,!1)})(N);var le=N.exports,$={exports:{}};$.exports;(function(x){(function(p,c,s){function f(i){var e=this,t="";e.next=function(){var n=e.x^e.x>>>2;return e.x=e.y,e.y=e.z,e.z=e.w,e.w=e.v,(e.d=e.d+362437|0)+(e.v=e.v^e.v<<4^(n^n<<1))|0},e.x=0,e.y=0,e.z=0,e.w=0,e.v=0,i===(i|0)?e.x=i:t+=i;for(var o=0;o<t.length+64;o++)e.x^=t.charCodeAt(o)|0,o==t.length&&(e.d=e.x<<10^e.x>>>4),e.next()}function g(i,e){return e.x=i.x,e.y=i.y,e.z=i.z,e.w=i.w,e.v=i.v,e.d=i.d,e}function l(i,e){var t=new f(i),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,a=(t.next()>>>0)/4294967296,u=(r+a)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&g(o,t),n.state=function(){return g(t,{})}),n}c&&c.exports?c.exports=l:s&&s.amd?s(function(){return l}):this.xorwow=l})(z,x,!1)})($);var fe=$.exports,j={exports:{}};j.exports;(function(x){(function(p,c,s){function f(i){var e=this;e.next=function(){var o=e.x,n=e.i,r,a;return r=o[n],r^=r>>>7,a=r^r<<24,r=o[n+1&7],a^=r^r>>>10,r=o[n+3&7],a^=r^r>>>3,r=o[n+4&7],a^=r^r<<7,r=o[n+7&7],r=r^r<<13,a^=r^r<<9,o[n]=a,e.i=n+1&7,a};function t(o,n){var r,a=[];if(n===(n|0))a[0]=n;else for(n=""+n,r=0;r<n.length;++r)a[r&7]=a[r&7]<<15^n.charCodeAt(r)+a[r+1&7]<<13;for(;a.length<8;)a.push(0);for(r=0;r<8&&a[r]===0;++r);for(r==8?a[7]=-1:a[r],o.x=a,o.i=0,r=256;r>0;--r)o.next()}t(e,i)}function g(i,e){return e.x=i.x.slice(),e.i=i.i,e}function l(i,e){i==null&&(i=+new Date);var t=new f(i),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,a=(t.next()>>>0)/4294967296,u=(r+a)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(o.x&&g(o,t),n.state=function(){return g(t,{})}),n}c&&c.exports?c.exports=l:s&&s.amd?s(function(){return l}):this.xorshift7=l})(z,x,!1)})(j);var ge=j.exports,B={exports:{}};B.exports;(function(x){(function(p,c,s){function f(i){var e=this;e.next=function(){var o=e.w,n=e.X,r=e.i,a,u;return e.w=o=o+1640531527|0,u=n[r+34&127],a=n[r=r+1&127],u^=u<<13,a^=a<<17,u^=u>>>15,a^=a>>>12,u=n[r]=u^a,e.i=r,u+(o^o>>>16)|0};function t(o,n){var r,a,u,w,C,A=[],D=128;for(n===(n|0)?(a=n,n=null):(n=n+"\0",a=0,D=Math.max(D,n.length)),u=0,w=-32;w<D;++w)n&&(a^=n.charCodeAt((w+32)%n.length)),w===0&&(C=a),a^=a<<10,a^=a>>>15,a^=a<<4,a^=a>>>13,w>=0&&(C=C+1640531527|0,r=A[w&127]^=a+C,u=r==0?u+1:0);for(u>=128&&(A[(n&&n.length||0)&127]=-1),u=127,w=4*128;w>0;--w)a=A[u+34&127],r=A[u=u+1&127],a^=a<<13,r^=r<<17,a^=a>>>15,r^=r>>>12,A[u]=a^r;o.w=C,o.X=A,o.i=u}t(e,i)}function g(i,e){return e.i=i.i,e.w=i.w,e.X=i.X.slice(),e}function l(i,e){i==null&&(i=+new Date);var t=new f(i),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,a=(t.next()>>>0)/4294967296,u=(r+a)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(o.X&&g(o,t),n.state=function(){return g(t,{})}),n}c&&c.exports?c.exports=l:s&&s.amd?s(function(){return l}):this.xor4096=l})(z,x,!1)})(B);var de=B.exports,X={exports:{}};X.exports;(function(x){(function(p,c,s){function f(i){var e=this,t="";e.next=function(){var n=e.b,r=e.c,a=e.d,u=e.a;return n=n<<25^n>>>7^r,r=r-a|0,a=a<<24^a>>>8^u,u=u-n|0,e.b=n=n<<20^n>>>12^r,e.c=r=r-a|0,e.d=a<<16^r>>>16^u,e.a=u-n|0},e.a=0,e.b=0,e.c=-1640531527,e.d=1367130551,i===Math.floor(i)?(e.a=i/4294967296|0,e.b=i|0):t+=i;for(var o=0;o<t.length+20;o++)e.b^=t.charCodeAt(o)|0,e.next()}function g(i,e){return e.a=i.a,e.b=i.b,e.c=i.c,e.d=i.d,e}function l(i,e){var t=new f(i),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,a=(t.next()>>>0)/4294967296,u=(r+a)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&g(o,t),n.state=function(){return g(t,{})}),n}c&&c.exports?c.exports=l:s&&s.amd?s(function(){return l}):this.tychei=l})(z,x,!1)})(X);var pe=X.exports,H={exports:{}};const me={},xe=Object.freeze(Object.defineProperty({__proto__:null,default:me},Symbol.toStringTag,{value:"Module"})),he=Y(xe);(function(x){(function(p,c,s){var f=256,g=6,l=52,i="random",e=s.pow(f,g),t=s.pow(2,l),o=t*2,n=f-1,r;function a(d,m,v){var y=[];m=m==!0?{entropy:!0}:m||{};var h=A(C(m.entropy?[d,G(c)]:d??D(),3),y),b=new u(y),S=function(){for(var E=b.g(g),R=e,_=0;E<t;)E=(E+_)*f,R*=f,_=b.g(1);for(;E>=o;)E/=2,R/=2,_>>>=1;return(E+_)/R};return S.int32=function(){return b.g(4)|0},S.quick=function(){return b.g(4)/4294967296},S.double=S,A(G(b.S),c),(m.pass||v||function(E,R,_,L){return L&&(L.S&&w(L,b),E.state=function(){return w(b,{})}),_?(s[i]=E,R):E})(S,h,"global"in m?m.global:this==s,m.state)}function u(d){var m,v=d.length,y=this,h=0,b=y.i=y.j=0,S=y.S=[];for(v||(d=[v++]);h<f;)S[h]=h++;for(h=0;h<f;h++)S[h]=S[b=n&b+d[h%v]+(m=S[h])],S[b]=m;(y.g=function(E){for(var R,_=0,L=y.i,M=y.j,F=y.S;E--;)R=F[L=n&L+1],_=_*f+F[n&(F[L]=F[M=n&M+R])+(F[M]=R)];return y.i=L,y.j=M,_})(f)}function w(d,m){return m.i=d.i,m.j=d.j,m.S=d.S.slice(),m}function C(d,m){var v=[],y=typeof d,h;if(m&&y=="object")for(h in d)try{v.push(C(d[h],m-1))}catch{}return v.length?v:y=="string"?d:d+"\0"}function A(d,m){for(var v=d+"",y,h=0;h<v.length;)m[n&h]=n&(y^=m[n&h]*19)+v.charCodeAt(h++);return G(m)}function D(){try{var d;return r&&(d=r.randomBytes)?d=d(f):(d=new Uint8Array(f),(p.crypto||p.msCrypto).getRandomValues(d)),G(d)}catch{var m=p.navigator,v=m&&m.plugins;return[+new Date,p,v,p.screen,G(c)]}}function G(d){return String.fromCharCode.apply(0,d)}if(A(s.random(),c),x.exports){x.exports=a;try{r=he}catch{}}else s["seed"+i]=a})(typeof self<"u"?self:z,[],Math)})(H);var ye=H.exports,ve=ue,we=le,be=fe,Ee=ge,Se=de,Ae=pe,T=ye;T.alea=ve;T.xor128=we;T.xorwow=be;T.xorshift7=Ee;T.xor4096=Se;T.tychei=Ae;var _e=T;const Re=U(_e),Ce={order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},Le=x=>{const p=Re("sigma"),c={...Ce,...x.args},s=ce(V,{...c,rng:p});Z.assign(s,{hierarchyAttributes:["cluster"]});const f={};for(let r=0;r<+c.clusters;r++)f[r]="#"+Math.floor(p()*16777215).toString(16);let g=0;s.forEachNode((r,{cluster:a})=>{s.mergeNodeAttributes(r,{size:s.degree(r)/3,label:`Node n°${++g}, in cluster n°${a}`,color:f[a+""]})});const l=document.getElementById("sigma-container"),i=new I(s,l,{defaultEdgeColor:"#e6e6e6",defaultEdgeType:c.edgesRenderer,edgeProgramClasses:{"edges-default":W,"edges-fast":ie}}),e=document.getElementById("fa2"),t=Q.inferSettings(s),o=new ee(s,{settings:t});function n(){o.isRunning()?(o.stop(),e.innerHTML="Start layout ▶"):(o.start(),e.innerHTML="Stop layout ⏸")}e.addEventListener("click",n),i.getCamera().setState({angle:.2}),K(()=>{o.kill(),i.kill()})},ze=`<style>
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
  #buttons {
    position: absolute;
    right: 1em;
    top: 1em;
    display: flex;
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
  <fieldset>
    <button type="button" id="fa2">Start layout ▶</button>
  </fieldset>
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

import { onStoryDown } from "../utils";

const DEFAULT_ARGS = {
  order: 5000,
  size: 1000,
  clusters: 3,
  edgesRenderer: "edges-default",
};

export default (input: { args: typeof DEFAULT_ARGS }) => {
  //{ order: number; size: number; clusters: number; edgesRenderer: string }) => {
  const rng = seedrandom("sigma");
  const state = {
    ...DEFAULT_ARGS,
    ...input.args,
  };

  // 1. Generate a graph:
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

  // 2. Render the graph:
  const container = document.getElementById("sigma-container") as HTMLElement;
  const renderer = new Sigma(graph, container, {
    defaultEdgeColor: "#e6e6e6",
    defaultEdgeType: state.edgesRenderer,
    edgeProgramClasses: {
      "edges-default": EdgeRectangleProgram,
      "edges-fast": EdgeLineProgram,
    },
  });

  // 3. Enable FA2 button:
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

  onStoryDown(() => {
    fa2Layout.kill();
    renderer.kill();
  });
};
`,$e={id:"large-graphs",title:"Examples",argTypes:{order:{name:"Number of nodes",defaultValue:5e3,control:{type:"number",step:"100",min:"100"}},size:{name:"Number of edges",defaultValue:1e4,control:{type:"number",step:"100",min:"100"}},clusters:{name:"Number of clusters",defaultValue:3,control:{type:"number",step:"1",min:"1"}},edgesRenderer:{name:"Edges renderer",defaultValue:"edge-default",options:["edges-default","edges-fast"],control:{type:"radio"}}}},je={name:"Performances showcase",render:()=>ze,play:Le,args:{order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},parameters:{storySource:{source:Te}}};export{$e as default,je as story};
