import * as React from "react";
import { createModule } from "../config.js";
import { composePrefix, cssClass, label } from "../utils.js";
import { CloseIcon, IconButton } from "../components/index.js";
import { useContainerRect } from "../hooks/useContainerRect.js";
import { useController } from "./Controller.js";
import { ACTION_CLOSE, MODULE_TOOLBAR } from "../consts.js";
function cssPrefix(value) {
    return composePrefix(MODULE_TOOLBAR, value);
}
export function Toolbar({ toolbar: { buttons }, labels, render: { buttonClose, iconClose } }) {
    const { close, setToolbarWidth } = useController();
    const { setContainerRef, containerRect } = useContainerRect();
    React.useEffect(() => {
        setToolbarWidth(containerRect === null || containerRect === void 0 ? void 0 : containerRect.width);
    }, [setToolbarWidth, containerRect === null || containerRect === void 0 ? void 0 : containerRect.width]);
    const renderCloseButton = () => buttonClose ? (buttonClose()) : (React.createElement(IconButton, { key: ACTION_CLOSE, label: label(labels, "Close"), icon: CloseIcon, renderIcon: iconClose, onClick: () => close() }));
    return (React.createElement("div", { ref: setContainerRef, className: cssClass(cssPrefix()) }, buttons === null || buttons === void 0 ? void 0 : buttons.map((button) => (button === ACTION_CLOSE ? renderCloseButton() : button))));
}
export const ToolbarModule = createModule(MODULE_TOOLBAR, Toolbar);
