import * as React from "react";
import { clsx, cssClass, LightboxPropsProvider } from "../../core/index.js";
import { cssPrefix } from "./utils.js";
import { ThumbnailsTrack } from "./ThumbnailsTrack.js";
import { resolveThumbnailsProps } from "./props.js";
export function ThumbnailsContainer({ children, ...props }) {
    const containerRef = React.useRef(null);
    const { position } = resolveThumbnailsProps(props.thumbnails);
    return (React.createElement(LightboxPropsProvider, { ...props },
        React.createElement("div", { ref: containerRef, className: clsx(cssClass(cssPrefix()), cssClass(cssPrefix(`${position}`))) },
            ["start", "top"].includes(position) && React.createElement(ThumbnailsTrack, { containerRef: containerRef }),
            React.createElement("div", { className: cssClass(cssPrefix("wrapper")) }, children),
            ["end", "bottom"].includes(position) && React.createElement(ThumbnailsTrack, { containerRef: containerRef }))));
}
