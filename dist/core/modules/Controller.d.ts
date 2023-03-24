import * as React from "react";
import { Callback, ComponentProps, ContainerRect, ControllerRef, NavigationAction } from "../../types.js";
import { SubscribeSensors } from "../hooks/index.js";
import { LightboxStateSwipeAction } from "../contexts/index.js";
import { ACTION_CLOSE, ACTION_NEXT, ACTION_PREV, ACTION_SWIPE } from "../consts.js";
declare module "../index.js" {
    interface EventTypes {
        [ACTION_PREV]: NavigationAction | void;
        [ACTION_NEXT]: NavigationAction | void;
        [ACTION_SWIPE]: LightboxStateSwipeAction;
        [ACTION_CLOSE]: void;
    }
}
export type ControllerContextType = Pick<ControllerRef, "prev" | "next" | "close"> & {
    focus: Callback;
    slideRect: ContainerRect;
    containerRect: ContainerRect;
    subscribeSensors: SubscribeSensors<HTMLDivElement>;
    containerRef: React.RefObject<HTMLDivElement>;
    setCarouselRef: React.Ref<HTMLDivElement>;
    toolbarWidth: number | undefined;
    setToolbarWidth: (width: number | undefined) => void;
};
export declare const ControllerContext: React.Context<ControllerContextType | null>;
export declare const useController: () => NonNullable<ControllerContextType>;
export declare function Controller({ children, ...props }: ComponentProps): JSX.Element;
export declare const ControllerModule: import("../../types.js").Module;
