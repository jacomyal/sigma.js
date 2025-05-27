"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@react-sigma/core");
const react_1 = require("react");
function getMouseLayer() {
    return document.querySelector(".sigma-mouse");
}
const GraphEventsController = ({ setHoveredNode, children, }) => {
    const sigma = (0, core_1.useSigma)();
    const graph = sigma.getGraph();
    const registerEvents = (0, core_1.useRegisterEvents)();
    (0, react_1.useEffect)(() => {
        registerEvents({
            clickNode({ node }) {
                if (!graph.getNodeAttribute(node, "hidden")) {
                    window.open(graph.getNodeAttribute(node, "URL"), "_blank");
                }
            },
            enterNode({ node }) {
                setHoveredNode(node);
                const mouseLayer = getMouseLayer();
                if (mouseLayer)
                    mouseLayer.classList.add("mouse-pointer");
            },
            leaveNode() {
                setHoveredNode(null);
                const mouseLayer = getMouseLayer();
                if (mouseLayer)
                    mouseLayer.classList.remove("mouse-pointer");
            },
        });
    }, []);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.default = GraphEventsController;
//# sourceMappingURL=GraphEventsController.js.map