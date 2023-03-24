import * as React from "react";
import { cleanup, EVENT_ON_KEY_DOWN, EVENT_ON_POINTER_CANCEL, EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_LEAVE, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, EVENT_ON_WHEEL, useController, useEventCallback, useLightboxState, } from "../../../core/index.js";
import { useZoomProps } from "./useZoomProps.js";
function distance(pointerA, pointerB) {
    return ((pointerA.clientX - pointerB.clientX) ** 2 + (pointerA.clientY - pointerB.clientY) ** 2) ** 0.5;
}
export function useZoomSensors(zoom, maxZoom, disabled, changeZoom, changeOffsets, zoomWrapperRef) {
    const activePointers = React.useRef([]);
    const lastPointerDown = React.useRef(0);
    const pinchZoomDistance = React.useRef();
    const { globalIndex } = useLightboxState().state;
    const { containerRef, subscribeSensors } = useController();
    const { keyboardMoveDistance, zoomInMultiplier, wheelZoomDistanceFactor, scrollToZoom, doubleTapDelay, doubleClickDelay, doubleClickMaxStops, pinchZoomDistanceFactor, } = useZoomProps();
    const translateCoordinates = React.useCallback((event) => {
        if (containerRef.current) {
            const { pageX, pageY } = event;
            const { scrollX, scrollY } = window;
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            return [pageX - left - scrollX - width / 2, pageY - top - scrollY - height / 2];
        }
        return [];
    }, [containerRef]);
    const onKeyDown = useEventCallback((event) => {
        const preventDefault = () => {
            event.preventDefault();
            event.stopPropagation();
        };
        if (zoom > 1) {
            const move = (deltaX, deltaY) => {
                preventDefault();
                changeOffsets(deltaX, deltaY);
            };
            if (event.key === "ArrowDown") {
                move(0, keyboardMoveDistance);
            }
            else if (event.key === "ArrowUp") {
                move(0, -keyboardMoveDistance);
            }
            else if (event.key === "ArrowLeft") {
                move(-keyboardMoveDistance, 0);
            }
            else if (event.key === "ArrowRight") {
                move(keyboardMoveDistance, 0);
            }
        }
        const handleChangeZoom = (zoomValue) => {
            preventDefault();
            changeZoom(zoomValue);
        };
        const hasMeta = () => event.getModifierState("Meta");
        if (event.key === "+" || (event.key === "=" && hasMeta())) {
            handleChangeZoom(zoom * zoomInMultiplier);
        }
        else if (event.key === "-" || (event.key === "_" && hasMeta())) {
            handleChangeZoom(zoom / zoomInMultiplier);
        }
        else if (event.key === "0" && hasMeta()) {
            handleChangeZoom(1);
        }
    });
    const onWheel = useEventCallback((event) => {
        if (event.ctrlKey || scrollToZoom) {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.stopPropagation();
                changeZoom(zoom * (1 - event.deltaY / wheelZoomDistanceFactor), true, ...translateCoordinates(event));
                return;
            }
        }
        if (zoom > 1) {
            event.stopPropagation();
            if (!scrollToZoom) {
                changeOffsets(event.deltaX, event.deltaY);
            }
        }
    });
    const clearPointer = React.useCallback((event) => {
        const pointers = activePointers.current;
        pointers.splice(0, pointers.length, ...pointers.filter((p) => p.pointerId !== event.pointerId));
    }, []);
    const replacePointer = React.useCallback((event) => {
        clearPointer(event);
        event.persist();
        activePointers.current.push(event);
    }, [clearPointer]);
    const onPointerDown = useEventCallback((event) => {
        var _a;
        const pointers = activePointers.current;
        if (!((_a = zoomWrapperRef === null || zoomWrapperRef === void 0 ? void 0 : zoomWrapperRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
            return;
        }
        if (zoom > 1) {
            event.stopPropagation();
        }
        const { timeStamp } = event;
        if (pointers.length === 0 &&
            timeStamp - lastPointerDown.current < (event.pointerType === "touch" ? doubleTapDelay : doubleClickDelay)) {
            lastPointerDown.current = 0;
            changeZoom(zoom !== maxZoom ? zoom * Math.max(maxZoom ** (1 / doubleClickMaxStops), zoomInMultiplier) : 1, false, ...translateCoordinates(event));
        }
        else {
            lastPointerDown.current = timeStamp;
        }
        replacePointer(event);
        if (pointers.length === 2) {
            pinchZoomDistance.current = distance(pointers[0], pointers[1]);
        }
    });
    const onPointerMove = useEventCallback((event) => {
        const pointers = activePointers.current;
        const activePointer = pointers.find((p) => p.pointerId === event.pointerId);
        if (pointers.length === 2 && pinchZoomDistance.current) {
            event.stopPropagation();
            replacePointer(event);
            const currentDistance = distance(pointers[0], pointers[1]);
            const delta = currentDistance - pinchZoomDistance.current;
            if (Math.abs(delta) > 0) {
                changeZoom(zoom * (1 + delta / pinchZoomDistanceFactor), true, ...pointers
                    .map((x) => translateCoordinates(x))
                    .reduce((acc, coordinate) => coordinate.map((x, i) => acc[i] + x / 2)));
                pinchZoomDistance.current = currentDistance;
            }
            return;
        }
        if (zoom > 1) {
            event.stopPropagation();
            if (activePointer) {
                if (pointers.length === 1) {
                    changeOffsets((activePointer.clientX - event.clientX) / zoom, (activePointer.clientY - event.clientY) / zoom);
                }
                replacePointer(event);
            }
        }
    });
    const onPointerUp = React.useCallback((event) => {
        const pointers = activePointers.current;
        if (pointers.length === 2 && pointers.find((p) => p.pointerId === event.pointerId)) {
            pinchZoomDistance.current = undefined;
        }
        clearPointer(event);
    }, [clearPointer]);
    const cleanupSensors = React.useCallback(() => {
        const pointers = activePointers.current;
        pointers.splice(0, pointers.length);
        lastPointerDown.current = 0;
        pinchZoomDistance.current = undefined;
    }, []);
    React.useEffect(cleanupSensors, [globalIndex, cleanupSensors]);
    React.useEffect(() => {
        if (!disabled) {
            return cleanup(cleanupSensors, subscribeSensors(EVENT_ON_KEY_DOWN, onKeyDown), subscribeSensors(EVENT_ON_WHEEL, onWheel), subscribeSensors(EVENT_ON_POINTER_DOWN, onPointerDown), subscribeSensors(EVENT_ON_POINTER_MOVE, onPointerMove), subscribeSensors(EVENT_ON_POINTER_UP, onPointerUp), subscribeSensors(EVENT_ON_POINTER_LEAVE, onPointerUp), subscribeSensors(EVENT_ON_POINTER_CANCEL, onPointerUp));
        }
        return () => { };
    }, [disabled, subscribeSensors, cleanupSensors, onKeyDown, onWheel, onPointerDown, onPointerMove, onPointerUp]);
}
