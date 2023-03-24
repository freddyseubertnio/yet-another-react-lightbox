import * as React from "react";
import { createModule } from "../config.js";
import { useEventCallback, useLoseFocus, useRTL, useThrottle } from "../hooks/index.js";
import { cssClass, label as translateLabel } from "../utils.js";
import { IconButton, NextIcon, PreviousIcon } from "../components/index.js";
import { useLightboxProps, useLightboxState } from "../contexts/index.js";
import { useController } from "./Controller.js";
import { ACTION_NEXT, ACTION_PREV, EVENT_ON_KEY_DOWN, MODULE_NAVIGATION, VK_ARROW_LEFT, VK_ARROW_RIGHT, } from "../consts.js";
export function NavigationButton({ label, icon, renderIcon, action, onClick, disabled }) {
    const { labels } = useLightboxProps();
    return (React.createElement(IconButton, { label: translateLabel(labels, label), icon: icon, renderIcon: renderIcon, className: cssClass(`navigation_${action}`), disabled: disabled, onClick: onClick, ...useLoseFocus(disabled) }));
}
export function Navigation({ carousel: { finite }, animation, render: { buttonPrev, buttonNext, iconPrev, iconNext }, }) {
    var _a;
    const { slides, currentIndex } = useLightboxState().state;
    const { prev, next, subscribeSensors } = useController();
    const isRTL = useRTL();
    const prevDisabled = slides.length === 0 || (finite && currentIndex === 0);
    const nextDisabled = slides.length === 0 || (finite && currentIndex === slides.length - 1);
    const throttle = ((_a = animation.navigation) !== null && _a !== void 0 ? _a : animation.swipe) / 2;
    const prevThrottled = useThrottle(prev, throttle);
    const nextThrottled = useThrottle(next, throttle);
    const handleKeyDown = useEventCallback((event) => {
        if (event.key === VK_ARROW_LEFT && !(isRTL ? nextDisabled : prevDisabled)) {
            (isRTL ? nextThrottled : prevThrottled)();
        }
        if (event.key === VK_ARROW_RIGHT && !(isRTL ? prevDisabled : nextDisabled)) {
            (isRTL ? prevThrottled : nextThrottled)();
        }
    });
    React.useEffect(() => subscribeSensors(EVENT_ON_KEY_DOWN, handleKeyDown), [subscribeSensors, handleKeyDown]);
    return (React.createElement(React.Fragment, null,
        buttonPrev ? (buttonPrev()) : (React.createElement(NavigationButton, { label: "Previous", action: ACTION_PREV, icon: PreviousIcon, renderIcon: iconPrev, disabled: prevDisabled, onClick: prev })),
        buttonNext ? (buttonNext()) : (React.createElement(NavigationButton, { label: "Next", action: ACTION_NEXT, icon: NextIcon, renderIcon: iconNext, disabled: nextDisabled, onClick: next }))));
}
export const NavigationModule = createModule(MODULE_NAVIGATION, Navigation);
