import * as React from "react";
import { resolveCaptionsProps } from "./props.js";
import { Description } from "./Description.js";
import { Title } from "./Title.js";
export function Captions({ augment }) {
    augment(({ render: { slideFooter: renderFooter, ...restRender }, captions, styles, ...restProps }) => {
        return {
            render: {
                slideFooter: ({ slide }) => (React.createElement(React.Fragment, null, renderFooter === null || renderFooter === void 0 ? void 0 :
                    renderFooter({ slide }),
                    slide.title && React.createElement(Title, { styles: styles, title: slide.title }),
                    slide.description && React.createElement(Description, { styles: styles, description: slide.description }))),
                ...restRender,
            },
            captions: resolveCaptionsProps(captions),
            styles,
            ...restProps,
        };
    });
}
