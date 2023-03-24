import * as React from "react";
import { IMAGE_FIT_CONTAIN, IMAGE_FIT_COVER } from "./consts.js";
export const clsx = (...classes) => [...classes].filter((cls) => Boolean(cls)).join(" ");
const cssPrefix = "yarl__";
export const cssClass = (name) => `${cssPrefix}${name}`;
export const cssVar = (name) => `--${cssPrefix}${name}`;
export const composePrefix = (base, prefix) => `${base}${prefix ? `_${prefix}` : ""}`;
export const makeComposePrefix = (base) => (prefix) => composePrefix(base, prefix);
export const label = (labels, lbl) => (labels && labels[lbl] ? labels[lbl] : lbl);
export const cleanup = (...cleaners) => () => {
    cleaners.forEach((cleaner) => {
        cleaner();
    });
};
export const makeUseContext = (name, contextName, context) => () => {
    const ctx = React.useContext(context);
    if (!ctx) {
        throw new Error(`${name} must be used within a ${contextName}.Provider`);
    }
    return ctx;
};
export const hasWindow = () => typeof window !== "undefined";
export function round(value, decimals = 0) {
    const factor = 10 ** decimals;
    return Math.round((value + Number.EPSILON) * factor) / factor;
}
export const isImageSlide = (slide) => slide.type === undefined || slide.type === "image";
export const isImageFitCover = (image, imageFit) => image.imageFit === IMAGE_FIT_COVER || (image.imageFit !== IMAGE_FIT_CONTAIN && imageFit === IMAGE_FIT_COVER);
export function parseLengthPercentage(input) {
    if (typeof input === "number") {
        return { pixel: input };
    }
    if (typeof input === "string") {
        const value = parseInt(input, 10);
        return input.endsWith("%") ? { percent: value } : { pixel: value };
    }
    return { pixel: 0 };
}
export function computeSlideRect(containerRect, padding) {
    const paddingValue = parseLengthPercentage(padding);
    const paddingPixels = paddingValue.percent !== undefined ? (containerRect.width / 100) * paddingValue.percent : paddingValue.pixel;
    return {
        width: Math.max(containerRect.width - 2 * paddingPixels, 0),
        height: Math.max(containerRect.height - 2 * paddingPixels, 0),
    };
}
export const devicePixelRatio = () => (hasWindow() ? window === null || window === void 0 ? void 0 : window.devicePixelRatio : undefined) || 1;
export const getSlideIndex = (index, slidesCount) => ((index % slidesCount) + slidesCount) % slidesCount;
export const getSlide = (slides, index) => slides[getSlideIndex(index, slides.length)];
