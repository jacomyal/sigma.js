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
const TagsPanel = ({ tags, filters, toggleTag, setTags }) => {
    const sigma = (0, core_1.useSigma)();
    const graph = sigma.getGraph();
    const nodesPerTag = (0, react_1.useMemo)(() => {
        const index = {};
        graph.forEachNode((_, { tag }) => (index[tag] = (index[tag] || 0) + 1));
        return index;
    }, []);
    const maxNodesPerTag = (0, react_1.useMemo)(() => Math.max(...(0, lodash_1.values)(nodesPerTag)), [nodesPerTag]);
    const visibleTagsCount = (0, react_1.useMemo)(() => Object.keys(filters.tags).length, [filters]);
    const [visibleNodesPerTag, setVisibleNodesPerTag] = (0, react_1.useState)(nodesPerTag);
    (0, react_1.useEffect)(() => {
        requestAnimationFrame(() => {
            const index = {};
            graph.forEachNode((_, { tag, hidden }) => !hidden && (index[tag] = (index[tag] || 0) + 1));
            setVisibleNodesPerTag(index);
        });
    }, [filters]);
    const sortedTags = (0, react_1.useMemo)(() => (0, lodash_1.sortBy)(tags, (tag) => (tag.key === "unknown" ? Infinity : -nodesPerTag[tag.key])), [tags, nodesPerTag]);
    return ((0, jsx_runtime_1.jsxs)(Panel_1.default, { title: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(md_1.MdCategory, { className: "text-muted" }), " Categories", visibleTagsCount < tags.length ? ((0, jsx_runtime_1.jsxs)("span", { className: "text-muted text-small", children: [" ", "(", visibleTagsCount, " / ", tags.length, ")"] })) : ("")] }), children: [(0, jsx_runtime_1.jsx)("p", { children: (0, jsx_runtime_1.jsx)("i", { className: "text-muted", children: "Click a category to show/hide related pages from the network." }) }), (0, jsx_runtime_1.jsxs)("p", { className: "buttons", children: [(0, jsx_runtime_1.jsxs)("button", { className: "btn", onClick: () => setTags((0, lodash_1.mapValues)((0, lodash_1.keyBy)(tags, "key"), () => true)), children: [(0, jsx_runtime_1.jsx)(ai_1.AiOutlineCheckCircle, {}), " Check all"] }), " ", (0, jsx_runtime_1.jsxs)("button", { className: "btn", onClick: () => setTags({}), children: [(0, jsx_runtime_1.jsx)(ai_1.AiOutlineCloseCircle, {}), " Uncheck all"] })] }), (0, jsx_runtime_1.jsx)("ul", { children: sortedTags.map((tag) => {
                    const nodesCount = nodesPerTag[tag.key];
                    const visibleNodesCount = visibleNodesPerTag[tag.key] || 0;
                    return ((0, jsx_runtime_1.jsxs)("li", { className: "caption-row", title: `${nodesCount} page${nodesCount > 1 ? "s" : ""}${visibleNodesCount !== nodesCount
                            ? visibleNodesCount > 0
                                ? ` (only ${visibleNodesCount > 1 ? `${visibleNodesCount} are` : "one is"} visible)`
                                : " (all hidden)"
                            : ""}`, children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: filters.tags[tag.key] || false, onChange: () => toggleTag(tag.key), id: `tag-${tag.key}` }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: `tag-${tag.key}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "circle", style: { backgroundImage: `url(./images/${tag.image})` } }), " ", (0, jsx_runtime_1.jsxs)("div", { className: "node-label", children: [(0, jsx_runtime_1.jsx)("span", { children: tag.key }), (0, jsx_runtime_1.jsx)("div", { className: "bar", style: { width: (100 * nodesCount) / maxNodesPerTag + "%" }, children: (0, jsx_runtime_1.jsx)("div", { className: "inside-bar", style: {
                                                        width: (100 * visibleNodesCount) / nodesCount + "%",
                                                    } }) })] })] })] }, tag.key));
                }) })] }));
};
exports.default = TagsPanel;
//# sourceMappingURL=TagsPanel.js.map