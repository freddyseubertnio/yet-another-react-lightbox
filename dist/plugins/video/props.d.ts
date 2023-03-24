import { LightboxProps } from "../../types.js";
export declare const defaultVideoProps: {
    controls: boolean;
    playsInline: boolean;
};
export declare const resolveVideoProps: (video: LightboxProps["video"]) => {
    autoPlay?: boolean | undefined;
    controls: boolean;
    controlsList?: string | undefined;
    crossOrigin?: string | undefined;
    preload?: string | undefined;
    loop?: boolean | undefined;
    muted?: boolean | undefined;
    playsInline: boolean;
    disablePictureInPicture?: boolean | undefined;
    disableRemotePlayback?: boolean | undefined;
};
export declare function useVideoProps(): {
    autoPlay?: boolean | undefined;
    controls: boolean;
    controlsList?: string | undefined;
    crossOrigin?: string | undefined;
    preload?: string | undefined;
    loop?: boolean | undefined;
    muted?: boolean | undefined;
    playsInline: boolean;
    disablePictureInPicture?: boolean | undefined;
    disableRemotePlayback?: boolean | undefined;
};
