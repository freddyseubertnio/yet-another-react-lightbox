import * as React from "react";
import { createModule } from "../config.js";
import { clsx, composePrefix, cssClass, cssVar, isImageSlide, parseLengthPercentage } from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller.js";
import { useLightboxProps, useLightboxState } from "../contexts/index.js";
import { CLASS_FLEX_CENTER, CLASS_FULLSIZE, MODULE_CAROUSEL } from "../consts.js";
function cssPrefix(value) {
    return composePrefix(MODULE_CAROUSEL, value);
}
function cssSlidePrefix(value) {
    return composePrefix("slide", value);
}
function CarouselSlide({ slide, offset }) {
    const containerRef = React.useRef(null);
    const { currentIndex } = useLightboxState().state;
    const { slideRect, close } = useController();
    const { render, carousel: { imageFit }, on: { click: onClick }, controller: { closeOnBackdropClick }, } = useLightboxProps();
    const renderSlide = () => {
        var _a, _b, _c, _d;
        let rendered = (_a = render.slide) === null || _a === void 0 ? void 0 : _a.call(render, { slide, offset, rect: slideRect });
        if (!rendered && isImageSlide(slide)) {
            rendered = (React.createElement(ImageSlide, { slide: slide, offset: offset, render: render, rect: slideRect, imageFit: imageFit, onClick: offset === 0 ? () => onClick === null || onClick === void 0 ? void 0 : onClick({ index: currentIndex }) : undefined }));
        }
        return rendered ? (React.createElement(React.Fragment, null, (_b = render.slideHeader) === null || _b === void 0 ? void 0 :
            _b.call(render, { slide }),
            ((_c = render.slideContainer) !== null && _c !== void 0 ? _c : (({ children }) => children))({ slide, children: rendered }), (_d = render.slideFooter) === null || _d === void 0 ? void 0 :
            _d.call(render, { slide }))) : null;
    };
    const handleBackdropClick = (event) => {
        const container = containerRef.current;
        const target = event.target instanceof HTMLElement ? event.target : undefined;
        if (closeOnBackdropClick &&
            target &&
            container &&
            (target === container ||
                (Array.from(container.children).find((x) => x === target) &&
                    target.classList.contains(cssClass(CLASS_FULLSIZE))))) {
            close();
        }
    };
    return (React.createElement("div", { ref: containerRef, className: clsx(cssClass(cssSlidePrefix()), offset === 0 && cssClass(cssSlidePrefix("current")), cssClass(CLASS_FLEX_CENTER)), onClick: handleBackdropClick }, renderSlide()));
}
function Placeholder() {
    return React.createElement("div", { className: cssClass("slide") });
}
export function Carousel({ carousel: { finite, preload, padding, spacing } }) {
    const { slides, currentIndex, globalIndex } = useLightboxState().state;
    const { setCarouselRef } = useController();
    const spacingValue = parseLengthPercentage(spacing);
    const paddingValue = parseLengthPercentage(padding);
    const items = [];
    if ((slides === null || slides === void 0 ? void 0 : slides.length) > 0) {
        for (let i = currentIndex - preload; i < currentIndex; i += 1) {
            const key = globalIndex + i - currentIndex;
            items.push(!finite || i >= 0 ? (React.createElement(CarouselSlide, { key: key, slide: slides[(i + preload * slides.length) % slides.length], offset: i - currentIndex })) : (React.createElement(Placeholder, { key: key })));
        }
        items.push(React.createElement(CarouselSlide, { key: globalIndex, slide: slides[currentIndex], offset: 0 }));
        for (let i = currentIndex + 1; i <= currentIndex + preload; i += 1) {
            const key = globalIndex + i - currentIndex;
            items.push(!finite || i <= slides.length - 1 ? (React.createElement(CarouselSlide, { key: key, slide: slides[i % slides.length], offset: i - currentIndex })) : (React.createElement(Placeholder, { key: key })));
        }
    }
    return (React.createElement("div", { ref: setCarouselRef, className: clsx(cssClass(cssPrefix()), items.length > 0 && cssClass(cssPrefix("with_slides"))), style: {
            [`${cssVar(cssPrefix("slides_count"))}`]: items.length,
            [`${cssVar(cssPrefix("spacing_px"))}`]: spacingValue.pixel || 0,
            [`${cssVar(cssPrefix("spacing_percent"))}`]: spacingValue.percent || 0,
            [`${cssVar(cssPrefix("padding_px"))}`]: paddingValue.pixel || 0,
            [`${cssVar(cssPrefix("padding_percent"))}`]: paddingValue.percent || 0,
        } }, items));
}
export const CarouselModule = createModule(MODULE_CAROUSEL, Carousel);
