import * as React from "react";
import { clsx, cssClass, hasWindow, isImageFitCover, makeComposePrefix } from "../utils.js";
import { useEventCallback } from "../hooks/index.js";
import { useEvents, useTimeouts } from "../contexts/index.js";
import { ErrorIcon, LoadingIcon } from "./Icons.js";
import { activeSlideStatus, ELEMENT_ICON, SLIDE_STATUS_COMPLETE, SLIDE_STATUS_ERROR, SLIDE_STATUS_LOADING, SLIDE_STATUS_PLACEHOLDER, } from "../consts.js";
const slidePrefix = makeComposePrefix("slide");
const slideImagePrefix = makeComposePrefix("slide_image");
export function ImageSlide({ slide: image, offset, render, rect, imageFit, onClick, onLoad, style }) {
    var _a, _b, _c, _d, _e, _f, _g;
    const [status, setStatus] = React.useState(SLIDE_STATUS_LOADING);
    const { publish } = useEvents();
    const { setTimeout } = useTimeouts();
    const imageRef = React.useRef(null);
    React.useEffect(() => {
        if (offset === 0) {
            publish(activeSlideStatus(status));
        }
    }, [offset, status, publish]);
    const handleLoading = useEventCallback((img) => {
        ("decode" in img ? img.decode() : Promise.resolve())
            .catch(() => { })
            .then(() => {
            if (!img.parentNode) {
                return;
            }
            setStatus(SLIDE_STATUS_COMPLETE);
            setTimeout(() => {
                onLoad === null || onLoad === void 0 ? void 0 : onLoad(img);
            }, 0);
        });
    });
    const setImageRef = React.useCallback((img) => {
        imageRef.current = img;
        if (img === null || img === void 0 ? void 0 : img.complete) {
            handleLoading(img);
        }
    }, [handleLoading]);
    const handleOnLoad = React.useCallback((event) => {
        handleLoading(event.currentTarget);
    }, [handleLoading]);
    const onError = React.useCallback(() => {
        setStatus(SLIDE_STATUS_ERROR);
    }, []);
    const cover = isImageFitCover(image, imageFit);
    const nonInfinite = (value, fallback) => (Number.isFinite(value) ? value : fallback);
    const maxWidth = nonInfinite(Math.max(...((_b = (_a = image.srcSet) === null || _a === void 0 ? void 0 : _a.map((x) => x.width)) !== null && _b !== void 0 ? _b : []).concat(image.width ? [image.width] : [])), ((_c = imageRef.current) === null || _c === void 0 ? void 0 : _c.naturalWidth) || 0);
    const maxHeight = nonInfinite(Math.max(...((_e = (_d = image.srcSet) === null || _d === void 0 ? void 0 : _d.map((x) => x.height)) !== null && _e !== void 0 ? _e : []).concat(image.height ? [image.height] : [])), ((_f = imageRef.current) === null || _f === void 0 ? void 0 : _f.naturalHeight) || 0);
    const defaultStyle = maxWidth && maxHeight
        ? {
            maxWidth: `min(${maxWidth}px, 100%)`,
            maxHeight: `min(${maxHeight}px, 100%)`,
        }
        : {
            maxWidth: "100%",
            maxHeight: "100%",
        };
    const srcSet = (_g = image.srcSet) === null || _g === void 0 ? void 0 : _g.sort((a, b) => a.width - b.width).map((item) => `${item.src} ${item.width}w`).join(", ");
    const estimateActualWidth = () => rect && !cover && image.width && image.height ? (rect.height / image.height) * image.width : Number.MAX_VALUE;
    const sizes = srcSet && rect && hasWindow() ? `${Math.round(Math.min(estimateActualWidth(), rect.width))}px` : undefined;
    return (React.createElement(React.Fragment, null,
        React.createElement("img", { ref: setImageRef, onLoad: handleOnLoad, onError: onError, onClick: onClick, className: clsx(cssClass(slideImagePrefix()), cover && cssClass(slideImagePrefix("cover")), status !== SLIDE_STATUS_COMPLETE && cssClass(slideImagePrefix("loading"))), draggable: false, alt: image.alt, style: { ...defaultStyle, ...style }, sizes: sizes, srcSet: srcSet, src: image.src }),
        status !== SLIDE_STATUS_COMPLETE && (React.createElement("div", { className: cssClass(slidePrefix(SLIDE_STATUS_PLACEHOLDER)) },
            status === SLIDE_STATUS_LOADING &&
                ((render === null || render === void 0 ? void 0 : render.iconLoading) ? (render.iconLoading()) : (React.createElement(LoadingIcon, { className: clsx(cssClass(ELEMENT_ICON), cssClass(slidePrefix(SLIDE_STATUS_LOADING))) }))),
            status === SLIDE_STATUS_ERROR &&
                ((render === null || render === void 0 ? void 0 : render.iconError) ? (render.iconError()) : (React.createElement(ErrorIcon, { className: clsx(cssClass(ELEMENT_ICON), cssClass(slidePrefix(SLIDE_STATUS_ERROR))) })))))));
}
