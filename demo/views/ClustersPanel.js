"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@react-sigma/core");
const lodash_1 = require("lodash");
const react_1 = require("react");
const ai_1 = require("react-icons/ai");
const md_1 = require("react-icons/md");
const Panel_1 = tslib_1.__importDefault(require("./Panel"));
const ClustersPanel = ({ clusters, filters, toggleCluster, setClusters }) => {
    const sigma = (0, core_1.useSigma)();
    const graph = sigma.getGraph();
    const nodesPerCluster = (0, react_1.useMemo)(() => {
        const index = {};
        graph.forEachNode((_, { cluster }) => (index[cluster] = (index[cluster] || 0) + 1));
        return index;
    }, []);
    const maxNodesPerCluster = (0, react_1.useMemo)(() => Math.max(...(0, lodash_1.values)(nodesPerCluster)), [nodesPerCluster]);
    const visibleClustersCount = (0, react_1.useMemo)(() => Object.keys(filters.clusters).length, [filters]);
    const [visibleNodesPerCluster, setVisibleNodesPerCluster] = (0, react_1.useState)(nodesPerCluster);
    (0, react_1.useEffect)(() => {
        requestAnimationFrame(() => {
            const index = {};
            graph.forEachNode((_, { cluster, hidden }) => !hidden && (index[cluster] = (index[cluster] || 0) + 1));
            setVisibleNodesPerCluster(index);
        });
    }, [filters]);
    const sortedClusters = (0, react_1.useMemo)(() => (0, lodash_1.sortBy)(clusters, (cluster) => -nodesPerCluster[cluster.key]), [clusters, nodesPerCluster]);
    return ((0, jsx_runtime_1.jsxs)(Panel_1.default, { title: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(md_1.MdGroupWork, { className: "text-muted" }), " Clusters", visibleClustersCount < clusters.length ? ((0, jsx_runtime_1.jsxs)("span", { className: "text-muted text-small", children: [" ", "(", visibleClustersCount, " / ", clusters.length, ")"] })) : ("")] }), children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("i", { className: "text-muted", children: "Click a cluster to show/hide related pages from the network." }) }), (0, jsx_runtime_1.jsxs)("p", { className: "buttons", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn", onClick: () => setClusters((0, lodash_1.mapValues)((0, lodash_1.keyBy)(clusters, "key"), () => true)), children: [(0, jsx_runtime_1.jsx)(ai_1.AiOutlineCheckCircle, {}), " Check all"] }), " ", (0, jsx_runtime_1.jsxs)("button", { className: "btn", onClick: () => setClusters({}), children: [(0, jsx_runtime_1.jsx)(ai_1.AiOutlineCloseCircle, {}), " Uncheck all"] })] }), (0, jsx_runtime_1.jsx)("ul", { children: sortedClusters.map((cluster) => {
                    const nodesCount = nodesPerCluster[cluster.key];
                    const visibleNodesCount = visibleNodesPerCluster[cluster.key] || 0;
                    return ((0, jsx_runtime_1.jsxs)("li", { className: "caption-row", title: `${nodesCount} page${nodesCount > 1 ? "s" : ""}${visibleNodesCount !== nodesCount
                            ? visibleNodesCount > 0
                                ? ` (only ${visibleNodesCount > 1 ? `${visibleNodesCount} are` : "one is"} visible)`
                                : " (all hidden)"
                            : ""}`, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.clusters[cluster.key] || false, onChange: () => toggleCluster(cluster.key), id: `cluster-${cluster.key}` }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: `cluster-${cluster.key}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "circle", style: { background: cluster.color, borderColor: cluster.color } }), " ", (0, jsx_runtime_1.jsxs)("div", { className: "node-label", children: [(0, jsx_runtime_1.jsx)("span", { children: cluster.clusterLabel }), (0, jsx_runtime_1.jsx)("div", { className: "bar", style: { width: (100 * nodesCount) / maxNodesPerCluster + "%" }, children: (0, jsx_runtime_1.jsx)("div", { className: "inside-bar", style: {
                                                        width: (100 * visibleNodesCount) / nodesCount + "%",
                                                    } }) })] })] })] }, cluster.key));
                }) })] }));
};
exports.default = ClustersPanel;
//# sourceMappingURL=ClustersPanel.js.map