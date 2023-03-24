/// <reference types="react" />
import { Slide } from "../../types.js";
export type FadeSettings = {
    duration: number;
    delay: number;
};
export type ThumbnailProps = {
    slide: Slide | null;
    onClick: () => void;
    active: boolean;
    fadeIn?: FadeSettings;
    fadeOut?: FadeSettings;
    placeholder: boolean;
};
export declare function Thumbnail({ slide, onClick, active, fadeIn, fadeOut, placeholder }: ThumbnailProps): JSX.Element;
