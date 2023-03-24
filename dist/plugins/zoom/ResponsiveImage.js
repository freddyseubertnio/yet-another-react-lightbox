import * as React from "react";
import { devicePixelRatio, ImageSlide, isImageFitCover, UNKNOWN_ACTION_TYPE, useEventCallback, useLayoutEffect, } from "../../core/index.js";
export function isResponsiveImageSlide(slide) {
    var _a;
    return (((_a = slide.srcSet) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0;
}
function reducer({ current, preload }, { type, source }) {
    switch (type) {
        case "fetch":
            if (!current) {
                return { current: source };
            }
            return { current, preload: source };
        case "done":
            if (source === preload) {
                return { current: source };
            }
            return { current, preload };
        default:
            throw new Error(UNKNOWN_ACTION_TYPE);
    }
}
export function ResponsiveImage(props) {
    var _a, _b;
    const [{ current, preload }, dispatch] = React.useReducer(reducer, {});
    const { slide: image, rect, imageFit, render } = props;
    const srcSet = image.srcSet.sort((a, b) => a.width - b.width);
    const width = (_a = image.width) !== null && _a !== void 0 ? _a : srcSet[srcSet.length - 1].width;
    const height = (_b = image.height) !== null && _b !== void 0 ? _b : srcSet[srcSet.length - 1].height;
    const cover = isImageFitCover(image, imageFit);
    const maxWidth = Math.max(...srcSet.map((x) => x.width));
    const targetWidth = Math.min((cover ? Math.max : Math.min)(rect.width, width * (rect.height / height)), maxWidth);
    const pixelDensity = devicePixelRatio();
    const handleResize = useEventCallback(() => {
        var _a;
        const targetSource = (_a = srcSet.find((x) => x.width >= targetWidth * pixelDensity)) !== null && _a !== void 0 ? _a : srcSet[srcSet.length - 1];
        if (!current || srcSet.findIndex((x) => x.src === current) < srcSet.findIndex((x) => x === targetSource)) {
            dispatch({ type: "fetch", source: targetSource.src });
        }
    });
    useLayoutEffect(handleResize, [rect.width, rect.height, pixelDensity, handleResize]);
    const handlePreload = useEventCallback((currentPreload) => dispatch({ type: "done", source: currentPreload }));
    const style = {
        WebkitTransform: "translateZ(0)",
    };
    if (!cover) {
        Object.assign(style, rect.width / rect.height < width / height
            ? { width: "100%", height: "auto" }
            : { width: "auto", height: "100%" });
    }
    return (React.createElement(React.Fragment, null,
        preload && preload !== current && (React.createElement(ImageSlide, { key: "preload", ...props, slide: { ...image, src: preload, srcSet: undefined }, style: { position: "absolute", visibility: "hidden", ...style }, onLoad: () => handlePreload(preload), render: {
                ...render,
                iconLoading: () => null,
                iconError: () => null,
            } })),
        current && (React.createElement(ImageSlide, { key: "current", ...props, slide: { ...image, src: current, srcSet: undefined }, style: style }))));
}
