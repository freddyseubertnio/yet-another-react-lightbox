import * as React from "react";
export type ComputeAnimation<T> = (snapshot: T, rect: DOMRect, translate: {
    x: number;
    y: number;
    z: number;
}) => {
    keyframes: Keyframe[];
    duration: number;
    easing?: string;
    onfinish?: () => void;
} | undefined;
export declare function useAnimation<T>(nodeRef: React.RefObject<HTMLElement | null>, computeAnimation: ComputeAnimation<T>): {
    prepareAnimation: (currentSnapshot: T | undefined) => void;
    isAnimationPlaying: () => boolean;
};
