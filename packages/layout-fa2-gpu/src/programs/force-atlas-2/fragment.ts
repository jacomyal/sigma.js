import { numberToGLSLFloat } from "sigma/rendering";

import { ForceAtlas2Settings } from "../../consts";
import { GLSL_getIndex, GLSL_getValueInTexture, getTextureSize } from "../../utils";

export function getForceAtlas2FragmentShader({
  nodesCount,
  edgeEntriesCount,
  linLogMode,
  strongGravityMode,
  outboundAttractionDistribution,
  quadTreeDepth,
  quadTreeTheta,
}: {
  nodesCount: number;
  // Number of entries in the edges texture (each undirected edge is stored
  // twice, once per direction):
  edgeEntriesCount: number;
  // Resolved quad-tree depth (never "auto" at this point):
  quadTreeDepth: number;
  quadTreeTheta: number;
} & Pick<ForceAtlas2Settings, "linLogMode" | "strongGravityMode" | "outboundAttractionDistribution">) {
  // Cells more than quadTreeRing cells away (Chebyshev distance) are
  // considered "well separated", like Barnes-Hut cells passing the
  // size/distance < theta test (on a uniform grid, this is a distance in
  // cells: ceil(1/theta)):
  const quadTreeRing = Math.max(1, Math.ceil(1 / quadTreeTheta));

  // language=GLSL
  const SHADER = /*glsl*/ `#version 300 es
precision highp float;

#define NODES_COUNT ${numberToGLSLFloat(nodesCount)}
#define NODES_TEXTURE_SIZE ${numberToGLSLFloat(getTextureSize(nodesCount))}
#define EDGES_TEXTURE_SIZE ${numberToGLSLFloat(getTextureSize(edgeEntriesCount))}
#define QUAD_TREE_DEPTH ${Math.floor(quadTreeDepth)}
#define QUAD_TREE_RING ${Math.floor(quadTreeRing)}
${linLogMode ? "#define LINLOG_MODE" : ""}
${strongGravityMode ? "#define STRONG_GRAVITY_MODE" : ""}
${outboundAttractionDistribution ? "#define OUTBOUND_ATTRACTION_DISTRIBUTION" : ""}

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
${GLSL_getValueInTexture}
${GLSL_getIndex}

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
}`;

  return SHADER;
}
