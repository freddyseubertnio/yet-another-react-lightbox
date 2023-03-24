import * as React from "react";
import { ComponentProps, ContainerRect, ZoomRef } from "../../types.js";
export type ActiveZoomWrapper = {
    zoomWrapperRef: React.RefObject<HTMLDivElement>;
    imageDimensions?: ContainerRect;
};
export type ZoomControllerContextType = ZoomRef & {
    setZoomWrapper: React.Dispatch<React.SetStateAction<ActiveZoomWrapper | undefined>>;
};
export declare const ZoomControllerContext: React.Context<ZoomControllerContextType | null>;
export declare const useZoom: () => NonNullable<ZoomControllerContextType>;
export declare function ZoomContextProvider({ children }: ComponentProps): JSX.Element;
