import * as React from "react";
import { CLASS_FLEX_CENTER, CLASS_FULLSIZE, clsx, cssClass, ImageSlide, isImageSlide, useLayoutEffect, useLightboxProps, useLightboxState, } from "../../core/index.js";
import { useZoom } from "./ZoomController.js";
import { isResponsiveImageSlide, ResponsiveImage } from "./ResponsiveImage.js";
export function ZoomWrapper({ render, slide, offset, rect }) {
    var _a;
    const [imageDimensions, setImageDimensions] = React.useState();
    const zoomWrapperRef = React.useRef(null);
    const { zoom, maxZoom, offsetX, offsetY, setZoomWrapper } = useZoom();
    const { carousel, on } = useLightboxProps();
    const { currentIndex } = useLightboxState().state;
    useLayoutEffect(() => {
        if (offset === 0) {
            setZoomWrapper({ zoomWrapperRef, imageDimensions });
            return () => setZoomWrapper(undefined);
        }
        return () => { };
    }, [offset, imageDimensions, setZoomWrapper]);
    let rendered = (_a = render.slide) === null || _a === void 0 ? void 0 : _a.call(render, { slide, offset, rect, zoom, maxZoom });
    if (!rendered && isImageSlide(slide)) {
        const slideProps = {
            slide,
            offset,
            rect,
            render,
            imageFit: carousel.imageFit,
            onClick: offset === 0 ? () => { var _a; return (_a = on.click) === null || _a === void 0 ? void 0 : _a.call(on, { index: currentIndex }); } : undefined,
        };
        rendered = isResponsiveImageSlide(slide) ? (React.createElement(ResponsiveImage, { key: slide.src, ...slideProps, slide: slide, rect: offset === 0 ? { width: rect.width * zoom, height: rect.height * zoom } : rect })) : (React.createElement(ImageSlide, { key: slide.src, onLoad: (img) => setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight }), ...slideProps }));
    }
    if (!rendered)
        return null;
    return (React.createElement("div", { ref: zoomWrapperRef, className: clsx(cssClass(CLASS_FULLSIZE), cssClass(CLASS_FLEX_CENTER)), style: offset === 0
            ? { transform: `scale(${zoom}) translateX(${offsetX}px) translateY(${offsetY}px)` }
            : undefined }, rendered));
}
