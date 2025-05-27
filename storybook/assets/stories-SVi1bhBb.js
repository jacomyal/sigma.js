import{E as Z,f as ee,G as re,S as ne,p as te,w as oe}from"./sigma-BsJT_GRv.js";import{a as P}from"./_commonjsHelpers-C4iS2aBk.js";import{r as ie}from"./is-graph-constructor-BVugt_gr.js";import{f as ae}from"./index-BUEWZHga.js";import{F as se}from"./worker-B6sB0a3K.js";import{r as ue}from"./circlepack-DXqN3GYD.js";import{r as ce}from"./___vite-browser-external_commonjs-proxy-BqV5D26a.js";import"./getters-CXJ0gpj8.js";import"./defaults-BeBqgnWC.js";const le=`
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
`,{UNSIGNED_BYTE:U,FLOAT:de}=WebGLRenderingContext,ge=["u_matrix"];class me extends Z{getDefinition(){return{VERTICES:2,VERTEX_SHADER_SOURCE:fe,FRAGMENT_SHADER_SOURCE:le,METHOD:WebGLRenderingContext.LINES,UNIFORMS:ge,ATTRIBUTES:[{name:"a_position",size:2,type:de},{name:"a_color",size:4,type:U,normalized:!0},{name:"a_id",size:4,type:U,normalized:!0}]}}processVisibleItem(p,s,d,l,f){const c=this.array,a=d.x,e=d.y,t=l.x,o=l.y,n=ee(f.color);c[s++]=a,c[s++]=e,c[s++]=n,c[s++]=p,c[s++]=t,c[s++]=o,c[s++]=n,c[s++]=p}setUniforms(p,{gl:s,uniformLocations:d}){const{u_matrix:l}=d;s.uniformMatrix3fv(l,!1,p.matrix)}}var H,j;function pe(){if(j)return H;j=1;var h=ie();return H=function(p,s){if(!h(p))throw new Error("graphology-generators/random/clusters: invalid Graph constructor.");s=s||{};var d="clusterDensity"in s?s.clusterDensity:.5,l=s.rng||Math.random,f=s.order,c=s.size,a=s.clusters;if(typeof d!="number"||d>1||d<0)throw new Error("graphology-generators/random/clusters: `clusterDensity` option should be a number between 0 and 1.");if(typeof l!="function")throw new Error("graphology-generators/random/clusters: `rng` option should be a function.");if(typeof f!="number"||f<=0)throw new Error("graphology-generators/random/clusters: `order` option should be a positive number.");if(typeof c!="number"||c<=0)throw new Error("graphology-generators/random/clusters: `size` option should be a positive number.");if(typeof a!="number"||a<=0)throw new Error("graphology-generators/random/clusters: `clusters` option should be a positive number.");var e=new p;if(!f)return e;var t=new Array(a),o,n,r;for(r=0;r<a;r++)t[r]=[];for(r=0;r<f;r++)o=l()*a|0,e.addNode(r,{cluster:o}),t[o].push(r);if(!c)return e;var i,u,x;for(r=0;r<c;r++){if(l()<1-d){i=l()*f|0;do u=l()*f|0;while(i===u)}else{if(o=l()*a|0,n=t[o],x=n.length,!x||x<2)continue;i=n[l()*x|0];do u=n[l()*x|0];while(i===u)}e.multi?e.addEdge(i,u):e.mergeEdge(i,u)}return e},H}var he=pe();const xe=P(he);var ve=ue();const ye=P(ve);var M={exports:{}},be=M.exports,I;function we(){return I||(I=1,function(h){(function(p,s,d){function l(e){var t=this,o=a();t.next=function(){var n=2091639*t.s0+t.c*23283064365386963e-26;return t.s0=t.s1,t.s1=t.s2,t.s2=n-(t.c=n|0)},t.c=1,t.s0=o(" "),t.s1=o(" "),t.s2=o(" "),t.s0-=o(e),t.s0<0&&(t.s0+=1),t.s1-=o(e),t.s1<0&&(t.s1+=1),t.s2-=o(e),t.s2<0&&(t.s2+=1),o=null}function f(e,t){return t.c=e.c,t.s0=e.s0,t.s1=e.s1,t.s2=e.s2,t}function c(e,t){var o=new l(e),n=t&&t.state,r=o.next;return r.int32=function(){return o.next()*4294967296|0},r.double=function(){return r()+(r()*2097152|0)*11102230246251565e-32},r.quick=r,n&&(typeof n=="object"&&f(n,o),r.state=function(){return f(o,{})}),r}function a(){var e=4022871197,t=function(o){o=String(o);for(var n=0;n<o.length;n++){e+=o.charCodeAt(n);var r=.02519603282416938*e;e=r>>>0,r-=e,r*=e,e=r>>>0,r-=e,e+=r*4294967296}return(e>>>0)*23283064365386963e-26};return t}s&&s.exports?s.exports=c:this.alea=c})(be,h)}(M)),M.exports}var X={exports:{}},Ee=X.exports,O;function Se(){return O||(O=1,function(h){(function(p,s,d){function l(a){var e=this,t="";e.x=0,e.y=0,e.z=0,e.w=0,e.next=function(){var n=e.x^e.x<<11;return e.x=e.y,e.y=e.z,e.z=e.w,e.w^=e.w>>>19^n^n>>>8},a===(a|0)?e.x=a:t+=a;for(var o=0;o<t.length+64;o++)e.x^=t.charCodeAt(o)|0,e.next()}function f(a,e){return e.x=a.x,e.y=a.y,e.z=a.z,e.w=a.w,e}function c(a,e){var t=new l(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,u=(r+i)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&f(o,t),n.state=function(){return f(t,{})}),n}s&&s.exports?s.exports=c:this.xor128=c})(Ee,h)}(X)),X.exports}var N={exports:{}},Re=N.exports,V;function Le(){return V||(V=1,function(h){(function(p,s,d){function l(a){var e=this,t="";e.next=function(){var n=e.x^e.x>>>2;return e.x=e.y,e.y=e.z,e.z=e.w,e.w=e.v,(e.d=e.d+362437|0)+(e.v=e.v^e.v<<4^(n^n<<1))|0},e.x=0,e.y=0,e.z=0,e.w=0,e.v=0,a===(a|0)?e.x=a:t+=a;for(var o=0;o<t.length+64;o++)e.x^=t.charCodeAt(o)|0,o==t.length&&(e.d=e.x<<10^e.x>>>4),e.next()}function f(a,e){return e.x=a.x,e.y=a.y,e.z=a.z,e.w=a.w,e.v=a.v,e.d=a.d,e}function c(a,e){var t=new l(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,u=(r+i)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&f(o,t),n.state=function(){return f(t,{})}),n}s&&s.exports?s.exports=c:this.xorwow=c})(Re,h)}(N)),N.exports}var G={exports:{}},Ae=G.exports,W;function qe(){return W||(W=1,function(h){(function(p,s,d){function l(a){var e=this;e.next=function(){var o=e.x,n=e.i,r,i;return r=o[n],r^=r>>>7,i=r^r<<24,r=o[n+1&7],i^=r^r>>>10,r=o[n+3&7],i^=r^r>>>3,r=o[n+4&7],i^=r^r<<7,r=o[n+7&7],r=r^r<<13,i^=r^r<<9,o[n]=i,e.i=n+1&7,i};function t(o,n){var r,i=[];if(n===(n|0))i[0]=n;else for(n=""+n,r=0;r<n.length;++r)i[r&7]=i[r&7]<<15^n.charCodeAt(r)+i[r+1&7]<<13;for(;i.length<8;)i.push(0);for(r=0;r<8&&i[r]===0;++r);for(r==8?i[7]=-1:i[r],o.x=i,o.i=0,r=256;r>0;--r)o.next()}t(e,a)}function f(a,e){return e.x=a.x.slice(),e.i=a.i,e}function c(a,e){a==null&&(a=+new Date);var t=new l(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,u=(r+i)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(o.x&&f(o,t),n.state=function(){return f(t,{})}),n}s&&s.exports?s.exports=c:this.xorshift7=c})(Ae,h)}(G)),G.exports}var D={exports:{}},Ce=D.exports,K;function _e(){return K||(K=1,function(h){(function(p,s,d){function l(a){var e=this;e.next=function(){var o=e.w,n=e.X,r=e.i,i,u;return e.w=o=o+1640531527|0,u=n[r+34&127],i=n[r=r+1&127],u^=u<<13,i^=i<<17,u^=u>>>15,i^=i>>>12,u=n[r]=u^i,e.i=r,u+(o^o>>>16)|0};function t(o,n){var r,i,u,x,S,L=[],_=128;for(n===(n|0)?(i=n,n=null):(n=n+"\0",i=0,_=Math.max(_,n.length)),u=0,x=-32;x<_;++x)n&&(i^=n.charCodeAt((x+32)%n.length)),x===0&&(S=i),i^=i<<10,i^=i>>>15,i^=i<<4,i^=i>>>13,x>=0&&(S=S+1640531527|0,r=L[x&127]^=i+S,u=r==0?u+1:0);for(u>=128&&(L[(n&&n.length||0)&127]=-1),u=127,x=4*128;x>0;--x)i=L[u+34&127],r=L[u=u+1&127],i^=i<<13,r^=r<<17,i^=i>>>15,r^=r>>>12,L[u]=i^r;o.w=S,o.X=L,o.i=u}t(e,a)}function f(a,e){return e.i=a.i,e.w=a.w,e.X=a.X.slice(),e}function c(a,e){a==null&&(a=+new Date);var t=new l(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,u=(r+i)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(o.X&&f(o,t),n.state=function(){return f(t,{})}),n}s&&s.exports?s.exports=c:this.xor4096=c})(Ce,h)}(D)),D.exports}var F={exports:{}},Te=F.exports,Y;function ze(){return Y||(Y=1,function(h){(function(p,s,d){function l(a){var e=this,t="";e.next=function(){var n=e.b,r=e.c,i=e.d,u=e.a;return n=n<<25^n>>>7^r,r=r-i|0,i=i<<24^i>>>8^u,u=u-n|0,e.b=n=n<<20^n>>>12^r,e.c=r=r-i|0,e.d=i<<16^r>>>16^u,e.a=u-n|0},e.a=0,e.b=0,e.c=-1640531527,e.d=1367130551,a===Math.floor(a)?(e.a=a/4294967296|0,e.b=a|0):t+=a;for(var o=0;o<t.length+20;o++)e.b^=t.charCodeAt(o)|0,e.next()}function f(a,e){return e.a=a.a,e.b=a.b,e.c=a.c,e.d=a.d,e}function c(a,e){var t=new l(a),o=e&&e.state,n=function(){return(t.next()>>>0)/4294967296};return n.double=function(){do var r=t.next()>>>11,i=(t.next()>>>0)/4294967296,u=(r+i)/(1<<21);while(u===0);return u},n.int32=t.next,n.quick=n,o&&(typeof o=="object"&&f(o,t),n.state=function(){return f(t,{})}),n}s&&s.exports?s.exports=c:this.tychei=c})(Te,h)}(F)),F.exports}var $={exports:{}},ke=$.exports,J;function Me(){return J||(J=1,function(h){(function(p,s,d){var l=256,f=6,c=52,a="random",e=d.pow(l,f),t=d.pow(2,c),o=t*2,n=l-1,r;function i(g,m,b){var y=[];m=m==!0?{entropy:!0}:m||{};var v=L(S(m.entropy?[g,T(s)]:g??_(),3),y),w=new u(y),R=function(){for(var E=w.g(f),q=e,A=0;E<t;)E=(E+A)*l,q*=l,A=w.g(1);for(;E>=o;)E/=2,q/=2,A>>>=1;return(E+A)/q};return R.int32=function(){return w.g(4)|0},R.quick=function(){return w.g(4)/4294967296},R.double=R,L(T(w.S),s),(m.pass||b||function(E,q,A,C){return C&&(C.S&&x(C,w),E.state=function(){return x(w,{})}),A?(d[a]=E,q):E})(R,v,"global"in m?m.global:this==d,m.state)}function u(g){var m,b=g.length,y=this,v=0,w=y.i=y.j=0,R=y.S=[];for(b||(g=[b++]);v<l;)R[v]=v++;for(v=0;v<l;v++)R[v]=R[w=n&w+g[v%b]+(m=R[v])],R[w]=m;(y.g=function(E){for(var q,A=0,C=y.i,k=y.j,z=y.S;E--;)q=z[C=n&C+1],A=A*l+z[n&(z[C]=z[k=n&k+q])+(z[k]=q)];return y.i=C,y.j=k,A})(l)}function x(g,m){return m.i=g.i,m.j=g.j,m.S=g.S.slice(),m}function S(g,m){var b=[],y=typeof g,v;if(m&&y=="object")for(v in g)try{b.push(S(g[v],m-1))}catch{}return b.length?b:y=="string"?g:g+"\0"}function L(g,m){for(var b=g+"",y,v=0;v<b.length;)m[n&v]=n&(y^=m[n&v]*19)+b.charCodeAt(v++);return T(m)}function _(){try{var g;return r&&(g=r.randomBytes)?g=g(l):(g=new Uint8Array(l),(p.crypto||p.msCrypto).getRandomValues(g)),T(g)}catch{var m=p.navigator,b=m&&m.plugins;return[+new Date,p,b,p.screen,T(s)]}}function T(g){return String.fromCharCode.apply(0,g)}if(L(d.random(),s),h.exports){h.exports=i;try{r=ce}catch{}}else d["seed"+a]=i})(typeof self<"u"?self:ke,[],Math)}($)),$.exports}var B,Q;function Xe(){if(Q)return B;Q=1;var h=we(),p=Se(),s=Le(),d=qe(),l=_e(),f=ze(),c=Me();return c.alea=h,c.xor128=p,c.xorwow=s,c.xorshift7=d,c.xor4096=l,c.tychei=f,B=c,B}var Ne=Xe();const Ge=P(Ne),De={order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},Fe=()=>{const h=Ge("sigma"),p=new URLSearchParams(location.search).entries();for(const[r,i]of p){const u=document.getElementsByName(r);u.length===1?u[0].value=i:u.length>1&&u.forEach(x=>{const S=x;S.checked=S.value===i})}const s={...De,order:+document.querySelector("#order").value,size:+document.querySelector("#size").value,clusters:+document.querySelector("#clusters").value,edgesRenderer:document.querySelector('[name="edges-renderer"]:checked').value},d=xe(re,{...s,rng:h});ye.assign(d,{hierarchyAttributes:["cluster"]});const l={};for(let r=0;r<+s.clusters;r++)l[r]="#"+Math.floor(h()*16777215).toString(16);let f=0;d.forEachNode((r,{cluster:i})=>{d.mergeNodeAttributes(r,{size:d.degree(r)/3,label:`Node n°${++f}, in cluster n°${i}`,color:l[i+""]})});const c=document.getElementById("sigma-container"),a=new ne(d,c,{defaultEdgeColor:"#e6e6e6",defaultEdgeType:s.edgesRenderer,edgeProgramClasses:{"edges-default":te,"edges-fast":me}}),e=document.getElementById("fa2"),t=ae.inferSettings(d),o=new se(d,{settings:t});function n(){o.isRunning()?(o.stop(),e.innerHTML="Start layout ▶"):(o.start(),e.innerHTML="Stop layout ⏸")}return e.addEventListener("click",n),a.getCamera().setState({angle:.2}),()=>{o.kill(),a.kill()}},$e=`<style>
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
`,He=`/**
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
`,Ye={id:"large-graphs",title:"Core library/Advanced use cases",argTypes:{order:{name:"Number of nodes",defaultValue:5e3,control:{type:"number",step:"100",min:"100"}},size:{name:"Number of edges",defaultValue:1e4,control:{type:"number",step:"100",min:"100"}},clusters:{name:"Number of clusters",defaultValue:3,control:{type:"number",step:"1",min:"1"}},edgesRenderer:{name:"Edges renderer",defaultValue:"edge-default",options:["edges-default","edges-fast"],control:{type:"radio"}}}},Je={name:"Performances showcase",render:()=>$e,play:oe(Fe),args:{order:5e3,size:1e3,clusters:3,edgesRenderer:"edges-default"},parameters:{storySource:{source:He}}};export{Ye as default,Je as story};
