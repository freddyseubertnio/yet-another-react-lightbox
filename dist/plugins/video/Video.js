import * as React from "react";
import { resolveVideoProps } from "./props.js";
import { VideoSlide } from "./VideoSlide.js";
function isVideoSlide(slide) {
    return slide.type === "video";
}
export function Video({ augment }) {
    augment(({ render: { slide: renderSlide, ...restRender }, video, ...restProps }) => ({
        render: {
            slide: ({ slide, offset, rect }) => {
                if (isVideoSlide(slide)) {
                    return (React.createElement(VideoSlide, { key: `${slide.sources.map((source) => source.src).join(" ")}`, slide: slide, offset: offset }));
                }
                return renderSlide === null || renderSlide === void 0 ? void 0 : renderSlide({ slide, offset, rect });
            },
            ...restRender,
        },
        video: resolveVideoProps(video),
        ...restProps,
    }));
}
