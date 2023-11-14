import { NodeDisplayData, RenderParams } from "sigma/types";
import { NodeProgram } from "sigma/rendering/webgl/programs/common/node";
import { checkDiscNodeCollision } from "sigma/utils/node-collisions";
import { drawDiscNodeLabel } from "sigma/utils/node-labels";
import { drawDiscNodeHover } from "sigma/utils/node-hover";
declare const UNIFORMS: readonly ["u_sizeRatio", "u_pixelRatio", "u_matrix"];
export default class NodeBorderProgram extends NodeProgram<typeof UNIFORMS[number]> {
    checkCollision: typeof checkDiscNodeCollision;
    drawLabel: typeof drawDiscNodeLabel;
    drawHover: typeof drawDiscNodeHover;
    getDefinition(): {
        VERTICES: number;
        VERTEX_SHADER_SOURCE: string;
        FRAGMENT_SHADER_SOURCE: string;
        UNIFORMS: readonly ["u_sizeRatio", "u_pixelRatio", "u_matrix"];
        ATTRIBUTES: ({
            name: string;
            size: number;
            type: 5126;
            normalized?: undefined;
        } | {
            name: string;
            size: number;
            type: 5121;
            normalized: boolean;
        })[];
    };
    processVisibleItem(i: number, data: NodeDisplayData): void;
    draw(params: RenderParams): void;
}
export {};
