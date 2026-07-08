import { getTextureSize } from "../../utils";

/**
 * This vertex shader is executed once per node (as a POINTS draw call, without
 * any attribute, using gl_VertexID). It reads the node position and mass from
 * the nodes position texture, and outputs a 1px point, snapped to the center
 * of the grid cell containing the node.
 *
 * The grid is aligned on the square bounding box of the graph (read from the
 * boundaries texture). Snapping the point to the cell center guarantees that
 * rasterization assigns the node to the exact same cell as the
 * floor(relativePosition * gridSize) computed in the ForceAtlas2 fragment
 * shader.
 */
export function getQuadTreeSplatVertexShader({ nodesCount }: { nodesCount: number }) {
  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

#define NODES_TEXTURE_SIZE ${Math.floor(getTextureSize(nodesCount))}

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
}`;

  return SHADER;
}
