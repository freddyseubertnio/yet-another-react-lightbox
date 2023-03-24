import { createModule, MODULE_CONTROLLER, PLUGIN_FULLSCREEN, PLUGIN_THUMBNAILS } from "../../core/index.js";
import { resolveThumbnailsProps } from "./props.js";
import { ThumbnailsContainer } from "./ThumbnailsContainer.js";
export function Thumbnails({ augment, contains, append, addParent }) {
    augment(({ thumbnails, ...restProps }) => ({
        thumbnails: resolveThumbnailsProps(thumbnails),
        ...restProps,
    }));
    const module = createModule(PLUGIN_THUMBNAILS, ThumbnailsContainer);
    if (contains(PLUGIN_FULLSCREEN)) {
        append(PLUGIN_FULLSCREEN, module);
    }
    else {
        addParent(MODULE_CONTROLLER, module);
    }
}
