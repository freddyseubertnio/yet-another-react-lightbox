import * as React from "react";
import { useLayoutEffect } from "./useLayoutEffect.js";
import { useMotionPreference } from "./useMotionPreference.js";
function currentTransformation(node) {
    let x = 0;
    let y = 0;
    let z = 0;
    const matrix = window.getComputedStyle(node).transform;
    const matcher = matrix.match(/matrix.*\((.+)\)/);
    if (matcher) {
        const values = matcher[1].split(",").map((str) => Number.parseInt(str, 10));
        if (values.length === 6) {
            x = values[4];
            y = values[5];
        }
        else if (values.length === 16) {
            x = values[12];
            y = values[13];
            z = values[14];
        }
    }
    return { x, y, z };
}
export function useAnimation(nodeRef, computeAnimation) {
    const snapshot = React.useRef();
    const animation = React.useRef();
    const reduceMotion = useMotionPreference();
    useLayoutEffect(() => {
        var _a, _b, _c;
        if (nodeRef.current && snapshot.current !== undefined && !reduceMotion) {
            const { keyframes, duration, easing, onfinish } = computeAnimation(snapshot.current, nodeRef.current.getBoundingClientRect(), currentTransformation(nodeRef.current)) || {};
            if (keyframes && duration) {
                (_a = animation.current) === null || _a === void 0 ? void 0 : _a.cancel();
                animation.current = undefined;
                try {
                    animation.current = (_c = (_b = nodeRef.current).animate) === null || _c === void 0 ? void 0 : _c.call(_b, keyframes, { duration, easing });
                }
                catch (err) {
                    console.error(err);
                }
                if (animation.current) {
                    animation.current.onfinish = () => {
                        animation.current = undefined;
                        onfinish === null || onfinish === void 0 ? void 0 : onfinish();
                    };
                }
            }
        }
        snapshot.current = undefined;
    });
    return {
        prepareAnimation: (currentSnapshot) => {
            snapshot.current = currentSnapshot;
        },
        isAnimationPlaying: () => { var _a; return ((_a = animation.current) === null || _a === void 0 ? void 0 : _a.playState) === "running"; },
    };
}
