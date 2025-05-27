"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@react-sigma/core");
const node_image_1 = require("@sigma/node-image");
const graphology_1 = require("graphology");
const lodash_1 = require("lodash");
const react_1 = require("react");
const bi_1 = require("react-icons/bi");
const bs_1 = require("react-icons/bs");
const gr_1 = require("react-icons/gr");
const canvas_utils_1 = require("../canvas-utils");
const ClustersPanel_1 = tslib_1.__importDefault(require("./ClustersPanel"));
const DescriptionPanel_1 = tslib_1.__importDefault(require("./DescriptionPanel"));
const GraphDataController_1 = tslib_1.__importDefault(require("./GraphDataController"));
const GraphEventsController_1 = tslib_1.__importDefault(require("./GraphEventsController"));
const GraphSettingsController_1 = tslib_1.__importDefault(require("./GraphSettingsController"));
const GraphTitle_1 = tslib_1.__importDefault(require("./GraphTitle"));
const SearchField_1 = tslib_1.__importDefault(require("./SearchField"));
const TagsPanel_1 = tslib_1.__importDefault(require("./TagsPanel"));
const Root = () => {
    const graph = (0, react_1.useMemo)(() => new graphology_1.DirectedGraph(), []);
    const [showContents, setShowContents] = (0, react_1.useState)(false);
    const [dataReady, setDataReady] = (0, react_1.useState)(false);
    const [dataset, setDataset] = (0, react_1.useState)(null);
    const [filtersState, setFiltersState] = (0, react_1.useState)({
        clusters: {},
        tags: {},
    });
    const [hoveredNode, setHoveredNode] = (0, react_1.useState)(null);
    const sigmaSettings = (0, react_1.useMemo)(() => ({
        nodeProgramClasses: {
            image: (0, node_image_1.createNodeImageProgram)({
                size: { mode: "force", value: 256 },
            }),
        },
        defaultDrawNodeLabel: canvas_utils_1.drawLabel,
        defaultDrawNodeHover: canvas_utils_1.drawHover,
        defaultNodeType: "image",
        defaultEdgeType: "arrow",
        labelDensity: 0.07,
        labelGridCellSize: 60,
        labelRenderedSizeThreshold: 15,
        labelFont: "Lato, sans-serif",
        zIndex: true,
    }), []);
    (0, react_1.useEffect)(() => {
        fetch(`./dataset.json`)
            .then((res) => res.json())
            .then((dataset) => {
            const clusters = (0, lodash_1.keyBy)(dataset.clusters, "key");
            const tags = (0, lodash_1.keyBy)(dataset.tags, "key");
            dataset.nodes.forEach((node) => graph.addNode(node.key, Object.assign(Object.assign(Object.assign({}, node), (0, lodash_1.omit)(clusters[node.cluster], "key")), { image: `./images/${tags[node.tag].image}` })));
            dataset.edges.forEach(([source, target]) => graph.addEdge(source, target, { size: 1 }));
            const scores = graph.nodes().map((node) => graph.getNodeAttribute(node, "score"));
            const minDegree = Math.min(...scores);
            const maxDegree = Math.max(...scores);
            const MIN_NODE_SIZE = 3;
            const MAX_NODE_SIZE = 30;
            graph.forEachNode((node) => graph.setNodeAttribute(node, "size", ((graph.getNodeAttribute(node, "score") - minDegree) / (maxDegree - minDegree)) *
                (MAX_NODE_SIZE - MIN_NODE_SIZE) +
                MIN_NODE_SIZE));
            setFiltersState({
                clusters: (0, lodash_1.mapValues)((0, lodash_1.keyBy)(dataset.clusters, "key"), (0, lodash_1.constant)(true)),
                tags: (0, lodash_1.mapValues)((0, lodash_1.keyBy)(dataset.tags, "key"), (0, lodash_1.constant)(true)),
            });
            setDataset(dataset);
            requestAnimationFrame(() => setDataReady(true));
        });
    }, []);
    if (!dataset)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { id: "app-root", className: showContents ? "show-contents" : "", children: (0, jsx_runtime_1.jsxs)(core_1.SigmaContainer, { graph: graph, settings: sigmaSettings, className: "react-sigma", children: [(0, jsx_runtime_1.jsx)(GraphSettingsController_1.default, { hoveredNode: hoveredNode }), (0, jsx_runtime_1.jsx)(GraphEventsController_1.default, { setHoveredNode: setHoveredNode }), (0, jsx_runtime_1.jsx)(GraphDataController_1.default, { filters: filtersState }), dataReady && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "controls", children: [(0, jsx_runtime_1.jsx)("div", { className: "react-sigma-control ico", children: (0, jsx_runtime_1.jsx)("button", { type: "button", className: "show-contents", onClick: () => setShowContents(true), title: "Show caption and description", children: (0, jsx_runtime_1.jsx)(bi_1.BiBookContent, {}) }) }), (0, jsx_runtime_1.jsxs)(core_1.FullScreenControl, { className: "ico", children: [(0, jsx_runtime_1.jsx)(bs_1.BsArrowsFullscreen, {}), (0, jsx_runtime_1.jsx)(bs_1.BsFullscreenExit, {})] }), (0, jsx_runtime_1.jsxs)(core_1.ZoomControl, { className: "ico", children: [(0, jsx_runtime_1.jsx)(bs_1.BsZoomIn, {}), (0, jsx_runtime_1.jsx)(bs_1.BsZoomOut, {}), (0, jsx_runtime_1.jsx)(bi_1.BiRadioCircleMarked, {})] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "contents", children: [(0, jsx_runtime_1.jsx)("div", { className: "ico", children: (0, jsx_runtime_1.jsx)("button", { type: "button", className: "ico hide-contents", onClick: () => setShowContents(false), title: "Show caption and description", children: (0, jsx_runtime_1.jsx)(gr_1.GrClose, {}) }) }), (0, jsx_runtime_1.jsx)(GraphTitle_1.default, { filters: filtersState }), (0, jsx_runtime_1.jsxs)("div", { className: "panels", children: [(0, jsx_runtime_1.jsx)(SearchField_1.default, { filters: filtersState }), (0, jsx_runtime_1.jsx)(DescriptionPanel_1.default, {}), (0, jsx_runtime_1.jsx)(ClustersPanel_1.default, { clusters: dataset.clusters, filters: filtersState, setClusters: (clusters) => setFiltersState((filters) => (Object.assign(Object.assign({}, filters), { clusters }))), toggleCluster: (cluster) => {
                                                setFiltersState((filters) => (Object.assign(Object.assign({}, filters), { clusters: filters.clusters[cluster]
                                                        ? (0, lodash_1.omit)(filters.clusters, cluster)
                                                        : Object.assign(Object.assign({}, filters.clusters), { [cluster]: true }) })));
                                            } }), (0, jsx_runtime_1.jsx)(TagsPanel_1.default, { tags: dataset.tags, filters: filtersState, setTags: (tags) => setFiltersState((filters) => (Object.assign(Object.assign({}, filters), { tags }))), toggleTag: (tag) => {
                                                setFiltersState((filters) => (Object.assign(Object.assign({}, filters), { tags: filters.tags[tag] ? (0, lodash_1.omit)(filters.tags, tag) : Object.assign(Object.assign({}, filters.tags), { [tag]: true }) })));
                                            } })] })] })] }))] }) }));
};
exports.default = Root;
//# sourceMappingURL=Root.js.map