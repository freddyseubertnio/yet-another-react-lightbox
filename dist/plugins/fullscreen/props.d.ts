/// <reference types="react" />
import { LightboxProps } from "../../types.js";
export declare const defaultFullscreenProps: {
    auto: boolean;
    ref: null;
};
export declare const resolveFullscreenProps: (fullscreen: LightboxProps["fullscreen"]) => {
    ref: import("react").ForwardedRef<import("../../types.js").FullscreenRef>;
    auto: boolean;
};
