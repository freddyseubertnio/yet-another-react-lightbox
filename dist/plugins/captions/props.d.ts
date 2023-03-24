import { LightboxProps } from "../../types.js";
export declare const defaultCaptionsProps: {
    descriptionTextAlign: "start";
    descriptionMaxLines: number;
};
export declare const resolveCaptionsProps: (captions: LightboxProps["captions"]) => {
    descriptionTextAlign: import("../../types.js").TextAlignment;
    descriptionMaxLines: number;
};
