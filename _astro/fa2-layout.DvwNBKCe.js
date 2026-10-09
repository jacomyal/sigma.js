import{r as N,p as w,s as g,T as X}from"./graphology.BwGEgIxD.js";const F=8;class G{constructor(e){this.program=null,this.vao=null,this.drawFramebuffer=null,this.readFramebuffer=null,this.viewport=new Int32Array(4),this.blend=!1,this.blendSrcRGB=WebGL2RenderingContext.ONE,this.blendDstRGB=WebGL2RenderingContext.ZERO,this.blendSrcAlpha=WebGL2RenderingContext.ONE,this.blendDstAlpha=WebGL2RenderingContext.ZERO,this.blendEquationRGB=WebGL2RenderingContext.FUNC_ADD,this.blendEquationAlpha=WebGL2RenderingContext.FUNC_ADD,this.colorMask=[!0,!0,!0,!0],this.activeTexture=WebGL2RenderingContext.TEXTURE0,this.textures=[],this.gl=e}save(){const{gl:e}=this;this.program=e.getParameter(e.CURRENT_PROGRAM),this.vao=e.getParameter(e.VERTEX_ARRAY_BINDING),this.drawFramebuffer=e.getParameter(e.DRAW_FRAMEBUFFER_BINDING),this.readFramebuffer=e.getParameter(e.READ_FRAMEBUFFER_BINDING),this.viewport=e.getParameter(e.VIEWPORT),this.blend=e.isEnabled(e.BLEND),this.blendSrcRGB=e.getParameter(e.BLEND_SRC_RGB),this.blendDstRGB=e.getParameter(e.BLEND_DST_RGB),this.blendSrcAlpha=e.getParameter(e.BLEND_SRC_ALPHA),this.blendDstAlpha=e.getParameter(e.BLEND_DST_ALPHA),this.blendEquationRGB=e.getParameter(e.BLEND_EQUATION_RGB),this.blendEquationAlpha=e.getParameter(e.BLEND_EQUATION_ALPHA),this.colorMask=e.getParameter(e.COLOR_WRITEMASK),this.activeTexture=e.getParameter(e.ACTIVE_TEXTURE);for(let t=0;t<F;t++)e.activeTexture(e.TEXTURE0+t),this.textures[t]=e.getParameter(e.TEXTURE_BINDING_2D);e.activeTexture(this.activeTexture)}restore(){const{gl:e}=this;for(let t=0;t<F;t++)e.activeTexture(e.TEXTURE0+t),e.bindTexture(e.TEXTURE_2D,this.textures[t]);e.activeTexture(this.activeTexture),e.useProgram(this.program),e.bindVertexArray(this.vao),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,this.drawFramebuffer),e.bindFramebuffer(e.READ_FRAMEBUFFER,this.readFramebuffer),e.viewport(this.viewport[0],this.viewport[1],this.viewport[2],this.viewport[3]),this.blend?e.enable(e.BLEND):e.disable(e.BLEND),e.blendFuncSeparate(this.blendSrcRGB,this.blendDstRGB,this.blendSrcAlpha,this.blendDstAlpha),e.blendEquationSeparate(this.blendEquationRGB,this.blendEquationAlpha),e.colorMask(this.colorMask[0],this.colorMask[1],this.colorMask[2],this.colorMask[3]),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)}}const z={linLogMode:!1,strongGravityMode:!1,outboundAttractionDistribution:!1,edgeWeightInfluence:1,scalingRatio:1,gravity:1,slowDown:1,maxForce:1e3,quadTreeDepth:"auto",quadTreeTheta:1,iterationsPerFrame:"auto",maxIterationsPerFrame:100,backportInterval:200};function f(i){return Math.ceil(Math.sqrt(i))}function x(i,e,t,r="program",o="a_position"){const n=i.createProgram();if(i.attachShader(n,N(i,e)),i.attachShader(n,w(i,t)),i.bindAttribLocation(n,0,o),i.linkProgram(n),!i.getProgramParameter(n,i.LINK_STATUS))throw new Error(`Failed to link ${r}: `+i.getProgramInfoLog(n));return n}function l(i,e,t=e){const r=i.createTexture();return i.bindTexture(i.TEXTURE_2D,r),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,e,t,0,i.RGBA,i.FLOAT,null),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),r}function A(i,e,t="framebuffer"){const r=i.createFramebuffer();if(i.bindFramebuffer(i.FRAMEBUFFER,r),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,e,0),i.checkFramebufferStatus(i.FRAMEBUFFER)!==i.FRAMEBUFFER_COMPLETE)throw new Error(`${t} is not complete`);return i.bindFramebuffer(i.FRAMEBUFFER,null),r}class k{gl;pbo;framebuffer;width;height;array;fence=null;constructor(e,t=1,r=t){this.gl=e,this.width=t,this.height=r,this.array=new Float32Array(t*r*4),this.pbo=e.createBuffer(),e.bindBuffer(e.PIXEL_PACK_BUFFER,this.pbo),e.bufferData(e.PIXEL_PACK_BUFFER,this.array.byteLength,e.STREAM_READ),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),this.framebuffer=e.createFramebuffer()}start(e){const{gl:t}=this;return this.fence?!1:(t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,e,0),t.readBuffer(t.COLOR_ATTACHMENT0),t.bindBuffer(t.PIXEL_PACK_BUFFER,this.pbo),t.pixelStorei(t.PACK_ALIGNMENT,1),t.readPixels(0,0,this.width,this.height,t.RGBA,t.FLOAT,0),t.bindBuffer(t.PIXEL_PACK_BUFFER,null),t.bindFramebuffer(t.FRAMEBUFFER,null),this.fence=t.fenceSync(t.SYNC_GPU_COMMANDS_COMPLETE,0),t.flush(),!0)}poll(){const{gl:e}=this;if(!this.fence)return null;const t=e.clientWaitSync(this.fence,0,0);if(t===e.TIMEOUT_EXPIRED)return null;if(e.deleteSync(this.fence),this.fence=null,t===e.WAIT_FAILED)throw new Error("AsyncTexelsReader: failed to wait for the read fence");return e.bindBuffer(e.PIXEL_PACK_BUFFER,this.pbo),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,this.array),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),this.array}cancel(){this.fence&&(this.gl.deleteSync(this.fence),this.fence=null)}kill(){this.cancel(),this.gl.deleteBuffer(this.pbo),this.gl.deleteFramebuffer(this.framebuffer)}}const _=`#version 300 es
in vec2 a_position;

out vec2 v_textureCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_textureCoord = (a_position + vec2(1.0, 1.0)) / 2.0;
}`,q=`
vec4 getValueInTexture(sampler2D inputTexture, float index, float textureSize) {
  float row = floor(index / textureSize);
  float col = index - row * textureSize;

  return texelFetch(inputTexture, ivec2(int(col), int(row)), 0);
}
`,V=`
float getIndex(vec2 positionInTexture, float textureSize) {
  float col = floor(positionInTexture.x * textureSize);
  float row = floor(positionInTexture.y * textureSize);
  return row * textureSize + col;
}
`;function H({nodesCount:i,edgeEntriesCount:e,linLogMode:t,strongGravityMode:r,outboundAttractionDistribution:o,quadTreeDepth:n,quadTreeTheta:s}){const a=Math.max(1,Math.ceil(1/s));return`#version 300 es
precision highp float;

#define NODES_COUNT ${g(i)}
#define NODES_TEXTURE_SIZE ${g(f(i))}
#define EDGES_TEXTURE_SIZE ${g(f(e))}
#define QUAD_TREE_DEPTH ${Math.floor(n)}
#define QUAD_TREE_RING ${Math.floor(a)}
${t?"#define LINLOG_MODE":""}
${r?"#define STRONG_GRAVITY_MODE":""}
${o?"#define OUTBOUND_ATTRACTION_DISTRIBUTION":""}

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
${q}
${V}

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
}`}const v=0,P=1,S=2,D=3,U=4,y=5;class W{gl;nodesTextureSize;edgesTextureSize;program;vao;quadBuffer;positionTextures;movementTextures;framebuffers;current=0;metadataTexture;edgesTexture;boundariesTexture;quadTreeTexture;uniformLocations;constructor(e,t){this.gl=e,this.nodesTextureSize=f(t.nodesCount),this.edgesTextureSize=f(t.edgeEntriesCount),this.boundariesTexture=t.boundariesTexture,this.quadTreeTexture=t.quadTreeTexture,this.program=x(e,_,H(t),"ForceAtlas2"),this.uniformLocations={edgeWeightInfluence:e.getUniformLocation(this.program,"u_edgeWeightInfluence"),scalingRatio:e.getUniformLocation(this.program,"u_scalingRatio"),gravity:e.getUniformLocation(this.program,"u_gravity"),maxForce:e.getUniformLocation(this.program,"u_maxForce"),slowDown:e.getUniformLocation(this.program,"u_slowDown"),outboundAttCompensation:e.getUniformLocation(this.program,"u_outboundAttCompensation")},e.useProgram(this.program),e.uniform1i(e.getUniformLocation(this.program,"u_nodesPositionTexture"),v),e.uniform1i(e.getUniformLocation(this.program,"u_nodesMovementTexture"),P),e.uniform1i(e.getUniformLocation(this.program,"u_nodesMetadataTexture"),S),e.uniform1i(e.getUniformLocation(this.program,"u_edgesTexture"),D),e.uniform1i(e.getUniformLocation(this.program,"u_boundariesTexture"),U),e.uniform1i(e.getUniformLocation(this.program,"u_quadTreeTexture"),y),this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.quadBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null);const r=this.nodesTextureSize;this.positionTextures=[l(e,r),l(e,r)],this.movementTextures=[l(e,r),l(e,r)],this.framebuffers=[0,1].map(o=>{const n=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.positionTextures[o],0),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT1,e.TEXTURE_2D,this.movementTextures[o],0),e.drawBuffers([e.COLOR_ATTACHMENT0,e.COLOR_ATTACHMENT1]),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw new Error("ForceAtlas2Program: framebuffer is not complete");return n}),e.bindFramebuffer(e.FRAMEBUFFER,null),this.metadataTexture=l(e,r),this.edgesTexture=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.edgesTexture),e.texImage2D(e.TEXTURE_2D,0,e.RG32F,this.edgesTextureSize,this.edgesTextureSize,0,e.RG,e.FLOAT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}setData({nodesPosition:e,nodesMovement:t,nodesMetadata:r,edges:o}){const{gl:n}=this,s=this.nodesTextureSize;n.pixelStorei(n.UNPACK_ALIGNMENT,1),n.bindTexture(n.TEXTURE_2D,this.positionTextures[this.current]),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,s,s,0,n.RGBA,n.FLOAT,e),n.bindTexture(n.TEXTURE_2D,this.movementTextures[this.current]),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,s,s,0,n.RGBA,n.FLOAT,t),n.bindTexture(n.TEXTURE_2D,this.metadataTexture),n.texImage2D(n.TEXTURE_2D,0,n.RGBA32F,s,s,0,n.RGBA,n.FLOAT,r),n.bindTexture(n.TEXTURE_2D,this.edgesTexture),n.texImage2D(n.TEXTURE_2D,0,n.RG32F,this.edgesTextureSize,this.edgesTextureSize,0,n.RG,n.FLOAT,o)}setPositionItem(e,t){this.setTexel(this.positionTextures[this.current],e,t)}setMovementItem(e,t){this.setTexel(this.movementTextures[this.current],e,t)}setMetadataItem(e,t){this.setTexel(this.metadataTexture,e,t)}setTexel(e,t,r){const{gl:o}=this,n=this.nodesTextureSize,s=t%n,a=Math.floor(t/n);o.bindTexture(o.TEXTURE_2D,e),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texSubImage2D(o.TEXTURE_2D,0,s,a,1,1,o.RGBA,o.FLOAT,r)}setUniforms(e){const{gl:t,uniformLocations:r}=this;t.useProgram(this.program);for(const o in e)t.uniform1f(r[o],e[o])}run(){const{gl:e}=this,t=this.nodesTextureSize;e.useProgram(this.program),e.bindVertexArray(this.vao),e.viewport(0,0,t,t),e.disable(e.BLEND),e.activeTexture(e.TEXTURE0+v),e.bindTexture(e.TEXTURE_2D,this.positionTextures[this.current]),e.activeTexture(e.TEXTURE0+P),e.bindTexture(e.TEXTURE_2D,this.movementTextures[this.current]),e.activeTexture(e.TEXTURE0+S),e.bindTexture(e.TEXTURE_2D,this.metadataTexture),e.activeTexture(e.TEXTURE0+D),e.bindTexture(e.TEXTURE_2D,this.edgesTexture),e.activeTexture(e.TEXTURE0+U),e.bindTexture(e.TEXTURE_2D,this.boundariesTexture),e.activeTexture(e.TEXTURE0+y),e.bindTexture(e.TEXTURE_2D,this.quadTreeTexture),e.bindFramebuffer(e.FRAMEBUFFER,this.framebuffers[1-this.current]),e.drawArrays(e.TRIANGLE_STRIP,0,4),this.current=1-this.current}getPositionsTexture(){return this.positionTextures[this.current]}readPositionsSync(){const{gl:e}=this,t=this.nodesTextureSize,r=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,this.getPositionsTexture(),0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)throw e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(r),new Error("ForceAtlas2Program: failed to create framebuffer for reading positions");const o=new Float32Array(t*t*4);return e.pixelStorei(e.PACK_ALIGNMENT,1),e.readPixels(0,0,t,t,e.RGBA,e.FLOAT,o),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(r),o}kill(){const{gl:e}=this;e.deleteProgram(this.program),e.deleteVertexArray(this.vao),e.deleteBuffer(this.quadBuffer),this.positionTextures.forEach(t=>e.deleteTexture(t)),this.movementTextures.forEach(t=>e.deleteTexture(t)),this.framebuffers.forEach(t=>e.deleteFramebuffer(t)),e.deleteTexture(this.metadataTexture),e.deleteTexture(this.edgesTexture)}}function K({nodesCount:i}){return`#version 300 es
precision highp float;

#define NODES_COUNT ${Math.floor(i)}
#define SOURCE_SIZE ${Math.floor(f(i))}
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
}`}function Q(){return`#version 300 es
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
}`}const M=4;class Y{gl;passSizes;initProgram;reduceProgram;initUniformLocations;reduceUniformLocations;vao;quadBuffer;pingTexture;pongTexture;boundariesTexture;pingFramebuffer;pongFramebuffer;boundariesFramebuffer;constructor(e,{nodesCount:t}){for(this.gl=e,this.passSizes=[Math.ceil(f(t)/M)];this.passSizes[this.passSizes.length-1]>1;)this.passSizes.push(Math.ceil(this.passSizes[this.passSizes.length-1]/M));this.initProgram=x(e,_,K({nodesCount:t}),"boundaries init program"),this.reduceProgram=x(e,_,Q(),"boundaries reduce program"),this.initUniformLocations={nodesPositionTexture:e.getUniformLocation(this.initProgram,"u_nodesPositionTexture")},this.reduceUniformLocations={inputTexture:e.getUniformLocation(this.reduceProgram,"u_inputTexture"),inputSize:e.getUniformLocation(this.reduceProgram,"u_inputSize")},this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.quadBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.quadBuffer),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null);const r=this.passSizes[0];this.pingTexture=l(e,r),this.pongTexture=l(e,r),this.boundariesTexture=l(e,1),this.pingFramebuffer=A(e,this.pingTexture,"BoundariesGPU ping framebuffer"),this.pongFramebuffer=A(e,this.pongTexture,"BoundariesGPU pong framebuffer"),this.boundariesFramebuffer=A(e,this.boundariesTexture,"BoundariesGPU boundaries framebuffer")}compute(e){const{gl:t,passSizes:r}=this;t.bindVertexArray(this.vao),t.disable(t.BLEND),r.forEach((o,n)=>{const s=o===1;n===0?(t.useProgram(this.initProgram),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.uniform1i(this.initUniformLocations.nodesPositionTexture,0)):(t.useProgram(this.reduceProgram),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,n%2===1?this.pingTexture:this.pongTexture),t.uniform1i(this.reduceUniformLocations.inputTexture,0),t.uniform1i(this.reduceUniformLocations.inputSize,r[n-1]));const a=s?this.boundariesFramebuffer:n%2===0?this.pingFramebuffer:this.pongFramebuffer;t.bindFramebuffer(t.FRAMEBUFFER,a),t.viewport(0,0,o,o),t.drawArrays(t.TRIANGLE_STRIP,0,4)}),t.bindVertexArray(null),t.bindFramebuffer(t.FRAMEBUFFER,null)}getBoundariesTexture(){return this.boundariesTexture}kill(){const{gl:e}=this;e.deleteProgram(this.initProgram),e.deleteProgram(this.reduceProgram),e.deleteVertexArray(this.vao),e.deleteBuffer(this.quadBuffer),e.deleteTexture(this.pingTexture),e.deleteTexture(this.pongTexture),e.deleteTexture(this.boundariesTexture),e.deleteFramebuffer(this.pingFramebuffer),e.deleteFramebuffer(this.pongFramebuffer),e.deleteFramebuffer(this.boundariesFramebuffer)}}function Z(){return`#version 300 es
precision highp float;

in vec3 v_positionAndMass;

layout(location = 0) out vec4 cellOutput;

void main() {
  float mass = v_positionAndMass.z;
  cellOutput = vec4(v_positionAndMass.xy * mass, mass, 1.0);
}`}function $({nodesCount:i}){return`#version 300 es
precision highp float;

#define NODES_TEXTURE_SIZE ${Math.floor(f(i))}

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
}`}function j(i){return Math.max(3,Math.min(11,Math.ceil(Math.log2(Math.max(i,2))/2)))}function J(i){return 2**(i+1)}function ee(i){return 2**(i+1)-2}function I(i){return 2**i}function L(i){return 2**(i+1)-2}class te{gl;nodesCount;params;boundaries;splatProgram;splatVAO;splatUniformLocations;atlasTexture;atlasFramebuffer;constructor(e,{nodesCount:t},r){this.gl=e,this.nodesCount=t,this.params=r,this.boundaries=new Y(e,{nodesCount:t}),this.splatProgram=x(e,$({nodesCount:t}),Z(),"splat program"),this.splatUniformLocations={nodesPositionTexture:e.getUniformLocation(this.splatProgram,"u_nodesPositionTexture"),boundariesTexture:e.getUniformLocation(this.splatProgram,"u_boundariesTexture"),gridSize:e.getUniformLocation(this.splatProgram,"u_gridSize")},this.splatVAO=e.createVertexArray();const{depth:o}=this.params;this.atlasTexture=l(e,I(o),L(o)),this.atlasFramebuffer=A(e,this.atlasTexture,"QuadTreeGPU atlas framebuffer")}compute(e){const{gl:t,boundaries:r,splatProgram:o,splatVAO:n,atlasFramebuffer:s}=this,{depth:a}=this.params;r.compute(e),t.useProgram(o),t.bindVertexArray(n),t.bindFramebuffer(t.FRAMEBUFFER,s),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.uniform1i(this.splatUniformLocations.nodesPositionTexture,0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r.getBoundariesTexture()),t.uniform1i(this.splatUniformLocations.boundariesTexture,1),t.viewport(0,0,I(a),L(a)),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.enable(t.BLEND),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ONE);for(let d=0;d<a;d++){const u=J(d);t.viewport(0,ee(d),u,u),t.uniform1f(this.splatUniformLocations.gridSize,u),t.drawArrays(t.POINTS,0,this.nodesCount)}t.disable(t.BLEND),t.bindVertexArray(null),t.bindFramebuffer(t.FRAMEBUFFER,null)}getAtlasTexture(){return this.atlasTexture}getBoundariesTexture(){return this.boundaries.getBoundariesTexture()}getDepth(){return this.params.depth}kill(){const{gl:e}=this;this.boundaries.kill(),e.deleteProgram(this.splatProgram),e.deleteVertexArray(this.splatVAO),e.deleteTexture(this.atlasTexture),e.deleteFramebuffer(this.atlasFramebuffer)}}function re(){return`#version 300 es
precision highp float;

in vec2 v_position;

layout(location = 0) out vec4 fragColor;

void main() {
  fragColor = vec4(v_position, 0.0, 0.0);
}`}function ie({nodesCount:i}){return`#version 300 es
precision highp float;

#define NODES_TEXTURE_SIZE ${Math.floor(f(i))}
#define TEXELS_PER_NODE ${g(2)}

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
}`}class oe{gl;nodesCount;program;vao;indicesBuffer;framebuffer;attachedTexture=null;uniformLocations;constructor(e,{nodesCount:t}){this.gl=e,this.nodesCount=t,this.program=x(e,ie({nodesCount:t}),re(),"scatter program","a_sigmaIndex"),this.uniformLocations={nodesPositionTexture:e.getUniformLocation(this.program,"u_nodesPositionTexture"),normalization:e.getUniformLocation(this.program,"u_normalization"),targetSize:e.getUniformLocation(this.program,"u_targetSize")},this.vao=e.createVertexArray(),e.bindVertexArray(this.vao),this.indicesBuffer=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,this.indicesBuffer),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,1,e.FLOAT,!1,0,0),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),this.framebuffer=e.createFramebuffer()}setIndices(e){const{gl:t}=this;t.bindBuffer(t.ARRAY_BUFFER,this.indicesBuffer),t.bufferData(t.ARRAY_BUFFER,e,t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,null)}run({positionsTexture:e,targetTexture:t,targetWidth:r,targetHeight:o,normalization:n}){const{gl:s}=this;s.useProgram(this.program),s.bindVertexArray(this.vao),s.bindFramebuffer(s.FRAMEBUFFER,this.framebuffer),this.attachedTexture!==t&&(s.framebufferTexture2D(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,t,0),this.attachedTexture=t),s.activeTexture(s.TEXTURE0),s.bindTexture(s.TEXTURE_2D,e),s.uniform1i(this.uniformLocations.nodesPositionTexture,0),s.uniform3f(this.uniformLocations.normalization,n.dX,n.dY,n.ratio),s.uniform2f(this.uniformLocations.targetSize,r,o),s.viewport(0,0,r,o),s.disable(s.BLEND),s.colorMask(!0,!0,!1,!1),s.drawArrays(s.POINTS,0,this.nodesCount),s.colorMask(!0,!0,!0,!0),s.bindVertexArray(null),s.bindFramebuffer(s.FRAMEBUFFER,null)}kill(){const{gl:e}=this;e.deleteProgram(this.program),e.deleteVertexArray(this.vao),e.deleteBuffer(this.indicesBuffer),e.deleteFramebuffer(this.framebuffer)}}const h={nodesPosition:4,nodesMovement:4,nodesMetadata:4,edges:2};class C extends X{static MAX_PENDING_BATCHES=2;renderer;gl;guard;params;running=!1;mode=null;remainingIterations=-1;deadline=null;headlessTimeout=null;totalIterations=0;adaptiveIterationsPerFrame=10;batchFences=[];lastBackportTime=0;backportPending=!1;pendingMovedNodes=new Set;fixedNodes=new Set;pendingFixedUpdates=new Set;sigmaIndicesDirty=!0;killed=!1;nodeKeys=[];nodeDataCache={};edgeEntriesCount=0;outboundAttCompensation=0;nodesPositionArray=new Float32Array;nodesMovementArray=new Float32Array;nodesMetadataArray=new Float32Array;edgesArray=new Float32Array;fa2Program=null;quadTree=null;scatter=null;positionsReader=null;programsKey="";handleFrame=()=>this.onFrame();handleAfterProcess=()=>{this.sigmaIndicesDirty=!0};handleRendererKill=()=>this.kill();handleStructuralChange=()=>this.stopRun("structure");handleNodeUpdate=e=>{(e.type==="set"||e.type==="remove"?e.name==="x"||e.name==="y":e.type==="merge"||e.type==="update"?!!e.data&&("x"in e.data||"y"in e.data):!0)&&this.pendingMovedNodes.add(e.key)};constructor(e,t={}){if(super(),this.renderer=e,this.gl=e.getWebGLContext(),this.guard=new G(this.gl),this.params={...z,...t},!this.gl.getExtension("EXT_color_buffer_float"))throw new Error("ForceAtlas2GPULayout: EXT_color_buffer_float extension not supported");if(!this.gl.getExtension("EXT_float_blend"))throw new Error("ForceAtlas2GPULayout: EXT_float_blend extension not supported");e.on("afterTexturesUpload",this.handleFrame),e.on("afterProcess",this.handleAfterProcess),e.on("kill",this.handleRendererKill)}start(e=-1){this.beginRun("live",typeof e=="number"?{iterations:e}:e)}run(e={}){return this.beginRun("headless",e)?new Promise(r=>{this.once("stopped",({reason:o})=>r(o))}):Promise.resolve("stop")}stop(){this.stopRun("stop")}isRunning(){return this.running}getTotalIterations(){return this.totalIterations}getCurrentIterationsPerFrame(){const{iterationsPerFrame:e,maxIterationsPerFrame:t}=this.params,r=e==="auto"?Math.round(this.adaptiveIterationsPerFrame):e;return Math.max(1,Math.min(r,t))}getSettings(){return{...this.params}}setSettings(e){this.params={...this.params,...e}}setNodeFixed(e,t){t!==this.fixedNodes.has(e)&&(t?this.fixedNodes.add(e):this.fixedNodes.delete(e),this.running&&this.pendingFixedUpdates.add(e))}isNodeFixed(e){return this.fixedNodes.has(e)}kill(){if(!this.killed){this.running&&this.stopRun("kill",{backport:!1}),this.renderer.off("afterTexturesUpload",this.handleFrame),this.renderer.off("afterProcess",this.handleAfterProcess),this.renderer.off("kill",this.handleRendererKill),this.guard.save();try{this.fa2Program?.kill(),this.quadTree?.kill(),this.scatter?.kill(),this.positionsReader?.kill()}finally{this.guard.restore()}this.fa2Program=null,this.quadTree=null,this.scatter=null,this.positionsReader=null,this.programsKey="",this.killed=!0}}beginRun(e,{iterations:t=-1,duration:r}){if(this.killed)throw new Error("ForceAtlas2GPULayout: layout was killed");if(!this.renderer.getGraph().order)return!1;this.running&&this.stopRun("stop"),this.readGraph(),this.guard.save();try{this.ensurePrograms();const n=this.fa2Program;this.positionsReader.cancel(),n.setData({nodesPosition:this.nodesPositionArray,nodesMovement:this.nodesMovementArray,nodesMetadata:this.nodesMetadataArray,edges:this.edgesArray}),this.uploadSigmaIndices()}finally{this.guard.restore()}return this.bindGraphListeners(),this.clearBatchFences(),this.pendingMovedNodes.clear(),this.pendingFixedUpdates.clear(),this.backportPending=!1,this.remainingIterations=t,this.deadline=typeof r=="number"?performance.now()+r:null,this.lastBackportTime=performance.now(),this.mode=e,this.running=!0,this.emit("started"),e==="live"?this.renderer.scheduleRender():this.scheduleHeadlessFrame(),!0}exhaustedBudgetReason(){return this.remainingIterations===0?"iterations":this.deadline!==null&&performance.now()>=this.deadline?"duration":null}stopRun(e,{backport:t=!0}={}){if(!this.running)return;this.running=!1,this.mode=null,this.deadline=null,this.headlessTimeout!==null&&(clearTimeout(this.headlessTimeout),this.headlessTimeout=null),this.unbindGraphListeners(),this.clearBatchFences();const r=this.fa2Program;if(r&&(this.positionsReader?.cancel(),this.backportPending=!1,t)){let o;this.guard.save();try{o=r.readPositionsSync()}finally{this.guard.restore()}this.applyPositions(o)}this.emit("stopped",{reason:e})}onFrame(){if(!this.running||this.mode!=="live"||!this.fa2Program||!this.scatter)return;let e=null;this.guard.save();try{this.sigmaIndicesDirty&&this.uploadSigmaIndices(),this.applyPendingMoves(),this.applyPendingFixedUpdates(),this.issueIterations(),e=this.exhaustedBudgetReason(),e||(this.runScatter(),this.pollBackport())}finally{this.guard.restore()}if(e){this.stopRun(e);return}this.renderer.scheduleRender()}scheduleHeadlessFrame(){this.headlessTimeout=setTimeout(()=>this.headlessFrame(),0)}headlessFrame(){if(this.headlessTimeout=null,!this.running||this.mode!=="headless"||!this.fa2Program)return;let e=null;this.guard.save();try{this.applyPendingMoves(),this.applyPendingFixedUpdates(),this.issueIterations(),e=this.exhaustedBudgetReason()}finally{this.guard.restore()}if(e){this.stopRun(e);return}this.scheduleHeadlessFrame()}issueIterations(){const{gl:e,params:t}=this,r=t.iterationsPerFrame==="auto";if(this.batchFences=this.batchFences.filter(o=>e.clientWaitSync(o,0,0)===e.TIMEOUT_EXPIRED?!0:(e.deleteSync(o),!1)),this.batchFences.length<C.MAX_PENDING_BATCHES){let o=this.getCurrentIterationsPerFrame();if(this.remainingIterations>=0&&(o=Math.min(o,this.remainingIterations)),o>0){this.fa2Program.setUniforms({edgeWeightInfluence:t.edgeWeightInfluence,scalingRatio:t.scalingRatio,gravity:t.gravity,maxForce:t.maxForce,slowDown:t.slowDown,outboundAttCompensation:this.outboundAttCompensation});for(let n=0;n<o;n++)this.runIteration();this.batchFences.push(e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0)),e.flush()}this.remainingIterations>0&&(this.remainingIterations-=o),r&&(this.adaptiveIterationsPerFrame=Math.min(t.maxIterationsPerFrame,this.adaptiveIterationsPerFrame*1.1+1))}else r&&(this.adaptiveIterationsPerFrame=Math.max(1,this.adaptiveIterationsPerFrame*.7))}runIteration(){const e=this.fa2Program;this.quadTree.compute(e.getPositionsTexture()),e.run(),this.totalIterations++}runScatter(){const e=this.renderer.getNodeDataTexture(),t=e.getTexture();if(!t)return;const r=this.renderer.getNormalizationFunction(),o=r.inverse({x:.5,y:.5});this.scatter.run({positionsTexture:this.fa2Program.getPositionsTexture(),targetTexture:t,targetWidth:e.getTextureWidth(),targetHeight:e.getTextureHeight(),normalization:{dX:o.x,dY:o.y,ratio:r.ratio}})}pollBackport(){const{backportInterval:e}=this.params;if(!Number.isFinite(e))return;const t=this.positionsReader;if(this.backportPending){const r=t.poll();r&&(this.applyPositions(r),this.backportPending=!1,this.lastBackportTime=performance.now())}!this.backportPending&&performance.now()-this.lastBackportTime>=e&&(this.backportPending=t.start(this.fa2Program.getPositionsTexture()))}applyPositions(e){this.renderer.getGraph().updateEachNodeAttributes((r,o)=>{const n=this.nodeDataCache[r];return n&&(o.x=e[h.nodesPosition*n.index],o.y=e[h.nodesPosition*n.index+1]),o},{attributes:["x","y"]})}applyPendingMoves(){if(!this.pendingMovedNodes.size)return;const e=this.renderer.getGraph(),t=this.fa2Program;this.pendingMovedNodes.forEach(r=>{const o=this.nodeDataCache[r];if(!o||!e.hasNode(r))return;const n=e.getNodeAttributes(r),s=typeof n.x=="number"?n.x:0,a=typeof n.y=="number"?n.y:0;t.setPositionItem(o.index,new Float32Array([s,a,o.mass,0])),t.setMovementItem(o.index,new Float32Array([0,0,1,0]))}),this.pendingMovedNodes.clear()}applyPendingFixedUpdates(){if(!this.pendingFixedUpdates.size)return;const e=this.fa2Program;this.pendingFixedUpdates.forEach(t=>{const r=this.nodeDataCache[t];if(!r)return;const o=r.index*h.nodesMetadata;this.nodesMetadataArray[o+2]=this.fixedNodes.has(t)?1:0,e.setMetadataItem(r.index,this.nodesMetadataArray.subarray(o,o+h.nodesMetadata))}),this.pendingFixedUpdates.clear()}readGraph(){const e=this.renderer.getGraph(),t=[];this.nodeDataCache={},this.nodeKeys=e.nodes(),this.nodeKeys.forEach((d,u)=>{this.nodeDataCache[d]={index:u,mass:1},t[u]=[]}),e.forEachEdge((d,u,c,p)=>{const T=typeof u.weight=="number"?u.weight:1,m=this.nodeDataCache[c].index,E=this.nodeDataCache[p].index;t[m].push({weight:T,index:E}),t[E].push({weight:T,index:m}),this.nodeDataCache[c].mass+=T,this.nodeDataCache[p].mass+=T});const r=this.nodeKeys.length;this.edgeEntriesCount=e.size*2;const o=f(r),n=f(this.edgeEntriesCount);this.nodesPositionArray=new Float32Array(h.nodesPosition*o**2),this.nodesMovementArray=new Float32Array(h.nodesMovement*o**2),this.nodesMetadataArray=new Float32Array(h.nodesMetadata*o**2),this.edgesArray=new Float32Array(h.edges*n**2);let s=0,a=0;this.outboundAttCompensation=0,this.nodeKeys.forEach((d,u)=>{const c=e.getNodeAttributes(d),p=typeof c.x=="number"?c.x:0,T=typeof c.y=="number"?c.y:0,{mass:m}=this.nodeDataCache[d],E=t[u],R=E.length;s=u*h.nodesPosition,this.nodesPositionArray[s++]=p,this.nodesPositionArray[s++]=T,this.nodesPositionArray[s++]=m,this.outboundAttCompensation+=m,s=u*h.nodesMovement,this.nodesMovementArray[s++]=0,this.nodesMovementArray[s++]=0,this.nodesMovementArray[s++]=1,s=u*h.nodesMetadata,this.nodesMetadataArray[s++]=a,this.nodesMetadataArray[s++]=R,this.nodesMetadataArray[s++]=this.fixedNodes.has(d)?1:0;for(let b=0;b<R;b++){const{weight:B,index:O}=E[b];s=a*h.edges,this.edgesArray[s++]=O,this.edgesArray[s++]=B,a++}}),this.outboundAttCompensation/=r}ensurePrograms(){const{gl:e,params:t}=this,r=this.nodeKeys.length,o=t.quadTreeDepth==="auto"?j(r):t.quadTreeDepth;if(o<1||o>12)throw new Error("ForceAtlas2GPULayout: quadTreeDepth must be between 1 and 12");const n=t.quadTreeTheta;if(n<.25||n>1)throw new Error("ForceAtlas2GPULayout: quadTreeTheta must be between 0.25 and 1");const s=JSON.stringify([r,this.edgeEntriesCount,t.linLogMode,t.strongGravityMode,t.outboundAttractionDistribution,o,n]);s===this.programsKey&&this.fa2Program||(this.fa2Program?.kill(),this.quadTree?.kill(),this.scatter?.kill(),this.positionsReader?.kill(),this.quadTree=new te(e,{nodesCount:r},{depth:o}),this.fa2Program=new W(e,{nodesCount:r,edgeEntriesCount:this.edgeEntriesCount,linLogMode:t.linLogMode,strongGravityMode:t.strongGravityMode,outboundAttractionDistribution:t.outboundAttractionDistribution,quadTreeDepth:o,quadTreeTheta:n,boundariesTexture:this.quadTree.getBoundariesTexture(),quadTreeTexture:this.quadTree.getAtlasTexture()}),this.scatter=new oe(e,{nodesCount:r}),this.positionsReader=new k(e,f(r)),this.programsKey=s)}uploadSigmaIndices(){if(!this.scatter)return;const e=this.renderer.getNodeDataTexture(),t=new Float32Array(this.nodeKeys.length);for(let r=0,o=this.nodeKeys.length;r<o;r++)t[r]=e.getIndex(this.nodeKeys[r]);this.scatter.setIndices(t),this.sigmaIndicesDirty=!1}bindGraphListeners(){const e=this.renderer.getGraph();e.on("nodeAdded",this.handleStructuralChange),e.on("nodeDropped",this.handleStructuralChange),e.on("edgeAdded",this.handleStructuralChange),e.on("edgeDropped",this.handleStructuralChange),e.on("edgesCleared",this.handleStructuralChange),e.on("cleared",this.handleStructuralChange),e.on("nodeAttributesUpdated",this.handleNodeUpdate)}unbindGraphListeners(){const e=this.renderer.getGraph();e.off("nodeAdded",this.handleStructuralChange),e.off("nodeDropped",this.handleStructuralChange),e.off("edgeAdded",this.handleStructuralChange),e.off("edgeDropped",this.handleStructuralChange),e.off("edgesCleared",this.handleStructuralChange),e.off("cleared",this.handleStructuralChange),e.off("nodeAttributesUpdated",this.handleNodeUpdate)}clearBatchFences(){this.batchFences.forEach(e=>this.gl.deleteSync(e)),this.batchFences=[]}}export{C as F};
