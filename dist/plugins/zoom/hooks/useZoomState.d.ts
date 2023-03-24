import * as React from "react";
import { ContainerRect } from "../../../types.js";
export declare function useZoomState(imageRect: ContainerRect, maxZoom: number, zoomWrapperRef?: React.RefObject<HTMLDivElement>): {
    zoom: number;
    offsetX: number;
    offsetY: number;
    disabled: boolean;
    changeOffsets: (dx?: number, dy?: number, targetZoom?: number) => void;
    changeZoom: (value: number, rapid?: boolean, dx?: number, dy?: number) => void;
    zoomIn: () => void;
    zoomOut: () => void;
};
