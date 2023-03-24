/// <reference types="react" />
import { LightboxProps } from "../../types.js";
export declare const defaultSlideshowProps: {
    autoplay: boolean;
    delay: number;
    ref: null;
};
export declare const resolveSlideshowProps: (slideshow: LightboxProps["slideshow"]) => {
    ref: import("react").ForwardedRef<import("../../types.js").SlideshowRef>;
    autoplay: boolean;
    delay: number;
};
