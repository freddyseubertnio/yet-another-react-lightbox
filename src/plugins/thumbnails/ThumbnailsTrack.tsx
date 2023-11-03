import * as React from "react";

import {
  ACTION_NEXT,
  ACTION_PREV,
  calculatePreload,
  CLASS_FLEX_CENTER,
  clsx,
  cssClass,
  cssVar,
  hasSlides,
  Slide,
  useAnimation,
  useEvents,
  useKeyboardNavigation,
  useLightboxProps,
  useLightboxState,
  useRTL,
  useSensors,
} from "../../index.js";
import { cssPrefix, cssThumbnailPrefix } from "./utils.js";
import { Thumbnail } from "./Thumbnail.js";
import { defaultThumbnailsProps, useThumbnailsProps } from "./props.js";

function isHorizontal(position: ReturnType<typeof useThumbnailsProps>["position"]) {
  return ["top", "bottom"].includes(position);
}

function boxSize(thumbnails: ReturnType<typeof useThumbnailsProps>, dimension: number, includeGap?: boolean) {
  return dimension + 2 * (thumbnails.border + thumbnails.padding) + (includeGap ? thumbnails.gap : 0);
}

export type ThumbnailsTrackProps = {
  visible: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
};

export function ThumbnailsTrack({ visible }: ThumbnailsTrackProps) {
  const track = React.useRef<HTMLDivElement>(null);
  const trackContainerRef = React.useRef<HTMLDivElement>(null);
  const isRTL = useRTL();
  const { publish } = useEvents();
  const { carousel, styles } = useLightboxProps();
  const { slides, globalIndex, animation } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();

  useKeyboardNavigation(subscribeSensors);

  const thumbnails = useThumbnailsProps();
  const { position, width, height, border, borderRadius, padding, gap, vignette } = thumbnails;

  const index = globalIndex;
  const animationDuration = animation?.duration || 0;
  const offset = (animationDuration > 0 && animation?.increment) || 0;

  useAnimation<number>(track, (snapshot) => ({
    keyframes: isHorizontal(position)
      ? [
          {
            transform: `translateX(${(isRTL ? -1 : 1) * boxSize(thumbnails, width, true) * offset + snapshot}px)`,
          },
          { transform: "translateX(0)" },
        ]
      : [
          {
            transform: `translateY(${boxSize(thumbnails, height, true) * offset + snapshot}px)`,
          },
          { transform: "translateY(0)" },
        ],
    duration: animationDuration,
    easing: animation?.easing,
  }));

  calculatePreload(carousel, slides);

  const items: { slide: Slide | null; index: number; placeholder?: boolean }[] = [];

  if (hasSlides(slides)) {
    // create loop goin through slides adn pushes them to items array
    slides.forEach((slide, i) => {
      items.push({ slide, index: i });
    });
  }

  // Adjsust track position so active thumbnail is visible
  React.useEffect(() => {
    const unactiveThumbnails = document.querySelectorAll(
      ".yarl__thumbnails_thumbnail:not(.yarl__thumbnails_thumbnail_active)",
    );
    for (let i = 0; i < unactiveThumbnails.length; i += 1) {
      (unactiveThumbnails[i] as HTMLElement).blur();
    }

    const activeThumbnail = document.getElementsByClassName("yarl__thumbnails_thumbnail_active")[0];
    activeThumbnail.scrollIntoView();
    (activeThumbnail as HTMLElement).focus();
  }, [index]);

  const handleClick = (slideIndex: number) => () => {
    if (slideIndex > index) {
      publish(ACTION_NEXT, { count: slideIndex - index });
    } else if (slideIndex < index) {
      publish(ACTION_PREV, { count: index - slideIndex });
    }
  };

  return (
    <div
      ref={trackContainerRef}
      className={clsx(cssClass(cssPrefix("container")), cssClass(CLASS_FLEX_CENTER))}
      style={{
        ...(!visible ? { display: "none" } : null),
        ...(width !== defaultThumbnailsProps.width
          ? { [cssVar(cssThumbnailPrefix("width"))]: `${boxSize(thumbnails, width)}px` }
          : null),
        ...(height !== defaultThumbnailsProps.height
          ? { [cssVar(cssThumbnailPrefix("height"))]: `${boxSize(thumbnails, height)}px` }
          : null),
        ...(border !== defaultThumbnailsProps.border
          ? { [cssVar(cssThumbnailPrefix("border"))]: `${border}px` }
          : null),
        ...(borderRadius !== defaultThumbnailsProps.borderRadius
          ? { [cssVar(cssThumbnailPrefix("border_radius"))]: `${borderRadius}px` }
          : null),
        ...(padding !== defaultThumbnailsProps.padding
          ? { [cssVar(cssThumbnailPrefix("padding"))]: `${padding}px` }
          : null),
        ...(gap !== defaultThumbnailsProps.gap ? { [cssVar(cssThumbnailPrefix("gap"))]: `${gap}px` } : null),
        ...styles.thumbnailsContainer,
      }}
    >
      <nav
        ref={track}
        style={styles.thumbnailsTrack}
        className={clsx(cssClass(cssPrefix("track")), cssClass(CLASS_FLEX_CENTER))}
        tabIndex={-1}
        {...registerSensors}
      >
        {items.map(({ slide, index: slideIndex, placeholder }) => {
          return (
            <Thumbnail
              key={slideIndex}
              slide={slide}
              active={slideIndex === index}
              // fadeIn={fadeIn}
              // fadeOut={fadeOut}
              placeholder={Boolean(placeholder)}
              onClick={handleClick(slideIndex)}
              onLoseFocus={() => {
                track.current?.focus();
              }}
            />
          );
        })}
      </nav>
      {vignette && <div className={cssClass(cssPrefix("vignette"))} />}
    </div>
  );
}
