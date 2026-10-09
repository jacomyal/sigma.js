import{W as E,Q as h}from"./bind-webgl-layer.SELYzwHf.js";import{r as m,p as c,q as _}from"./graphology.BwGEgIxD.js";function R(){return`#version 300 es
precision highp float;

in vec2 v_offset;
in float v_weight;

out vec4 fragColor;

void main() {
  float dist = length(v_offset);
  if (dist > 1.0) discard;
  float score = smoothstep(1.0, 0.0, dist) * v_weight;
  fragColor = vec4(score, 0.0, 0.0, 0.0);
}
  `}function x(){return`#version 300 es
in vec2 a_position;

uniform sampler2D u_nodesTexture;
uniform int u_nodesTextureWidth;
uniform mat3 u_matrix;
uniform float u_radius;
uniform float u_correctionRatio;
uniform float u_zoomModifier;

out vec2 v_offset;
out float v_weight;

void main() {
  vec3 nodeData = texelFetch(u_nodesTexture, ivec2(gl_InstanceID % u_nodesTextureWidth, gl_InstanceID / u_nodesTextureWidth), 0).xyz;
  vec2 nodePos = nodeData.xy;
  v_weight = nodeData.z;

  float factor = 0.5 / u_correctionRatio;
  float radius = u_radius * u_zoomModifier;
  float correctedRadius = radius / factor;

  vec2 worldPos = nodePos + a_position * correctedRadius;
  vec3 clip = u_matrix * vec3(worldPos, 1.0);

  gl_Position = vec4(clip.xy, 0.0, 1.0);
  v_offset = a_position;
}
  `}const D=new Float32Array(h);function A(o,d,s){const{radius:T,zoomToRadiusRatioFunction:f,getWeight:n}=d;return class extends E{nodesTexture;nodesTextureWidth;nodesDataArray;nodeCount=0;splatProgram;splatBuffer;splatPositionLocation;splatUniforms;densityFBO;densityTexture;densityWidth=0;densityHeight=0;constructor(t,e,r){if(super(t,e,r),!t.getExtension("EXT_color_buffer_float"))throw new Error("createDensitySplatProgram: EXT_color_buffer_float extension is required");t.activeTexture(t.TEXTURE0),this.nodesTextureWidth=Math.min(o.length||1,t.getParameter(t.MAX_TEXTURE_SIZE)),this.nodesDataArray=new Float32Array(o.length*3),this.nodesTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.nodesTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST);const i=m(t,x()),a=c(t,R());this.splatProgram=_(t,[i,a]),t.deleteShader(i),t.deleteShader(a),this.splatPositionLocation=t.getAttribLocation(this.splatProgram,"a_position"),this.splatUniforms={u_nodesTexture:t.getUniformLocation(this.splatProgram,"u_nodesTexture"),u_nodesTextureWidth:t.getUniformLocation(this.splatProgram,"u_nodesTextureWidth"),u_matrix:t.getUniformLocation(this.splatProgram,"u_matrix"),u_radius:t.getUniformLocation(this.splatProgram,"u_radius"),u_correctionRatio:t.getUniformLocation(this.splatProgram,"u_correctionRatio"),u_zoomModifier:t.getUniformLocation(this.splatProgram,"u_zoomModifier")},this.splatBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.splatBuffer),t.bufferData(t.ARRAY_BUFFER,D,t.STATIC_DRAW),t.useProgram(this.splatProgram),t.uniform1i(this.splatUniforms.u_nodesTexture,0),this.densityFBO=t.createFramebuffer(),this.densityTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.densityTexture),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}updateNodesData(){let t=0;for(const e of o){const r=this.renderer.getNodeDisplayData(e);r&&(this.nodesDataArray[t*3]=r.x,this.nodesDataArray[t*3+1]=r.y,this.nodesDataArray[t*3+2]=n?n(e):1,t++)}this.nodeCount=t}ensureDensityTextureSize(t,e){if(this.densityWidth===t&&this.densityHeight===e)return;const r=this.normalProgram.gl;r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,this.densityTexture),r.texImage2D(r.TEXTURE_2D,0,r.R32F,t,e,0,r.RED,r.FLOAT,null),r.bindFramebuffer(r.FRAMEBUFFER,this.densityFBO),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,this.densityTexture,0);const i=r.checkFramebufferStatus(r.FRAMEBUFFER);if(i!==r.FRAMEBUFFER_COMPLETE)throw new Error(`Density framebuffer incomplete (status 0x${i.toString(16)})`);this.densityWidth=t,this.densityHeight=e}getCustomLayerDefinition(){return s.definition}setCameraUniforms(t,e){s.setCameraUniforms&&s.setCameraUniforms(t,e)}cacheDataUniforms(t){s.cacheUniforms(t)}preRender(t){if(this.nodeCount===0)return;const e=this.normalProgram.gl,r=e.canvas;this.ensureDensityTextureSize(r.width,r.height),e.bindFramebuffer(e.FRAMEBUFFER,this.densityFBO),e.viewport(0,0,this.densityWidth,this.densityHeight),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.useProgram(this.splatProgram),e.uniformMatrix3fv(this.splatUniforms.u_matrix,!1,t.matrix),e.uniform1f(this.splatUniforms.u_correctionRatio,t.correctionRatio),e.uniform1f(this.splatUniforms.u_zoomModifier,1/f(t.zoomRatio)),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.nodesTexture),e.bindBuffer(e.ARRAY_BUFFER,this.splatBuffer),e.enableVertexAttribArray(this.splatPositionLocation),e.vertexAttribPointer(this.splatPositionLocation,2,e.FLOAT,!1,0,0),e.drawArraysInstanced(e.TRIANGLE_STRIP,0,4,this.nodeCount),e.disableVertexAttribArray(this.splatPositionLocation)}render(t){const e=this.normalProgram.gl;e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.densityTexture),this.bindProgram(this.normalProgram),this.renderProgram(t,this.normalProgram),this.unbindProgram(this.normalProgram)}cacheData(){super.cacheData();const t=this.normalProgram.gl;t.useProgram(this.splatProgram),t.uniform1f(this.splatUniforms.u_radius,T),t.uniform1i(this.splatUniforms.u_nodesTextureWidth,this.nodesTextureWidth),this.updateNodesData();const e=this.nodesTextureWidth,r=Math.ceil(this.nodeCount/e)||1,i=this.nodesDataArray.subarray(0,this.nodeCount*3);t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.nodesTexture);const a=e*r*3;if(this.nodeCount*3<a){const u=new Float32Array(a);u.set(i),t.texImage2D(t.TEXTURE_2D,0,t.RGB32F,e,r,0,t.RGB,t.FLOAT,u)}else t.texImage2D(t.TEXTURE_2D,0,t.RGB32F,e,r,0,t.RGB,t.FLOAT,i);t.bindTexture(t.TEXTURE_2D,null)}kill(){const t=this.normalProgram.gl;t.deleteProgram(this.splatProgram),t.deleteBuffer(this.splatBuffer),t.deleteTexture(this.densityTexture),t.deleteFramebuffer(this.densityFBO),t.deleteTexture(this.nodesTexture),super.kill()}}}export{A as c};
