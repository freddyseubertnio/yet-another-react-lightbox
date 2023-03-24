import * as React from "react";
import { ACTIVE_SLIDE_COMPLETE, ACTIVE_SLIDE_LOADING, ACTIVE_SLIDE_PLAYING, CLASS_FLEX_CENTER, clsx, cssClass, useContainerRect, useEventCallback, useEvents, } from "../../core/index.js";
import { useVideoProps } from "./props.js";
export function VideoSlide({ slide, offset }) {
    const video = useVideoProps();
    const { publish } = useEvents();
    const { setContainerRef, containerRect } = useContainerRect();
    const videoRef = React.useRef(null);
    React.useEffect(() => {
        if (offset !== 0 && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    }, [offset]);
    React.useEffect(() => {
        if (offset === 0 && videoRef.current && (slide.autoPlay || video.autoPlay)) {
            publish(ACTIVE_SLIDE_LOADING);
            videoRef.current.play().catch(() => { });
        }
    }, [offset, video.autoPlay, slide.autoPlay, publish]);
    const handleVideoRef = useEventCallback((node) => {
        if (offset === 0 && (video.autoPlay || slide.autoPlay) && node.paused) {
            node.play().catch(() => { });
        }
    });
    const setVideoRef = React.useCallback((node) => {
        videoRef.current = node;
        if (node) {
            handleVideoRef(node);
        }
    }, [handleVideoRef]);
    const { width, height, poster, sources } = slide;
    const scaleWidthAndHeight = () => {
        if (!width || !height || !containerRect)
            return null;
        const widthBound = width / height > containerRect.width / containerRect.height;
        const elementWidth = widthBound ? containerRect.width : Math.round((containerRect.height / height) * width);
        const elementHeight = !widthBound ? containerRect.height : Math.round((containerRect.width / width) * height);
        return {
            width: elementWidth,
            height: elementHeight,
            style: { width: elementWidth, height: elementHeight, maxWidth: "100%", maxHeight: "100%" },
        };
    };
    const resolveBoolean = (attr) => {
        if (slide[attr] === false)
            return null;
        if (slide[attr] === true)
            return { [attr]: true };
        if (video[attr] === false)
            return null;
        if (video[attr] === true)
            return { [attr]: true };
        return null;
    };
    const resolveString = (attr) => {
        if (video[attr] || slide[attr]) {
            return { [attr]: slide[attr] || video[attr] };
        }
        return null;
    };
    return (React.createElement(React.Fragment, null, sources && (React.createElement("div", { ref: setContainerRef, style: {
            width: "100%",
            height: "100%",
            ...(width ? { maxWidth: `${width}px` } : null),
        }, className: clsx(cssClass("video_container"), cssClass(CLASS_FLEX_CENTER)) }, containerRect && (React.createElement("video", { ref: setVideoRef, poster: poster, ...scaleWidthAndHeight(), ...resolveBoolean("controls"), ...resolveBoolean("playsInline"), ...resolveBoolean("loop"), ...resolveBoolean("muted"), ...resolveBoolean("playsInline"), ...resolveBoolean("disablePictureInPicture"), ...resolveBoolean("disableRemotePlayback"), ...resolveString("controlsList"), ...resolveString("crossOrigin"), ...resolveString("preload"), onPlay: () => {
            publish(ACTIVE_SLIDE_PLAYING);
        }, onEnded: () => {
            publish(ACTIVE_SLIDE_COMPLETE);
        } }, sources.map(({ src, type }, index) => (React.createElement("source", { key: index, src: src, type: type })))))))));
}
