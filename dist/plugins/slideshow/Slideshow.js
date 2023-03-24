import * as React from "react";
import { createModule, PLUGIN_SLIDESHOW } from "../../core/index.js";
import { resolveSlideshowProps } from "./props.js";
import { SlideshowContextProvider } from "./SlideshowContext.js";
import { SlideshowButton } from "./SlideshowButton.js";
export function Slideshow({ augment, addModule }) {
    augment(({ slideshow, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: { buttons: [React.createElement(SlideshowButton, { key: PLUGIN_SLIDESHOW }), ...buttons], ...restToolbar },
        slideshow: resolveSlideshowProps(slideshow),
        ...restProps,
    }));
    addModule(createModule(PLUGIN_SLIDESHOW, SlideshowContextProvider));
}
