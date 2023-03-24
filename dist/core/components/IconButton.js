import * as React from "react";
import { clsx, cssClass } from "../utils.js";
import { useLightboxProps } from "../contexts/index.js";
import { ELEMENT_BUTTON, ELEMENT_ICON } from "../consts.js";
export const IconButton = React.forwardRef(({ label, className, icon: Icon, renderIcon, onClick, style, ...rest }, ref) => {
    const { styles } = useLightboxProps();
    return (React.createElement("button", { ref: ref, type: "button", "aria-label": label, className: clsx(cssClass(ELEMENT_BUTTON), className), onClick: onClick, style: { ...style, ...styles.button }, ...rest }, renderIcon ? renderIcon() : React.createElement(Icon, { className: cssClass(ELEMENT_ICON), style: styles.icon })));
});
IconButton.displayName = "IconButton";
