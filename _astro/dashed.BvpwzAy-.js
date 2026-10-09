import{w as m,s as _}from"./graphology.BwGEgIxD.js";const y="pixels",C="butt";function b(t){return t===void 0||t===!1?{tail:!1,head:!1}:t===!0?{tail:!0,head:!0}:t==="head"?{tail:!1,head:!0}:{tail:!0,head:!1}}function L(t){return t===void 0?{tail:0,head:0}:typeof t=="number"?{tail:t,head:t}:{tail:t.tail??0,head:t.head??0}}function D(t){const s=t??{},z=s.dashColor??{attribute:"color"},i=s.gapColor??0,a={dashSize:s.dashSize??{value:10,mode:"pixels"},gapSize:s.gapSize??{value:10,mode:"pixels"},dashOffset:s.dashOffset??{value:0,mode:"pixels"}},x=s.align??.5,S=s.cap??C,c=b(s.solidExtremities),u=L(s.solidMargin),o=m(z,"dashColor"),n=[{name:"u_sizeMode",type:"vec3",value:[a.dashSize,a.gapSize,a.dashOffset].map(e=>(e.mode??y)==="relative"?1:0)},{name:"u_align",type:"float",value:x},{name:"u_solidExtremities",type:"vec2",value:[c.tail?1:0,c.head?1:0]},{name:"u_solidMargin",type:"vec2",value:[u.tail,u.head]}],r=[...o.attributes];let d=o.needsNodeColors,l;if(typeof i=="number")l=`vec4(dashColor.rgb, dashColor.a * ${_(i)})`;else{const e=m(i,"gapColor");l=e.glsl,r.push(...e.attributes),d=d||e.needsNodeColors}const f=!("value"in a.dashSize),g=!("value"in a.gapSize),p=!("value"in a.dashOffset);["dashSize","gapSize","dashOffset"].forEach(e=>{"value"in a[e]?n.push({name:`u_${e}`,type:"float",value:a[e].value}):(r.push({name:`a_${e}`,size:1,type:WebGL2RenderingContext.FLOAT,source:a[e].attribute}),n.push({name:`u_${e}`,type:"float",value:a[e].default??0}))});const h=(e,v)=>v?`(v_${e} > 0.0 ? v_${e} : u_${e})`:`u_${e}`;return{name:"dashed",glsl:`
// Dashed pattern layer with antialiased boundaries
// Uniforms:
//   u_dashSize: size of each dash (or default when using attribute)
//   u_gapSize: size of gaps between dashes (or default when using attribute)
//   u_dashOffset: offset to shift the pattern (or default when using attribute)
//   u_sizeMode: vec3 indicating if values are thickness-relative (x=dash, y=gap, z=offset)
//   u_align: pattern alignment (0=start, 0.5=center, 1=end)
//   u_solidExtremities: vec2(tail, head) - 1.0 means solid, 0.0 means dashed
//   u_solidMargin: vec2(tail, head) - extra solid margin in pixels
${f?"// Varying: v_dashSize for per-edge dash size":""}
${g?"// Varying: v_gapSize for per-edge gap size":""}
${p?"// Varying: v_dashOffset for per-edge dash offset":""}

vec4 layer_dashed(EdgeContext ctx) {
  // Dash color (straight alpha, matching v_color and blendOver)
  vec4 dashColor = ${o.glsl};

  // Check for solid zones first (extremities and margins)
  // v_zone: 0=tail extremity, 1=body, 2=head extremity
  // v_tailLengthRatio and v_headLengthRatio give extremity lengths as ratio of thickness

  // Tail solid zone check
  if (u_solidExtremities.x > 0.5 && v_zone < 0.5) {
    // In tail extremity zone and solidExtremities.tail is enabled
    return dashColor;
  }
  // Head solid zone check
  if (u_solidExtremities.y > 0.5 && v_zone > 1.5) {
    // In head extremity zone and solidExtremities.head is enabled
    return dashColor;
  }

  // Compute extremity lengths in world units for margin calculation
  float tailExtremityLength = v_tailLengthRatio * ctx.thickness;
  float headExtremityLength = v_headLengthRatio * ctx.thickness;

  // Convert pixel margins to world units (same formula as thickness conversion)
  float tailMarginWorld = u_solidMargin.x * u_correctionRatio / u_sizeRatio;
  float headMarginWorld = u_solidMargin.y * u_correctionRatio / u_sizeRatio;

  // Tail margin check (margin starts after extremity zone)
  float tailSolidZone = (u_solidExtremities.x > 0.5 ? tailExtremityLength : 0.0) + tailMarginWorld;
  if (ctx.distanceFromSource < tailSolidZone) {
    return dashColor;
  }

  // Head margin check (margin starts before extremity zone)
  float headSolidZone = (u_solidExtremities.y > 0.5 ? headExtremityLength : 0.0) + headMarginWorld;
  if (ctx.distanceToTarget < headSolidZone) {
    return dashColor;
  }

  // Get dash size values (from attribute if available, otherwise uniform)
  float dashSizeValue = ${h("dashSize",f)};
  float gapSizeValue = ${h("gapSize",g)};
  float dashOffsetValue = ${h("dashOffset",p)};

  // Compute actual sizes (either in pixels converted to world units, or relative to thickness)
  float pixelToWorld = u_correctionRatio / u_sizeRatio;
  float dashSize = dashSizeValue * (u_sizeMode.x > 0.5 ? ctx.thickness : pixelToWorld);
  float gapSize = gapSizeValue * (u_sizeMode.y > 0.5 ? ctx.thickness : pixelToWorld);
  float dashOffset = dashOffsetValue * (u_sizeMode.z > 0.5 ? ctx.thickness : pixelToWorld);

  // Early return when no visible dash pattern:
  // - dashSize ≈ 0: no dashes to show, return transparent (let plain layer show through)
  // - gapSize ≈ 0: all dash/no gap, effectively solid, return transparent (let plain layer handle it)
  // Threshold scales with pixelToWorld so it stays ~0.1px regardless of zoom
  float dashThreshold = 0.1 * pixelToWorld;
  if (dashSize < dashThreshold || gapSize < dashThreshold) {
    return vec4(0.0);
  }

  // Pattern length is dash + gap
  float patternLength = dashSize + gapSize;

  // Adjust distances for solid zones (pattern starts after solid zones)
  float adjustedDistFromSource = ctx.distanceFromSource - tailSolidZone;
  float adjustedDistToTarget = ctx.distanceToTarget - headSolidZone;

  // Compute alignment anchor point
  // - align: 0 → anchor at start, pattern begins with a dash
  // - align: 1 → anchor at end, pattern ends with a dash
  // - align: 0.5 → anchor at center, pattern is symmetric
  float dashedLength = adjustedDistFromSource + adjustedDistToTarget;
  float anchorDist = u_align * dashedLength;

  // Position within the repeating pattern
  // By subtracting anchorDist, we ensure the anchor point maps to position 0 in the pattern
  // This avoids the unstable mod(dashedLength, patternLength) operation
  float posInPattern = mod(adjustedDistFromSource - anchorDist + dashOffset, patternLength);

  // Signed longitudinal distance to the nearest dash center, wrapping across
  // pattern repetitions so both dash edges antialias correctly
  float longFromCenter =
    mod(posInPattern - dashSize * 0.5 + patternLength * 0.5, patternLength) - patternLength * 0.5;

  // Compute signed distance field for the dash
  // Positive inside dash, negative inside gap
${S==="round"?`  // Capsule SDF: round caps carved inside the dash length, so a dash never
  // exceeds dashSize. Dashes shorter than the thickness degenerate to circles
  // (dots) of diameter dashSize.
  // ctx.sdf is 0 at the stroke boundary, so shift it back to centerline distance
  float transverse = ctx.sdf + ctx.thickness * 0.5;
  float capRadius = min(ctx.thickness, dashSize) * 0.5;
  float halfLength = dashSize * 0.5 - capRadius;
  vec2 q = vec2(max(abs(longFromCenter) - halfLength, 0.0), transverse);
  float sdf = capRadius - length(q);`:"  float sdf = dashSize * 0.5 - abs(longFromCenter);"}

  // Apply antialiasing using smoothstep
  // aaWidth is in world units, same as our distance
  float dashAlpha = smoothstep(-ctx.aaWidth, ctx.aaWidth, sdf);

  // Gap color (straight alpha, like the dash color)
  vec4 gapColor = ${l};

  // Blend between gap and dash colors
  return mix(gapColor, dashColor, dashAlpha);
}
`,uniforms:n,attributes:r,needsNodeColors:d}}export{D as l};
