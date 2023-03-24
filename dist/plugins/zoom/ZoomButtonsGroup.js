import * as React from "react";
import { useController } from "../../core/index.js";
import { ZoomButton } from "./ZoomButton.js";
export default function ZoomButtonsGroup() {
    const zoomInRef = React.useRef(null);
    const zoomOutRef = React.useRef(null);
    const { focus } = useController();
    const focusSibling = React.useCallback((sibling) => {
        var _a, _b;
        if (!((_a = sibling.current) === null || _a === void 0 ? void 0 : _a.disabled)) {
            (_b = sibling.current) === null || _b === void 0 ? void 0 : _b.focus();
        }
        else {
            focus();
        }
    }, [focus]);
    const focusZoomIn = React.useCallback(() => focusSibling(zoomInRef), [focusSibling]);
    const focusZoomOut = React.useCallback(() => focusSibling(zoomOutRef), [focusSibling]);
    return (React.createElement(React.Fragment, null,
        React.createElement(ZoomButton, { zoomIn: true, ref: zoomInRef, onLoseFocus: focusZoomOut }),
        React.createElement(ZoomButton, { ref: zoomOutRef, onLoseFocus: focusZoomIn })));
}
