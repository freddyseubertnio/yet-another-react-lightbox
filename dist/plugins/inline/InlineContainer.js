import * as React from "react";
import { clsx, cssClass } from "../../core/index.js";
export function InlineContainer({ inline: { className, ...rest } = {}, children }) {
    return (React.createElement("div", { className: clsx(cssClass("root"), cssClass("relative"), className), ...rest }, children));
}
