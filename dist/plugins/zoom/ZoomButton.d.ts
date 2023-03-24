import * as React from "react";
/** Zoom button props */
export type ZoomButtonProps = {
    zoomIn?: boolean;
    onLoseFocus: () => void;
};
/** Zoom button */
export declare const ZoomButton: React.ForwardRefExoticComponent<ZoomButtonProps & React.RefAttributes<HTMLButtonElement>>;
