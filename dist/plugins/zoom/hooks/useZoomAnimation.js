import * as React from "react";
import { useEventCallback, useLayoutEffect, useLightboxProps, useMotionPreference } from "../../../core/index.js";
export function useZoomAnimation(zoom, offsetX, offsetY, zoomWrapperRef) {
    const zoomAnimation = React.useRef();
    const zoomAnimationStart = React.useRef();
    const { zoom: zoomAnimationDuration } = useLightboxProps().animation;
    const reduceMotion = useMotionPreference();
    const playZoomAnimation = useEventCallback(() => {
        var _a, _b, _c;
        (_a = zoomAnimation.current) === null || _a === void 0 ? void 0 : _a.cancel();
        zoomAnimation.current = undefined;
        if (zoomAnimationStart.current && (zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current)) {
            try {
                zoomAnimation.current = (_c = (_b = zoomWrapperRef.current).animate) === null || _c === void 0 ? void 0 : _c.call(_b, [
                    { transform: zoomAnimationStart.current },
                    { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` },
                ], {
                    duration: !reduceMotion ? zoomAnimationDuration !== null && zoomAnimationDuration !== void 0 ? zoomAnimationDuration : 500 : 0,
                    easing: zoomAnimation.current ? "ease-out" : "ease-in-out",
                });
            }
            catch (err) {
                console.error(err);
            }
            zoomAnimationStart.current = undefined;
            if (zoomAnimation.current) {
                zoomAnimation.current.onfinish = () => {
                    zoomAnimation.current = undefined;
                };
            }
        }
    });
    useLayoutEffect(playZoomAnimation, [zoom, offsetX, offsetY, playZoomAnimation]);
    return React.useCallback(() => {
        zoomAnimationStart.current = (zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current)
            ? window.getComputedStyle(zoomWrapperRef.current).transform
            : undefined;
    }, [zoomWrapperRef]);
}
