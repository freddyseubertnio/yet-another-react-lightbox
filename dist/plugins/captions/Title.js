import * as React from "react";
import { clsx, cssVar, useController } from "../../core/index.js";
import { cssPrefix } from "./utils.js";
export function Title({ title, styles }) {
    const { toolbarWidth } = useController();
    return (React.createElement("div", { style: styles.captionsTitleContainer, className: clsx(cssPrefix("captions_container"), cssPrefix("title_container")) },
        React.createElement("div", { style: styles.captionsTitle, className: cssPrefix("title"), ...(toolbarWidth ? { style: { [cssVar("toolbar_width")]: `${toolbarWidth}px` } } : null) }, title)));
}
