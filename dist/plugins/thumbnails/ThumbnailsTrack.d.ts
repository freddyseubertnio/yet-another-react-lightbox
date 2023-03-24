import * as React from "react";
import { DeepNonNullable, LightboxProps } from "../../types.js";
export type ThumbnailsInternal = DeepNonNullable<LightboxProps["thumbnails"]>;
export type ThumbnailsTrackProps = {
    containerRef: React.RefObject<HTMLDivElement>;
};
export declare function ThumbnailsTrack({ containerRef }: ThumbnailsTrackProps): JSX.Element;
