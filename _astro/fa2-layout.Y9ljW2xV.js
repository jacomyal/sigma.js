import{S as e,T as t,r as n,w as r}from"./graphology.DvPOi-Ni.js";var i=8,a=class{constructor(e){this.program=null,this.vao=null,this.drawFramebuffer=null,this.readFramebuffer=null,this.viewport=new Int32Array(4),this.blend=!1,this.blendSrcRGB=WebGL2RenderingContext.ONE,this.blendDstRGB=WebGL2RenderingContext.ZERO,this.blendSrcAlpha=WebGL2RenderingContext.ONE,this.blendDstAlpha=WebGL2RenderingContext.ZERO,this.blendEquationRGB=WebGL2RenderingContext.FUNC_ADD,this.blendEquationAlpha=WebGL2RenderingContext.FUNC_ADD,this.colorMask=[!0,!0,!0,!0],this.activeTexture=WebGL2RenderingContext.TEXTURE0,this.textures=[],this.gl=e}save(){let{gl:e}=this;this.program=e.getParameter(e.CURRENT_PROGRAM),this.vao=e.getParameter(e.VERTEX_ARRAY_BINDING),this.drawFramebuffer=e.getParameter(e.DRAW_FRAMEBUFFER_BINDING),this.readFramebuffer=e.getParameter(e.READ_FRAMEBUFFER_BINDING),this.viewport=e.getParameter(e.VIEWPORT),this.blend=e.isEnabled(e.BLEND),this.blendSrcRGB=e.getParameter(e.BLEND_SRC_RGB),this.blendDstRGB=e.getParameter(e.BLEND_DST_RGB),this.blendSrcAlpha=e.getParameter(e.BLEND_SRC_ALPHA),this.blendDstAlpha=e.getParameter(e.BLEND_DST_ALPHA),this.blendEquationRGB=e.getParameter(e.BLEND_EQUATION_RGB),this.blendEquationAlpha=e.getParameter(e.BLEND_EQUATION_ALPHA),this.colorMask=e.getParameter(e.COLOR_WRITEMASK),this.activeTexture=e.getParameter(e.ACTIVE_TEXTURE);for(let t=0;t<i;t++)e.activeTexture(e.TEXTURE0+t),this.textures[t]=e.getParameter(e.TEXTURE_BINDING_2D);e.activeTexture(this.activeTexture)}restore(){let{gl:e}=this;for(let t=0;t<i;t++)e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.textures[t]);e.activeTexture(this.activeTexture),e.useProgram(this.program),e.bindVertexArray(this.vao),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,this.drawFramebuffer),e.bindFramebuffer(e.READ_FRAMEBUFFER,this.readFramebuffer),e.viewport(this.viewport[0],this.viewport[1],this.viewport[2],this.viewport[3]),this.blend?e.enable(e.BLEND):e.disable(e.BLEND),e.blendFuncSeparate(this.blendSrcRGB,this.blendDstRGB,this.blendSrcAlpha,this.blendDstAlpha),e.blendEquationSeparate(this.blendEquationRGB,this.blendEquationAlpha),e.colorMask(this.colorMask[0],this.colorMask[1],this.colorMask[2],this.colorMask[3]),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)}},o={linLogMode:!1,strongGravityMode:!1,outboundAttractionDistribution:!1,edgeWeightInfluence:1,scalingRatio:1,gravity:1,slowDown:1,maxForce:1e3,quadTreeDepth:`auto`,quadTreeTheta:1,iterationsPerFrame:`auto`,maxIterationsPerFrame:100,backportInterval:200};function s(e){return Math.ceil(Math.sqrt(e))}function c(t,n,i,a=`program`,o=`a_position`){let s=t.createProgram();if(t.attachShader(s,r(t,n)),t.attachShader(s,e(t,i)),t.bindAttribLocation(s,0,o),t.linkProgram(s),!t.getProgramParameter(s,t.LINK_STATUS))throw Error(`Failed to link ${a}: `+t.getProgramInfoLog(s));return s}function l(e,t,n=t){let r=e.createTexture();return e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,e.RGBA32F,t,n,0,e.RGBA,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),r}function u(e,t,n=`framebuffer`){let r=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw Error(`${n} is not complete`);return e.bindFramebuffer(e.FRAMEBUFFER,null),r}var d=class{gl;pbo;framebuffer;width;height;array;fence=null;constructor(e,t=1,n=t){this.gl=e,this.width=t,this.height=n,this.array=new Float32Array(t*n*4),this.pbo=e.createBuffer(),e.bindBuffer(e.PIXEL_PACK_BUFFER,this.pbo),e.bufferData(e.PIXEL_PACK_BUFFER,this.array.byteLength,e.STREAM_READ),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),this.framebuffer=e.createFramebuffer()}start(e){let{gl:t}=this;return!this.fence&&(t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0),t.readBuffer(t.COLOR_ATTACHMENT0),t.bindBuffer(t.PIXEL_PACK_BUFFER,this.pbo),t.pixelStorei(t.PACK_ALIGNMENT,1),t.readPixels(0,0,this.width,this.height,t.RGBA,t.FLOAT,0),t.bindBuffer(t.PIXEL_PACK_BUFFER,null),t.bindFramebuffer(t.FRAMEBUFFER,null),this.fence=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0),t.flush(),!0)}poll(){let{gl:e}=this;if(!this.fence)return null;let t=e.clientWaitSync(this.fence,0,0);if(t===e.TIMEOUT_EXPIRED)return null;if(e.deleteSync(this.fence),this.fence=null,t===e.WAIT_FAILED)throw Error(`AsyncTexelsReader: failed to wait for the read fence`);return e.bindBuffer(e.PIXEL_PACK_BUFFER,this.pbo),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,this.array),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),this.array}cancel(){this.fence&&=(this.gl.deleteSync(this.fence),null)}kill(){this.cancel(),this.gl.deleteBuffer(this.pbo),this.gl.deleteFramebuffer(this.framebuffer)}},f=`#version 300 es
in vec2 a_position;

out vec2 v_textureCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_textureCoord = (a_position + vec2(1.0, 1.0)) / 2.0;
}`,p=`
vec4 getValueInTexture(sampler2D inputTexture, float index, float textureSize) {
  float row = floor(index / textureSize);
  float col = index - row * textureSize;

  return texelFetch(inputTexture, ivec2(int(col), int(row)), 0);
}
`,m=`
float getIndex(vec2 positionInTexture, float textureSize) {
  float col = floor(positionInTexture.x * textureSize);
  float row = floor(positionInTexture.y * textureSize);
  return row * textureSize + col;
}
`;function h({nodesCount:e,edgeEntriesCount:n,linLogMode:r,strongGravityMode:i,outboundAttractionDistribution:a,quadTreeDepth:o,quadTreeTheta:c}){let l=Math.max(1,Math.ceil(1/c));return`#version 300 es
precision highp float;

#define NODES_COUNT ${t(e)}
#define NODES_TEXTURE_SIZE ${t(s(e))}
#define EDGES_TEXTURE_SIZE ${t(s(n))}
#define QUAD_TREE_DEPTH ${Math.floor(o)}
#define QUAD_TREE_RING ${Math.floor(l)}
${r?`#define LINLOG_MODE`:``}
${i?`#define STRONG_GRAVITY_MODE`:``}
${a?`#define OUTBOUND_ATTRACTION_DISTRIBUTION`:``}

// Graph data
uniform sampler2D u_nodesPositionTexture;
uniform sampler2D u_nodesMovementTexture;
uniform sampler2D u_nodesMetadataTexture;
uniform sampler2D u_edgesTexture;

// Quad-tree
uniform sampler2D u_boundariesTexture;
uniform sampler2D u_quadTreeTexture;

in vec2 v_textureCoord;

// Settings management:
uniform float u_edgeWeightInfluence;
uniform float u_scalingRatio;
uniform float u_gravity;
uniform float u_maxForce;
uniform float u_slowDown;

#if defined(OUTBOUND_ATTRACTION_DISTRIBUTION)
  uniform float u_outboundAttCompensation;
#endif

// Output
layout(location = 0) out vec4 positionOutput;
layout(location = 1) out vec4 movementOutput;

// Additional helpers:
${p}
${m}

void main() {
  float nodeIndex = getIndex(v_textureCoord, NODES_TEXTURE_SIZE);
  if (nodeIndex >= NODES_COUNT) return;

  positionOutput = vec4(0.0);
  movementOutput = vec4(0.0);

  vec4 nodePosition = getValueInTexture(u_nodesPositionTexture, nodeIndex, NODES_TEXTURE_SIZE);
  float x = nodePosition.x;
  float y = nodePosition.y;
  float nodeMass = nodePosition.z;

  vec4 nodeMovement = getValueInTexture(u_nodesMovementTexture, nodeIndex, NODES_TEXTURE_SIZE);
  float oldDx = nodeMovement.x;
  float oldDy = nodeMovement.y;
  float nodeConvergence = nodeMovement.z;
  float dx = 0.0;
  float dy = 0.0;

  vec4 nodeMetadata = getValueInTexture(u_nodesMetadataTexture, nodeIndex, NODES_TEXTURE_SIZE);
  float edgesOffset = nodeMetadata.r;
  float neighborsCount = nodeMetadata.g;
  float nodeFixed = nodeMetadata.b;

  // A fixed node does not move (but the other nodes still read its position
  // and mass, so it keeps repulsing and attracting them). Its inertia is
  // zeroed, so it restarts gently when unfixed:
  if (nodeFixed > 0.5) {
    positionOutput = vec4(x, y, nodeMass, 0.0);
    movementOutput = vec4(0.0, 0.0, nodeConvergence, 0.0);
    return;
  }

  // REPULSION:
  // The quadtree is complete, so each level is a 2^(level+1) x 2^(level+1)
  // grid of cells, whose centers of mass are read from the atlas texture.
  // For a given node, at each level, the cells "well separated" from the
  // node (more than QUAD_TREE_RING cells away, i.e. passing the
  // size/distance < theta test) but not already handled at a coarser
  // level (inside its parent's neighborhood, refined) are used as single
  // bodies. At the finest level, the remaining neighborhood is used as
  // well, with the node's own contribution removed from its own cell.
  float repulsionCoefficient = u_scalingRatio;

  // Square bounding box (must match the splat vertex shader):
  vec4 boundaries = getValueInTexture(u_boundariesTexture, 0.0, 1.0);
  vec2 bbCenter = vec2((boundaries.x + boundaries.y) / 2.0, (boundaries.z + boundaries.w) / 2.0);
  float bbSide = max(max(boundaries.y - boundaries.x, boundaries.w - boundaries.z), 1e-6);
  vec2 relativePosition = clamp((nodePosition.xy - bbCenter) / bbSide + 0.5, 0.0, 0.999999);

  for (int level = 0; level < QUAD_TREE_DEPTH; level++) {
    int gridSize = 1 << (level + 1);
    int rowOffset = gridSize - 2;
    ivec2 cell = ivec2(floor(relativePosition * float(gridSize)));
    ivec2 blockMin = (cell / 2 - QUAD_TREE_RING) * 2;
    bool isFinestLevel = level == QUAD_TREE_DEPTH - 1;

    // The block of cells covering the node's parent cell's neighborhood at
    // the previous level:
    for (int i = 0; i < 4 * QUAD_TREE_RING + 2; i++) {
      for (int j = 0; j < 4 * QUAD_TREE_RING + 2; j++) {
        ivec2 otherCell = blockMin + ivec2(i, j);
        if (otherCell.x < 0 || otherCell.y < 0 || otherCell.x >= gridSize || otherCell.y >= gridSize) continue;

        bool isNeighborCell = abs(otherCell.x - cell.x) <= QUAD_TREE_RING && abs(otherCell.y - cell.y) <= QUAD_TREE_RING;
        if (isNeighborCell && !isFinestLevel) continue;

        vec4 cellData = texelFetch(u_quadTreeTexture, ivec2(otherCell.x, rowOffset + otherCell.y), 0);
        vec2 cellMassSum = cellData.rg;
        float cellMass = cellData.b;

        // Remove the node's own contribution from its own cell:
        if (isFinestLevel && all(equal(otherCell, cell))) {
          cellMassSum -= nodePosition.xy * nodeMass;
          cellMass -= nodeMass;
        }
        if (cellMass <= 0.0) continue;

        vec2 diff = nodePosition.xy - cellMassSum / cellMass;
        // Distances below a small fraction of the cell side are quantization
        // noise (in particular the float32 residue of the self-subtraction
        // above, for a node coincident with its own cell's center of mass):
        // flooring the squared distance bounds the force, which then decays
        // to zero with diff. Exactly coincident positions repulse not at all,
        // like in the reference CPU implementation:
        float minDistance = bbSide / float(gridSize) * 0.01;
        float dSquare = max(dot(diff, diff), minDistance * minDistance);

        // Linear Repulsion
        float factor = repulsionCoefficient * nodeMass * cellMass / dSquare;
        dx += diff.x * factor;
        dy += diff.y * factor;
      }
    }
  }

  // GRAVITY:
  float distanceToCenter = sqrt(x * x + y * y);
  float gravityFactor = 0.0;
  #if defined(STRONG_GRAVITY_MODE)
    if (distanceToCenter > 0.0) gravityFactor = nodeMass * u_gravity;
  #else
    if (distanceToCenter > 0.0) gravityFactor = nodeMass * u_gravity / distanceToCenter;
  #endif

  dx -= x * gravityFactor;
  dy -= y * gravityFactor;

  // ATTRACTION:
  #if defined(OUTBOUND_ATTRACTION_DISTRIBUTION)
    float attractionCoefficient = u_outboundAttCompensation;
  #else
    float attractionCoefficient = 1.0;
  #endif

  for (float j = 0.0; j < neighborsCount; j++) {
    vec2 edgeData = getValueInTexture(u_edgesTexture, edgesOffset + j, EDGES_TEXTURE_SIZE).xy;
    float otherNodeIndex = edgeData.x;
    float weight = edgeData.y;
    float edgeWeightInfluence = pow(weight, u_edgeWeightInfluence);

    vec4 otherNodePosition = getValueInTexture(u_nodesPositionTexture, otherNodeIndex, NODES_TEXTURE_SIZE);
    vec2 diff = nodePosition.xy - otherNodePosition.xy;

    float attractionFactor = 0.0;
    #if defined(LINLOG_MODE)
      // LinLog Attraction
      float d = sqrt(dot(diff, diff));
      if (d > 0.0) attractionFactor = -attractionCoefficient * edgeWeightInfluence * log(1.0 + d) / d;
    #else
      // Linear Attraction
      attractionFactor = -attractionCoefficient * edgeWeightInfluence;
    #endif

    #if defined(OUTBOUND_ATTRACTION_DISTRIBUTION)
      // Degree Distributed: heavy nodes are attracted less:
      attractionFactor /= nodeMass;
    #endif

    dx += diff.x * attractionFactor;
    dy += diff.y * attractionFactor;
  }

  // APPLY FORCES:
  // Clamp the force, then use the clamped value as this iteration's force
  // everywhere below (swinging, traction, convergence, stored movement):
  float force = sqrt(pow(dx, 2.0) + pow(dy, 2.0));
  if (force > u_maxForce) {
    dx = dx * u_maxForce / force;
    dy = dy * u_maxForce / force;
  }
  float forceSquared = pow(dx, 2.0) + pow(dy, 2.0);

  float swinging = nodeMass * sqrt(
    pow(oldDx - dx, 2.0)
    + pow(oldDy - dy, 2.0)
  );
  float swingingFactor = 1.0 / (1.0 + sqrt(swinging));
  float traction = sqrt(
    pow(oldDx + dx, 2.0)
    + pow(oldDy + dy, 2.0)
  ) / 2.0;

  float nodeSpeed = (nodeConvergence * log(1.0 + traction)) * swingingFactor;
  // Store new node convergence:
  movementOutput.z = min(
    1.0,
    sqrt(nodeSpeed * forceSquared * swingingFactor)
  );

  // Store the force as this iteration's movement, like the reference CPU
  // implementation: swinging compares forces across iterations, not
  // displacements (the displacement below is orders of magnitude smaller,
  // and storing it makes every iteration read as maximal swinging, which
  // freezes the layout early):
  movementOutput.x = dx;
  movementOutput.y = dy;

  positionOutput.x = x + dx * nodeSpeed / u_slowDown;
  positionOutput.y = y + dy * nodeSpeed / u_slowDown;
  positionOutput.z = nodeMass;
}`}var g=0,_=1,v=2,y=3,b=4,x=5,S=class{gl;nodesTextureSize;edgesTextureSize;program;vao;quadBuffer;positionTextures;movementTextures;framebuffers;current=0;metadataTexture;edgesTexture;boundariesTexture;quadTreeTexture;uniformLocations;constructor(e,t){this.gl=e,this.nodesTextureSize=s(t.nodesCount),this.edgesTextureSize=s(t.edgeEntriesCount),this.boundariesTexture=t.boundariesTexture,this.quadTreeTexture=t.quadTreeTexture,this.program=c(e,f,h(t),`ForceAtlas2`),this.uniformLocations={edgeWeightInfluence:e.getUniformLocation(this.program,`u_edgeWeightInfluence`),scalingRatio:e.getUniformLocation(this.program,`u_scalingRatio`),gravity:e.getUniformLocation(this.program,`u_gravity`),maxForce:e.getUniformLocation(this.program,`u_maxForce`),slowDown:e.getUniformLocation(this.program,`u_slowDown`),outboundAttCompensation:e.getUniformLocation(this.program,`u_outboundAttCompensation`)},e.useProgram(this.program),e.uniform1i(e.getUniformLocation(this.program,`u_nodesPositionTexture`),g),e.uniform1i(e.getUniformLocation(this.program,`u_nodesMovementTexture`),_),e.uniform1i(e.getUniformLocation(this.program,`u_nodesMetadataTexture`),v),e.uniform1i(e.getUniformLocation(this.program,`u_edgesTexture`),y),e.uniform1i(e.getUniformLocation(this.program,`u_boundariesTexture`),b),e.uniform1i(e.getUniformLocation(this.program,`u_quadTreeTexture`),x),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.quadBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null);let n=this.nodesTextureSize;this.positionTextures=[l(e,n),l(e,n)],this.movementTextures=[l(e,n),l(e,n)],this.framebuffers=[0,1].map(t=>{let n=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.positionTextures[t],0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,this.movementTextures[t],0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw Error(`ForceAtlas2Program: framebuffer is not complete`);return n}),e.bindFramebuffer(e.FRAMEBUFFER,null),this.metadataTexture=l(e,n),this.edgesTexture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.edgesTexture),e.texImage2D(e.TEXTURE_2D,0,e.RG32F,this.edgesTextureSize,this.edgesTextureSize,0,e.RG,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}setData({nodesPosition:e,nodesMovement:t,nodesMetadata:n,edges:r}){let{gl:i}=this,a=this.nodesTextureSize;i.pixelStorei(i.UNPACK_ALIGNMENT,1),i.bindTexture(i.TEXTURE_2D,this.positionTextures[this.current]),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,a,a,0,i.RGBA,i.FLOAT,e),i.bindTexture(i.TEXTURE_2D,this.movementTextures[this.current]),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,a,a,0,i.RGBA,i.FLOAT,t),i.bindTexture(i.TEXTURE_2D,this.metadataTexture),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,a,a,0,i.RGBA,i.FLOAT,n),i.bindTexture(i.TEXTURE_2D,this.edgesTexture),i.texImage2D(i.TEXTURE_2D,0,i.RG32F,this.edgesTextureSize,this.edgesTextureSize,0,i.RG,i.FLOAT,r)}setPositionItem(e,t){this.setTexel(this.positionTextures[this.current],e,t)}setMovementItem(e,t){this.setTexel(this.movementTextures[this.current],e,t)}setMetadataItem(e,t){this.setTexel(this.metadataTexture,e,t)}setTexel(e,t,n){let{gl:r}=this,i=this.nodesTextureSize,a=t%i,o=Math.floor(t/i);r.bindTexture(r.TEXTURE_2D,e),r.pixelStorei(r.UNPACK_ALIGNMENT,1),r.texSubImage2D(r.TEXTURE_2D,0,a,o,1,1,r.RGBA,r.FLOAT,n)}setUniforms(e){let{gl:t,uniformLocations:n}=this;t.useProgram(this.program);for(let r in e)t.uniform1f(n[r],e[r])}run(){let{gl:e}=this,t=this.nodesTextureSize;e.useProgram(this.program),e.bindVertexArray(this.vao),e.viewport(0,0,t,t),e.disable(e.BLEND),e.activeTexture(e.TEXTURE0+g),e.bindTexture(e.TEXTURE_2D,this.positionTextures[this.current]),e.activeTexture(e.TEXTURE0+_),e.bindTexture(e.TEXTURE_2D,this.movementTextures[this.current]),e.activeTexture(e.TEXTURE0+v),e.bindTexture(e.TEXTURE_2D,this.metadataTexture),e.activeTexture(e.TEXTURE0+y),e.bindTexture(e.TEXTURE_2D,this.edgesTexture),e.activeTexture(e.TEXTURE0+b),e.bindTexture(e.TEXTURE_2D,this.boundariesTexture),e.activeTexture(e.TEXTURE0+x),e.bindTexture(e.TEXTURE_2D,this.quadTreeTexture),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffers[1-this.current]),e.drawArrays(e.TRIANGLE_STRIP,0,4),this.current=1-this.current}getPositionsTexture(){return this.positionTextures[this.current]}readPositionsSync(){let{gl:e}=this,t=this.nodesTextureSize,n=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.getPositionsTexture(),0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n),Error(`ForceAtlas2Program: failed to create framebuffer for reading positions`);let r=new Float32Array(t*t*4);return e.pixelStorei(e.PACK_ALIGNMENT,1),e.readPixels(0,0,t,t,e.RGBA,e.FLOAT,r),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(n),r}kill(){let{gl:e}=this;e.deleteProgram(this.program),e.deleteVertexArray(this.vao),e.deleteBuffer(this.quadBuffer),this.positionTextures.forEach(t=>e.deleteTexture(t)),this.movementTextures.forEach(t=>e.deleteTexture(t)),this.framebuffers.forEach(t=>e.deleteFramebuffer(t)),e.deleteTexture(this.metadataTexture),e.deleteTexture(this.edgesTexture)}};function C({nodesCount:e}){return`#version 300 es
precision highp float;

#define NODES_COUNT ${Math.floor(e)}
#define SOURCE_SIZE ${Math.floor(s(e))}
#define FLOAT_MAX 3.402823466e38

uniform sampler2D u_nodesPositionTexture;

layout(location = 0) out vec4 boundaries;

vec4 readNode(ivec2 coord) {
  if (coord.x >= SOURCE_SIZE || coord.y >= SOURCE_SIZE) return vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);

  int nodeIndex = coord.y * SOURCE_SIZE + coord.x;
  if (nodeIndex >= NODES_COUNT) return vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);

  vec4 nodePosition = texelFetch(u_nodesPositionTexture, coord, 0);
  return vec4(nodePosition.x, nodePosition.x, nodePosition.y, nodePosition.y);
}

void main() {
  ivec2 base = ivec2(gl_FragCoord.xy) * 4;

  vec4 result = vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);
  for (int dy = 0; dy < 4; dy++) {
    for (int dx = 0; dx < 4; dx++) {
      vec4 value = readNode(base + ivec2(dx, dy));
      result = vec4(
        min(result.x, value.x),
        max(result.y, value.y),
        min(result.z, value.z),
        max(result.w, value.w)
      );
    }
  }

  boundaries = result;
}`}function w(){return`#version 300 es
precision highp float;

#define FLOAT_MAX 3.402823466e38

uniform sampler2D u_inputTexture;
uniform int u_inputSize;

layout(location = 0) out vec4 boundaries;

vec4 readCell(ivec2 coord) {
  if (coord.x >= u_inputSize || coord.y >= u_inputSize) return vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);

  return texelFetch(u_inputTexture, coord, 0);
}

void main() {
  ivec2 base = ivec2(gl_FragCoord.xy) * 4;

  vec4 result = vec4(FLOAT_MAX, -FLOAT_MAX, FLOAT_MAX, -FLOAT_MAX);
  for (int dy = 0; dy < 4; dy++) {
    for (int dx = 0; dx < 4; dx++) {
      vec4 value = readCell(base + ivec2(dx, dy));
      result = vec4(
        min(result.x, value.x),
        max(result.y, value.y),
        min(result.z, value.z),
        max(result.w, value.w)
      );
    }
  }

  boundaries = result;
}`}var T=4,E=class{gl;passSizes;initProgram;reduceProgram;initUniformLocations;reduceUniformLocations;vao;quadBuffer;pingTexture;pongTexture;boundariesTexture;pingFramebuffer;pongFramebuffer;boundariesFramebuffer;constructor(e,{nodesCount:t}){for(this.gl=e,this.passSizes=[Math.ceil(s(t)/T)];this.passSizes[this.passSizes.length-1]>1;)this.passSizes.push(Math.ceil(this.passSizes[this.passSizes.length-1]/T));this.initProgram=c(e,f,C({nodesCount:t}),`boundaries init program`),this.reduceProgram=c(e,f,w(),`boundaries reduce program`),this.initUniformLocations={nodesPositionTexture:e.getUniformLocation(this.initProgram,`u_nodesPositionTexture`)},this.reduceUniformLocations={inputTexture:e.getUniformLocation(this.reduceProgram,`u_inputTexture`),inputSize:e.getUniformLocation(this.reduceProgram,`u_inputSize`)},this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.quadBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null);let n=this.passSizes[0];this.pingTexture=l(e,n),this.pongTexture=l(e,n),this.boundariesTexture=l(e,1),this.pingFramebuffer=u(e,this.pingTexture,`BoundariesGPU ping framebuffer`),this.pongFramebuffer=u(e,this.pongTexture,`BoundariesGPU pong framebuffer`),this.boundariesFramebuffer=u(e,this.boundariesTexture,`BoundariesGPU boundaries framebuffer`)}compute(e){let{gl:t,passSizes:n}=this;t.bindVertexArray(this.vao),t.disable(t.BLEND),n.forEach((r,i)=>{let a=r===1;i===0?(t.useProgram(this.initProgram),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.uniform1i(this.initUniformLocations.nodesPositionTexture,0)):(t.useProgram(this.reduceProgram),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,i%2==1?this.pingTexture:this.pongTexture),t.uniform1i(this.reduceUniformLocations.inputTexture,0),t.uniform1i(this.reduceUniformLocations.inputSize,n[i-1]));let o=a?this.boundariesFramebuffer:i%2==0?this.pingFramebuffer:this.pongFramebuffer;t.bindFramebuffer(t.FRAMEBUFFER,o),t.viewport(0,0,r,r),t.drawArrays(t.TRIANGLE_STRIP,0,4)}),t.bindVertexArray(null),t.bindFramebuffer(t.FRAMEBUFFER,null)}getBoundariesTexture(){return this.boundariesTexture}kill(){let{gl:e}=this;e.deleteProgram(this.initProgram),e.deleteProgram(this.reduceProgram),e.deleteVertexArray(this.vao),e.deleteBuffer(this.quadBuffer),e.deleteTexture(this.pingTexture),e.deleteTexture(this.pongTexture),e.deleteTexture(this.boundariesTexture),e.deleteFramebuffer(this.pingFramebuffer),e.deleteFramebuffer(this.pongFramebuffer),e.deleteFramebuffer(this.boundariesFramebuffer)}};function D(){return`#version 300 es
precision highp float;

in vec3 v_positionAndMass;

layout(location = 0) out vec4 cellOutput;

void main() {
  float mass = v_positionAndMass.z;
  cellOutput = vec4(v_positionAndMass.xy * mass, mass, 1.0);
}`}function O({nodesCount:e}){return`#version 300 es
precision highp float;

#define NODES_TEXTURE_SIZE ${Math.floor(s(e))}

uniform sampler2D u_nodesPositionTexture;
uniform sampler2D u_boundariesTexture;
uniform float u_gridSize;

out vec3 v_positionAndMass;

void main() {
  int nodeIndex = gl_VertexID;
  ivec2 texCoord = ivec2(nodeIndex % NODES_TEXTURE_SIZE, nodeIndex / NODES_TEXTURE_SIZE);
  vec4 nodePosition = texelFetch(u_nodesPositionTexture, texCoord, 0);

  // Square bounding box (must match the ForceAtlas2 fragment shader):
  vec4 boundaries = texelFetch(u_boundariesTexture, ivec2(0), 0);
  vec2 bbCenter = vec2((boundaries.x + boundaries.y) / 2.0, (boundaries.z + boundaries.w) / 2.0);
  float bbSide = max(max(boundaries.y - boundaries.x, boundaries.w - boundaries.z), 1e-6);

  vec2 relativePosition = clamp((nodePosition.xy - bbCenter) / bbSide + 0.5, 0.0, 0.999999);

  // Snap the point to the center of its grid cell:
  vec2 cell = floor(relativePosition * u_gridSize);
  vec2 clipPosition = (cell + 0.5) / u_gridSize * 2.0 - 1.0;

  gl_Position = vec4(clipPosition, 0.0, 1.0);
  gl_PointSize = 1.0;
  v_positionAndMass = vec3(nodePosition.xy, nodePosition.z);
}`}function k(e){return Math.max(3,Math.min(11,Math.ceil(Math.log2(Math.max(e,2))/2)))}function A(e){return 2**(e+1)}function j(e){return 2**(e+1)-2}function M(e){return 2**e}function N(e){return 2**(e+1)-2}var P=class{gl;nodesCount;params;boundaries;splatProgram;splatVAO;splatUniformLocations;atlasTexture;atlasFramebuffer;constructor(e,{nodesCount:t},n){this.gl=e,this.nodesCount=t,this.params=n,this.boundaries=new E(e,{nodesCount:t}),this.splatProgram=c(e,O({nodesCount:t}),D(),`splat program`),this.splatUniformLocations={nodesPositionTexture:e.getUniformLocation(this.splatProgram,`u_nodesPositionTexture`),boundariesTexture:e.getUniformLocation(this.splatProgram,`u_boundariesTexture`),gridSize:e.getUniformLocation(this.splatProgram,`u_gridSize`)},this.splatVAO=e.createVertexArray();let{depth:r}=this.params;this.atlasTexture=l(e,M(r),N(r)),this.atlasFramebuffer=u(e,this.atlasTexture,`QuadTreeGPU atlas framebuffer`)}compute(e){let{gl:t,boundaries:n,splatProgram:r,splatVAO:i,atlasFramebuffer:a}=this,{depth:o}=this.params;n.compute(e),t.useProgram(r),t.bindVertexArray(i),t.bindFramebuffer(t.FRAMEBUFFER,a),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.uniform1i(this.splatUniformLocations.nodesPositionTexture,0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,n.getBoundariesTexture()),t.uniform1i(this.splatUniformLocations.boundariesTexture,1),t.viewport(0,0,M(o),N(o)),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ONE);for(let e=0;e<o;e++){let n=A(e);t.viewport(0,j(e),n,n),t.uniform1f(this.splatUniformLocations.gridSize,n),t.drawArrays(t.POINTS,0,this.nodesCount)}t.disable(t.BLEND),t.bindVertexArray(null),t.bindFramebuffer(t.FRAMEBUFFER,null)}getAtlasTexture(){return this.atlasTexture}getBoundariesTexture(){return this.boundaries.getBoundariesTexture()}getDepth(){return this.params.depth}kill(){let{gl:e}=this;this.boundaries.kill(),e.deleteProgram(this.splatProgram),e.deleteVertexArray(this.splatVAO),e.deleteTexture(this.atlasTexture),e.deleteFramebuffer(this.atlasFramebuffer)}};function F(){return`#version 300 es
precision highp float;

in vec2 v_position;

layout(location = 0) out vec4 fragColor;

void main() {
  fragColor = vec4(v_position, 0.0, 0.0);
}`}function I({nodesCount:e}){return`#version 300 es
precision highp float;

#define NODES_TEXTURE_SIZE ${Math.floor(s(e))}
#define TEXELS_PER_NODE ${t(2)}

uniform sampler2D u_nodesPositionTexture;
// (dX, dY, ratio) of sigma's normalization function:
uniform vec3 u_normalization;
// Sigma's node data texture dimensions, in texels:
uniform vec2 u_targetSize;

// The node's item index in sigma's node data texture:
in float a_sigmaIndex;

out vec2 v_position;

void main() {
  int fa2Index = gl_VertexID;
  ivec2 texCoord = ivec2(fa2Index % NODES_TEXTURE_SIZE, fa2Index / NODES_TEXTURE_SIZE);
  vec2 graphPosition = texelFetch(u_nodesPositionTexture, texCoord, 0).xy;
  v_position = 0.5 + (graphPosition - u_normalization.xy) / u_normalization.z;

  if (a_sigmaIndex < 0.0) {
    // Node unknown to sigma: discard the point.
    gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);
    gl_PointSize = 1.0;
    return;
  }

  // Target the node's geometry texel (the first of its two texels):
  float texel = a_sigmaIndex * TEXELS_PER_NODE;
  float row = floor(texel / u_targetSize.x);
  float col = texel - row * u_targetSize.x;
  vec2 clipPosition = (vec2(col, row) + 0.5) / u_targetSize * 2.0 - 1.0;

  gl_Position = vec4(clipPosition, 0.0, 1.0);
  gl_PointSize = 1.0;
}`}var L=class{gl;nodesCount;program;vao;indicesBuffer;framebuffer;attachedTexture=null;uniformLocations;constructor(e,{nodesCount:t}){this.gl=e,this.nodesCount=t,this.program=c(e,I({nodesCount:t}),F(),`scatter program`,`a_sigmaIndex`),this.uniformLocations={nodesPositionTexture:e.getUniformLocation(this.program,`u_nodesPositionTexture`),normalization:e.getUniformLocation(this.program,`u_normalization`),targetSize:e.getUniformLocation(this.program,`u_targetSize`)},this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.indicesBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.indicesBuffer),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,1,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),this.framebuffer=e.createFramebuffer()}setIndices(e){let{gl:t}=this;t.bindBuffer(t.ARRAY_BUFFER,this.indicesBuffer),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null)}run({positionsTexture:e,targetTexture:t,targetWidth:n,targetHeight:r,normalization:i}){let{gl:a}=this;a.useProgram(this.program),a.bindVertexArray(this.vao),a.bindFramebuffer(a.FRAMEBUFFER,this.framebuffer),this.attachedTexture!==t&&(a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,t,0),this.attachedTexture=t),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,e),a.uniform1i(this.uniformLocations.nodesPositionTexture,0),a.uniform3f(this.uniformLocations.normalization,i.dX,i.dY,i.ratio),a.uniform2f(this.uniformLocations.targetSize,n,r),a.viewport(0,0,n,r),a.disable(a.BLEND),a.colorMask(!0,!0,!1,!1),a.drawArrays(a.POINTS,0,this.nodesCount),a.colorMask(!0,!0,!0,!0),a.bindVertexArray(null),a.bindFramebuffer(a.FRAMEBUFFER,null)}kill(){let{gl:e}=this;e.deleteProgram(this.program),e.deleteVertexArray(this.vao),e.deleteBuffer(this.indicesBuffer),e.deleteFramebuffer(this.framebuffer)}},R={nodesPosition:4,nodesMovement:4,nodesMetadata:4,edges:2},z=class e extends n{static MAX_PENDING_BATCHES=2;renderer;gl;guard;params;running=!1;mode=null;remainingIterations=-1;deadline=null;headlessTimeout=null;totalIterations=0;adaptiveIterationsPerFrame=10;batchFences=[];lastBackportTime=0;backportPending=!1;pendingMovedNodes=new Set;fixedNodes=new Set;pendingFixedUpdates=new Set;sigmaIndicesDirty=!0;killed=!1;nodeKeys=[];nodeDataCache={};edgeEntriesCount=0;outboundAttCompensation=0;nodesPositionArray=new Float32Array;nodesMovementArray=new Float32Array;nodesMetadataArray=new Float32Array;edgesArray=new Float32Array;fa2Program=null;quadTree=null;scatter=null;positionsReader=null;programsKey=``;handleFrame=()=>this.onFrame();handleAfterProcess=()=>{this.sigmaIndicesDirty=!0};handleRendererKill=()=>this.kill();handleStructuralChange=()=>this.stopRun(`structure`);handleNodeUpdate=e=>{(e.type===`set`||e.type===`remove`?e.name===`x`||e.name===`y`:e.type!==`merge`&&e.type!==`update`||e.data&&(`x`in e.data||`y`in e.data))&&this.pendingMovedNodes.add(e.key)};constructor(e,t={}){if(super(),this.renderer=e,this.gl=e.getWebGLContext(),this.guard=new a(this.gl),this.params={...o,...t},!this.gl.getExtension(`EXT_color_buffer_float`))throw Error(`ForceAtlas2GPULayout: EXT_color_buffer_float extension not supported`);if(!this.gl.getExtension(`EXT_float_blend`))throw Error(`ForceAtlas2GPULayout: EXT_float_blend extension not supported`);e.on(`afterTexturesUpload`,this.handleFrame),e.on(`afterProcess`,this.handleAfterProcess),e.on(`kill`,this.handleRendererKill)}start(e=-1){this.beginRun(`live`,typeof e==`number`?{iterations:e}:e)}run(e={}){return this.beginRun(`headless`,e)?new Promise(e=>{this.once(`stopped`,({reason:t})=>e(t))}):Promise.resolve(`stop`)}stop(){this.stopRun(`stop`)}isRunning(){return this.running}getTotalIterations(){return this.totalIterations}getCurrentIterationsPerFrame(){let{iterationsPerFrame:e,maxIterationsPerFrame:t}=this.params,n=e===`auto`?Math.round(this.adaptiveIterationsPerFrame):e;return Math.max(1,Math.min(n,t))}getSettings(){return{...this.params}}setSettings(e){this.params={...this.params,...e}}setNodeFixed(e,t){t!==this.fixedNodes.has(e)&&(t?this.fixedNodes.add(e):this.fixedNodes.delete(e),this.running&&this.pendingFixedUpdates.add(e))}isNodeFixed(e){return this.fixedNodes.has(e)}kill(){if(!this.killed){this.running&&this.stopRun(`kill`,{backport:!1}),this.renderer.off(`afterTexturesUpload`,this.handleFrame),this.renderer.off(`afterProcess`,this.handleAfterProcess),this.renderer.off(`kill`,this.handleRendererKill),this.guard.save();try{this.fa2Program?.kill(),this.quadTree?.kill(),this.scatter?.kill(),this.positionsReader?.kill()}finally{this.guard.restore()}this.fa2Program=null,this.quadTree=null,this.scatter=null,this.positionsReader=null,this.programsKey=``,this.killed=!0}}beginRun(e,{iterations:t=-1,duration:n}){if(this.killed)throw Error(`ForceAtlas2GPULayout: layout was killed`);if(!this.renderer.getGraph().order)return!1;this.running&&this.stopRun(`stop`),this.readGraph(),this.guard.save();try{this.ensurePrograms();let e=this.fa2Program;this.positionsReader.cancel(),e.setData({nodesPosition:this.nodesPositionArray,nodesMovement:this.nodesMovementArray,nodesMetadata:this.nodesMetadataArray,edges:this.edgesArray}),this.uploadSigmaIndices()}finally{this.guard.restore()}return this.bindGraphListeners(),this.clearBatchFences(),this.pendingMovedNodes.clear(),this.pendingFixedUpdates.clear(),this.backportPending=!1,this.remainingIterations=t,this.deadline=typeof n==`number`?performance.now()+n:null,this.lastBackportTime=performance.now(),this.mode=e,this.running=!0,this.emit(`started`),e===`live`?this.renderer.scheduleRender():this.scheduleHeadlessFrame(),!0}exhaustedBudgetReason(){return this.remainingIterations===0?`iterations`:this.deadline!==null&&performance.now()>=this.deadline?`duration`:null}stopRun(e,{backport:t=!0}={}){if(!this.running)return;this.running=!1,this.mode=null,this.deadline=null,this.headlessTimeout!==null&&(clearTimeout(this.headlessTimeout),this.headlessTimeout=null),this.unbindGraphListeners(),this.clearBatchFences();let n=this.fa2Program;if(n&&(this.positionsReader?.cancel(),this.backportPending=!1,t)){let e;this.guard.save();try{e=n.readPositionsSync()}finally{this.guard.restore()}this.applyPositions(e)}this.emit(`stopped`,{reason:e})}onFrame(){if(!this.running||this.mode!==`live`||!this.fa2Program||!this.scatter)return;let e=null;this.guard.save();try{this.sigmaIndicesDirty&&this.uploadSigmaIndices(),this.applyPendingMoves(),this.applyPendingFixedUpdates(),this.issueIterations(),e=this.exhaustedBudgetReason(),e||(this.runScatter(),this.pollBackport())}finally{this.guard.restore()}e?this.stopRun(e):this.renderer.scheduleRender()}scheduleHeadlessFrame(){this.headlessTimeout=setTimeout(()=>this.headlessFrame(),0)}headlessFrame(){if(this.headlessTimeout=null,!this.running||this.mode!==`headless`||!this.fa2Program)return;let e=null;this.guard.save();try{this.applyPendingMoves(),this.applyPendingFixedUpdates(),this.issueIterations(),e=this.exhaustedBudgetReason()}finally{this.guard.restore()}e?this.stopRun(e):this.scheduleHeadlessFrame()}issueIterations(){let{gl:t,params:n}=this,r=n.iterationsPerFrame===`auto`;if(this.batchFences=this.batchFences.filter(e=>t.clientWaitSync(e,0,0)===t.TIMEOUT_EXPIRED||(t.deleteSync(e),!1)),this.batchFences.length<e.MAX_PENDING_BATCHES){let e=this.getCurrentIterationsPerFrame();if(this.remainingIterations>=0&&(e=Math.min(e,this.remainingIterations)),e>0){this.fa2Program.setUniforms({edgeWeightInfluence:n.edgeWeightInfluence,scalingRatio:n.scalingRatio,gravity:n.gravity,maxForce:n.maxForce,slowDown:n.slowDown,outboundAttCompensation:this.outboundAttCompensation});for(let t=0;t<e;t++)this.runIteration();this.batchFences.push(t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0)),t.flush()}this.remainingIterations>0&&(this.remainingIterations-=e),r&&(this.adaptiveIterationsPerFrame=Math.min(n.maxIterationsPerFrame,this.adaptiveIterationsPerFrame*1.1+1))}else r&&(this.adaptiveIterationsPerFrame=Math.max(1,this.adaptiveIterationsPerFrame*.7))}runIteration(){let e=this.fa2Program;this.quadTree.compute(e.getPositionsTexture()),e.run(),this.totalIterations++}runScatter(){let e=this.renderer.getNodeDataTexture(),t=e.getTexture();if(!t)return;let n=this.renderer.getNormalizationFunction(),r=n.inverse({x:.5,y:.5});this.scatter.run({positionsTexture:this.fa2Program.getPositionsTexture(),targetTexture:t,targetWidth:e.getTextureWidth(),targetHeight:e.getTextureHeight(),normalization:{dX:r.x,dY:r.y,ratio:n.ratio}})}pollBackport(){let{backportInterval:e}=this.params;if(!Number.isFinite(e))return;let t=this.positionsReader;if(this.backportPending){let e=t.poll();e&&(this.applyPositions(e),this.backportPending=!1,this.lastBackportTime=performance.now())}!this.backportPending&&performance.now()-this.lastBackportTime>=e&&(this.backportPending=t.start(this.fa2Program.getPositionsTexture()))}applyPositions(e){this.renderer.getGraph().updateEachNodeAttributes((t,n)=>{let r=this.nodeDataCache[t];return r&&(n.x=e[R.nodesPosition*r.index],n.y=e[R.nodesPosition*r.index+1]),n},{attributes:[`x`,`y`]})}applyPendingMoves(){if(!this.pendingMovedNodes.size)return;let e=this.renderer.getGraph(),t=this.fa2Program;this.pendingMovedNodes.forEach(n=>{let r=this.nodeDataCache[n];if(!r||!e.hasNode(n))return;let i=e.getNodeAttributes(n),a=typeof i.x==`number`?i.x:0,o=typeof i.y==`number`?i.y:0;t.setPositionItem(r.index,new Float32Array([a,o,r.mass,0])),t.setMovementItem(r.index,new Float32Array([0,0,1,0]))}),this.pendingMovedNodes.clear()}applyPendingFixedUpdates(){if(!this.pendingFixedUpdates.size)return;let e=this.fa2Program;this.pendingFixedUpdates.forEach(t=>{let n=this.nodeDataCache[t];if(!n)return;let r=n.index*R.nodesMetadata;this.nodesMetadataArray[r+2]=+!!this.fixedNodes.has(t),e.setMetadataItem(n.index,this.nodesMetadataArray.subarray(r,r+R.nodesMetadata))}),this.pendingFixedUpdates.clear()}readGraph(){let e=this.renderer.getGraph(),t=[];this.nodeDataCache={},this.nodeKeys=e.nodes(),this.nodeKeys.forEach((e,n)=>{this.nodeDataCache[e]={index:n,mass:1},t[n]=[]}),e.forEachEdge((e,n,r,i)=>{let a=typeof n.weight==`number`?n.weight:1,o=this.nodeDataCache[r].index,s=this.nodeDataCache[i].index;t[o].push({weight:a,index:s}),t[s].push({weight:a,index:o}),this.nodeDataCache[r].mass+=a,this.nodeDataCache[i].mass+=a});let n=this.nodeKeys.length;this.edgeEntriesCount=e.size*2;let r=s(n),i=s(this.edgeEntriesCount);this.nodesPositionArray=new Float32Array(R.nodesPosition*r**2),this.nodesMovementArray=new Float32Array(R.nodesMovement*r**2),this.nodesMetadataArray=new Float32Array(R.nodesMetadata*r**2),this.edgesArray=new Float32Array(R.edges*i**2);let a=0,o=0;this.outboundAttCompensation=0,this.nodeKeys.forEach((n,r)=>{let i=e.getNodeAttributes(n),s=typeof i.x==`number`?i.x:0,c=typeof i.y==`number`?i.y:0,{mass:l}=this.nodeDataCache[n],u=t[r],d=u.length;a=r*R.nodesPosition,this.nodesPositionArray[a++]=s,this.nodesPositionArray[a++]=c,this.nodesPositionArray[a++]=l,this.outboundAttCompensation+=l,a=r*R.nodesMovement,this.nodesMovementArray[a++]=0,this.nodesMovementArray[a++]=0,this.nodesMovementArray[a++]=1,a=r*R.nodesMetadata,this.nodesMetadataArray[a++]=o,this.nodesMetadataArray[a++]=d,this.nodesMetadataArray[a++]=+!!this.fixedNodes.has(n);for(let e=0;e<d;e++){let{weight:t,index:n}=u[e];a=o*R.edges,this.edgesArray[a++]=n,this.edgesArray[a++]=t,o++}}),this.outboundAttCompensation/=n}ensurePrograms(){let{gl:e,params:t}=this,n=this.nodeKeys.length,r=t.quadTreeDepth===`auto`?k(n):t.quadTreeDepth;if(r<1||r>12)throw Error(`ForceAtlas2GPULayout: quadTreeDepth must be between 1 and 12`);let i=t.quadTreeTheta;if(i<.25||i>1)throw Error(`ForceAtlas2GPULayout: quadTreeTheta must be between 0.25 and 1`);let a=JSON.stringify([n,this.edgeEntriesCount,t.linLogMode,t.strongGravityMode,t.outboundAttractionDistribution,r,i]);a===this.programsKey&&this.fa2Program||(this.fa2Program?.kill(),this.quadTree?.kill(),this.scatter?.kill(),this.positionsReader?.kill(),this.quadTree=new P(e,{nodesCount:n},{depth:r}),this.fa2Program=new S(e,{nodesCount:n,edgeEntriesCount:this.edgeEntriesCount,linLogMode:t.linLogMode,strongGravityMode:t.strongGravityMode,outboundAttractionDistribution:t.outboundAttractionDistribution,quadTreeDepth:r,quadTreeTheta:i,boundariesTexture:this.quadTree.getBoundariesTexture(),quadTreeTexture:this.quadTree.getAtlasTexture()}),this.scatter=new L(e,{nodesCount:n}),this.positionsReader=new d(e,s(n)),this.programsKey=a)}uploadSigmaIndices(){if(!this.scatter)return;let e=this.renderer.getNodeDataTexture(),t=new Float32Array(this.nodeKeys.length);for(let n=0,r=this.nodeKeys.length;n<r;n++)t[n]=e.getIndex(this.nodeKeys[n]);this.scatter.setIndices(t),this.sigmaIndicesDirty=!1}bindGraphListeners(){let e=this.renderer.getGraph();e.on(`nodeAdded`,this.handleStructuralChange),e.on(`nodeDropped`,this.handleStructuralChange),e.on(`edgeAdded`,this.handleStructuralChange),e.on(`edgeDropped`,this.handleStructuralChange),e.on(`edgesCleared`,this.handleStructuralChange),e.on(`cleared`,this.handleStructuralChange),e.on(`nodeAttributesUpdated`,this.handleNodeUpdate)}unbindGraphListeners(){let e=this.renderer.getGraph();e.off(`nodeAdded`,this.handleStructuralChange),e.off(`nodeDropped`,this.handleStructuralChange),e.off(`edgeAdded`,this.handleStructuralChange),e.off(`edgeDropped`,this.handleStructuralChange),e.off(`edgesCleared`,this.handleStructuralChange),e.off(`cleared`,this.handleStructuralChange),e.off(`nodeAttributesUpdated`,this.handleNodeUpdate)}clearBatchFences(){this.batchFences.forEach(e=>this.gl.deleteSync(e)),this.batchFences=[]}};export{z as t};