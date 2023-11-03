import {
  useLightboxProps,
  composePrefix,
  createIcon,
  cssClass,
  isImageSlide,
  clsx,
  ImageSlide,
  makeComposePrefix,
  useEventCallback,
  cssVar,
  useRTL,
  useEvents,
  useLightboxState,
  useSensors,
  useKeyboardNavigation,
  useAnimation,
  calculatePreload,
  hasSlides,
  makeUseContext,
  LightboxPropsProvider,
  createIconDisabled,
  IconButton,
  addToolbarButton,
  createModule,
} from "../../index.js";
import * as React from "react";
import {
  PLUGIN_THUMBNAILS,
  ELEMENT_ICON,
  CLASS_FULLSIZE,
  CLASS_FLEX_CENTER,
  ACTION_NEXT,
  ACTION_PREV,
  PLUGIN_FULLSCREEN,
  MODULE_CONTROLLER,
} from "../../types.js";

const defaultThumbnailsProps = {
  ref: null,
  position: "bottom",
  width: 120,
  height: 80,
  border: 1,
  borderRadius: 4,
  padding: 4,
  gap: 16,
  imageFit: "contain",
  vignette: true,
};
const resolveThumbnailsProps = (thumbnails) => ({
  ...defaultThumbnailsProps,
  ...thumbnails,
});
function useThumbnailsProps() {
  const { thumbnails } = useLightboxProps();
  return resolveThumbnailsProps(thumbnails);
}

const cssPrefix = (value) => composePrefix(PLUGIN_THUMBNAILS, value);
const cssThumbnailPrefix = (value) => cssPrefix(composePrefix("thumbnail", value));

const VideoThumbnailIcon = createIcon(
  "VideoThumbnail",
  React.createElement("path", {
    d: "M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z",
  }),
);
const UnknownThumbnailIcon = createIcon(
  "UnknownThumbnail",
  React.createElement("path", {
    d: "M23 18V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zM8.5 12.5l2.5 3.01L14.5 11l4.5 6H5l3.5-4.5z",
  }),
);
function renderThumbnail({ slide, render, rect, imageFit }) {
  var _a;
  const customThumbnail =
    (_a = render.thumbnail) === null || _a === void 0 ? void 0 : _a.call(render, { slide, render, rect, imageFit });
  if (customThumbnail) {
    return customThumbnail;
  }
  const thumbnailIconClass = cssClass(cssThumbnailPrefix(ELEMENT_ICON));
  if (!isImageSlide(slide)) {
    if (slide.type === "video") {
      return React.createElement(
        React.Fragment,
        null,
        "poster" in slide &&
          React.createElement("img", {
            alt: "",
            src: slide.poster,
            className: clsx(cssClass(CLASS_FULLSIZE), cssClass(cssPrefix("contain_image"))),
          }),
        React.createElement(VideoThumbnailIcon, { className: thumbnailIconClass }),
      );
    }
  } else {
    return React.createElement(ImageSlide, { slide: slide, render: render, rect: rect, imageFit: imageFit });
  }
  return React.createElement(UnknownThumbnailIcon, { className: thumbnailIconClass });
}
const activePrefix = makeComposePrefix("active");
const fadeInPrefix = makeComposePrefix("fadein");
const fadeOutPrefix = makeComposePrefix("fadeout");
const placeholderPrefix = makeComposePrefix("placeholder");
const DELAY = "delay";
const DURATION = "duration";
function Thumbnail({ slide, onClick, active, fadeIn, fadeOut, placeholder, onLoseFocus }) {
  const ref = React.useRef(null);
  const { render, styles } = useLightboxProps();
  const { width, height, imageFit } = useThumbnailsProps();
  const rect = { width, height };
  const onLoseFocusCallback = useEventCallback(onLoseFocus);
  React.useEffect(() => {
    if (fadeOut && document.activeElement === ref.current) {
      onLoseFocusCallback();
    }
  }, [fadeOut, onLoseFocusCallback]);
  return React.createElement(
    "button",
    {
      ref: ref,
      type: "button",
      className: clsx(
        cssClass(CLASS_FLEX_CENTER),
        cssClass(cssThumbnailPrefix()),
        active && cssClass(cssThumbnailPrefix(activePrefix())),
        fadeIn && cssClass(cssThumbnailPrefix(fadeInPrefix())),
        fadeOut && cssClass(cssThumbnailPrefix(fadeOutPrefix())),
        placeholder && cssClass(cssThumbnailPrefix(placeholderPrefix())),
      ),
      style: {
        ...(fadeIn
          ? {
              [cssVar(cssThumbnailPrefix(fadeInPrefix(DURATION)))]: `${fadeIn.duration}ms`,
              [cssVar(cssThumbnailPrefix(fadeInPrefix(DELAY)))]: `${fadeIn.delay}ms`,
            }
          : null),
        ...(fadeOut
          ? {
              [cssVar(cssThumbnailPrefix(fadeOutPrefix(DURATION)))]: `${fadeOut.duration}ms`,
              [cssVar(cssThumbnailPrefix(fadeOutPrefix(DELAY)))]: `${fadeOut.delay}ms`,
            }
          : null),
        ...styles.thumbnail,
      },
      onClick: onClick,
    },
    slide && renderThumbnail({ slide, render, rect, imageFit }),
  );
}

function isHorizontal(position) {
  return ["top", "bottom"].includes(position);
}
function boxSize(thumbnails, dimension, includeGap) {
  return dimension + 2 * (thumbnails.border + thumbnails.padding) + (includeGap ? thumbnails.gap : 0);
}
function ThumbnailsTrack({ visible }) {
  const track = React.useRef(null);
  const trackContainerRef = React.useRef(null);
  const isRTL = useRTL();
  const { publish } = useEvents();
  const { carousel, styles } = useLightboxProps();
  const { slides, globalIndex, animation } = useLightboxState();
  const { registerSensors, subscribeSensors } = useSensors();
  useKeyboardNavigation(subscribeSensors);
  const thumbnails = useThumbnailsProps();
  const { position, width, height, border, borderRadius, padding, gap, vignette } = thumbnails;
  const index = globalIndex;
  const animationDuration = (animation === null || animation === void 0 ? void 0 : animation.duration) || 0;
  const offset =
    (animationDuration > 0 && (animation === null || animation === void 0 ? void 0 : animation.increment)) || 0;
  useAnimation(track, (snapshot) => ({
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
    easing: animation === null || animation === void 0 ? void 0 : animation.easing,
  }));
  calculatePreload(carousel, slides);
  const items = [];
  if (hasSlides(slides)) {
    slides.forEach((slide, index2) => {
      items.push({ slide: slide, index: index2 });
    });
  }
  React.useEffect(() => {
    const activeThumbnail = document.getElementsByClassName("yarl__thumbnails_thumbnail_active")[0];
    activeThumbnail.scrollIntoView();
  }, [index]);
  const handleClick = (slideIndex) => () => {
    if (slideIndex > index) {
      publish(ACTION_NEXT, { count: slideIndex - index });
    } else if (slideIndex < index) {
      publish(ACTION_PREV, { count: index - slideIndex });
    }
  };
  return React.createElement(
    "div",
    {
      ref: trackContainerRef,
      className: clsx(cssClass(cssPrefix("container")), cssClass(CLASS_FLEX_CENTER)),
      style: {
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
      },
    },
    React.createElement(
      "nav",
      {
        ref: track,
        style: styles.thumbnailsTrack,
        className: clsx(cssClass(cssPrefix("track")), cssClass(CLASS_FLEX_CENTER)),
        tabIndex: -1,
        ...registerSensors,
      },
      items.map(({ slide, index: slideIndex, placeholder }) => {
        return React.createElement(Thumbnail, {
          key: slideIndex,
          slide: slide,
          active: slideIndex === index,
          placeholder: Boolean(placeholder),
          onClick: handleClick(slideIndex),
          onLoseFocus: () => {
            var _a;
            return (_a = track.current) === null || _a === void 0 ? void 0 : _a.focus();
          },
        });
      }),
    ),
    vignette && React.createElement("div", { className: cssClass(cssPrefix("vignette")) }),
  );
}

const ThumbnailsContext = React.createContext(null);
const useThumbnails = makeUseContext("useThumbnails", "ThumbnailsContext", ThumbnailsContext);
function ThumbnailsContextProvider({ children, ...props }) {
  const [visible, setVisible] = React.useState(true);
  const containerRef = React.useRef(null);
  const { ref, position } = resolveThumbnailsProps(props.thumbnails);
  const context = React.useMemo(
    () => ({
      visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [visible],
  );
  React.useImperativeHandle(ref, () => context, [context]);
  return React.createElement(
    LightboxPropsProvider,
    { ...props },
    React.createElement(
      ThumbnailsContext.Provider,
      { value: context },
      React.createElement(
        "div",
        { ref: containerRef, className: clsx(cssClass(cssPrefix()), cssClass(cssPrefix(`${position}`))) },
        ["start", "top"].includes(position) &&
          React.createElement(ThumbnailsTrack, { containerRef: containerRef, visible: visible }),
        React.createElement("div", { className: cssClass(cssPrefix("wrapper")) }, children),
        ["end", "bottom"].includes(position) &&
          React.createElement(ThumbnailsTrack, { containerRef: containerRef, visible: visible }),
      ),
    ),
  );
}

const thumbnailsIcon = () =>
  React.createElement(
    React.Fragment,
    null,
    React.createElement("path", {
      strokeWidth: 2,
      stroke: "currentColor",
      strokeLinejoin: "round",
      fill: "none",
      d: "M3 5l18 0l0 14l-18 0l0-14z",
    }),
    React.createElement("path", { d: "M5 14h4v3h-4zM10 14h4v3h-4zM15 14h4v3h-4z" }),
  );
const ThumbnailsVisible = createIcon("ThumbnailsVisible", thumbnailsIcon());
const ThumbnailsHidden = createIconDisabled("ThumbnailsHidden", thumbnailsIcon());
function ThumbnailsButton() {
  const { visible, show, hide } = useThumbnails();
  const { render } = useLightboxProps();
  if (render.buttonThumbnails) {
    return React.createElement(React.Fragment, null, render.buttonThumbnails({ visible, show, hide }));
  }
  return React.createElement(IconButton, {
    label: visible ? "Hide thumbnails" : "Show thumbnails",
    icon: visible ? ThumbnailsVisible : ThumbnailsHidden,
    renderIcon: visible ? render.iconThumbnailsVisible : render.iconThumbnailsHidden,
    onClick: visible ? hide : show,
  });
}

function Thumbnails({ augment, contains, append, addParent }) {
  augment(({ thumbnails: thumbnailsProps, toolbar, ...restProps }) => {
    const thumbnails = resolveThumbnailsProps(thumbnailsProps);
    return {
      toolbar: addToolbarButton(
        toolbar,
        PLUGIN_THUMBNAILS,
        thumbnails.showToggle ? React.createElement(ThumbnailsButton, null) : null,
      ),
      thumbnails,
      ...restProps,
    };
  });
  const module = createModule(PLUGIN_THUMBNAILS, ThumbnailsContextProvider);
  if (contains(PLUGIN_FULLSCREEN)) {
    append(PLUGIN_FULLSCREEN, module);
  } else {
    addParent(MODULE_CONTROLLER, module);
  }
}

export { Thumbnails as default };
