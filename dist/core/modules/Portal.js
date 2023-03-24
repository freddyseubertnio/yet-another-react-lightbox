import * as React from "react";
import * as ReactDOM from "react-dom";
import { LightboxDefaultProps } from "../../props.js";
import { createModule } from "../config.js";
import { clsx, composePrefix, cssClass, cssVar } from "../utils.js";
import { useEventCallback, useMotionPreference } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";
import { ACTION_CLOSE, CLASS_NO_SCROLL_PADDING, MODULE_PORTAL } from "../consts.js";
function cssPrefix(value) {
    return composePrefix(MODULE_PORTAL, value);
}
function setAttribute(element, attribute, value) {
    const previousValue = element.getAttribute(attribute);
    element.setAttribute(attribute, value);
    return () => {
        if (previousValue) {
            element.setAttribute(attribute, previousValue);
        }
        else {
            element.removeAttribute(attribute);
        }
    };
}
export function Portal({ children, animation, styles, className, on, close }) {
    const [mounted, setMounted] = React.useState(false);
    const [visible, setVisible] = React.useState(false);
    const cleanup = React.useRef([]);
    const { setTimeout } = useTimeouts();
    const { subscribe } = useEvents();
    const reduceMotion = useMotionPreference();
    const animationDuration = !reduceMotion ? animation.fade : 0;
    React.useEffect(() => {
        setMounted(true);
        return () => {
            setMounted(false);
            setVisible(false);
        };
    }, []);
    const handleClose = useEventCallback(() => {
        var _a;
        setVisible(false);
        (_a = on.exiting) === null || _a === void 0 ? void 0 : _a.call(on);
        setTimeout(() => {
            var _a;
            (_a = on.exited) === null || _a === void 0 ? void 0 : _a.call(on);
            close();
        }, animationDuration);
    });
    React.useEffect(() => subscribe(ACTION_CLOSE, handleClose), [subscribe, handleClose]);
    const handleEnter = useEventCallback((node) => {
        var _a, _b, _c;
        node.scrollTop;
        setVisible(true);
        (_a = on.entering) === null || _a === void 0 ? void 0 : _a.call(on);
        const elements = (_c = (_b = node.parentNode) === null || _b === void 0 ? void 0 : _b.children) !== null && _c !== void 0 ? _c : [];
        for (let i = 0; i < elements.length; i += 1) {
            const element = elements[i];
            if (["TEMPLATE", "SCRIPT", "STYLE"].indexOf(element.tagName) === -1 && element !== node) {
                cleanup.current.push(setAttribute(element, "inert", "true"));
                cleanup.current.push(setAttribute(element, "aria-hidden", "true"));
            }
        }
        setTimeout(() => {
            var _a;
            (_a = on.entered) === null || _a === void 0 ? void 0 : _a.call(on);
        }, animationDuration);
    });
    const handleExit = useEventCallback(() => {
        cleanup.current.forEach((clean) => clean());
        cleanup.current = [];
    });
    const handleRef = React.useCallback((node) => {
        if (node) {
            handleEnter(node);
        }
        else {
            handleExit();
        }
    }, [handleEnter, handleExit]);
    return mounted
        ? ReactDOM.createPortal(React.createElement("div", { ref: handleRef, className: clsx(className, cssClass("root"), cssClass(cssPrefix()), cssClass(CLASS_NO_SCROLL_PADDING), visible && cssClass(cssPrefix("open"))), role: "presentation", "aria-live": "polite", style: {
                ...(animation.fade !== LightboxDefaultProps.animation.fade
                    ? { [cssVar("fade_animation_duration")]: `${animationDuration}ms` }
                    : null),
                ...(animation.easing.fade !== LightboxDefaultProps.animation.easing.fade
                    ? { [cssVar("fade_animation_timing_function")]: animation.easing.fade }
                    : null),
                ...styles.root,
            } }, children), document.body)
        : null;
}
export const PortalModule = createModule(MODULE_PORTAL, Portal);
