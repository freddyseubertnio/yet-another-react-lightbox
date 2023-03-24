import * as React from "react";
import { createModule, MODULE_CONTROLLER, PLUGIN_FULLSCREEN, PLUGIN_THUMBNAILS } from "../../core/index.js";
import { resolveFullscreenProps } from "./props.js";
import { FullscreenButton } from "./FullscreenButton.js";
import { FullscreenContextProvider } from "./FullscreenContext.js";
export function Fullscreen({ augment, contains, addParent }) {
    augment(({ fullscreen, toolbar: { buttons, ...restToolbar }, ...restProps }) => ({
        toolbar: { buttons: [React.createElement(FullscreenButton, { key: PLUGIN_FULLSCREEN }), ...buttons], ...restToolbar },
        fullscreen: resolveFullscreenProps(fullscreen),
        ...restProps,
    }));
    addParent(contains(PLUGIN_THUMBNAILS) ? PLUGIN_THUMBNAILS : MODULE_CONTROLLER, createModule(PLUGIN_FULLSCREEN, FullscreenContextProvider));
}
