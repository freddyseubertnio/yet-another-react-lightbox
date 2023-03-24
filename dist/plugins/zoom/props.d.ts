/// <reference types="react" />
import { LightboxProps } from "../../types.js";
export declare const defaultZoomProps: {
    maxZoomPixelRatio: number;
    zoomInMultiplier: number;
    doubleTapDelay: number;
    doubleClickDelay: number;
    doubleClickMaxStops: number;
    keyboardMoveDistance: number;
    wheelZoomDistanceFactor: number;
    pinchZoomDistanceFactor: number;
    scrollToZoom: boolean;
};
export declare const resolveZoomProps: (zoom: LightboxProps["zoom"]) => {
    ref?: import("react").ForwardedRef<import("../../types.js").ZoomRef> | undefined;
    maxZoomPixelRatio: number;
    zoomInMultiplier: number;
    doubleTapDelay: number;
    doubleClickDelay: number;
    doubleClickMaxStops: number;
    keyboardMoveDistance: number;
    wheelZoomDistanceFactor: number;
    pinchZoomDistanceFactor: number;
    scrollToZoom: boolean;
};
