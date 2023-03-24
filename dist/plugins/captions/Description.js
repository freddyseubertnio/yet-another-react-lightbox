import * as React from "react";
import { clsx, cssVar, useLightboxProps } from "../../core/index.js";
import { defaultCaptionsProps, resolveCaptionsProps } from "./props.js";
import { cssPrefix } from "./utils.js";
export function Description({ description, styles }) {
    const { captions } = useLightboxProps();
    const { descriptionTextAlign, descriptionMaxLines } = resolveCaptionsProps(captions);
    return (React.createElement("div", { style: styles.captionsDescriptionContainer, className: clsx(cssPrefix("captions_container"), cssPrefix("description_container")) },
        React.createElement("div", { className: cssPrefix("description"), style: {
                ...(descriptionTextAlign !== defaultCaptionsProps.descriptionTextAlign ||
                    descriptionMaxLines !== defaultCaptionsProps.descriptionMaxLines
                    ? {
                        [cssVar("slide_description_text_align")]: descriptionTextAlign,
                        [cssVar("slide_description_max_lines")]: descriptionMaxLines,
                    }
                    : null),
                ...styles.captionsDescription,
            } }, typeof description === "string"
            ? description
                .split("\n")
                .flatMap((line, index) => [...(index > 0 ? [React.createElement("br", { key: index })] : []), line])
            : description)));
}
