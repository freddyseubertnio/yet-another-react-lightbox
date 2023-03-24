import * as React from "react";
import { useEventCallback, useLightboxProps } from "../../../core/index.js";
export function useZoomCallback(zoom, disabled) {
    const { on } = useLightboxProps();
    const onZoomCallback = useEventCallback(() => {
        var _a;
        if (!disabled) {
            (_a = on.zoom) === null || _a === void 0 ? void 0 : _a.call(on, { zoom });
        }
    });
    React.useEffect(onZoomCallback, [zoom, onZoomCallback]);
}
