"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@react-sigma/core");
const react_1 = require("react");
const GraphDataController = ({ filters, children }) => {
    const sigma = (0, core_1.useSigma)();
    const graph = sigma.getGraph();
    (0, react_1.useEffect)(() => {
        const { clusters, tags } = filters;
        graph.forEachNode((node, { cluster, tag }) => graph.setNodeAttribute(node, "hidden", !clusters[cluster] || !tags[tag]));
    }, [graph, filters]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
};
exports.default = GraphDataController;
//# sourceMappingURL=GraphDataController.js.map