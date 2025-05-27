"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@react-sigma/core");
const react_1 = require("react");
function prettyPercentage(val) {
    return (val * 100).toFixed(1) + "%";
}
const GraphTitle = ({ filters }) => {
    const sigma = (0, core_1.useSigma)();
    const graph = sigma.getGraph();
    const [visibleItems, setVisibleItems] = (0, react_1.useState)({ nodes: 0, edges: 0 });
    (0, react_1.useEffect)(() => {
        requestAnimationFrame(() => {
            const index = { nodes: 0, edges: 0 };
            graph.forEachNode((_, { hidden }) => !hidden && index.nodes++);
            graph.forEachEdge((_, _2, _3, _4, source, target) => !source.hidden && !target.hidden && index.edges++);
            setVisibleItems(index);
        });
    }, [filters]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "graph-title", children: [(0, jsx_runtime_1.jsx)("h1", { children: "A cartography of Wikipedia pages around data visualization" }), (0, jsx_runtime_1.jsx)("h2", { children: (0, jsx_runtime_1.jsxs)("i", { children: [graph.order, " node", graph.order > 1 ? "s" : "", " ", visibleItems.nodes !== graph.order
                            ? ` (only ${prettyPercentage(visibleItems.nodes / graph.order)} visible)`
                            : "", ", ", graph.size, " edge", graph.size > 1 ? "s" : "", " ", visibleItems.edges !== graph.size
                            ? ` (only ${prettyPercentage(visibleItems.edges / graph.size)} visible)`
                            : ""] }) })] }));
};
exports.default = GraphTitle;
//# sourceMappingURL=GraphTitle.js.map