import{E as Z,f as ee,G as re,S as ne,p as te,w as oe}from"./sigma-CUkpdr6a.js";import{g as P,a as ie}from"./_commonjsHelpers-BosuxZz1.js";import{r as ae}from"./is-graph-constructor-BVugt_gr.js";import{f as se}from"./index-DE-rwKI7.js";import{r as ue,F as le}from"./worker-mFIzwX63.js";import"./getters-sgVfsx1C.js";const ce=`
precision mediump float;

varying vec4 v_color;

void main(void) {
  gl_FragColor = v_color;
}
`,fe=`
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
`,{UNSIGNED_BYTE:j,FLOAT:de}=WebGLRenderingContext,ge=["u_matrix"];class me extends Z{getDefinition(){return{VERTICES:2,VERTEX_SHADER_SOURCE:fe,FRAGMENT_SHADER_SOURCE:ce,METHOD:WebGLRenderingContext.LINES,UNIFORMS:ge,ATTRIBUTES:[{name:"a_position",size:2,type:de},{name:"a_color",size:4,type:j,normalized:!0},{name:"a_id",size:4,type:j,normalized:!0}]}}processVisibleItem(p,u,d,c,f){const l=this.array,a=d.x,e=d.y,t=c.x,o=c.y,n=ee(f.color);l[u++]=a,l[u++]=e,l[u++]=n,l[u++]=p,l[u++]=t,l[u++]=o,l[u++]=n,l[u++]=p}setUniforms(p,{gl:u,uniformLocations:d}){const{u_matrix:c}=d;u.uniformMatrix3fv(c,!1,p.matrix)}}var H,U;function pe(){if(U)return H;U=1;var h=ae();return H=function(p,u){if(!h(p))throw new Error("graphology-generators/random/clusters: invalid Graph constructor.");u=u||{};var d="clusterDensity"in u?u.clusterDensity:.5,c=u.rng||Math.random,f=u.order,l=u.size,a=u.clusters;if(typeof d!="number"||d>1||d<0)throw new Error("graphology-generators/random/clusters: `clusterDensity` option should be a number between 0 and 1.");if(typeof c!="function")throw new Error("graphology-generators/random/clusters: `rng` option should be a function.");if(typeof f!="number"||f<=0)throw new Error("graphology-generators/random/clusters: `order` option should be a positive number.");if(typeof l!="number"||l<=0)throw new Error("graphology-generators/random/clusters: `size` option should be a positive number.");if(typeof a!="number"||a<=0)throw new Error("graphology-generators/random/clusters: `clusters` option should be a positive number.");var e=new p;if(!f)return e;var t=new Array(a),o,n,r;for(r=0;r<a;r++)t[r]=[];for(r=0;r<f;r++)o=c()*a|0,e.addNode(r,{cluster:o}),t[o].push(r);if(!l)return e;var i,s,v;for(r=0;r<l;r++){if(c()<1-d){i=c()*f|0;do s=c()*f|0;while(i===s)}else{if(o=c()*a|0,n=t[o],v=n.length,!v||v<2)continue;i=n[c()*v|0];do s=n[c()*v|0];while(i===s)}e.multi?e.addEdge(i,s):e.mergeEdge(i,s)}return e},H}var he=pe();const ve=P(he);var xe=ue();const ye=P(xe);var M={exports:{}},be=M.exports,I;function we(){return I||(I=1,function(h){(function(p,u,d){function c(e){var t=this,o=a();t.next=function(){var n=2091639*t.s0+t.c*23283064365386963e-26;return t.s0=t.s1,t.s1=t.s2,t.s2=n-(t.c=n|0)},t.c=1,t.s0=o(" "),t.s1=o(" "),t.s2=o(" "),t.s0-=o(e),t.s0<0&&(t.s0+=1),t.s1-=o(e),t.s1<0&&(t.s1+=1),t.s2-=o(e),t.s2<0&&(t.s2+=1),o=null}function f(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function l(e,t){var o=new c(e),n=t&&t.state,r=o.next;return r.int32=function(){return o.next()*4294967296|0},r.double=function(){return r()+(r()*2097152|0)*11102230246251565e-32},r.quick=r,n&&(typeof n=="object"&&f(n,o),r.state=function(){return f(o,{})}),r}function a(){var e=4022871197,t=function(o){o=String(o);for(var n=0;n<o.length;n++){e+=o.charCodeAt(n);var r=.02519603282416938*e;e=r>>>0,r-=e,r*=e,e=r>>>0,r-=e,e+=r*4294967296}return(e>>>0)*23283064365386963e-26};return t}u.exports?u.exports=l:this.alea=l})(be,h)}(M)),M.exports}var N={exports:{}},Ee=N.exports,O;function Se(){return O||(O=1,function(h){(function(p,u,d){function c(a){var e=this,t="";e.x=0,e.y=0,e.z=0,e.w=0,e.next=function(){var n=e.x^e.x<<11;return e.x=e.y,e.y=e.z,e.z=e.w,e.w^=e.w>>>19^n^n>>>8},a===(a|0)?e.x=a:t+=a;for(var o=0;o<t.length+64;o++)e.x^=t.charCodeAt(o)|0,e.next()}function f(a,e){return e.x=a.x,e.y=a.y,e.z=a.z,e.w=a.w,e}function l(a,e){var t=new c(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,s=(r+i)/(1<<21);while(s===0);return s},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&f(o,t),n.state=function(){return f(t,{})}),n}u.exports?u.exports=l:this.xor128=l})(Ee,h)}(N)),N.exports}var X={exports:{}},Re=X.exports,V;function Le(){return V||(V=1,function(h){(function(p,u,d){function c(a){var e=this,t="";e.next=function(){var n=e.x^e.x>>>2;return e.x=e.y,e.y=e.z,e.z=e.w,e.w=e.v,(e.d=e.d+362437|0)+(e.v=e.v^e.v<<4^(n^n<<1))|0},e.x=0,e.y=0,e.z=0,e.w=0,e.v=0,a===(a|0)?e.x=a:t+=a;for(var o=0;o<t.length+64;o++)e.x^=t.charCodeAt(o)|0,o==t.length&&(e.d=e.x<<10^e.x>>>4),e.next()}function f(a,e){return e.x=a.x,e.y=a.y,e.z=a.z,e.w=a.w,e.v=a.v,e.d=a.d,e}function l(a,e){var t=new c(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,s=(r+i)/(1<<21);while(s===0);return s},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&f(o,t),n.state=function(){return f(t,{})}),n}u.exports?u.exports=l:this.xorwow=l})(Re,h)}(X)),X.exports}var G={exports:{}},Ae=G.exports,W;function _e(){return W||(W=1,function(h){(function(p,u,d){function c(a){var e=this;e.next=function(){var o=e.x,n=e.i,r,i;return r=o[n],r^=r>>>7,i=r^r<<24,r=o[n+1&7],i^=r^r>>>10,r=o[n+3&7],i^=r^r>>>3,r=o[n+4&7],i^=r^r<<7,r=o[n+7&7],r=r^r<<13,i^=r^r<<9,o[n]=i,e.i=n+1&7,i};function t(o,n){var r,i=[];if(n===(n|0))i[0]=n;else for(n=""+n,r=0;r<n.length;++r)i[r&7]=i[r&7]<<15^n.charCodeAt(r)+i[r+1&7]<<13;for(;i.length<8;)i.push(0);for(r=0;r<8&&i[r]===0;++r);for(r==8?i[7]=-1:i[r],o.x=i,o.i=0,r=256;r>0;--r)o.next()}t(e,a)}function f(a,e){return e.x=a.x.slice(),e.i=a.i,e}function l(a,e){a==null&&(a=+new Date);var t=new c(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,s=(r+i)/(1<<21);while(s===0);return s},n.int32=t.next,n.quick=n,o&&(o.x&&f(o,t),n.state=function(){return f(t,{})}),n}u.exports?u.exports=l:this.xorshift7=l})(Ae,h)}(G)),G.exports}var $={exports:{}},qe=$.exports,K;function Ce(){return K||(K=1,function(h){(function(p,u,d){function c(a){var e=this;e.next=function(){var o=e.w,n=e.X,r=e.i,i,s;return e.w=o=o+1640531527|0,s=n[r+34&127],i=n[r=r+1&127],s^=s<<13,i^=i<<17,s^=s>>>15,i^=i>>>12,s=n[r]=s^i,e.i=r,s+(o^o>>>16)|0};function t(o,n){var r,i,s,v,S,L=[],C=128;for(n===(n|0)?(i=n,n=null):(n=n+"\0",i=0,C=Math.max(C,n.length)),s=0,v=-32;v<C;++v)n&&(i^=n.charCodeAt((v+32)%n.length)),v===0&&(S=i),i^=i<<10,i^=i>>>15,i^=i<<4,i^=i>>>13,v>=0&&(S=S+1640531527|0,r=L[v&127]^=i+S,s=r==0?s+1:0);for(s>=128&&(L[(n&&n.length||0)&127]=-1),s=127,v=4*128;v>0;--v)i=L[s+34&127],r=L[s=s+1&127],i^=i<<13,r^=r<<17,i^=i>>>15,r^=r>>>12,L[s]=i^r;o.w=S,o.X=L,o.i=s}t(e,a)}function f(a,e){return e.i=a.i,e.w=a.w,e.X=a.X.slice(),e}function l(a,e){a==null&&(a=+new Date);var t=new c(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,s=(r+i)/(1<<21);while(s===0);return s},n.int32=t.next,n.quick=n,o&&(o.X&&f(o,t),n.state=function(){return f(t,{})}),n}u.exports?u.exports=l:this.xor4096=l})(qe,h)}($)),$.exports}var D={exports:{}},Te=D.exports,Y;function ze(){return Y||(Y=1,function(h){(function(p,u,d){function c(a){var e=this,t="";e.next=function(){var n=e.b,r=e.c,i=e.d,s=e.a;return n=n<<25^n>>>7^r,r=r-i|0,i=i<<24^i>>>8^s,s=s-n|0,e.b=n=n<<20^n>>>12^r,e.c=r=r-i|0,e.d=i<<16^r>>>16^s,e.a=s-n|0},e.a=0,e.b=0,e.c=-1640531527,e.d=1367130551,a===Math.floor(a)?(e.a=a/4294967296|0,e.b=a|0):t+=a;for(var o=0;o<t.length+20;o++)e.b^=t.charCodeAt(o)|0,e.next()}function f(a,e){return e.a=a.a,e.b=a.b,e.c=a.c,e.d=a.d,e}function l(a,e){var t=new c(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,s=(r+i)/(1<<21);while(s===0);return s},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&f(o,t),n.state=function(){return f(t,{})}),n}u.exports?u.exports=l:this.tychei=l})(Te,h)}(D)),D.exports}var F={exports:{}};const ke={},Me=Object.freeze(Object.defineProperty({__proto__:null,default:ke},Symbol.toStringTag,{value:"Module"})),Ne=ie(Me);var Xe=F.exports,J;function Ge(){return J||(J=1,function(h){(function(p,u,d){var c=256,f=6,l=52,a="random",e=d.pow(c,f),t=d.pow(2,l),o=t*2,n=c-1,r;function i(g,m,b){var y=[];m=m==!0?{entropy:!0}:m||{};var x=L(S(m.entropy?[g,T(u)]:g??C(),3),y),w=new s(y),R=function(){for(var E=w.g(f),_=e,A=0;E<t;)E=(E+A)*c,_*=c,A=w.g(1);for(;E>=o;)E/=2,_/=2,A>>>=1;return(E+A)/_};return R.int32=function(){return w.g(4)|0},R.quick=function(){return w.g(4)/4294967296},R.double=R,L(T(w.S),u),(m.pass||b||function(E,_,A,q){return q&&(q.S&&v(q,w),E.state=function(){return v(w,{})}),A?(d[a]=E,_):E})(R,x,"global"in m?m.global:this==d,m.state)}function s(g){var m,b=g.length,y=this,x=0,w=y.i=y.j=0,R=y.S=[];for(b||(g=[b++]);x<c;)R[x]=x++;for(x=0;x<c;x++)R[x]=R[w=n&w+g[x%b]+(m=R[x])],R[w]=m;(y.g=function(E){for(var _,A=0,q=y.i,k=y.j,z=y.S;E--;)_=z[q=n&q+1],A=A*c+z[n&(z[q]=z[k=n&k+_])+(z[k]=_)];return y.i=q,y.j=k,A})(c)}function v(g,m){return m.i=g.i,m.j=g.j,m.S=g.S.slice(),m}function S(g,m){var b=[],y=typeof g,x;if(m&&y=="object")for(x in g)try{b.push(S(g[x],m-1))}catch{}return b.length?b:y=="string"?g:g+"\0"}function L(g,m){for(var b=g+"",y,x=0;x<b.length;)m[n&x]=n&(y^=m[n&x]*19)+b.charCodeAt(x++);return T(m)}function C(){try{var g;return r&&(g=r.randomBytes)?g=g(c):(g=new Uint8Array(c),(p.crypto||p.msCrypto).getRandomValues(g)),T(g)}catch{var m=p.navigator,b=m&&m.plugins;return[+new Date,p,b,p.screen,T(u)]}}function T(g){return String.fromCharCode.apply(0,g)}if(L(d.random(),u),h.exports){h.exports=i;try{r=Ne}catch{}}else d["seed"+a]=i})(typeof self<"u"?self:Xe,[],Math)}(F)),F.exports}var B,Q;function $e(){if(Q)return B;Q=1;var h=we(),p=Se(),u=Le(),d=_e(),c=Ce(),f=ze(),l=Ge();return l.alea=h,l.xor128=p,l.xorwow=u,l.xorshift7=d,l.xor4096=c,l.tychei=f,B=l,B}var De=$e();const Fe=P(De),He={order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},Be=()=>{const h=Fe("sigma"),p=new URLSearchParams(location.search).entries();for(const[r,i]of p){const s=document.getElementsByName(r);s.length===1?s[0].value=i:s.length>1&&s.forEach(v=>{const S=v;S.checked=S.value===i})}const u={...He,order:+document.querySelector("#order").value,size:+document.querySelector("#size").value,clusters:+document.querySelector("#clusters").value,edgesRenderer:document.querySelector('[name="edges-renderer"]:checked').value},d=ve(re,{...u,rng:h});ye.assign(d,{hierarchyAttributes:["cluster"]});const c={};for(let r=0;r<+u.clusters;r++)c[r]="#"+Math.floor(h()*16777215).toString(16);let f=0;d.forEachNode((r,{cluster:i})=>{d.mergeNodeAttributes(r,{size:d.degree(r)/3,label:`Node n°${++f}, in cluster n°${i}`,color:c[i+""]})});const l=document.getElementById("sigma-container"),a=new ne(d,l,{defaultEdgeColor:"#e6e6e6",defaultEdgeType:u.edgesRenderer,edgeProgramClasses:{"edges-default":te,"edges-fast":me}}),e=document.getElementById("fa2"),t=se.inferSettings(d),o=new le(d,{settings:t});function n(){o.isRunning()?(o.stop(),e.innerHTML="Start layout ▶"):(o.start(),e.innerHTML="Stop layout ⏸")}return e.addEventListener("click",n),a.getCamera().setState({angle:.2}),()=>{o.kill(),a.kill()}},Pe=`<style>
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
`,je=`/**
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
`,Ye={id:"large-graphs",title:"Core library/Advanced use cases",argTypes:{order:{name:"Number of nodes",defaultValue:5e3,control:{type:"number",step:"100",min:"100"}},size:{name:"Number of edges",defaultValue:1e4,control:{type:"number",step:"100",min:"100"}},clusters:{name:"Number of clusters",defaultValue:3,control:{type:"number",step:"1",min:"1"}},edgesRenderer:{name:"Edges renderer",defaultValue:"edge-default",options:["edges-default","edges-fast"],control:{type:"radio"}}}},Je={name:"Performances showcase",render:()=>Pe,play:oe(Be),args:{order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},parameters:{storySource:{source:je}}};export{Ye as default,Je as story};
