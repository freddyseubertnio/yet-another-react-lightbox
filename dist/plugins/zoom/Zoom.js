import * as React from "react";
import { createModule, isImageSlide, PLUGIN_ZOOM } from "../../core/index.js";
import { resolveZoomProps } from "./props.js";
import { ZoomContextProvider } from "./ZoomController.js";
import { ZoomToolbarControl } from "./ZoomToolbarControl.js";
import { ZoomWrapper } from "./ZoomWrapper.js";
export const Zoom = ({ augment, addModule }) => {
    augment(({ toolbar: { buttons, ...restToolbar }, render, zoom, ...restProps }) => ({
        zoom: resolveZoomProps(zoom),
        toolbar: { buttons: [React.createElement(ZoomToolbarControl, { key: PLUGIN_ZOOM }), ...buttons], ...restToolbar },
        render: {
            ...render,
            slide: (props) => { var _a; return isImageSlide(props.slide) ? React.createElement(ZoomWrapper, { render: render, ...props }) : (_a = render.slide) === null || _a === void 0 ? void 0 : _a.call(render, props); },
        },
        ...restProps,
    }));
    addModule(createModule(PLUGIN_ZOOM, ZoomContextProvider));
};
