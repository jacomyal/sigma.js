import{c as y,S,a as g,o as w,t as p,n as b}from"./graphology.BwGEgIxD.js";import{e as W}from"./arrow.BEykAiMF.js";import{p as D}from"./curved.CciR-gGH.js";import{p as F}from"./curvedS.B5ioVNIn.js";function L(t){const{lengthRatio:a=.75,widthRatio:e=4,margin:o=0}=t??{};return{name:"bar",glsl:`
// Box SDF (same geometry as square, different defaults)
float extremity_bar(vec2 uv, float lengthRatio, float widthRatio) {
  float halfW = widthRatio * 0.5;

  // Box SDF: distance to rectangle [0, lengthRatio] × [-halfW, halfW]
  vec2 center = vec2(lengthRatio * 0.5, 0.0);
  vec2 halfSize = vec2(lengthRatio * 0.5, halfW);
  vec2 d = abs(uv - center) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,length:a,widthFactor:e,margin:o,baseRatio:1,uniforms:[],attributes:[]}}function I(t){const{lengthRatio:a=4,widthRatio:e=a+1,margin:o=0}=t??{};return{name:"circle",glsl:`
// Circle SDF: circle centered at (lengthRatio/2, 0) with radius = lengthRatio/2
// uv.x: 0 (base) to lengthRatio (far edge), uv.y: [-halfW, +halfW]
float extremity_circle(vec2 uv, float lengthRatio, float widthRatio) {
  float radius = lengthRatio * 0.5;
  vec2 center = vec2(radius, 0.0);
  return length(uv - center) - radius;
}
`,length:a,widthFactor:e,margin:o,uniforms:[],attributes:[]}}function C(t){const{lengthRatio:a=5,widthRatio:e=4,margin:o=0}=t??{};return{name:"diamond",glsl:`
// Diamond SDF: rhombus with vertices at (0,0), (L/2, W/2), (L, 0), (L/2, -W/2)
float extremity_diamond(vec2 uv, float lengthRatio, float widthRatio) {
  float halfL = lengthRatio * 0.5;
  float halfW = widthRatio * 0.5;

  // Center the diamond at (halfL, 0)
  vec2 p = abs(uv - vec2(halfL, 0.0));

  // Diamond is the set |x/halfL| + |y/halfW| <= 1
  // Signed distance: (p.x/halfL + p.y/halfW - 1) * normalization
  float d = p.x / halfL + p.y / halfW - 1.0;

  // Scale by the distance from center to edge along the gradient direction
  float norm = length(vec2(1.0 / halfL, 1.0 / halfW));
  return d / norm;
}
`,length:a,widthFactor:e,margin:o,uniforms:[],attributes:[]}}function _(t){const{lengthRatio:a=4,widthRatio:e=4,margin:o=0}=t??{};return{name:"square",glsl:`
// Box SDF (same geometry as bar, different defaults)
float extremity_square(vec2 uv, float lengthRatio, float widthRatio) {
  float halfW = widthRatio * 0.5;
  vec2 center = vec2(lengthRatio * 0.5, 0.0);
  vec2 halfSize = vec2(lengthRatio * 0.5, halfW);
  vec2 d = abs(uv - center) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,length:a,widthFactor:e,margin:o,baseRatio:1,uniforms:[],attributes:[]}}const A=document.getElementById("sigma-container"),n=new y,u=100,z=70,l=50,E=5,s=[{name:"straight",color:"#5B8FF9"},{name:"curved",color:"#61DDAA",curvature:.3},{name:"curvedS",color:"#F6903D"}],G=s.length*u+40,m=[[{head:"arrow"},{head:"circle"},{head:"diamond"},{head:"bar"},{head:"square"}],[{head:"arrow",tail:"arrow"},{head:"arrow",tail:"circle"},{head:"diamond",tail:"bar"},{head:"circle",tail:"square"},{head:"square",tail:"diamond"}]];for(let t=0;t<m.length;t++){const a=m[t];for(let e=0;e<a.length;e++){const{head:o,tail:r}=a[e];for(let i=0;i<s.length;i++){const{name:v,color:R,curvature:x}=s[i],c=t*G+i*u,h=-e*z,d=`${t}-${e}-${i}-s`,f=`${t}-${e}-${i}-t`;n.addNode(d,{x:c-l/2,y:h}),n.addNode(f,{x:c+l/2,y:h+l*.6}),n.addEdge(d,f,{size:E,color:R,path:v,curvature:x??0,head:o,tail:r})}}}new S(n,A,{primitives:{nodes:{layers:[b()]},edges:{paths:[p(),D(),F()],extremities:[W(),I(),C(),L(),_()],layers:[w()]}},styles:{nodes:[g.nodes,{size:12,color:"darkgrey"}],edges:[g.edges,{path:{attribute:"path"},head:{attribute:"head"},tail:{attribute:"tail"}}]},settings:{itemSizesReference:"positions",autoRescale:!0}});
