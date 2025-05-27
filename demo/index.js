"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = tslib_1.__importDefault(require("react"));
const client_1 = tslib_1.__importDefault(require("react-dom/client"));
require("./styles.css");
const Root_1 = tslib_1.__importDefault(require("./views/Root"));
const root = client_1.default.createRoot(document.getElementById("root"));
root.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(Root_1.default, {}) }));
//# sourceMappingURL=index.js.map