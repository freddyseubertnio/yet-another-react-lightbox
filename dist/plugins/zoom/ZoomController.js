import * as React from "react";
import { makeUseContext, useController } from "../../core/index.js";
import { useZoomCallback, useZoomImageRect, useZoomProps, useZoomSensors, useZoomState } from "./hooks/index.js";
export const ZoomControllerContext = React.createContext(null);
export const useZoom = makeUseContext("useZoom", "ZoomControllerContext", ZoomControllerContext);
export function ZoomContextProvider({ children }) {
    const [zoomWrapper, setZoomWrapper] = React.useState();
    const { slideRect } = useController();
    const { imageRect, maxZoom } = useZoomImageRect(slideRect, zoomWrapper === null || zoomWrapper === void 0 ? void 0 : zoomWrapper.imageDimensions);
    const { zoom, offsetX, offsetY, disabled, changeZoom, changeOffsets, zoomIn, zoomOut } = useZoomState(imageRect, maxZoom, zoomWrapper === null || zoomWrapper === void 0 ? void 0 : zoomWrapper.zoomWrapperRef);
    useZoomCallback(zoom, disabled);
    useZoomSensors(zoom, maxZoom, disabled, changeZoom, changeOffsets, zoomWrapper === null || zoomWrapper === void 0 ? void 0 : zoomWrapper.zoomWrapperRef);
    const zoomRef = React.useMemo(() => ({ zoom, maxZoom, offsetX, offsetY, disabled, zoomIn, zoomOut }), [zoom, maxZoom, offsetX, offsetY, disabled, zoomIn, zoomOut]);
    React.useImperativeHandle(useZoomProps().ref, () => zoomRef, [zoomRef]);
    const context = React.useMemo(() => ({ ...zoomRef, setZoomWrapper }), [zoomRef, setZoomWrapper]);
    return React.createElement(ZoomControllerContext.Provider, { value: context }, children);
}
