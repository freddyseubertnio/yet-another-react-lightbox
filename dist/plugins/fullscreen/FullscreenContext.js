import * as React from "react";
import { CLASS_FULLSIZE, clsx, cssClass, makeUseContext, PLUGIN_FULLSCREEN, useEventCallback, useLayoutEffect, } from "../../core/index.js";
import { resolveFullscreenProps } from "./props.js";
export const FullscreenContext = React.createContext(null);
export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);
export function FullscreenContextProvider({ fullscreen: fullscreenProps, children }) {
    const { auto, ref } = resolveFullscreenProps(fullscreenProps);
    const containerRef = React.useRef(null);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [disabled, setDisabled] = React.useState();
    useLayoutEffect(() => {
        var _a, _b, _c, _d;
        setDisabled(!((_d = (_c = (_b = (_a = document.fullscreenEnabled) !== null && _a !== void 0 ? _a : document.webkitFullscreenEnabled) !== null && _b !== void 0 ? _b : document.mozFullScreenEnabled) !== null && _c !== void 0 ? _c : document.msFullscreenEnabled) !== null && _d !== void 0 ? _d : false));
    }, []);
    const getFullscreenElement = React.useCallback(() => {
        var _a, _b, _c;
        return (_c = (_b = (_a = document.fullscreenElement) !== null && _a !== void 0 ? _a : document.webkitFullscreenElement) !== null && _b !== void 0 ? _b : document.mozFullScreenElement) !== null && _c !== void 0 ? _c : document.msFullscreenElement;
    }, []);
    const enter = React.useCallback(() => {
        const container = containerRef.current;
        if (container) {
            try {
                if (container.requestFullscreen) {
                    container.requestFullscreen().catch(() => { });
                }
                else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                }
                else if (container.mozRequestFullScreen) {
                    container.mozRequestFullScreen();
                }
                else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
            }
            catch (err) {
            }
        }
    }, []);
    const exit = React.useCallback(() => {
        if (getFullscreenElement()) {
            try {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => { });
                }
                else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            catch (err) {
            }
        }
    }, [getFullscreenElement]);
    const fullscreenChangeListener = React.useCallback(() => {
        if (getFullscreenElement() === containerRef.current) {
            setFullscreen(true);
        }
        else {
            setFullscreen(false);
        }
    }, [getFullscreenElement]);
    React.useEffect(() => {
        const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];
        events.forEach((event) => {
            document.addEventListener(event, fullscreenChangeListener);
        });
        return () => {
            events.forEach((event) => {
                document.removeEventListener(event, fullscreenChangeListener);
            });
        };
    }, [fullscreenChangeListener]);
    const handleAutoFullscreen = useEventCallback(() => { var _a; return (_a = (auto ? enter : null)) === null || _a === void 0 ? void 0 : _a(); });
    React.useEffect(() => {
        handleAutoFullscreen();
        return () => exit();
    }, [handleAutoFullscreen, exit]);
    const context = React.useMemo(() => ({
        fullscreen,
        disabled,
        enter,
        exit,
    }), [fullscreen, disabled, enter, exit]);
    React.useImperativeHandle(ref, () => context, [context]);
    return (React.createElement("div", { ref: containerRef, className: clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE)) },
        React.createElement(FullscreenContext.Provider, { value: context }, children)));
}
