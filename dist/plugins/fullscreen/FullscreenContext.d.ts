import * as React from "react";
import { ComponentProps, FullscreenRef } from "../../types.js";
export declare const FullscreenContext: React.Context<FullscreenRef | null>;
export declare const useFullscreen: () => FullscreenRef;
export declare function FullscreenContextProvider({ fullscreen: fullscreenProps, children }: ComponentProps): JSX.Element;
