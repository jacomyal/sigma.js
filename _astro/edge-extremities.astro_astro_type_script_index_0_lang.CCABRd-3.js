import{c as e,f as t,i as n,l as r,n as i,t as a}from"./graphology.DvPOi-Ni.js";import{t as o}from"./arrow.BsqU9xg_.js";import{t as s}from"./curved.OkB8Gikv.js";import{t as c}from"./curvedS.DCJzQWWe.js";function l(e){let{lengthRatio:t=.75,widthRatio:n=4,margin:r=0}=e??{};return{name:`bar`,glsl:`
// Box SDF (same geometry as square, different defaults)
float extremity_bar(vec2 uv, float lengthRatio, float widthRatio) {
  float halfW = widthRatio * 0.5;

  // Box SDF: distance to rectangle [0, lengthRatio] × [-halfW, halfW]
  vec2 center = vec2(lengthRatio * 0.5, 0.0);
  vec2 halfSize = vec2(lengthRatio * 0.5, halfW);
  vec2 d = abs(uv - center) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,length:t,widthFactor:n,margin:r,baseRatio:1,uniforms:[],attributes:[]}}function u(e){let{lengthRatio:t=4,widthRatio:n=t+1,margin:r=0}=e??{};return{name:`circle`,glsl:`
// Circle SDF: circle centered at (lengthRatio/2, 0) with radius = lengthRatio/2
// uv.x: 0 (base) to lengthRatio (far edge), uv.y: [-halfW, +halfW]
float extremity_circle(vec2 uv, float lengthRatio, float widthRatio) {
  float radius = lengthRatio * 0.5;
  vec2 center = vec2(radius, 0.0);
  return length(uv - center) - radius;
}
`,length:t,widthFactor:n,margin:r,uniforms:[],attributes:[]}}function d(e){let{lengthRatio:t=5,widthRatio:n=4,margin:r=0}=e??{};return{name:`diamond`,glsl:`
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
`,length:t,widthFactor:n,margin:r,uniforms:[],attributes:[]}}function f(e){let{lengthRatio:t=4,widthRatio:n=4,margin:r=0}=e??{};return{name:`square`,glsl:`
// Box SDF (same geometry as bar, different defaults)
float extremity_square(vec2 uv, float lengthRatio, float widthRatio) {
  float halfW = widthRatio * 0.5;
  vec2 center = vec2(lengthRatio * 0.5, 0.0);
  vec2 halfSize = vec2(lengthRatio * 0.5, halfW);
  vec2 d = abs(uv - center) - halfSize;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
`,length:t,widthFactor:n,margin:r,baseRatio:1,uniforms:[],attributes:[]}}var p=document.getElementById(`sigma-container`),m=new a,h=100,g=70,_=50,v=5,y=[{name:`straight`,color:`#5B8FF9`},{name:`curved`,color:`#61DDAA`,curvature:.3},{name:`curvedS`,color:`#F6903D`}],b=y.length*h+40,x=[[{head:`arrow`},{head:`circle`},{head:`diamond`},{head:`bar`},{head:`square`}],[{head:`arrow`,tail:`arrow`},{head:`arrow`,tail:`circle`},{head:`diamond`,tail:`bar`},{head:`circle`,tail:`square`},{head:`square`,tail:`diamond`}]];for(let e=0;e<x.length;e++){let t=x[e];for(let n=0;n<t.length;n++){let{head:r,tail:i}=t[n];for(let t=0;t<y.length;t++){let{name:a,color:o,curvature:s}=y[t],c=e*b+t*h,l=-n*g,u=`${e}-${n}-${t}-s`,d=`${e}-${n}-${t}-t`;m.addNode(u,{x:c-_/2,y:l}),m.addNode(d,{x:c+_/2,y:l+_*.6}),m.addEdge(u,d,{size:v,color:o,path:a,curvature:s??0,head:r,tail:i})}}}new i(m,p,{primitives:{nodes:{layers:[t()]},edges:{paths:[e(),s(),c()],extremities:[o(),u(),d(),l(),f()],layers:[r()]}},styles:{nodes:[n.nodes,{size:12,color:`darkgrey`}],edges:[n.edges,{path:{attribute:`path`},head:{attribute:`head`},tail:{attribute:`tail`}}]},settings:{itemSizesReference:`positions`,autoRescale:!0}});