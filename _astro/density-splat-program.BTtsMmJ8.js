import{C as e,S as t,w as n}from"./graphology.DvPOi-Ni.js";import{n as r,r as i}from"./bind-webgl-layer.QOUnA2OU.js";function a(){return`#version 300 es
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
  `}function o(){return`#version 300 es
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
  `}var s=new Float32Array(r);function c(r,c,l){let{radius:u,zoomToRadiusRatioFunction:d,getWeight:f}=c;return class extends i{nodesTexture;nodesTextureWidth;nodesDataArray;nodeCount=0;splatProgram;splatBuffer;splatPositionLocation;splatUniforms;densityFBO;densityTexture;densityWidth=0;densityHeight=0;constructor(i,c,l){if(super(i,c,l),!i.getExtension(`EXT_color_buffer_float`))throw Error(`createDensitySplatProgram: EXT_color_buffer_float extension is required`);i.activeTexture(i.TEXTURE0),this.nodesTextureWidth=Math.min(r.length||1,i.getParameter(i.MAX_TEXTURE_SIZE)),this.nodesDataArray=new Float32Array(r.length*3),this.nodesTexture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.nodesTexture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST);let u=n(i,o()),d=t(i,a());this.splatProgram=e(i,[u,d]),i.deleteShader(u),i.deleteShader(d),this.splatPositionLocation=i.getAttribLocation(this.splatProgram,`a_position`),this.splatUniforms={u_nodesTexture:i.getUniformLocation(this.splatProgram,`u_nodesTexture`),u_nodesTextureWidth:i.getUniformLocation(this.splatProgram,`u_nodesTextureWidth`),u_matrix:i.getUniformLocation(this.splatProgram,`u_matrix`),u_radius:i.getUniformLocation(this.splatProgram,`u_radius`),u_correctionRatio:i.getUniformLocation(this.splatProgram,`u_correctionRatio`),u_zoomModifier:i.getUniformLocation(this.splatProgram,`u_zoomModifier`)},this.splatBuffer=i.createBuffer(),i.bindBuffer(i.ARRAY_BUFFER,this.splatBuffer),i.bufferData(i.ARRAY_BUFFER,s,i.STATIC_DRAW),i.useProgram(this.splatProgram),i.uniform1i(this.splatUniforms.u_nodesTexture,0),this.densityFBO=i.createFramebuffer(),this.densityTexture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.densityTexture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}updateNodesData(){let e=0;for(let t of r){let n=this.renderer.getNodeDisplayData(t);n&&(this.nodesDataArray[e*3]=n.x,this.nodesDataArray[e*3+1]=n.y,this.nodesDataArray[e*3+2]=f?f(t):1,e++)}this.nodeCount=e}ensureDensityTextureSize(e,t){if(this.densityWidth===e&&this.densityHeight===t)return;let n=this.normalProgram.gl;n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.densityTexture),n.texImage2D(n.TEXTURE_2D,0,n.R32F,e,t,0,n.RED,n.FLOAT,null),n.bindFramebuffer(n.FRAMEBUFFER,this.densityFBO),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,this.densityTexture,0);let r=n.checkFramebufferStatus(n.FRAMEBUFFER);if(r!==n.FRAMEBUFFER_COMPLETE)throw Error(`Density framebuffer incomplete (status 0x${r.toString(16)})`);this.densityWidth=e,this.densityHeight=t}getCustomLayerDefinition(){return l.definition}setCameraUniforms(e,t){l.setCameraUniforms&&l.setCameraUniforms(e,t)}cacheDataUniforms(e){l.cacheUniforms(e)}preRender(e){if(this.nodeCount===0)return;let t=this.normalProgram.gl,n=t.canvas;this.ensureDensityTextureSize(n.width,n.height),t.bindFramebuffer(t.FRAMEBUFFER,this.densityFBO),t.viewport(0,0,this.densityWidth,this.densityHeight),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE),t.useProgram(this.splatProgram),t.uniformMatrix3fv(this.splatUniforms.u_matrix,!1,e.matrix),t.uniform1f(this.splatUniforms.u_correctionRatio,e.correctionRatio),t.uniform1f(this.splatUniforms.u_zoomModifier,1/d(e.zoomRatio)),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.nodesTexture),t.bindBuffer(t.ARRAY_BUFFER,this.splatBuffer),t.enableVertexAttribArray(this.splatPositionLocation),t.vertexAttribPointer(this.splatPositionLocation,2,t.FLOAT,!1,0,0),t.drawArraysInstanced(t.TRIANGLE_STRIP,0,4,this.nodeCount),t.disableVertexAttribArray(this.splatPositionLocation)}render(e){let t=this.normalProgram.gl;t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.densityTexture),this.bindProgram(this.normalProgram),this.renderProgram(e,this.normalProgram),this.unbindProgram(this.normalProgram)}cacheData(){super.cacheData();let e=this.normalProgram.gl;e.useProgram(this.splatProgram),e.uniform1f(this.splatUniforms.u_radius,u),e.uniform1i(this.splatUniforms.u_nodesTextureWidth,this.nodesTextureWidth),this.updateNodesData();let t=this.nodesTextureWidth,n=Math.ceil(this.nodeCount/t)||1,r=this.nodesDataArray.subarray(0,this.nodeCount*3);e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.nodesTexture);let i=t*n*3;if(this.nodeCount*3<i){let a=new Float32Array(i);a.set(r),e.texImage2D(e.TEXTURE_2D,0,e.RGB32F,t,n,0,e.RGB,e.FLOAT,a)}else e.texImage2D(e.TEXTURE_2D,0,e.RGB32F,t,n,0,e.RGB,e.FLOAT,r);e.bindTexture(e.TEXTURE_2D,null)}kill(){let e=this.normalProgram.gl;e.deleteProgram(this.splatProgram),e.deleteBuffer(this.splatBuffer),e.deleteTexture(this.densityTexture),e.deleteFramebuffer(this.densityFBO),e.deleteTexture(this.nodesTexture),super.kill()}}}export{c as t};