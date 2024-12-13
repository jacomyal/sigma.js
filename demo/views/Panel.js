"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_animate_height_1 = tslib_1.__importDefault(require("react-animate-height"));
const md_1 = require("react-icons/md");
const DURATION = 300;
const Panel = ({ title, initiallyDeployed, children, }) => {
    const [isDeployed, setIsDeployed] = (0, react_1.useState)(initiallyDeployed || false);
    const dom = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (isDeployed)
            setTimeout(() => {
                var _a;
                if (dom.current)
                    (_a = dom.current.parentElement) === null || _a === void 0 ? void 0 : _a.scrollTo({ top: dom.current.offsetTop - 5, behavior: "smooth" });
            }, DURATION);
    }, [isDeployed]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "panel", ref: dom, children: [(0, jsx_runtime_1.jsxs)("h2", { children: [title, " ", (0, jsx_runtime_1.jsx)("button", { type: "button", onClick: () => setIsDeployed((v) => !v), children: isDeployed ? (0, jsx_runtime_1.jsx)(md_1.MdExpandLess, {}) : (0, jsx_runtime_1.jsx)(md_1.MdExpandMore, {}) })] }), (0, jsx_runtime_1.jsx)(react_animate_height_1.default, { duration: DURATION, height: isDeployed ? "auto" : 0, children: children })] }));
};
exports.default = Panel;
//# sourceMappingURL=Panel.js.map