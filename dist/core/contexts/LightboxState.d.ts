import * as React from "react";
import { LightboxProps, LightboxState, Slide } from "../../types.js";
export type LightboxStateSwipeAction = {
    type: "swipe";
    increment: number;
    duration?: number;
    easing?: string;
};
export type LightboxStateUpdateAction = {
    type: "update";
    slides: Slide[];
    index: number;
};
export type LightboxStateAction = LightboxStateSwipeAction | LightboxStateUpdateAction;
export type LightboxStateContextType = {
    state: LightboxState;
    dispatch: React.Dispatch<LightboxStateAction>;
};
export declare const LightboxStateContext: React.Context<LightboxStateContextType | null>;
export declare const useLightboxState: () => LightboxStateContextType;
export type LightboxStateProviderProps = React.PropsWithChildren<Pick<LightboxProps, "slides" | "index">>;
export declare function LightboxStateProvider({ slides, index, children }: LightboxStateProviderProps): JSX.Element;
