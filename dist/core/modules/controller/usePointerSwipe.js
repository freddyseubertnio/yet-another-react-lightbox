import * as React from "react";
import { cleanup } from "../../utils.js";
import { useEventCallback } from "../../hooks/useEventCallback.js";
import { EVENT_ON_POINTER_CANCEL, EVENT_ON_POINTER_DOWN, EVENT_ON_POINTER_LEAVE, EVENT_ON_POINTER_MOVE, EVENT_ON_POINTER_UP, } from "../../consts.js";
export function usePointerSwipe(subscribeSensors, isSwipeValid, containerWidth, swipeAnimationDuration, onSwipeStart, onSwipeProgress, onSwipeFinish, onSwipeCancel) {
    const offset = React.useRef(0);
    const pointers = React.useRef([]);
    const activePointer = React.useRef();
    const startTime = React.useRef(0);
    const clearPointer = React.useCallback((event) => {
        if (activePointer.current === event.pointerId) {
            activePointer.current = undefined;
        }
        const currentPointers = pointers.current;
        currentPointers.splice(0, currentPointers.length, ...currentPointers.filter((p) => p.pointerId !== event.pointerId));
    }, []);
    const addPointer = React.useCallback((event) => {
        clearPointer(event);
        event.persist();
        pointers.current.push(event);
    }, [clearPointer]);
    const onPointerDown = useEventCallback((event) => {
        addPointer(event);
    });
    const onPointerUp = useEventCallback((event) => {
        if (pointers.current.find((x) => x.pointerId === event.pointerId) &&
            activePointer.current === event.pointerId) {
            const duration = Date.now() - startTime.current;
            const currentOffset = offset.current;
            if (Math.abs(currentOffset) > 0.3 * containerWidth ||
                (Math.abs(currentOffset) > 5 && duration < swipeAnimationDuration)) {
                onSwipeFinish(currentOffset, duration);
            }
            else {
                onSwipeCancel(currentOffset);
            }
            offset.current = 0;
        }
        clearPointer(event);
    });
    const onPointerMove = useEventCallback((event) => {
        console.log(event);
        const pointer = pointers.current.find((p) => p.pointerId === event.pointerId);
        if (pointer) {
            const isCurrentPointer = activePointer.current === event.pointerId;
            if (event.buttons === 0) {
                if (isCurrentPointer && offset.current !== 0) {
                    onPointerUp(event);
                }
                else {
                    clearPointer(pointer);
                }
                return;
            }
            const deltaX = event.clientX - pointer.clientX;
            const deltaY = event.clientY - pointer.clientY;
            if (activePointer.current === undefined &&
                isSwipeValid(deltaX) &&
                Math.abs(deltaX) > Math.abs(deltaY) &&
                Math.abs(deltaX) > 30) {
                addPointer(event);
                activePointer.current = event.pointerId;
                startTime.current = Date.now();
                onSwipeStart();
            }
            else if (isCurrentPointer) {
                offset.current = deltaX;
                onSwipeProgress(deltaX);
            }
        }
    });
    React.useEffect(() => cleanup(subscribeSensors(EVENT_ON_POINTER_DOWN, onPointerDown), subscribeSensors(EVENT_ON_POINTER_MOVE, onPointerMove), subscribeSensors(EVENT_ON_POINTER_UP, onPointerUp), subscribeSensors(EVENT_ON_POINTER_LEAVE, onPointerUp), subscribeSensors(EVENT_ON_POINTER_CANCEL, onPointerUp)), [subscribeSensors, onPointerDown, onPointerMove, onPointerUp]);
}
