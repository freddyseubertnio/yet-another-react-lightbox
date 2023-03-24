import * as React from "react";
import { useZoomState } from "./useZoomState.js";
export declare function useZoomSensors(zoom: number, maxZoom: number, disabled: boolean, changeZoom: ReturnType<typeof useZoomState>["changeZoom"], changeOffsets: ReturnType<typeof useZoomState>["changeOffsets"], zoomWrapperRef?: React.RefObject<HTMLDivElement>): void;
