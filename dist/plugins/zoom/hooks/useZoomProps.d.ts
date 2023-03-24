/// <reference types="react" />
export declare function useZoomProps(): {
    ref?: import("react").ForwardedRef<import("../../../types.js").ZoomRef> | undefined;
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
