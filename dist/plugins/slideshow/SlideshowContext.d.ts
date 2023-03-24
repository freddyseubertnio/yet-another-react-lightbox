import * as React from "react";
import { ComponentProps, SlideshowRef } from "../../types.js";
export declare const SlideshowContext: React.Context<SlideshowRef | null>;
export declare const useSlideshow: () => SlideshowRef;
export declare function SlideshowContextProvider({ slideshow, carousel: { finite }, children }: ComponentProps): JSX.Element;
