import * as React from "react";
import { ContainerRect, Labels, LengthOrPercentage, LightboxProps, Slide, SlideImage } from "../types.js";
export declare const clsx: (...classes: (string | boolean | undefined)[]) => string;
export declare const cssClass: (name: string) => string;
export declare const cssVar: (name: string) => string;
export declare const composePrefix: (base: string, prefix?: string) => string;
export declare const makeComposePrefix: (base: string) => (prefix?: string) => string;
export declare const label: (labels: Labels | undefined, lbl: string) => string;
export declare const cleanup: (...cleaners: (() => void)[]) => () => void;
export declare const makeUseContext: <T>(name: string, contextName: string, context: React.Context<T | null>) => () => NonNullable<T>;
export declare const hasWindow: () => boolean;
export declare function round(value: number, decimals?: number): number;
export declare const isImageSlide: (slide: Slide) => slide is SlideImage;
export declare const isImageFitCover: (image: SlideImage, imageFit?: LightboxProps["carousel"]["imageFit"]) => boolean;
export declare function parseLengthPercentage(input: LengthOrPercentage): {
    pixel: number;
    percent?: undefined;
} | {
    percent: number;
    pixel?: undefined;
};
export declare function computeSlideRect(containerRect: ContainerRect, padding: LengthOrPercentage): {
    width: number;
    height: number;
};
export declare const devicePixelRatio: () => number;
export declare const getSlideIndex: (index: number, slidesCount: number) => number;
export declare const getSlide: (slides: Slide[], index: number) => Slide;
