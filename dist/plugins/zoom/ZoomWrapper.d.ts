/// <reference types="react" />
import { LightboxProps, RenderSlideProps } from "../../types.js";
export type ZoomWrapperProps = Pick<LightboxProps, "render"> & RenderSlideProps;
/** Zoom wrapper */
export declare function ZoomWrapper({ render, slide, offset, rect }: ZoomWrapperProps): JSX.Element | null;
