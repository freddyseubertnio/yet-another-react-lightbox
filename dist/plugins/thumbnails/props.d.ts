import { LightboxProps } from "../../types.js";
export declare const defaultThumbnailsProps: {
    position: "bottom";
    width: number;
    height: number;
    border: number;
    borderRadius: number;
    padding: number;
    gap: number;
    imageFit: "contain";
    vignette: boolean;
};
export declare const resolveThumbnailsProps: (thumbnails: LightboxProps["thumbnails"]) => {
    position: "end" | "start" | "bottom" | "top";
    width: number;
    height: number;
    border: number;
    borderRadius: number;
    padding: number;
    gap: number;
    imageFit: import("../../types.js").ImageFit;
    vignette: boolean;
};
export declare function useThumbnailsProps(): {
    position: "end" | "start" | "bottom" | "top";
    width: number;
    height: number;
    border: number;
    borderRadius: number;
    padding: number;
    gap: number;
    imageFit: import("../../types.js").ImageFit;
    vignette: boolean;
};
