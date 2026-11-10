import{u as e}from"./graphology.DvPOi-Ni.js";function t(e){let t=e.map(e=>e.offset);t[0]===void 0&&(t[0]=0),t[e.length-1]===void 0&&(t[e.length-1]=1);let n=0;for(let e=0;e<t.length;e++){let r=t[e];r!==void 0&&(n=Math.max(n,Math.min(Math.max(r,0),1)),t[e]=n)}for(let e=1;e<t.length;e++){if(t[e]!==void 0)continue;let n=e+1;for(;t[n]===void 0;)n++;let r=t[e-1],i=t[n];for(let a=e;a<n;a++)t[a]=r+(i-r)*(a-e+1)/(n-e+1);e=n}return t}function n(n){if(n.stops.length<2)throw Error(`layerGradient: at least two stops are required`);let r=n.stops.map(e=>typeof e==`string`?{color:e,offset:void 0}:{color:`color`in e?e.color:e,offset:e.offset}),i=t(r),a=r.map((t,n)=>e(t.color,`gradientStop${n}`)),o=n.enabled,s=a.flatMap(e=>e.attributes);o&&s.push({name:`a_gradient`,size:1,type:WebGL2RenderingContext.FLOAT,source:o.attribute,defaultValue:o.default??!0});let c=i.map((e,t)=>{if(t===0)return``;let n=i[t-1].toFixed(6),r=Math.max(e-i[t-1],1e-6).toFixed(6);return`
  vec4 c${t} = ${a[t].glsl};
  color = mix(color, vec4(c${t}.rgb * c${t}.a, c${t}.a), clamp((ctx.t - ${n}) / ${r}, 0.0, 1.0));`}).join(``);return{name:`gradient`,glsl:`
// Gradient layer: interpolates the color stops over the visible span of the
// edge (ctx.t is 0 where the edge leaves the source node, 1 where it reaches
// the target node). Interpolation happens in premultiplied space so fading to
// a (semi-)transparent stop keeps the hue instead of darkening through black;
// the returned color is straight-alpha, matching the blendOver convention.
vec4 layer_gradient(EdgeContext ctx) {${o?`
  // Per-edge toggle: fall through to the layers below when disabled
  if (v_gradient < 0.5) return vec4(0.0);
`:``}
  vec4 c0 = ${a[0].glsl};
  vec4 color = vec4(c0.rgb * c0.a, c0.a);${c}
  return color.a > 0.0 ? vec4(color.rgb / color.a, color.a) : vec4(0.0);
}
`,uniforms:[],attributes:s,needsNodeColors:a.some(e=>e.needsNodeColors)}}export{n as t};