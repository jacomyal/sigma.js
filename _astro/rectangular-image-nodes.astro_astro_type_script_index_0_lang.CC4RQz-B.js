import{m as p,G as m,s as h,S as f,a as d,n as g}from"./graphology.BwGEgIxD.js";import{r as b}from"./_controls.BjInEjVR.js";import{g as R}from"./small-graph.D6DIB7I0.js";import{e as v}from"./arrow.BEykAiMF.js";import{p as y}from"./curved.CciR-gGH.js";import{l as x}from"./layer.CzMdmixX.js";import"./schema.DPqDLh61.js";function S(i){const{aspectRatio:t={attribute:"aspectRatio"},cornerRadius:e,rotation:a}=i??{},s=`
${m}
float sdf_rectangle(vec2 uv, float size, float cornerRadius, float rotation, float aspectRatio) {
  // Apply rotation if needed
  vec2 p = uv;
  if (rotation != 0.0) {
    p = rotate2D(rotation) * p;
  }

  vec2 halfExtent = aspectRatio >= 1.0 ? vec2(size, size / aspectRatio) : vec2(size * aspectRatio, size);
  // Keeps thin rectangles from growing past their half extent
  float radius = min(cornerRadius, min(halfExtent.x, halfExtent.y));

  // Based on Inigo Quilez's box SDF: https://iquilezles.org/articles/distfunctions2d/
  vec2 d = abs(p) - (halfExtent - radius);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
}
`,r=[{name:"u_cornerRadius",type:"float",value:typeof e=="number"?e:0},{name:"u_rotation",type:"float",value:typeof a=="number"?a:0}],n=c=>`0.70710678 / max(${c}, 1.0 / ${c})`;if(!p(t))return{name:"rectangle",glsl:s,uniforms:[...r,{name:"u_aspectRatio",type:"float",value:t}],inradiusFactor:Math.SQRT1_2,inradiusFactorGLSL:n(h(t))};const{attribute:l,default:u=1}=t;return{name:"rectangle",glsl:s,uniforms:r,attributes:[{name:"aspectRatio",size:1,type:WebGL2RenderingContext.FLOAT,source:l}],variables:{[l]:{type:"number",default:u}},inradiusFactor:Math.SQRT1_2,inradiusFactorGLSL:n("v_aspectRatio")}}const L=document.getElementById("sigma-container"),{objectFit:w}=b({objectFit:{type:"select",label:"Object fit",default:"contain",options:[{label:"Contain",value:"contain"},{label:"Cover",value:"cover"}]}}),F={a:{id:10,width:600,height:400},b:{id:15,width:400,height:600},c:{id:28,width:600,height:600},d:{id:29,width:800,height:300},e:{id:37,width:300,height:800},f:{id:42,width:500,height:350}},o=R();o.forEachNode(i=>{const{id:t,width:e,height:a}=F[i];o.mergeNodeAttributes(i,{image:`https://picsum.photos/id/${t}/${e}/${a}`,aspectRatio:e/a,label:`${e} x ${a}`})});new f(o,L,{primitives:{nodes:{shapes:[S({cornerRadius:.2})],variables:{image:{type:"string",default:""}},layers:[g({color:"#eee"}),x({textureManagerOptions:{objectFit:w}})]},edges:{paths:[y({})],extremities:[v({lengthRatio:4,widthRatio:4})]}},styles:{nodes:[d.nodes,{backdropArea:"label",labelPosition:"below",size:40}],edges:[d.edges,{path:"curved",head:"arrow",size:8}]},settings:{autoRescaleContent:"nodes"}});
