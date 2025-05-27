var ze=Object.defineProperty;var pe=(t,e,r)=>e in t?ze(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r;var re=(t,e,r)=>pe(t,typeof e!="symbol"?e+"":e,r);import{E as oe,j as ke,f as ne,k as V,l as he,m as ae,M as $,S as L,o as X,p as me,G as ue,w as N}from"./sigma-BsJT_GRv.js";import"./_commonjsHelpers-C4iS2aBk.js";const fe=`
attribute vec4 a_id;
attribute vec4 a_color;
attribute vec2 a_normal;
attribute float a_normalCoef;
attribute vec2 a_positionStart;
attribute vec2 a_positionEnd;
attribute float a_positionCoef;
attribute float a_sourceRadius;
attribute float a_targetRadius;
attribute float a_sourceRadiusCoef;
attribute float a_targetRadiusCoef;

uniform mat3 u_matrix;
uniform float u_zoomRatio;
uniform float u_sizeRatio;
uniform float u_pixelRatio;
uniform float u_correctionRatio;
uniform float u_minEdgeThickness;
uniform float u_lengthToThicknessRatio;
uniform float u_feather;

varying vec4 v_color;
varying vec2 v_normal;
varying float v_thickness;
varying float v_feather;

const float bias = 255.0 / 254.0;

void main() {
  float minThickness = u_minEdgeThickness;

  vec2 normal = a_normal * a_normalCoef;
  vec2 position = a_positionStart * (1.0 - a_positionCoef) + a_positionEnd * a_positionCoef;

  float normalLength = length(normal);
  vec2 unitNormal = normal / normalLength;

  // These first computations are taken from edge.vert.glsl. Please read it to
  // get better comments on what's happening:
  float pixelsThickness = max(normalLength, minThickness * u_sizeRatio);
  float webGLThickness = pixelsThickness * u_correctionRatio / u_sizeRatio;

  // Here, we move the point to leave space for the arrow heads:
  // Source arrow head
  float sourceRadius = a_sourceRadius * a_sourceRadiusCoef;
  float sourceDirection = sign(sourceRadius);
  float webGLSourceRadius = sourceDirection * sourceRadius * 2.0 * u_correctionRatio / u_sizeRatio;
  float webGLSourceArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;
  vec2 sourceCompensationVector =
    vec2(-sourceDirection * unitNormal.y, sourceDirection * unitNormal.x)
    * (webGLSourceRadius + webGLSourceArrowHeadLength);
    
  // Target arrow head
  float targetRadius = a_targetRadius * a_targetRadiusCoef;
  float targetDirection = sign(targetRadius);
  float webGLTargetRadius = targetDirection * targetRadius * 2.0 * u_correctionRatio / u_sizeRatio;
  float webGLTargetArrowHeadLength = webGLThickness * u_lengthToThicknessRatio * 2.0;
  vec2 targetCompensationVector =
  vec2(-targetDirection * unitNormal.y, targetDirection * unitNormal.x)
    * (webGLTargetRadius + webGLTargetArrowHeadLength);

  // Here is the proper position of the vertex
  gl_Position = vec4((u_matrix * vec3(position + unitNormal * webGLThickness + sourceCompensationVector + targetCompensationVector, 1)).xy, 0, 1);

  v_thickness = webGLThickness / u_zoomRatio;

  v_normal = unitNormal;

  v_feather = u_feather * u_correctionRatio / u_zoomRatio / u_pixelRatio * 2.0;

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`,{UNSIGNED_BYTE:se,FLOAT:E}=WebGLRenderingContext,ve=["u_matrix","u_zoomRatio","u_sizeRatio","u_correctionRatio","u_pixelRatio","u_feather","u_minEdgeThickness","u_lengthToThicknessRatio"],Ee={lengthToThicknessRatio:V.lengthToThicknessRatio};function xe(t){const e={...Ee};return class extends oe{getDefinition(){return{VERTICES:6,VERTEX_SHADER_SOURCE:fe,FRAGMENT_SHADER_SOURCE:ke,METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:ve,ATTRIBUTES:[{name:"a_positionStart",size:2,type:E},{name:"a_positionEnd",size:2,type:E},{name:"a_normal",size:2,type:E},{name:"a_color",size:4,type:se,normalized:!0},{name:"a_id",size:4,type:se,normalized:!0},{name:"a_sourceRadius",size:1,type:E},{name:"a_targetRadius",size:1,type:E}],CONSTANT_ATTRIBUTES:[{name:"a_positionCoef",size:1,type:E},{name:"a_normalCoef",size:1,type:E},{name:"a_sourceRadiusCoef",size:1,type:E},{name:"a_targetRadiusCoef",size:1,type:E}],CONSTANT_DATA:[[0,1,-1,0],[0,-1,1,0],[1,1,0,1],[1,1,0,1],[0,-1,1,0],[1,-1,0,-1]]}}processVisibleItem(a,s,u,n,d){const f=d.size||1,b=u.x,c=u.y,i=n.x,y=n.y,o=ne(d.color),l=i-b,g=y-c,z=u.size||1,h=n.size||1;let p=l*l+g*g,x=0,_=0;p&&(p=1/Math.sqrt(p),x=-g*p*f,_=l*p*f);const k=this.array;k[s++]=b,k[s++]=c,k[s++]=i,k[s++]=y,k[s++]=x,k[s++]=_,k[s++]=o,k[s++]=a,k[s++]=z,k[s++]=h}setUniforms(a,{gl:s,uniformLocations:u}){const{u_matrix:n,u_zoomRatio:d,u_feather:f,u_pixelRatio:b,u_correctionRatio:c,u_sizeRatio:i,u_minEdgeThickness:y,u_lengthToThicknessRatio:o}=u;s.uniformMatrix3fv(n,!1,a.matrix),s.uniform1f(d,a.zoomRatio),s.uniform1f(i,a.sizeRatio),s.uniform1f(c,a.correctionRatio),s.uniform1f(b,a.pixelRatio),s.uniform1f(f,a.antiAliasingFeather),s.uniform1f(y,a.minEdgeThickness),s.uniform1f(o,e.lengthToThicknessRatio)}}}function _e(t){return he([xe(),ae(t),ae({...t,extremity:"source"})])}const Te=_e();function ce(t,e,r,a){const s=(1-t)**2*e.x+2*(1-t)*t*r.x+t**2*a.x,u=(1-t)**2*e.y+2*(1-t)*t*r.y+t**2*a.y;return{x:s,y:u}}function Ce(t,e,r){let s=0,u=t;for(let n=0;n<20;n++){const d=ce((n+1)/20,t,e,r);s+=Math.sqrt((u.x-d.x)**2+(u.y-d.y)**2),u=d}return s}function we({curvatureAttribute:t,defaultCurvature:e,keepLabelUpright:r=!0}){return(a,s,u,n,d)=>{const f=d.edgeLabelSize,b=s[t]||e,c=d.edgeLabelFont,i=d.edgeLabelWeight,y=d.edgeLabelColor.attribute?s[d.edgeLabelColor.attribute]||d.edgeLabelColor.color||"#000":d.edgeLabelColor.color;let o=s.label;if(!o)return;a.fillStyle=y,a.font=`${i} ${f}px ${c}`;const l=!r||u.x<n.x;let g=l?u.x:n.x,z=l?u.y:n.y,h=l?n.x:u.x,p=l?n.y:u.y;const x=(g+h)/2,_=(z+p)/2,k=h-g,m=p-z,W=Math.sqrt(k**2+m**2),q=l?1:-1;let C=x+m*b*q,w=_-k*b*q;const A=s.size*.7+5,D={x:w-z,y:-(C-g)},J=Math.sqrt(D.x**2+D.y**2),B={x:p-w,y:-(h-C)},K=Math.sqrt(B.x**2+B.y**2);g+=A*D.x/J,z+=A*D.y/J,h+=A*B.x/K,p+=A*B.y/K,C+=A*m/W,w-=A*k/W;const Q={x:C,y:w},Z={x:g,y:z},H={x:h,y:p},M=Ce(Z,Q,H);if(M<u.size+n.size)return;let I=a.measureText(o).width;const ee=M-u.size-n.size;if(I>ee){const v="…";for(o=o+v,I=a.measureText(o).width;I>ee&&o.length>1;)o=o.slice(0,-2)+v,I=a.measureText(o).width;if(o.length<4)return}const F={};for(let v=0,O=o.length;v<O;v++){const S=o[v];F[S]||(F[S]=a.measureText(S).width*(1+b*.35))}let R=.5-I/M/2;for(let v=0,O=o.length;v<O;v++){const S=o[v],te=ce(R,Z,Q,H),ge=2*(1-R)*(C-g)+2*R*(h-C),be=2*(1-R)*(w-z)+2*R*(p-w),ye=Math.atan2(be,ge);a.save(),a.translate(te.x,te.y),a.rotate(ye),a.fillText(S,0,0),a.restore(),R+=F[S]/M}}}function Ae({arrowHead:t}){const e=(t==null?void 0:t.extremity)==="target"||(t==null?void 0:t.extremity)==="both",r=(t==null?void 0:t.extremity)==="source"||(t==null?void 0:t.extremity)==="both";return`
precision highp float;

varying vec4 v_color;
varying float v_thickness;
varying float v_feather;
varying vec2 v_cpA;
varying vec2 v_cpB;
varying vec2 v_cpC;
${e?`
varying float v_targetSize;
varying vec2 v_targetPoint;`:""}
${r?`
varying float v_sourceSize;
varying vec2 v_sourcePoint;`:""}
${t?`
uniform float u_lengthToThicknessRatio;
uniform float u_widenessToThicknessRatio;`:""}

float det(vec2 a, vec2 b) {
  return a.x * b.y - b.x * a.y;
}

vec2 getDistanceVector(vec2 b0, vec2 b1, vec2 b2) {
  float a = det(b0, b2), b = 2.0 * det(b1, b0), d = 2.0 * det(b2, b1);
  float f = b * d - a * a;
  vec2 d21 = b2 - b1, d10 = b1 - b0, d20 = b2 - b0;
  vec2 gf = 2.0 * (b * d21 + d * d10 + a * d20);
  gf = vec2(gf.y, -gf.x);
  vec2 pp = -f * gf / dot(gf, gf);
  vec2 d0p = b0 - pp;
  float ap = det(d0p, d20), bp = 2.0 * det(d10, d0p);
  float t = clamp((ap + bp) / (2.0 * a + b + d), 0.0, 1.0);
  return mix(mix(b0, b1, t), mix(b1, b2, t), t);
}

float distToQuadraticBezierCurve(vec2 p, vec2 b0, vec2 b1, vec2 b2) {
  return length(getDistanceVector(b0 - p, b1 - p, b2 - p));
}

const vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);

void main(void) {
  float dist = distToQuadraticBezierCurve(gl_FragCoord.xy, v_cpA, v_cpB, v_cpC);
  float thickness = v_thickness;
${e?`
  float distToTarget = length(gl_FragCoord.xy - v_targetPoint);
  float targetArrowLength = v_targetSize + thickness * u_lengthToThicknessRatio;
  if (distToTarget < targetArrowLength) {
    thickness = (distToTarget - v_targetSize) / (targetArrowLength - v_targetSize) * u_widenessToThicknessRatio * thickness;
  }`:""}
${r?`
  float distToSource = length(gl_FragCoord.xy - v_sourcePoint);
  float sourceArrowLength = v_sourceSize + thickness * u_lengthToThicknessRatio;
  if (distToSource < sourceArrowLength) {
    thickness = (distToSource - v_sourceSize) / (sourceArrowLength - v_sourceSize) * u_widenessToThicknessRatio * thickness;
  }`:""}

  float halfThickness = thickness / 2.0;
  if (dist < halfThickness) {
    #ifdef PICKING_MODE
    gl_FragColor = v_color;
    #else
    float t = smoothstep(
      halfThickness - v_feather,
      halfThickness,
      dist
    );

    gl_FragColor = mix(v_color, transparent, t);
    #endif
  } else {
    gl_FragColor = transparent;
  }
}
`}function Re({arrowHead:t}){const e=(t==null?void 0:t.extremity)==="target"||(t==null?void 0:t.extremity)==="both",r=(t==null?void 0:t.extremity)==="source"||(t==null?void 0:t.extremity)==="both";return`
attribute vec4 a_id;
attribute vec4 a_color;
attribute float a_direction;
attribute float a_thickness;
attribute vec2 a_source;
attribute vec2 a_target;
attribute float a_current;
attribute float a_curvature;
${e?`attribute float a_targetSize;
`:""}
${r?`attribute float a_sourceSize;
`:""}

uniform mat3 u_matrix;
uniform float u_sizeRatio;
uniform float u_pixelRatio;
uniform vec2 u_dimensions;
uniform float u_minEdgeThickness;
uniform float u_feather;

varying vec4 v_color;
varying float v_thickness;
varying float v_feather;
varying vec2 v_cpA;
varying vec2 v_cpB;
varying vec2 v_cpC;
${e?`
varying float v_targetSize;
varying vec2 v_targetPoint;`:""}
${r?`
varying float v_sourceSize;
varying vec2 v_sourcePoint;`:""}
${t?`
uniform float u_widenessToThicknessRatio;`:""}

const float bias = 255.0 / 254.0;
const float epsilon = 0.7;

vec2 clipspaceToViewport(vec2 pos, vec2 dimensions) {
  return vec2(
    (pos.x + 1.0) * dimensions.x / 2.0,
    (pos.y + 1.0) * dimensions.y / 2.0
  );
}

vec2 viewportToClipspace(vec2 pos, vec2 dimensions) {
  return vec2(
    pos.x / dimensions.x * 2.0 - 1.0,
    pos.y / dimensions.y * 2.0 - 1.0
  );
}

void main() {
  float minThickness = u_minEdgeThickness;

  // Selecting the correct position
  // Branchless "position = a_source if a_current == 1.0 else a_target"
  vec2 position = a_source * max(0.0, a_current) + a_target * max(0.0, 1.0 - a_current);
  position = (u_matrix * vec3(position, 1)).xy;

  vec2 source = (u_matrix * vec3(a_source, 1)).xy;
  vec2 target = (u_matrix * vec3(a_target, 1)).xy;

  vec2 viewportPosition = clipspaceToViewport(position, u_dimensions);
  vec2 viewportSource = clipspaceToViewport(source, u_dimensions);
  vec2 viewportTarget = clipspaceToViewport(target, u_dimensions);

  vec2 delta = viewportTarget.xy - viewportSource.xy;
  float len = length(delta);
  vec2 normal = vec2(-delta.y, delta.x) * a_direction;
  vec2 unitNormal = normal / len;
  float boundingBoxThickness = len * a_curvature;

  float curveThickness = max(minThickness, a_thickness / u_sizeRatio);
  v_thickness = curveThickness * u_pixelRatio;
  v_feather = u_feather;

  v_cpA = viewportSource;
  v_cpB = 0.5 * (viewportSource + viewportTarget) + unitNormal * a_direction * boundingBoxThickness;
  v_cpC = viewportTarget;

  vec2 viewportOffsetPosition = (
    viewportPosition +
    unitNormal * (boundingBoxThickness / 2.0 + sign(boundingBoxThickness) * (${t?"curveThickness * u_widenessToThicknessRatio":"curveThickness"} + epsilon)) *
    max(0.0, a_direction) // NOTE: cutting the bounding box in half to avoid overdraw
  );

  position = viewportToClipspace(viewportOffsetPosition, u_dimensions);
  gl_Position = vec4(position, 0, 1);
    
${e?`
  v_targetSize = a_targetSize * u_pixelRatio / u_sizeRatio;
  v_targetPoint = viewportTarget;
`:""}
${r?`
  v_sourceSize = a_sourceSize * u_pixelRatio / u_sizeRatio;
  v_sourcePoint = viewportSource;
`:""}

  #ifdef PICKING_MODE
  // For picking mode, we use the ID as the color:
  v_color = a_id;
  #else
  // For normal mode, we use the color:
  v_color = a_color;
  #endif

  v_color.a *= bias;
}
`}const Y=.25,Se={arrowHead:null,curvatureAttribute:"curvature",defaultCurvature:Y},Ie={edgeIndexAttribute:"parallelIndex",edgeMinIndexAttribute:"parallelMinIndex",edgeMaxIndexAttribute:"parallelMaxIndex"};function Le(t,e){const r={...Ie,...e||{}},a={},s={},u={};let n=0;t.forEachNode(b=>{a[b]=++n+""}),t.forEachEdge((b,c,i,y)=>{const o=a[i],l=a[y],g=[o,l].join("-");s[b]=g,u[g]=[o,l].sort().join("-")});const d={},f={};t.forEachEdge(b=>{const c=s[b],i=u[c];d[c]=d[c]||[],d[c].push(b),f[i]=f[i]||[],f[i].push(b)});for(const b in d){const c=d[b],i=c.length,y=f[u[b]].length;if(i===1&&y===1){const o=c[0];t.setEdgeAttribute(o,r.edgeIndexAttribute,null),t.setEdgeAttribute(o,r.edgeMaxIndexAttribute,null)}else if(i===1){const o=c[0];t.setEdgeAttribute(o,r.edgeIndexAttribute,1),t.setEdgeAttribute(o,r.edgeMaxIndexAttribute,1)}else if(i===y){const o=(i-1)/2,l=-o;for(let g=0;g<i;g++){const z=c[g],h=-(i-1)/2+g;t.setEdgeAttribute(z,r.edgeIndexAttribute,h),t.setEdgeAttribute(z,r.edgeMinIndexAttribute,l),t.setEdgeAttribute(z,r.edgeMaxIndexAttribute,o)}}else for(let o=0;o<i;o++){const l=c[o];t.setEdgeAttribute(l,r.edgeIndexAttribute,o+1),t.setEdgeAttribute(l,r.edgeMaxIndexAttribute,i)}}}const{UNSIGNED_BYTE:ie,FLOAT:T}=WebGLRenderingContext;function j(t){const e={...Se,...t||{}},{arrowHead:r,curvatureAttribute:a,drawLabel:s}=e,u=(r==null?void 0:r.extremity)==="target"||(r==null?void 0:r.extremity)==="both",n=(r==null?void 0:r.extremity)==="source"||(r==null?void 0:r.extremity)==="both",d=["u_matrix","u_sizeRatio","u_dimensions","u_pixelRatio","u_feather","u_minEdgeThickness",...r?["u_lengthToThicknessRatio","u_widenessToThicknessRatio"]:[]];return class extends oe{constructor(){super(...arguments);re(this,"drawLabel",s||we(e))}getDefinition(){return{VERTICES:6,VERTEX_SHADER_SOURCE:Re(e),FRAGMENT_SHADER_SOURCE:Ae(e),METHOD:WebGLRenderingContext.TRIANGLES,UNIFORMS:d,ATTRIBUTES:[{name:"a_source",size:2,type:T},{name:"a_target",size:2,type:T},...u?[{name:"a_targetSize",size:1,type:T}]:[],...n?[{name:"a_sourceSize",size:1,type:T}]:[],{name:"a_thickness",size:1,type:T},{name:"a_curvature",size:1,type:T},{name:"a_color",size:4,type:ie,normalized:!0},{name:"a_id",size:4,type:ie,normalized:!0}],CONSTANT_ATTRIBUTES:[{name:"a_current",size:1,type:T},{name:"a_direction",size:1,type:T}],CONSTANT_DATA:[[0,1],[0,-1],[1,1],[0,-1],[1,1],[1,-1]]}}processVisibleItem(c,i,y,o,l){const g=l.size||1,z=y.x,h=y.y,p=o.x,x=o.y,_=ne(l.color),k=l[a]??Y,m=this.array;m[i++]=z,m[i++]=h,m[i++]=p,m[i++]=x,u&&(m[i++]=o.size),n&&(m[i++]=y.size),m[i++]=g,m[i++]=k,m[i++]=_,m[i++]=c}setUniforms(c,{gl:i,uniformLocations:y}){const{u_matrix:o,u_pixelRatio:l,u_feather:g,u_sizeRatio:z,u_dimensions:h,u_minEdgeThickness:p}=y;if(i.uniformMatrix3fv(o,!1,c.matrix),i.uniform1f(l,c.pixelRatio),i.uniform1f(z,c.sizeRatio),i.uniform1f(g,c.antiAliasingFeather),i.uniform2f(h,c.width*c.pixelRatio,c.height*c.pixelRatio),i.uniform1f(p,c.minEdgeThickness),r){const{u_lengthToThicknessRatio:x,u_widenessToThicknessRatio:_}=y;i.uniform1f(x,r.lengthToThicknessRatio),i.uniform1f(_,r.widenessToThicknessRatio)}}}}const G=j(),de=j({arrowHead:V}),Ne=j({arrowHead:{...V,extremity:"both"}}),Pe=()=>{const t=document.getElementById("sigma-container"),e=new $;e.addNode("a",{x:0,y:0,size:10,label:"Alexandra"}),e.addNode("b",{x:1,y:-1,size:20,label:"Bastian"}),e.addNode("c",{x:3,y:-2,size:10,label:"Charles"}),e.addNode("d",{x:1,y:-3,size:10,label:"Dorothea"}),e.addNode("e",{x:3,y:-4,size:20,label:"Ernestine"}),e.addNode("f",{x:4,y:-5,size:10,label:"Fabian"}),e.addEdge("a","b",{size:5}),e.addEdge("b","c",{size:6,curved:!0}),e.addEdge("b","d",{size:5}),e.addEdge("c","b",{size:5,curved:!0}),e.addEdge("c","e",{size:9}),e.addEdge("d","c",{size:5,curved:!0}),e.addEdge("d","e",{size:5,curved:!0}),e.addEdge("e","d",{size:4,curved:!0}),e.addEdge("f","e",{size:7,curved:!0});const r=new L(e,t,{allowInvalidContainer:!0,defaultEdgeType:"straightNoArrow",renderEdgeLabels:!0,edgeProgramClasses:{straightNoArrow:me,curvedNoArrow:G,straightArrow:X,curvedArrow:de,straightDoubleArrow:Te,curvedDoubleArrow:Ne}}),a=document.createElement("select");a.style.fontFamily="sans-serif",a.style.position="absolute",a.style.top="10px",a.style.right="10px",a.style.padding="10px",a.innerHTML=`
    <option value="NoArrow">No arrow</option>
    <option value="Arrow">Arrows</option>
    <option value="DoubleArrow">Double-sided arrows</option>
  `,a.value="Arrow",document.body.append(a);const s=()=>{const u=a.value;e.forEachEdge((n,{curved:d})=>e.setEdgeAttribute(n,"type",`${d?"curved":"straight"}${u}`))};return s(),a.addEventListener("change",s),()=>{r.kill()}},De=`/**
 * This story is here to showcase straight and curved arrows and double-arrows
 * renderers.
 */
import EdgeCurveProgram, { EdgeCurvedArrowProgram, EdgeCurvedDoubleArrowProgram } from "@sigma/edge-curve";
import { MultiGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram, EdgeDoubleArrowProgram, EdgeRectangleProgram } from "sigma/rendering";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Create a graph, with various parallel edges:
  const graph = new MultiGraph();

  graph.addNode("a", { x: 0, y: 0, size: 10, label: "Alexandra" });
  graph.addNode("b", { x: 1, y: -1, size: 20, label: "Bastian" });
  graph.addNode("c", { x: 3, y: -2, size: 10, label: "Charles" });
  graph.addNode("d", { x: 1, y: -3, size: 10, label: "Dorothea" });
  graph.addNode("e", { x: 3, y: -4, size: 20, label: "Ernestine" });
  graph.addNode("f", { x: 4, y: -5, size: 10, label: "Fabian" });

  graph.addEdge("a", "b", { size: 5 });
  graph.addEdge("b", "c", { size: 6, curved: true });
  graph.addEdge("b", "d", { size: 5 });
  graph.addEdge("c", "b", { size: 5, curved: true });
  graph.addEdge("c", "e", { size: 9 });
  graph.addEdge("d", "c", { size: 5, curved: true });
  graph.addEdge("d", "e", { size: 5, curved: true });
  graph.addEdge("e", "d", { size: 4, curved: true });
  graph.addEdge("f", "e", { size: 7, curved: true });

  const renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    defaultEdgeType: "straightNoArrow",
    renderEdgeLabels: true,
    edgeProgramClasses: {
      straightNoArrow: EdgeRectangleProgram,
      curvedNoArrow: EdgeCurveProgram,
      straightArrow: EdgeArrowProgram,
      curvedArrow: EdgeCurvedArrowProgram,
      straightDoubleArrow: EdgeDoubleArrowProgram,
      curvedDoubleArrow: EdgeCurvedDoubleArrowProgram,
    },
  });

  // Add a form to play with arrow heads sides:
  const select = document.createElement("select") as HTMLSelectElement;
  select.style.fontFamily = "sans-serif";
  select.style.position = "absolute";
  select.style.top = "10px";
  select.style.right = "10px";
  select.style.padding = "10px";
  select.innerHTML = \`
    <option value="NoArrow">No arrow</option>
    <option value="Arrow">Arrows</option>
    <option value="DoubleArrow">Double-sided arrows</option>
  \`;
  select.value = "Arrow";
  document.body.append(select);

  const refreshEdgeTypes = () => {
    const suffix = select.value;
    graph.forEachEdge((edge, { curved }) =>
      graph.setEdgeAttribute(edge, "type", \`\${curved ? "curved" : "straight"}\${suffix}\`),
    );
  };
  refreshEdgeTypes();
  select.addEventListener("change", refreshEdgeTypes);

  return () => {
    renderer.kill();
  };
};
`,Be=[{key:"0.0",attributes:{x:268.72385,y:91.18155,size:22.714287,label:"Myriel",color:"#D8482D"}},{key:"1.0",attributes:{x:296.39902,y:57.118374,size:15,label:"Napoleon",color:"#B30000"}},{key:"2.0",attributes:{x:248.45229,y:52.22656,size:16.714285,label:"MlleBaptistine",color:"#BB100A"}},{key:"3.0",attributes:{x:224.83313,y:98.01885,size:16.714285,label:"MmeMagloire",color:"#BB100A"}},{key:"4.0",attributes:{x:270.9098,y:149.2961,size:15,label:"CountessDeLo",color:"#B30000"}},{key:"5.0",attributes:{x:318.6509,y:85.41602,size:15,label:"Geborand",color:"#B30000"}},{key:"6.0",attributes:{x:330.3126,y:117.94921,size:15,label:"Champtercier",color:"#B30000"}},{key:"7.0",attributes:{x:310.513,y:155.66956,size:15,label:"Cravatte",color:"#B30000"}},{key:"8.0",attributes:{x:295.74683,y:124.78035,size:15,label:"Count",color:"#B30000"}},{key:"9.0",attributes:{x:241.03372,y:131.8897,size:15,label:"OldMan",color:"#B30000"}},{key:"10.0",attributes:{x:-55.532795,y:-246.75798,size:15,label:"Labarre",color:"#B30000"}},{key:"11.0",attributes:{x:-8.81755,y:-60.480377,size:45,label:"Valjean",color:"#FEF0D9"}},{key:"12.0",attributes:{x:116.85369,y:-100.77216,size:15.857142,label:"Marguerite",color:"#B70805"}},{key:"13.0",attributes:{x:78.10812,y:-16.99423,size:15,label:"MmeDeR",color:"#B30000"}},{key:"14.0",attributes:{x:47.669666,y:-96.23158,size:15,label:"Isabeau",color:"#B30000"}},{key:"15.0",attributes:{x:20.945133,y:-118.35298,size:15,label:"Gervais",color:"#B30000"}},{key:"16.0",attributes:{x:232.50653,y:-165.75543,size:21.857143,label:"Tholomyes",color:"#D44028"}},{key:"17.0",attributes:{x:322.50223,y:-210.94756,size:20.142857,label:"Listolier",color:"#CC301E"}},{key:"18.0",attributes:{x:322.0389,y:-162.5361,size:20.142857,label:"Fameuil",color:"#CC301E"}},{key:"19.0",attributes:{x:282.84045,y:-234.37758,size:20.142857,label:"Blacheville",color:"#CC301E"}},{key:"20.0",attributes:{x:282.14212,y:-141.3707,size:20.142857,label:"Favourite",color:"#CC301E"}},{key:"21.0",attributes:{x:279.24896,y:-186.69917,size:20.142857,label:"Dahlia",color:"#CC301E"}},{key:"22.0",attributes:{x:240.49136,y:-212.45226,size:20.142857,label:"Zephine",color:"#CC301E"}},{key:"23.0",attributes:{x:185.86234,y:-128.47615,size:27,label:"Fantine",color:"#ED7047"}},{key:"24.0",attributes:{x:-15.730793,y:46.37429,size:23.57143,label:"MmeThenardier",color:"#DC5032"}},{key:"25.0",attributes:{x:3.6068764,y:98.60965,size:27.857143,label:"Thenardier",color:"#F1784C"}},{key:"26.0",attributes:{x:-69.92912,y:-15.777599,size:23.57143,label:"Cosette",color:"#DC5032"}},{key:"27.0",attributes:{x:54.198936,y:49.115128,size:28.714287,label:"Javert",color:"#F58051"}},{key:"28.0",attributes:{x:58.138313,y:-56.714897,size:17.571428,label:"Fauchelevent",color:"#BF180F"}},{key:"29.0",attributes:{x:97.39532,y:-157.35661,size:21,label:"Bamatabois",color:"#D03823"}},{key:"30.0",attributes:{x:157.66608,y:-88.86034,size:15.857142,label:"Perpetue",color:"#B70805"}},{key:"31.0",attributes:{x:130.24326,y:-62.113045,size:17.571428,label:"Simplice",color:"#BF180F"}},{key:"32.0",attributes:{x:-31.725157,y:-124.8531,size:15,label:"Scaufflaire",color:"#B30000"}},{key:"33.0",attributes:{x:45.4282,y:-2.6807823,size:15.857142,label:"Woman1",color:"#B70805"}},{key:"34.0",attributes:{x:-2.146402,y:-152.7878,size:19.285715,label:"Judge",color:"#C72819"}},{key:"35.0",attributes:{x:54.183117,y:-142.10239,size:19.285715,label:"Champmathieu",color:"#C72819"}},{key:"36.0",attributes:{x:-21.096437,y:-192.47128,size:19.285715,label:"Brevet",color:"#C72819"}},{key:"37.0",attributes:{x:56.919018,y:-184.99847,size:19.285715,label:"Chenildieu",color:"#C72819"}},{key:"38.0",attributes:{x:21.456747,y:-211.19899,size:19.285715,label:"Cochepaille",color:"#C72819"}},{key:"39.0",attributes:{x:-69.42261,y:66.22773,size:16.714285,label:"Pontmercy",color:"#BB100A"}},{key:"40.0",attributes:{x:52.13746,y:97.863976,size:15,label:"Boulatruelle",color:"#B30000"}},{key:"41.0",attributes:{x:-84.15585,y:140.50175,size:23.57143,label:"Eponine",color:"#DC5032"}},{key:"42.0",attributes:{x:-47.696083,y:112.90357,size:16.714285,label:"Anzelma",color:"#BB100A"}},{key:"43.0",attributes:{x:10.037987,y:7.8234367,size:16.714285,label:"Woman2",color:"#BB100A"}},{key:"44.0",attributes:{x:82.99555,y:-87.651726,size:15.857142,label:"MotherInnocent",color:"#B70805"}},{key:"45.0",attributes:{x:94.93769,y:-47.799778,size:15,label:"Gribier",color:"#B30000"}},{key:"46.0",attributes:{x:-293.23438,y:-146.10257,size:15,label:"Jondrette",color:"#B30000"}},{key:"47.0",attributes:{x:-294.94247,y:-108.07895,size:15.857142,label:"MmeBurgon",color:"#B70805"}},{key:"48.0",attributes:{x:-215.57619,y:34.40003,size:33,label:"Gavroche",color:"#FCA072"}},{key:"49.0",attributes:{x:-119.18742,y:-17.39732,size:20.142857,label:"Gillenormand",color:"#CC301E"}},{key:"50.0",attributes:{x:-57.473045,y:29.63873,size:15.857142,label:"Magnon",color:"#B70805"}},{key:"51.0",attributes:{x:-93.255005,y:-60.657784,size:20.142857,label:"MlleGillenormand",color:"#CC301E"}},{key:"52.0",attributes:{x:-93.764046,y:22.565668,size:15.857142,label:"MmePontmercy",color:"#B70805"}},{key:"53.0",attributes:{x:-132.14008,y:-66.85538,size:15,label:"MlleVaubois",color:"#B30000"}},{key:"54.0",attributes:{x:-95.75337,y:-102.71505,size:17.571428,label:"LtGillenormand",color:"#BF180F"}},{key:"55.0",attributes:{x:-142.15263,y:36.388676,size:30.428574,label:"Marius",color:"#FC8F5C"}},{key:"56.0",attributes:{x:-160.2533,y:-24.29684,size:15.857142,label:"BaronessT",color:"#B70805"}},{key:"57.0",attributes:{x:-267.16248,y:196.98003,size:23.57143,label:"Mabeuf",color:"#DC5032"}},{key:"58.0",attributes:{x:-190.88988,y:96.44671,size:27,label:"Enjolras",color:"#ED7047"}},{key:"59.0",attributes:{x:-222.5417,y:144.66484,size:23.57143,label:"Combeferre",color:"#DC5032"}},{key:"60.0",attributes:{x:-325.61102,y:166.71417,size:21.857143,label:"Prouvaire",color:"#D44028"}},{key:"61.0",attributes:{x:-276.3468,y:145.79153,size:23.57143,label:"Feuilly",color:"#DC5032"}},{key:"62.0",attributes:{x:-251.45561,y:97.83937,size:25.285713,label:"Courfeyrac",color:"#E5603D"}},{key:"63.0",attributes:{x:-318.40936,y:114.202415,size:24.428572,label:"Bahorel",color:"#E05837"}},{key:"64.0",attributes:{x:-278.9682,y:45.932438,size:25.285713,label:"Bossuet",color:"#E5603D"}},{key:"65.0",attributes:{x:-333.04984,y:62.438156,size:24.428572,label:"Joly",color:"#E05837"}},{key:"66.0",attributes:{x:-370.2446,y:101.73884,size:22.714287,label:"Grantaire",color:"#D8482D"}},{key:"67.0",attributes:{x:-253.54378,y:237.9443,size:15,label:"MotherPlutarch",color:"#B30000"}},{key:"68.0",attributes:{x:-16.550194,y:152.69055,size:22.714287,label:"Gueulemer",color:"#D8482D"}},{key:"69.0",attributes:{x:35.653145,y:144.49445,size:22.714287,label:"Babet",color:"#D8482D"}},{key:"70.0",attributes:{x:58.97649,y:188.46011,size:22.714287,label:"Claquesous",color:"#D8482D"}},{key:"71.0",attributes:{x:-2.9325058,y:200.66508,size:21.857143,label:"Montparnasse",color:"#D44028"}},{key:"72.0",attributes:{x:-30.056648,y:3.5053203,size:16.714285,label:"Toussaint",color:"#BB100A"}},{key:"73.0",attributes:{x:-244.859,y:-11.3161335,size:15.857142,label:"Child1",color:"#B70805"}},{key:"74.0",attributes:{x:-280.33203,y:-1.466383,size:15.857142,label:"Child2",color:"#B70805"}},{key:"75.0",attributes:{x:-56.819256,y:182.0544,size:20.142857,label:"Brujon",color:"#CC301E"}},{key:"76.0",attributes:{x:-382.06223,y:47.045475,size:20.142857,label:"MmeHucheloup",color:"#CC301E"}}],Me=JSON.parse('[{"key":"0","source":"1.0","target":"0.0","attributes":{"size":1}},{"key":"1","source":"2.0","target":"0.0","attributes":{"size":8}},{"key":"2","source":"3.0","target":"0.0","attributes":{"size":10}},{"key":"3","source":"3.0","target":"2.0","attributes":{"size":6}},{"key":"4","source":"4.0","target":"0.0","attributes":{"size":1}},{"key":"5","source":"5.0","target":"0.0","attributes":{"size":1}},{"key":"6","source":"6.0","target":"0.0","attributes":{"size":1}},{"key":"7","source":"7.0","target":"0.0","attributes":{"size":1}},{"key":"8","source":"8.0","target":"0.0","attributes":{"size":2}},{"key":"9","source":"9.0","target":"0.0","attributes":{"size":1}},{"key":"13","source":"11.0","target":"0.0","attributes":{"size":5}},{"key":"12","source":"11.0","target":"2.0","attributes":{"size":3}},{"key":"11","source":"11.0","target":"3.0","attributes":{"size":3}},{"key":"10","source":"11.0","target":"10.0","attributes":{"size":1}},{"key":"14","source":"12.0","target":"11.0","attributes":{"size":1}},{"key":"15","source":"13.0","target":"11.0","attributes":{"size":1}},{"key":"16","source":"14.0","target":"11.0","attributes":{"size":1}},{"key":"17","source":"15.0","target":"11.0","attributes":{"size":1}},{"key":"18","source":"17.0","target":"16.0","attributes":{"size":4}},{"key":"19","source":"18.0","target":"16.0","attributes":{"size":4}},{"key":"20","source":"18.0","target":"17.0","attributes":{"size":4}},{"key":"21","source":"19.0","target":"16.0","attributes":{"size":4}},{"key":"22","source":"19.0","target":"17.0","attributes":{"size":4}},{"key":"23","source":"19.0","target":"18.0","attributes":{"size":4}},{"key":"24","source":"20.0","target":"16.0","attributes":{"size":3}},{"key":"25","source":"20.0","target":"17.0","attributes":{"size":3}},{"key":"26","source":"20.0","target":"18.0","attributes":{"size":3}},{"key":"27","source":"20.0","target":"19.0","attributes":{"size":4}},{"key":"28","source":"21.0","target":"16.0","attributes":{"size":3}},{"key":"29","source":"21.0","target":"17.0","attributes":{"size":3}},{"key":"30","source":"21.0","target":"18.0","attributes":{"size":3}},{"key":"31","source":"21.0","target":"19.0","attributes":{"size":3}},{"key":"32","source":"21.0","target":"20.0","attributes":{"size":5}},{"key":"33","source":"22.0","target":"16.0","attributes":{"size":3}},{"key":"34","source":"22.0","target":"17.0","attributes":{"size":3}},{"key":"35","source":"22.0","target":"18.0","attributes":{"size":3}},{"key":"36","source":"22.0","target":"19.0","attributes":{"size":3}},{"key":"37","source":"22.0","target":"20.0","attributes":{"size":4}},{"key":"38","source":"22.0","target":"21.0","attributes":{"size":4}},{"key":"47","source":"23.0","target":"11.0","attributes":{"size":9}},{"key":"46","source":"23.0","target":"12.0","attributes":{"size":2}},{"key":"39","source":"23.0","target":"16.0","attributes":{"size":3}},{"key":"40","source":"23.0","target":"17.0","attributes":{"size":3}},{"key":"41","source":"23.0","target":"18.0","attributes":{"size":3}},{"key":"42","source":"23.0","target":"19.0","attributes":{"size":3}},{"key":"43","source":"23.0","target":"20.0","attributes":{"size":4}},{"key":"44","source":"23.0","target":"21.0","attributes":{"size":4}},{"key":"45","source":"23.0","target":"22.0","attributes":{"size":4}},{"key":"49","source":"24.0","target":"11.0","attributes":{"size":7}},{"key":"48","source":"24.0","target":"23.0","attributes":{"size":2}},{"key":"52","source":"25.0","target":"11.0","attributes":{"size":12}},{"key":"51","source":"25.0","target":"23.0","attributes":{"size":1}},{"key":"50","source":"25.0","target":"24.0","attributes":{"size":13}},{"key":"54","source":"26.0","target":"11.0","attributes":{"size":31}},{"key":"55","source":"26.0","target":"16.0","attributes":{"size":1}},{"key":"53","source":"26.0","target":"24.0","attributes":{"size":4}},{"key":"56","source":"26.0","target":"25.0","attributes":{"size":1}},{"key":"57","source":"27.0","target":"11.0","attributes":{"size":17}},{"key":"58","source":"27.0","target":"23.0","attributes":{"size":5}},{"key":"60","source":"27.0","target":"24.0","attributes":{"size":1}},{"key":"59","source":"27.0","target":"25.0","attributes":{"size":5}},{"key":"61","source":"27.0","target":"26.0","attributes":{"size":1}},{"key":"62","source":"28.0","target":"11.0","attributes":{"size":8}},{"key":"63","source":"28.0","target":"27.0","attributes":{"size":1}},{"key":"66","source":"29.0","target":"11.0","attributes":{"size":2}},{"key":"64","source":"29.0","target":"23.0","attributes":{"size":1}},{"key":"65","source":"29.0","target":"27.0","attributes":{"size":1}},{"key":"67","source":"30.0","target":"23.0","attributes":{"size":1}},{"key":"69","source":"31.0","target":"11.0","attributes":{"size":3}},{"key":"70","source":"31.0","target":"23.0","attributes":{"size":2}},{"key":"71","source":"31.0","target":"27.0","attributes":{"size":1}},{"key":"68","source":"31.0","target":"30.0","attributes":{"size":2}},{"key":"72","source":"32.0","target":"11.0","attributes":{"size":1}},{"key":"73","source":"33.0","target":"11.0","attributes":{"size":2}},{"key":"74","source":"33.0","target":"27.0","attributes":{"size":1}},{"key":"75","source":"34.0","target":"11.0","attributes":{"size":3}},{"key":"76","source":"34.0","target":"29.0","attributes":{"size":2}},{"key":"77","source":"35.0","target":"11.0","attributes":{"size":3}},{"key":"79","source":"35.0","target":"29.0","attributes":{"size":2}},{"key":"78","source":"35.0","target":"34.0","attributes":{"size":3}},{"key":"82","source":"36.0","target":"11.0","attributes":{"size":2}},{"key":"83","source":"36.0","target":"29.0","attributes":{"size":1}},{"key":"80","source":"36.0","target":"34.0","attributes":{"size":2}},{"key":"81","source":"36.0","target":"35.0","attributes":{"size":2}},{"key":"87","source":"37.0","target":"11.0","attributes":{"size":2}},{"key":"88","source":"37.0","target":"29.0","attributes":{"size":1}},{"key":"84","source":"37.0","target":"34.0","attributes":{"size":2}},{"key":"85","source":"37.0","target":"35.0","attributes":{"size":2}},{"key":"86","source":"37.0","target":"36.0","attributes":{"size":2}},{"key":"93","source":"38.0","target":"11.0","attributes":{"size":2}},{"key":"94","source":"38.0","target":"29.0","attributes":{"size":1}},{"key":"89","source":"38.0","target":"34.0","attributes":{"size":2}},{"key":"90","source":"38.0","target":"35.0","attributes":{"size":2}},{"key":"91","source":"38.0","target":"36.0","attributes":{"size":2}},{"key":"92","source":"38.0","target":"37.0","attributes":{"size":2}},{"key":"95","source":"39.0","target":"25.0","attributes":{"size":1}},{"key":"96","source":"40.0","target":"25.0","attributes":{"size":1}},{"key":"97","source":"41.0","target":"24.0","attributes":{"size":2}},{"key":"98","source":"41.0","target":"25.0","attributes":{"size":3}},{"key":"101","source":"42.0","target":"24.0","attributes":{"size":1}},{"key":"100","source":"42.0","target":"25.0","attributes":{"size":2}},{"key":"99","source":"42.0","target":"41.0","attributes":{"size":2}},{"key":"102","source":"43.0","target":"11.0","attributes":{"size":3}},{"key":"103","source":"43.0","target":"26.0","attributes":{"size":1}},{"key":"104","source":"43.0","target":"27.0","attributes":{"size":1}},{"key":"106","source":"44.0","target":"11.0","attributes":{"size":1}},{"key":"105","source":"44.0","target":"28.0","attributes":{"size":3}},{"key":"107","source":"45.0","target":"28.0","attributes":{"size":2}},{"key":"108","source":"47.0","target":"46.0","attributes":{"size":1}},{"key":"112","source":"48.0","target":"11.0","attributes":{"size":1}},{"key":"110","source":"48.0","target":"25.0","attributes":{"size":1}},{"key":"111","source":"48.0","target":"27.0","attributes":{"size":1}},{"key":"109","source":"48.0","target":"47.0","attributes":{"size":2}},{"key":"114","source":"49.0","target":"11.0","attributes":{"size":2}},{"key":"113","source":"49.0","target":"26.0","attributes":{"size":3}},{"key":"116","source":"50.0","target":"24.0","attributes":{"size":1}},{"key":"115","source":"50.0","target":"49.0","attributes":{"size":1}},{"key":"119","source":"51.0","target":"11.0","attributes":{"size":2}},{"key":"118","source":"51.0","target":"26.0","attributes":{"size":2}},{"key":"117","source":"51.0","target":"49.0","attributes":{"size":9}},{"key":"121","source":"52.0","target":"39.0","attributes":{"size":1}},{"key":"120","source":"52.0","target":"51.0","attributes":{"size":1}},{"key":"122","source":"53.0","target":"51.0","attributes":{"size":1}},{"key":"125","source":"54.0","target":"26.0","attributes":{"size":1}},{"key":"124","source":"54.0","target":"49.0","attributes":{"size":1}},{"key":"123","source":"54.0","target":"51.0","attributes":{"size":2}},{"key":"131","source":"55.0","target":"11.0","attributes":{"size":19}},{"key":"132","source":"55.0","target":"16.0","attributes":{"size":1}},{"key":"133","source":"55.0","target":"25.0","attributes":{"size":2}},{"key":"130","source":"55.0","target":"26.0","attributes":{"size":21}},{"key":"128","source":"55.0","target":"39.0","attributes":{"size":1}},{"key":"134","source":"55.0","target":"41.0","attributes":{"size":5}},{"key":"135","source":"55.0","target":"48.0","attributes":{"size":4}},{"key":"127","source":"55.0","target":"49.0","attributes":{"size":12}},{"key":"126","source":"55.0","target":"51.0","attributes":{"size":6}},{"key":"129","source":"55.0","target":"54.0","attributes":{"size":1}},{"key":"136","source":"56.0","target":"49.0","attributes":{"size":1}},{"key":"137","source":"56.0","target":"55.0","attributes":{"size":1}},{"key":"139","source":"57.0","target":"41.0","attributes":{"size":1}},{"key":"140","source":"57.0","target":"48.0","attributes":{"size":1}},{"key":"138","source":"57.0","target":"55.0","attributes":{"size":1}},{"key":"145","source":"58.0","target":"11.0","attributes":{"size":4}},{"key":"143","source":"58.0","target":"27.0","attributes":{"size":6}},{"key":"142","source":"58.0","target":"48.0","attributes":{"size":7}},{"key":"141","source":"58.0","target":"55.0","attributes":{"size":7}},{"key":"144","source":"58.0","target":"57.0","attributes":{"size":1}},{"key":"148","source":"59.0","target":"48.0","attributes":{"size":6}},{"key":"147","source":"59.0","target":"55.0","attributes":{"size":5}},{"key":"149","source":"59.0","target":"57.0","attributes":{"size":2}},{"key":"146","source":"59.0","target":"58.0","attributes":{"size":15}},{"key":"150","source":"60.0","target":"48.0","attributes":{"size":1}},{"key":"151","source":"60.0","target":"58.0","attributes":{"size":4}},{"key":"152","source":"60.0","target":"59.0","attributes":{"size":2}},{"key":"153","source":"61.0","target":"48.0","attributes":{"size":2}},{"key":"158","source":"61.0","target":"55.0","attributes":{"size":1}},{"key":"157","source":"61.0","target":"57.0","attributes":{"size":1}},{"key":"154","source":"61.0","target":"58.0","attributes":{"size":6}},{"key":"156","source":"61.0","target":"59.0","attributes":{"size":5}},{"key":"155","source":"61.0","target":"60.0","attributes":{"size":2}},{"key":"164","source":"62.0","target":"41.0","attributes":{"size":1}},{"key":"162","source":"62.0","target":"48.0","attributes":{"size":7}},{"key":"159","source":"62.0","target":"55.0","attributes":{"size":9}},{"key":"163","source":"62.0","target":"57.0","attributes":{"size":2}},{"key":"160","source":"62.0","target":"58.0","attributes":{"size":17}},{"key":"161","source":"62.0","target":"59.0","attributes":{"size":13}},{"key":"166","source":"62.0","target":"60.0","attributes":{"size":3}},{"key":"165","source":"62.0","target":"61.0","attributes":{"size":6}},{"key":"168","source":"63.0","target":"48.0","attributes":{"size":5}},{"key":"174","source":"63.0","target":"55.0","attributes":{"size":1}},{"key":"170","source":"63.0","target":"57.0","attributes":{"size":2}},{"key":"171","source":"63.0","target":"58.0","attributes":{"size":4}},{"key":"167","source":"63.0","target":"59.0","attributes":{"size":5}},{"key":"173","source":"63.0","target":"60.0","attributes":{"size":2}},{"key":"172","source":"63.0","target":"61.0","attributes":{"size":3}},{"key":"169","source":"63.0","target":"62.0","attributes":{"size":6}},{"key":"184","source":"64.0","target":"11.0","attributes":{"size":1}},{"key":"177","source":"64.0","target":"48.0","attributes":{"size":5}},{"key":"175","source":"64.0","target":"55.0","attributes":{"size":5}},{"key":"183","source":"64.0","target":"57.0","attributes":{"size":1}},{"key":"179","source":"64.0","target":"58.0","attributes":{"size":10}},{"key":"182","source":"64.0","target":"59.0","attributes":{"size":9}},{"key":"181","source":"64.0","target":"60.0","attributes":{"size":2}},{"key":"180","source":"64.0","target":"61.0","attributes":{"size":6}},{"key":"176","source":"64.0","target":"62.0","attributes":{"size":12}},{"key":"178","source":"64.0","target":"63.0","attributes":{"size":4}},{"key":"187","source":"65.0","target":"48.0","attributes":{"size":3}},{"key":"194","source":"65.0","target":"55.0","attributes":{"size":2}},{"key":"193","source":"65.0","target":"57.0","attributes":{"size":1}},{"key":"189","source":"65.0","target":"58.0","attributes":{"size":5}},{"key":"192","source":"65.0","target":"59.0","attributes":{"size":5}},{"key":"191","source":"65.0","target":"60.0","attributes":{"size":2}},{"key":"190","source":"65.0","target":"61.0","attributes":{"size":5}},{"key":"188","source":"65.0","target":"62.0","attributes":{"size":5}},{"key":"185","source":"65.0","target":"63.0","attributes":{"size":5}},{"key":"186","source":"65.0","target":"64.0","attributes":{"size":7}},{"key":"200","source":"66.0","target":"48.0","attributes":{"size":1}},{"key":"196","source":"66.0","target":"58.0","attributes":{"size":3}},{"key":"197","source":"66.0","target":"59.0","attributes":{"size":1}},{"key":"203","source":"66.0","target":"60.0","attributes":{"size":1}},{"key":"202","source":"66.0","target":"61.0","attributes":{"size":1}},{"key":"198","source":"66.0","target":"62.0","attributes":{"size":2}},{"key":"201","source":"66.0","target":"63.0","attributes":{"size":1}},{"key":"195","source":"66.0","target":"64.0","attributes":{"size":3}},{"key":"199","source":"66.0","target":"65.0","attributes":{"size":2}},{"key":"204","source":"67.0","target":"57.0","attributes":{"size":3}},{"key":"206","source":"68.0","target":"11.0","attributes":{"size":1}},{"key":"207","source":"68.0","target":"24.0","attributes":{"size":1}},{"key":"205","source":"68.0","target":"25.0","attributes":{"size":5}},{"key":"208","source":"68.0","target":"27.0","attributes":{"size":1}},{"key":"210","source":"68.0","target":"41.0","attributes":{"size":1}},{"key":"209","source":"68.0","target":"48.0","attributes":{"size":1}},{"key":"213","source":"69.0","target":"11.0","attributes":{"size":1}},{"key":"214","source":"69.0","target":"24.0","attributes":{"size":1}},{"key":"211","source":"69.0","target":"25.0","attributes":{"size":6}},{"key":"215","source":"69.0","target":"27.0","attributes":{"size":2}},{"key":"217","source":"69.0","target":"41.0","attributes":{"size":1}},{"key":"216","source":"69.0","target":"48.0","attributes":{"size":1}},{"key":"212","source":"69.0","target":"68.0","attributes":{"size":6}},{"key":"221","source":"70.0","target":"11.0","attributes":{"size":1}},{"key":"222","source":"70.0","target":"24.0","attributes":{"size":1}},{"key":"218","source":"70.0","target":"25.0","attributes":{"size":4}},{"key":"223","source":"70.0","target":"27.0","attributes":{"size":1}},{"key":"224","source":"70.0","target":"41.0","attributes":{"size":1}},{"key":"225","source":"70.0","target":"58.0","attributes":{"size":1}},{"key":"220","source":"70.0","target":"68.0","attributes":{"size":4}},{"key":"219","source":"70.0","target":"69.0","attributes":{"size":4}},{"key":"230","source":"71.0","target":"11.0","attributes":{"size":1}},{"key":"233","source":"71.0","target":"25.0","attributes":{"size":1}},{"key":"226","source":"71.0","target":"27.0","attributes":{"size":1}},{"key":"232","source":"71.0","target":"41.0","attributes":{"size":1}},{"key":"231","source":"71.0","target":"48.0","attributes":{"size":1}},{"key":"228","source":"71.0","target":"68.0","attributes":{"size":2}},{"key":"227","source":"71.0","target":"69.0","attributes":{"size":2}},{"key":"229","source":"71.0","target":"70.0","attributes":{"size":2}},{"key":"236","source":"72.0","target":"11.0","attributes":{"size":1}},{"key":"234","source":"72.0","target":"26.0","attributes":{"size":2}},{"key":"235","source":"72.0","target":"27.0","attributes":{"size":1}},{"key":"237","source":"73.0","target":"48.0","attributes":{"size":2}},{"key":"238","source":"74.0","target":"48.0","attributes":{"size":2}},{"key":"239","source":"74.0","target":"73.0","attributes":{"size":3}},{"key":"242","source":"75.0","target":"25.0","attributes":{"size":3}},{"key":"244","source":"75.0","target":"41.0","attributes":{"size":1}},{"key":"243","source":"75.0","target":"48.0","attributes":{"size":1}},{"key":"241","source":"75.0","target":"68.0","attributes":{"size":3}},{"key":"240","source":"75.0","target":"69.0","attributes":{"size":3}},{"key":"245","source":"75.0","target":"70.0","attributes":{"size":1}},{"key":"246","source":"75.0","target":"71.0","attributes":{"size":1}},{"key":"252","source":"76.0","target":"48.0","attributes":{"size":1}},{"key":"253","source":"76.0","target":"58.0","attributes":{"size":1}},{"key":"251","source":"76.0","target":"62.0","attributes":{"size":1}},{"key":"250","source":"76.0","target":"63.0","attributes":{"size":1}},{"key":"247","source":"76.0","target":"64.0","attributes":{"size":1}},{"key":"248","source":"76.0","target":"65.0","attributes":{"size":1}},{"key":"249","source":"76.0","target":"66.0","attributes":{"size":1}}]'),le={nodes:Be,edges:Me},Ge=()=>{const t=document.getElementById("sigma-container"),e=new ue;e.import(le);const r=new L(e,t,{allowInvalidContainer:!0,defaultEdgeType:"curve",edgeProgramClasses:{curve:G}});return()=>{r.kill()}},Fe=`import EdgeCurveProgram from "@sigma/edge-curve";
import Graph from "graphology";
import Sigma from "sigma";

import data from "./data/les-miserables.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();
  graph.import(data);

  const renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    defaultEdgeType: "curve",
    edgeProgramClasses: {
      curve: EdgeCurveProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
`,P=`<style>
  html,
  body,
  #storybook-root,
  #sigma-container {
    width: 100%;
    height: 100%;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden;
  }
</style>
<div id="sigma-container"></div>
`,Oe=()=>{const t=document.getElementById("sigma-container"),e=new ue;e.import(le);let r={type:"idle"};const a=new L(e,t,{allowInvalidContainer:!0,enableEdgeEvents:!0,defaultEdgeType:"curve",zIndex:!0,edgeProgramClasses:{curve:G},edgeReducer:(s,u)=>{const n={...u};return r.type==="hovered"&&(s===r.edge?(n.size=(n.size||1)*1.5,n.zIndex=1):(n.color="#f0f0f0",n.zIndex=0)),n},nodeReducer:(s,u)=>{const n={...u};return r.type==="hovered"&&(s===r.source||s===r.target?(n.highlighted=!0,n.zIndex=1):(n.label=void 0,n.zIndex=0)),n}});return a.on("enterEdge",({edge:s})=>{r={type:"hovered",edge:s,source:e.source(s),target:e.target(s)},a.refresh()}),a.on("leaveEdge",()=>{r={type:"idle"},a.refresh()}),()=>{a.kill()}},Ue=`import EdgeCurveProgram from "@sigma/edge-curve";
import Graph from "graphology";
import Sigma from "sigma";
import { EdgeDisplayData, NodeDisplayData } from "sigma/types";

import data from "./data/les-miserables.json";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  const graph = new Graph();
  graph.import(data);

  let state: { type: "idle" } | { type: "hovered"; edge: string; source: string; target: string } = { type: "idle" };
  const sigma = new Sigma(graph, container, {
    allowInvalidContainer: true,
    enableEdgeEvents: true,
    defaultEdgeType: "curve",
    zIndex: true,
    edgeProgramClasses: {
      curve: EdgeCurveProgram,
    },
    edgeReducer: (edge, attributes) => {
      const res: Partial<EdgeDisplayData> = { ...attributes };

      if (state.type === "hovered") {
        if (edge === state.edge) {
          res.size = (res.size || 1) * 1.5;
          res.zIndex = 1;
        } else {
          res.color = "#f0f0f0";
          res.zIndex = 0;
        }
      }

      return res;
    },
    nodeReducer: (node, attributes) => {
      const res: Partial<NodeDisplayData> = { ...attributes };

      if (state.type === "hovered") {
        if (node === state.source || node === state.target) {
          res.highlighted = true;
          res.zIndex = 1;
        } else {
          res.label = undefined;
          res.zIndex = 0;
        }
      }

      return res;
    },
  });

  sigma.on("enterEdge", ({ edge }) => {
    state = { type: "hovered", edge, source: graph.source(edge), target: graph.target(edge) };
    sigma.refresh();
  });
  sigma.on("leaveEdge", () => {
    state = { type: "idle" };
    sigma.refresh();
  });

  return () => {
    sigma.kill();
  };
};
`,Ve=()=>{const t=document.getElementById("sigma-container"),e=new $;e.addNode("a",{x:0,y:0,size:10,label:"Alexandra"}),e.addNode("b",{x:1,y:-1,size:20,label:"Bastian"}),e.addNode("c",{x:3,y:-2,size:10,label:"Charles"}),e.addNode("d",{x:1,y:-3,size:10,label:"Dorothea"}),e.addNode("e",{x:3,y:-4,size:20,label:"Ernestine"}),e.addNode("f",{x:4,y:-5,size:10,label:"Fabian"}),e.addEdge("a","b",{forceLabel:!0,size:2,label:"works with"}),e.addEdge("b","c",{forceLabel:!0,label:"works with",type:"curved",curvature:.5}),e.addEdge("b","d",{forceLabel:!0,label:"works with"}),e.addEdge("c","b",{forceLabel:!0,size:3,label:"works with",type:"curved"}),e.addEdge("c","e",{forceLabel:!0,size:3,label:"works with"}),e.addEdge("d","c",{forceLabel:!0,label:"works with",type:"curved",curvature:.1}),e.addEdge("d","e",{forceLabel:!0,label:"works with",type:"curved",curvature:1}),e.addEdge("e","d",{forceLabel:!0,size:2,label:"works with",type:"curved"}),e.addEdge("f","e",{forceLabel:!0,label:"works with",type:"curved"});const r=new L(e,t,{allowInvalidContainer:!0,defaultEdgeType:"straight",renderEdgeLabels:!0,edgeProgramClasses:{straight:X,curved:G}});return()=>{r.kill()}},$e=`import EdgeCurveProgram from "@sigma/edge-curve";
import { MultiGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Create a graph, with various parallel edges:
  const graph = new MultiGraph();

  graph.addNode("a", { x: 0, y: 0, size: 10, label: "Alexandra" });
  graph.addNode("b", { x: 1, y: -1, size: 20, label: "Bastian" });
  graph.addNode("c", { x: 3, y: -2, size: 10, label: "Charles" });
  graph.addNode("d", { x: 1, y: -3, size: 10, label: "Dorothea" });
  graph.addNode("e", { x: 3, y: -4, size: 20, label: "Ernestine" });
  graph.addNode("f", { x: 4, y: -5, size: 10, label: "Fabian" });

  graph.addEdge("a", "b", { forceLabel: true, size: 2, label: "works with" });
  graph.addEdge("b", "c", { forceLabel: true, label: "works with", type: "curved", curvature: 0.5 });
  graph.addEdge("b", "d", { forceLabel: true, label: "works with" });
  graph.addEdge("c", "b", { forceLabel: true, size: 3, label: "works with", type: "curved" });
  graph.addEdge("c", "e", { forceLabel: true, size: 3, label: "works with" });
  graph.addEdge("d", "c", { forceLabel: true, label: "works with", type: "curved", curvature: 0.1 });
  graph.addEdge("d", "e", { forceLabel: true, label: "works with", type: "curved", curvature: 1 });
  graph.addEdge("e", "d", { forceLabel: true, size: 2, label: "works with", type: "curved" });
  graph.addEdge("f", "e", { forceLabel: true, label: "works with", type: "curved" });

  const renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    defaultEdgeType: "straight",
    renderEdgeLabels: true,
    edgeProgramClasses: {
      straight: EdgeArrowProgram,
      curved: EdgeCurveProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
`;function U(t,e){if(e<=0)throw new Error("Invalid maxIndex");if(t<0)return-U(-t,e);const r=3.5;return r*(1-Math.exp(-e/r))*Y*t/e}const Xe=()=>{const t=document.getElementById("sigma-container"),e=new $;e.addNode("a1",{x:0,y:0,size:10}),e.addNode("b1",{x:10,y:0,size:20}),e.addNode("c1",{x:20,y:0,size:10}),e.addNode("d1",{x:30,y:0,size:10}),e.addNode("e1",{x:40,y:0,size:20}),e.addNode("a2",{x:0,y:-10,size:20}),e.addNode("b2",{x:10,y:-10,size:10}),e.addNode("c2",{x:20,y:-10,size:10}),e.addNode("d2",{x:30,y:-10,size:20}),e.addNode("e2",{x:40,y:-10,size:10}),e.addEdge("a1","b1",{size:6}),e.addEdge("b1","c1",{size:3}),e.addEdge("b1","c1",{size:6}),e.addEdge("c1","d1",{size:3}),e.addEdge("c1","d1",{size:6}),e.addEdge("c1","d1",{size:10}),e.addEdge("d1","e1",{size:3}),e.addEdge("d1","e1",{size:6}),e.addEdge("d1","e1",{size:10}),e.addEdge("d1","e1",{size:3}),e.addEdge("d1","e1",{size:10}),e.addEdge("a2","b2",{size:3}),e.addEdge("b2","a2",{size:6}),e.addEdge("b2","c2",{size:6}),e.addEdge("b2","c2",{size:10}),e.addEdge("c2","b2",{size:3}),e.addEdge("c2","b2",{size:3}),e.addEdge("c2","d2",{size:3}),e.addEdge("c2","d2",{size:6}),e.addEdge("c2","d2",{size:6}),e.addEdge("c2","d2",{size:10}),e.addEdge("d2","c2",{size:3}),e.addEdge("d2","e2",{size:3}),e.addEdge("d2","e2",{size:3}),e.addEdge("d2","e2",{size:3}),e.addEdge("d2","e2",{size:6}),e.addEdge("d2","e2",{size:10}),e.addEdge("e2","d2",{size:3}),e.addEdge("e2","d2",{size:3}),e.addEdge("e2","d2",{size:6}),e.addEdge("e2","d2",{size:6}),e.addEdge("e2","d2",{size:10}),Le(e,{edgeIndexAttribute:"parallelIndex",edgeMinIndexAttribute:"parallelMinIndex",edgeMaxIndexAttribute:"parallelMaxIndex"}),e.forEachEdge((a,{parallelIndex:s,parallelMinIndex:u,parallelMaxIndex:n})=>{typeof u=="number"?e.mergeEdgeAttributes(a,{type:s?"curved":"straight",curvature:U(s,n)}):typeof s=="number"?e.mergeEdgeAttributes(a,{type:"curved",curvature:U(s,n)}):e.setEdgeAttribute(a,"type","straight")});const r=new L(e,t,{allowInvalidContainer:!0,defaultEdgeType:"straight",edgeProgramClasses:{straight:X,curved:de}});return()=>{r.kill()}},Ye=`import { DEFAULT_EDGE_CURVATURE, EdgeCurvedArrowProgram, indexParallelEdgesIndex } from "@sigma/edge-curve";
import { MultiGraph } from "graphology";
import Sigma from "sigma";
import { EdgeArrowProgram } from "sigma/rendering";

function getCurvature(index: number, maxIndex: number): number {
  if (maxIndex <= 0) throw new Error("Invalid maxIndex");
  if (index < 0) return -getCurvature(-index, maxIndex);
  const amplitude = 3.5;
  const maxCurvature = amplitude * (1 - Math.exp(-maxIndex / amplitude)) * DEFAULT_EDGE_CURVATURE;
  return (maxCurvature * index) / maxIndex;
}

export default () => {
  const container = document.getElementById("sigma-container") as HTMLElement;

  // Create a graph, with various parallel edges:
  const graph = new MultiGraph();

  graph.addNode("a1", { x: 0, y: 0, size: 10 });
  graph.addNode("b1", { x: 10, y: 0, size: 20 });
  graph.addNode("c1", { x: 20, y: 0, size: 10 });
  graph.addNode("d1", { x: 30, y: 0, size: 10 });
  graph.addNode("e1", { x: 40, y: 0, size: 20 });
  graph.addNode("a2", { x: 0, y: -10, size: 20 });
  graph.addNode("b2", { x: 10, y: -10, size: 10 });
  graph.addNode("c2", { x: 20, y: -10, size: 10 });
  graph.addNode("d2", { x: 30, y: -10, size: 20 });
  graph.addNode("e2", { x: 40, y: -10, size: 10 });

  // Parallel edges in the same direction:
  graph.addEdge("a1", "b1", { size: 6 });
  graph.addEdge("b1", "c1", { size: 3 });
  graph.addEdge("b1", "c1", { size: 6 });
  graph.addEdge("c1", "d1", { size: 3 });
  graph.addEdge("c1", "d1", { size: 6 });
  graph.addEdge("c1", "d1", { size: 10 });
  graph.addEdge("d1", "e1", { size: 3 });
  graph.addEdge("d1", "e1", { size: 6 });
  graph.addEdge("d1", "e1", { size: 10 });
  graph.addEdge("d1", "e1", { size: 3 });
  graph.addEdge("d1", "e1", { size: 10 });

  // Parallel edges in both directions:
  graph.addEdge("a2", "b2", { size: 3 });
  graph.addEdge("b2", "a2", { size: 6 });

  graph.addEdge("b2", "c2", { size: 6 });
  graph.addEdge("b2", "c2", { size: 10 });
  graph.addEdge("c2", "b2", { size: 3 });
  graph.addEdge("c2", "b2", { size: 3 });

  graph.addEdge("c2", "d2", { size: 3 });
  graph.addEdge("c2", "d2", { size: 6 });
  graph.addEdge("c2", "d2", { size: 6 });
  graph.addEdge("c2", "d2", { size: 10 });
  graph.addEdge("d2", "c2", { size: 3 });

  graph.addEdge("d2", "e2", { size: 3 });
  graph.addEdge("d2", "e2", { size: 3 });
  graph.addEdge("d2", "e2", { size: 3 });
  graph.addEdge("d2", "e2", { size: 6 });
  graph.addEdge("d2", "e2", { size: 10 });
  graph.addEdge("e2", "d2", { size: 3 });
  graph.addEdge("e2", "d2", { size: 3 });
  graph.addEdge("e2", "d2", { size: 6 });
  graph.addEdge("e2", "d2", { size: 6 });
  graph.addEdge("e2", "d2", { size: 10 });

  // Use dedicated helper to identify parallel edges:
  indexParallelEdgesIndex(graph, {
    edgeIndexAttribute: "parallelIndex",
    edgeMinIndexAttribute: "parallelMinIndex",
    edgeMaxIndexAttribute: "parallelMaxIndex",
  });

  // Adapt types and curvature of parallel edges for rendering:
  graph.forEachEdge(
    (
      edge,
      {
        parallelIndex,
        parallelMinIndex,
        parallelMaxIndex,
      }:
        | { parallelIndex: number; parallelMinIndex?: number; parallelMaxIndex: number }
        | { parallelIndex?: null; parallelMinIndex?: null; parallelMaxIndex?: null },
    ) => {
      if (typeof parallelMinIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: parallelIndex ? "curved" : "straight",
          curvature: getCurvature(parallelIndex, parallelMaxIndex),
        });
      } else if (typeof parallelIndex === "number") {
        graph.mergeEdgeAttributes(edge, {
          type: "curved",
          curvature: getCurvature(parallelIndex, parallelMaxIndex),
        });
      } else {
        graph.setEdgeAttribute(edge, "type", "straight");
      }
    },
  );

  const renderer = new Sigma(graph, container, {
    allowInvalidContainer: true,
    defaultEdgeType: "straight",
    edgeProgramClasses: {
      straight: EdgeArrowProgram,
      curved: EdgeCurvedArrowProgram,
    },
  });

  return () => {
    renderer.kill();
  };
};
`,Qe={id:"@sigma/edge-curve",title:"Satellite packages/@sigma--edge-curve"},Ze={name:"Basic example",render:()=>P,play:N(Ge),args:{},parameters:{storySource:{source:Fe}}},He={name:"Interactions",render:()=>P,play:N(Oe),args:{},parameters:{storySource:{source:Ue}}},et={name:"Labels",render:()=>P,play:N(Ve),args:{},parameters:{storySource:{source:$e}}},tt={name:"Parallel edges",render:()=>P,play:N(Xe),args:{},parameters:{storySource:{source:Ye}}},rt={name:"Arrow heads",render:()=>P,play:N(Pe),args:{},parameters:{storySource:{source:De}}};export{rt as arrowHeads,Ze as basic,Qe as default,He as interactions,et as labels,tt as parallelEdges};
