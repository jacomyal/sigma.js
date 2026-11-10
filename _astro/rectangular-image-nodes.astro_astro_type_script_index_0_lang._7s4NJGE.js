import{t as e}from"./layer.XUkk3sO7.js";import{T as t,f as n,i as r,m as i,n as a,x as o}from"./graphology.DvPOi-Ni.js";import{t as s}from"./arrow.BsqU9xg_.js";import{t as c}from"./curved.OkB8Gikv.js";import{t as l}from"./_controls.DxjZImZY.js";import{t as u}from"./small-graph.DE4MUY7S.js";function d(e){let{aspectRatio:n={attribute:`aspectRatio`},cornerRadius:r,rotation:a}=e??{},s=`
${o}
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
`,c=[{name:`u_cornerRadius`,type:`float`,value:typeof r==`number`?r:0},{name:`u_rotation`,type:`float`,value:typeof a==`number`?a:0}],l=e=>`0.70710678 / max(${e}, 1.0 / ${e})`;if(!i(n))return{name:`rectangle`,glsl:s,uniforms:[...c,{name:`u_aspectRatio`,type:`float`,value:n}],inradiusFactor:Math.SQRT1_2,inradiusFactorGLSL:l(t(n))};let{attribute:u,default:d=1}=n;return{name:`rectangle`,glsl:s,uniforms:c,attributes:[{name:`aspectRatio`,size:1,type:WebGL2RenderingContext.FLOAT,source:u}],variables:{[u]:{type:`number`,default:d}},inradiusFactor:Math.SQRT1_2,inradiusFactorGLSL:l(`v_aspectRatio`)}}var f=document.getElementById(`sigma-container`),{objectFit:p}=l({objectFit:{type:`select`,label:`Object fit`,default:`contain`,options:[{label:`Contain`,value:`contain`},{label:`Cover`,value:`cover`}]}}),m={a:{id:10,width:600,height:400},b:{id:15,width:400,height:600},c:{id:28,width:600,height:600},d:{id:29,width:800,height:300},e:{id:37,width:300,height:800},f:{id:42,width:500,height:350}},h=u();h.forEachNode(e=>{let{id:t,width:n,height:r}=m[e];h.mergeNodeAttributes(e,{image:`https://picsum.photos/id/${t}/${n}/${r}`,aspectRatio:n/r,label:`${n} x ${r}`})}),new a(h,f,{primitives:{nodes:{shapes:[d({cornerRadius:.2})],variables:{image:{type:`string`,default:``}},layers:[n({color:`#eee`}),e({textureManagerOptions:{objectFit:p}})]},edges:{paths:[c({curvature:.5})],extremities:[s({lengthRatio:4,widthRatio:4})]}},styles:{nodes:[r.nodes,{backdropArea:`label`,labelPosition:`below`,size:40}],edges:[r.edges,{path:`curved`,head:`arrow`,size:8}]},settings:{autoRescaleContent:`nodes`}});