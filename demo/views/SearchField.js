"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@react-sigma/core");
const react_1 = require("react");
const bs_1 = require("react-icons/bs");
const SearchField = ({ filters }) => {
    const sigma = (0, core_1.useSigma)();
    const [search, setSearch] = (0, react_1.useState)("");
    const [values, setValues] = (0, react_1.useState)([]);
    const [selected, setSelected] = (0, react_1.useState)(null);
    const refreshValues = () => {
        const newValues = [];
        const lcSearch = search.toLowerCase();
        if (!selected && search.length > 1) {
            sigma.getGraph().forEachNode((key, attributes) => {
                if (!attributes.hidden && attributes.label && attributes.label.toLowerCase().indexOf(lcSearch) === 0)
                    newValues.push({ id: key, label: attributes.label });
            });
        }
        setValues(newValues);
    };
    (0, react_1.useEffect)(() => refreshValues(), [search]);
    (0, react_1.useEffect)(() => {
        requestAnimationFrame(refreshValues);
    }, [filters]);
    (0, react_1.useEffect)(() => {
        if (!selected)
            return;
        sigma.getGraph().setNodeAttribute(selected, "highlighted", true);
        const nodeDisplayData = sigma.getNodeDisplayData(selected);
        if (nodeDisplayData)
            sigma.getCamera().animate(Object.assign(Object.assign({}, nodeDisplayData), { ratio: 0.05 }), {
                duration: 600,
            });
        return () => {
            sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
        };
    }, [selected]);
    const onInputChange = (e) => {
        const searchString = e.target.value;
        const valueItem = values.find((value) => value.label === searchString);
        if (valueItem) {
            setSearch(valueItem.label);
            setValues([]);
            setSelected(valueItem.id);
        }
        else {
            setSelected(null);
            setSearch(searchString);
        }
    };
    const onKeyPress = (e) => {
        if (e.key === "Enter" && values.length) {
            setSearch(values[0].label);
            setSelected(values[0].id);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "search-wrapper", children: [(0, jsx_runtime_1.jsx)("input", { type: "search", placeholder: "Search in nodes...", list: "nodes", value: search, onChange: onInputChange, onKeyPress: onKeyPress }), (0, jsx_runtime_1.jsx)(bs_1.BsSearch, { className: "icon" }), (0, jsx_runtime_1.jsx)("datalist", { id: "nodes", children: values.map((value) => ((0, jsx_runtime_1.jsx)("option", { value: value.label, children: value.label }, value.id))) })] }));
};
exports.default = SearchField;
//# sourceMappingURL=SearchField.js.map