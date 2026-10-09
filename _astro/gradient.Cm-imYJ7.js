import{w as h}from"./graphology.BwGEgIxD.js";function g(a){const t=a.map(e=>e.offset);t[0]===void 0&&(t[0]=0),t[a.length-1]===void 0&&(t[a.length-1]=1);let l=0;for(let e=0;e<t.length;e++){const o=t[e];o!==void 0&&(l=Math.max(l,Math.min(Math.max(o,0),1)),t[e]=l)}for(let e=1;e<t.length;e++){if(t[e]!==void 0)continue;let o=e+1;for(;t[o]===void 0;)o++;const s=t[e-1],i=t[o];for(let c=e;c<o;c++)t[c]=s+(i-s)*(c-e+1)/(o-e+1);e=o}return t}function v(a){if(a.stops.length<2)throw new Error("layerGradient: at least two stops are required");const t=a.stops.map(r=>typeof r=="string"?{color:r,offset:void 0}:{color:"color"in r?r.color:r,offset:r.offset}),l=g(t),e=t.map((r,n)=>h(r.color,`gradientStop${n}`)),o=a.enabled,s=e.flatMap(r=>r.attributes);o&&s.push({name:"a_gradient",size:1,type:WebGL2RenderingContext.FLOAT,source:o.attribute,defaultValue:o.default??!0});const i=l.map((r,n)=>{if(n===0)return"";const f=l[n-1].toFixed(6),d=Math.max(r-l[n-1],1e-6).toFixed(6);return`
  vec4 c${n} = ${e[n].glsl};
  color = mix(color, vec4(c${n}.rgb * c${n}.a, c${n}.a), clamp((ctx.t - ${f}) / ${d}, 0.0, 1.0));`}).join("");return{name:"gradient",glsl:`
// Gradient layer: interpolates the color stops over the visible span of the
// edge (ctx.t is 0 where the edge leaves the source node, 1 where it reaches
// the target node). Interpolation happens in premultiplied space so fading to
// a (semi-)transparent stop keeps the hue instead of darkening through black;
// the returned color is straight-alpha, matching the blendOver convention.
vec4 layer_gradient(EdgeContext ctx) {${o?`
  // Per-edge toggle: fall through to the layers below when disabled
  if (v_gradient < 0.5) return vec4(0.0);
`:""}
  vec4 c0 = ${e[0].glsl};
  vec4 color = vec4(c0.rgb * c0.a, c0.a);${i}
  return color.a > 0.0 ? vec4(color.rgb / color.a, color.a) : vec4(0.0);
}
`,uniforms:[],attributes:s,needsNodeColors:e.some(r=>r.needsNodeColors)}}export{v as l};
