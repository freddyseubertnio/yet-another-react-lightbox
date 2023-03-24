import * as React from "react";
import { createModule } from "../config.js";
import { MODULE_ROOT } from "../consts.js";
export function Root({ children }) {
    return React.createElement(React.Fragment, null, children);
}
export const RootModule = createModule(MODULE_ROOT, Root);
