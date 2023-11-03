"use client";
import * as React from "react";
import {
  ACTION_CLOSE,
  IMAGE_FIT_CONTAIN,
  MODULE_CONTROLLER,
  IMAGE_FIT_COVER,
  UNKNOWN_ACTION_TYPE,
  ELEMENT_BUTTON,
  ELEMENT_ICON,
  EVENT_ON_POINTER_DOWN,
  EVENT_ON_POINTER_MOVE,
  EVENT_ON_POINTER_UP,
  EVENT_ON_POINTER_LEAVE,
  EVENT_ON_POINTER_CANCEL,
  EVENT_ON_KEY_DOWN,
  EVENT_ON_KEY_UP,
  EVENT_ON_WHEEL,
  SLIDE_STATUS_LOADING,
  activeSlideStatus,
  SLIDE_STATUS_COMPLETE,
  SLIDE_STATUS_ERROR,
  SLIDE_STATUS_PLACEHOLDER,
  ACTION_PREV,
  ACTION_NEXT,
  ACTION_SWIPE,
  CLASS_FLEX_CENTER,
  MODULE_CAROUSEL,
  CLASS_FULLSIZE,
  VK_ARROW_RIGHT,
  VK_ARROW_LEFT,
  VK_ESCAPE,
  MODULE_NAVIGATION,
  CLASS_NO_SCROLL,
  CLASS_NO_SCROLL_PADDING,
  MODULE_NO_SCROLL,
  MODULE_PORTAL,
  MODULE_ROOT,
  MODULE_TOOLBAR,
  TOOLBAR_TITLE,
  TOOLBAR_BUTTONS,
} from "./types.js";
import { createPortal } from "react-dom";
export {
  ACTIVE_SLIDE_COMPLETE,
  ACTIVE_SLIDE_ERROR,
  ACTIVE_SLIDE_LOADING,
  ACTIVE_SLIDE_PLAYING,
  PLUGIN_CAPTIONS,
  PLUGIN_COUNTER,
  PLUGIN_DOWNLOAD,
  PLUGIN_FULLSCREEN,
  PLUGIN_INLINE,
  PLUGIN_SHARE,
  PLUGIN_SLIDESHOW,
  PLUGIN_THUMBNAILS,
  PLUGIN_ZOOM,
  SLIDE_STATUS_PLAYING,
} from "./types.js";

const LightboxDefaultProps = {
  open: false,
  close: () => {},
  index: 0,
  slides: [],
  render: {},
  plugins: [],
  toolbar: { title: "", buttons: [ACTION_CLOSE] },
  labels: {},
  animation: {
    fade: 250,
    swipe: 500,
    easing: {
      fade: "ease",
      swipe: "ease-out",
      navigation: "ease-in-out",
    },
  },
  customAnimation: {
    fade: 250,
    swipe: 500,
    easing: {
      fade: "ease",
      swipe: "ease-out",
      navigation: "ease-in-out",
    },
  },
  carousel: {
    finite: false,
    preload: 2,
    padding: "16px",
    spacing: "30%",
    imageFit: IMAGE_FIT_CONTAIN,
    imageProps: {},
  },
  controller: {
    ref: null,
    focus: true,
    aria: false,
    touchAction: "none",
    closeOnPullDown: false,
    closeOnBackdropClick: false,
  },
  portal: {},
  noScroll: {
    disabled: false,
  },
  on: {},
  styles: {},
  className: "",
};

function createModule(name, component) {
  return { name, component };
}
function createNode(module, children) {
  return { module, children };
}
function traverseNode(node, target, apply) {
  if (node.module.name === target) {
    return apply(node);
  }
  if (node.children) {
    return [
      createNode(
        node.module,
        node.children.flatMap((n) => {
          var _a;
          return (_a = traverseNode(n, target, apply)) !== null && _a !== void 0 ? _a : [];
        }),
      ),
    ];
  }
  return [node];
}
function traverse(nodes, target, apply) {
  return nodes.flatMap((node) => {
    var _a;
    return (_a = traverseNode(node, target, apply)) !== null && _a !== void 0 ? _a : [];
  });
}
function withPlugins(root, plugins = [], augmentations = []) {
  let config = root;
  const contains = (target) => {
    const nodes = [...config];
    while (nodes.length > 0) {
      const node = nodes.pop();
      if ((node === null || node === void 0 ? void 0 : node.module.name) === target) return true;
      if (node === null || node === void 0 ? void 0 : node.children) nodes.push(...node.children);
    }
    return false;
  };
  const addParent = (target, module) => {
    if (target === "") {
      config = [createNode(module, config)];
      return;
    }
    config = traverse(config, target, (node) => [createNode(module, [node])]);
  };
  const append = (target, module) => {
    config = traverse(config, target, (node) => [createNode(node.module, [createNode(module, node.children)])]);
  };
  const addChild = (target, module, precede) => {
    config = traverse(config, target, (node) => {
      var _a;
      return [
        createNode(node.module, [
          ...(precede ? [createNode(module)] : []),
          ...((_a = node.children) !== null && _a !== void 0 ? _a : []),
          ...(!precede ? [createNode(module)] : []),
        ]),
      ];
    });
  };
  const addSibling = (target, module, precede) => {
    config = traverse(config, target, (node) => [
      ...(precede ? [createNode(module)] : []),
      node,
      ...(!precede ? [createNode(module)] : []),
    ]);
  };
  const addModule = (module) => {
    append(MODULE_CONTROLLER, module);
  };
  const replace = (target, module) => {
    config = traverse(config, target, (node) => [createNode(module, node.children)]);
  };
  const remove = (target) => {
    config = traverse(config, target, (node) => node.children);
  };
  const augment = (augmentation) => {
    augmentations.push(augmentation);
  };
  plugins.forEach((plugin) => {
    plugin({
      contains,
      addParent,
      append,
      addChild,
      addSibling,
      addModule,
      replace,
      remove,
      augment,
    });
  });
  return {
    config,
    augmentation: (props) => augmentations.reduce((acc, augmentation) => augmentation(acc), props),
  };
}

const clsx = (...classes) => [...classes].filter((cls) => Boolean(cls)).join(" ");
const cssPrefix$3 = "yarl__";
const cssClass = (name) => `${cssPrefix$3}${name}`;
const cssVar = (name) => `--${cssPrefix$3}${name}`;
const composePrefix = (base, prefix) => `${base}${prefix ? `_${prefix}` : ""}`;
const makeComposePrefix = (base) => (prefix) => composePrefix(base, prefix);
const label = (labels, lbl) => (labels && labels[lbl] ? labels[lbl] : lbl);
const cleanup =
  (...cleaners) =>
  () => {
    cleaners.forEach((cleaner) => {
      cleaner();
    });
  };
const makeUseContext = (name, contextName, context) => () => {
  const ctx = React.useContext(context);
  if (!ctx) {
    throw new Error(`${name} must be used within a ${contextName}.Provider`);
  }
  return ctx;
};
const hasWindow = () => typeof window !== "undefined";
function round(value, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
const isImageSlide = (slide) => slide.type === undefined || slide.type === "image";
const isImageFitCover = (image, imageFit) =>
  image.imageFit === IMAGE_FIT_COVER || (image.imageFit !== IMAGE_FIT_CONTAIN && imageFit === IMAGE_FIT_COVER);
function parseLengthPercentage(input) {
  if (typeof input === "number") {
    return { pixel: input };
  }
  if (typeof input === "string") {
    const value = parseInt(input, 10);
    return input.endsWith("%") ? { percent: value } : { pixel: value };
  }
  return { pixel: 0 };
}
function computeSlideRect(containerRect, padding) {
  const paddingValue = parseLengthPercentage(padding);
  const paddingPixels =
    paddingValue.percent !== undefined ? (containerRect.width / 100) * paddingValue.percent : paddingValue.pixel;
  return {
    width: Math.max(containerRect.width - 2 * paddingPixels, 0),
    height: Math.max(containerRect.height - 2 * paddingPixels, 0),
  };
}
const devicePixelRatio = () =>
  (hasWindow() ? (window === null || window === void 0 ? void 0 : window.devicePixelRatio) : undefined) || 1;
const getSlideIndex = (index, slidesCount) =>
  slidesCount > 0 ? ((index % slidesCount) + slidesCount) % slidesCount : 0;
const hasSlides = (slides) => slides.length > 0;
const getSlide = (slides, index) => slides[getSlideIndex(index, slides.length)];
const getSlideIfPresent = (slides, index) => (hasSlides(slides) ? getSlide(slides, index) : undefined);
function addToolbarButton(toolbar, key, button) {
  if (!button) return toolbar;
  const { buttons, ...restToolbar } = toolbar;
  const index = buttons.findIndex((item) => item === key);
  const buttonWithKey = React.isValidElement(button) ? React.cloneElement(button, { key }, null) : button;
  if (index >= 0) {
    const result = [...buttons];
    result.splice(index, 1, buttonWithKey);
    return { buttons: result, ...restToolbar };
  }
  return { buttons: [buttonWithKey, ...buttons], ...restToolbar };
}
function stopNavigationEventsPropagation() {
  const stopPropagation = (event) => {
    event.stopPropagation();
  };
  return { onPointerDown: stopPropagation, onKeyDown: stopPropagation, onWheel: stopPropagation };
}
function calculatePreload(carousel, slides, minimum = 0) {
  return Math.min(
    carousel.preload,
    Math.max(carousel.finite ? slides.length - 1 : Math.floor(slides.length / 2), minimum),
  );
}

const EventsContext = React.createContext(null);
const useEvents = makeUseContext("useEvents", "EventsContext", EventsContext);
function EventsProvider({ children }) {
  const [subscriptions] = React.useState({});
  React.useEffect(
    () => () => {
      Object.keys(subscriptions).forEach((topic) => delete subscriptions[topic]);
    },
    [subscriptions],
  );
  const context = React.useMemo(() => {
    const unsubscribe = (topic, callback) => {
      var _a;
      (_a = subscriptions[topic]) === null || _a === void 0
        ? void 0
        : _a.splice(0, subscriptions[topic].length, ...subscriptions[topic].filter((cb) => cb !== callback));
    };
    const subscribe = (topic, callback) => {
      if (!subscriptions[topic]) {
        subscriptions[topic] = [];
      }
      subscriptions[topic].push(callback);
      return () => unsubscribe(topic, callback);
    };
    const publish = (...[topic, event]) => {
      var _a;
      (_a = subscriptions[topic]) === null || _a === void 0 ? void 0 : _a.forEach((callback) => callback(event));
    };
    return { publish, subscribe, unsubscribe };
  }, [subscriptions]);
  return React.createElement(EventsContext.Provider, { value: context }, children);
}

const LightboxPropsContext = React.createContext(null);
const useLightboxProps = makeUseContext("useLightboxProps", "LightboxPropsContext", LightboxPropsContext);
function LightboxPropsProvider({ children, ...props }) {
  return React.createElement(LightboxPropsContext.Provider, { value: props }, children);
}

const LightboxStateContext = React.createContext(null);
const useLightboxState = makeUseContext("useLightboxState", "LightboxStateContext", LightboxStateContext);
const LightboxDispatchContext = React.createContext(null);
const useLightboxDispatch = makeUseContext("useLightboxDispatch", "LightboxDispatchContext", LightboxDispatchContext);
function reducer(state, action) {
  switch (action.type) {
    case "swipe": {
      const { slides } = state;
      const increment = (action === null || action === void 0 ? void 0 : action.increment) || 0;
      const globalIndex = state.globalIndex + increment;
      const currentIndex = getSlideIndex(globalIndex, slides.length);
      const currentSlide = getSlideIfPresent(slides, currentIndex);
      const animation =
        increment || action.duration
          ? {
              increment,
              duration: action.duration,
              easing: action.easing,
            }
          : undefined;
      return { slides, currentIndex, globalIndex, currentSlide, animation };
    }
    case "update":
      return {
        slides: action.slides,
        currentIndex: action.index,
        globalIndex: action.index,
        currentSlide: getSlideIfPresent(action.slides, action.index),
      };
    default:
      throw new Error(UNKNOWN_ACTION_TYPE);
  }
}
function LightboxStateProvider({ slides, index, children }) {
  const [state, dispatch] = React.useReducer(reducer, {
    slides,
    currentIndex: index,
    globalIndex: index,
    currentSlide: getSlideIfPresent(slides, index),
  });
  React.useEffect(() => {
    dispatch({ type: "update", slides, index });
  }, [slides, index]);
  const context = React.useMemo(() => ({ ...state, state, dispatch }), [state, dispatch]);
  return React.createElement(
    LightboxDispatchContext.Provider,
    { value: dispatch },
    React.createElement(LightboxStateContext.Provider, { value: context }, children),
  );
}

const TimeoutsContext = React.createContext(null);
const useTimeouts = makeUseContext("useTimeouts", "TimeoutsContext", TimeoutsContext);
function TimeoutsProvider({ children }) {
  const [timeouts] = React.useState([]);
  React.useEffect(
    () => () => {
      timeouts.forEach((tid) => window.clearTimeout(tid));
      timeouts.splice(0, timeouts.length);
    },
    [timeouts],
  );
  const context = React.useMemo(() => {
    const removeTimeout = (id) => {
      timeouts.splice(0, timeouts.length, ...timeouts.filter((tid) => tid !== id));
    };
    const setTimeout = (fn, delay) => {
      const id = window.setTimeout(() => {
        removeTimeout(id);
        fn();
      }, delay);
      timeouts.push(id);
      return id;
    };
    const clearTimeout = (id) => {
      if (id !== undefined) {
        removeTimeout(id);
        window.clearTimeout(id);
      }
    };
    return { setTimeout, clearTimeout };
  }, [timeouts]);
  return React.createElement(TimeoutsContext.Provider, { value: context }, children);
}

const IconButton = React.forwardRef(function IconButton(
  { label: label$1, className, icon: Icon, renderIcon, onClick, style, ...rest },
  ref,
) {
  const { styles, labels } = useLightboxProps();
  return React.createElement(
    "button",
    {
      ref: ref,
      type: "button",
      "aria-label": label(labels, label$1),
      className: clsx(cssClass(ELEMENT_BUTTON), className),
      onClick: onClick,
      style: { ...style, ...styles.button },
      ...rest,
    },
    renderIcon ? renderIcon() : React.createElement(Icon, { className: cssClass(ELEMENT_ICON), style: styles.icon }),
  );
});

function svgIcon(name, children) {
  const icon = (props) =>
    React.createElement(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        width: "24",
        height: "24",
        "aria-hidden": "true",
        focusable: "false",
        ...props,
      },
      children,
    );
  icon.displayName = name;
  return icon;
}
function createIcon(name, glyph) {
  return svgIcon(
    name,
    React.createElement(
      "g",
      { fill: "currentColor" },
      React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
      glyph,
    ),
  );
}
function createIconDisabled(name, glyph) {
  return svgIcon(
    name,
    React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "defs",
        null,
        React.createElement(
          "mask",
          { id: "strike" },
          React.createElement("path", { d: "M0 0h24v24H0z", fill: "white" }),
          React.createElement("path", { d: "M0 0L24 24", stroke: "black", strokeWidth: 4 }),
        ),
      ),
      React.createElement("path", {
        d: "M0.70707 2.121320L21.878680 23.292883",
        stroke: "currentColor",
        strokeWidth: 2,
      }),
      React.createElement(
        "g",
        { fill: "currentColor", mask: "url(#strike)" },
        React.createElement("path", { d: "M0 0h24v24H0z", fill: "none" }),
        glyph,
      ),
    ),
  );
}
const CloseIcon = createIcon(
  "Close",
  React.createElement("path", {
    d: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  }),
);
const PreviousIcon = createIcon(
  "Previous",
  React.createElement("path", { d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" }),
);
const NextIcon = createIcon(
  "Next",
  React.createElement("path", { d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" }),
);
const LoadingIcon = createIcon(
  "Loading",
  React.createElement(
    React.Fragment,
    null,
    Array.from({ length: 8 }).map((_, index, array) =>
      React.createElement("line", {
        key: index,
        x1: "12",
        y1: "6.5",
        x2: "12",
        y2: "1.8",
        strokeLinecap: "round",
        strokeWidth: "2.6",
        stroke: "currentColor",
        strokeOpacity: (1 / array.length) * (index + 1),
        transform: `rotate(${(360 / array.length) * index}, 12, 12)`,
      }),
    ),
  ),
);
const ErrorIcon = createIcon(
  "Error",
  React.createElement("path", {
    d: "M21.9,21.9l-8.49-8.49l0,0L3.59,3.59l0,0L2.1,2.1L0.69,3.51L3,5.83V19c0,1.1,0.9,2,2,2h13.17l2.31,2.31L21.9,21.9z M5,18 l3.5-4.5l2.5,3.01L12.17,15l3,3H5z M21,18.17L5.83,3H19c1.1,0,2,0.9,2,2V18.17z",
  }),
);

const useLayoutEffect = hasWindow() ? React.useLayoutEffect : React.useEffect;

function useMotionPreference() {
  const [reduceMotion, setReduceMotion] = React.useState(false);
  React.useEffect(() => {
    var _a, _b;
    const mediaQuery =
      (_a = window.matchMedia) === null || _a === void 0 ? void 0 : _a.call(window, "(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery === null || mediaQuery === void 0 ? void 0 : mediaQuery.matches);
    const listener = (event) => setReduceMotion(event.matches);
    (_b = mediaQuery === null || mediaQuery === void 0 ? void 0 : mediaQuery.addEventListener) === null || _b === void 0
      ? void 0
      : _b.call(mediaQuery, "change", listener);
    return () => {
      var _a;
      return (_a = mediaQuery === null || mediaQuery === void 0 ? void 0 : mediaQuery.removeEventListener) === null ||
        _a === void 0
        ? void 0
        : _a.call(mediaQuery, "change", listener);
    };
  }, []);
  return reduceMotion;
}

function currentTransformation(node) {
  let x = 0;
  let y = 0;
  let z = 0;
  const matrix = window.getComputedStyle(node).transform;
  const matcher = matrix.match(/matrix.*\((.+)\)/);
  if (matcher) {
    const values = matcher[1].split(",").map((str) => Number.parseInt(str, 10));
    if (values.length === 6) {
      x = values[4];
      y = values[5];
    } else if (values.length === 16) {
      x = values[12];
      y = values[13];
      z = values[14];
    }
  }
  return { x, y, z };
}
function useAnimation(nodeRef, computeAnimation) {
  const snapshot = React.useRef();
  const animation = React.useRef();
  const reduceMotion = useMotionPreference();
  useLayoutEffect(() => {
    var _a, _b, _c;
    if (nodeRef.current && snapshot.current !== undefined && !reduceMotion) {
      const { keyframes, duration, easing, onfinish } =
        computeAnimation(
          snapshot.current,
          nodeRef.current.getBoundingClientRect(),
          currentTransformation(nodeRef.current),
        ) || {};
      if (keyframes && duration) {
        (_a = animation.current) === null || _a === void 0 ? void 0 : _a.cancel();
        animation.current = undefined;
        try {
          animation.current =
            (_c = (_b = nodeRef.current).animate) === null || _c === void 0
              ? void 0
              : _c.call(_b, keyframes, { duration, easing });
        } catch (err) {
          console.error(err);
        }
        if (animation.current) {
          animation.current.onfinish = () => {
            animation.current = undefined;
            onfinish === null || onfinish === void 0 ? void 0 : onfinish();
          };
        }
      }
    }
    snapshot.current = undefined;
  });
  return {
    prepareAnimation: (currentSnapshot) => {
      snapshot.current = currentSnapshot;
    },
    isAnimationPlaying: () => {
      var _a;
      return ((_a = animation.current) === null || _a === void 0 ? void 0 : _a.playState) === "running";
    },
  };
}

function useContainerRect() {
  const containerRef = React.useRef(null);
  const observerRef = React.useRef();
  const [containerRect, setContainerRect] = React.useState();
  const setContainerRef = React.useCallback((node) => {
    containerRef.current = node;
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = undefined;
    }
    const updateContainerRect = () => {
      if (node) {
        const styles = window.getComputedStyle(node);
        const parse = (value) => parseFloat(value) || 0;
        setContainerRect({
          width: Math.round(node.clientWidth - parse(styles.paddingLeft) - parse(styles.paddingRight)),
          height: Math.round(node.clientHeight - parse(styles.paddingTop) - parse(styles.paddingBottom)),
        });
      } else {
        setContainerRect(undefined);
      }
    };
    updateContainerRect();
    if (node && typeof ResizeObserver !== "undefined") {
      observerRef.current = new ResizeObserver(updateContainerRect);
      observerRef.current.observe(node);
    }
  }, []);
  return { setContainerRef, containerRef, containerRect };
}

function useDelay() {
  const timeoutId = React.useRef();
  const { setTimeout, clearTimeout } = useTimeouts();
  return React.useCallback(
    (callback, delay) => {
      clearTimeout(timeoutId.current);
      timeoutId.current = setTimeout(callback, delay > 0 ? delay : 0);
    },
    [setTimeout, clearTimeout],
  );
}

function useEventCallback(fn) {
  const ref = React.useRef(fn);
  useLayoutEffect(() => {
    ref.current = fn;
  });
  return React.useCallback((...args) => {
    var _a;
    return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.call(ref, ...args);
  }, []);
}

function setRef(ref, value) {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}
function useForkRef(refA, refB) {
  return React.useMemo(
    () =>
      refA == null && refB == null
        ? null
        : (refValue) => {
            setRef(refA, refValue);
            setRef(refB, refValue);
          },
    [refA, refB],
  );
}

function useLoseFocus(focus, disabled = false) {
  const focused = React.useRef();
  useLayoutEffect(() => {
    if (disabled && focused.current) {
      focused.current = false;
      focus();
    }
  }, [disabled, focus]);
  const onFocus = React.useCallback(() => {
    focused.current = true;
  }, []);
  const onBlur = React.useCallback(() => {
    focused.current = false;
  }, []);
  return { onFocus, onBlur };
}

function useRTL() {
  const [isRTL, setIsRTL] = React.useState(false);
  useLayoutEffect(() => {
    setIsRTL(window.getComputedStyle(window.document.documentElement).direction === "rtl");
  }, []);
  return isRTL;
}

function useSensors() {
  const [subscribers] = React.useState({});
  const notifySubscribers = React.useCallback(
    (type, event) => {
      var _a;
      (_a = subscribers[type]) === null || _a === void 0
        ? void 0
        : _a.forEach((listener) => {
            if (!event.isPropagationStopped()) listener(event);
          });
    },
    [subscribers],
  );
  const registerSensors = React.useMemo(
    () => ({
      onPointerDown: (event) => notifySubscribers(EVENT_ON_POINTER_DOWN, event),
      onPointerMove: (event) => notifySubscribers(EVENT_ON_POINTER_MOVE, event),
      onPointerUp: (event) => notifySubscribers(EVENT_ON_POINTER_UP, event),
      onPointerLeave: (event) => notifySubscribers(EVENT_ON_POINTER_LEAVE, event),
      onPointerCancel: (event) => notifySubscribers(EVENT_ON_POINTER_CANCEL, event),
      onKeyDown: (event) => notifySubscribers(EVENT_ON_KEY_DOWN, event),
      onKeyUp: (event) => notifySubscribers(EVENT_ON_KEY_UP, event),
      onWheel: (event) => notifySubscribers(EVENT_ON_WHEEL, event),
    }),
    [notifySubscribers],
  );
  const subscribeSensors = React.useCallback(
    (type, callback) => {
      if (!subscribers[type]) {
        subscribers[type] = [];
      }
      subscribers[type].unshift(callback);
      return () => {
        const listeners = subscribers[type];
        if (listeners) {
          listeners.splice(0, listeners.length, ...listeners.filter((el) => el !== callback));
        }
      };
    },
    [subscribers],
  );
  return { registerSensors, subscribeSensors };
}

function useThrottle(callback, delay) {
  const lastCallbackTime = React.useRef(0);
  const delayCallback = useDelay();
  const executeCallback = useEventCallback((...args) => {
    lastCallbackTime.current = Date.now();
    callback(args);
  });
  return React.useCallback(
    (...args) => {
      delayCallback(
        () => {
          executeCallback(args);
        },
        delay - (Date.now() - lastCallbackTime.current),
      );
    },
    [delay, executeCallback, delayCallback],
  );
}

const slidePrefix = makeComposePrefix("slide");
const slideImagePrefix = makeComposePrefix("slide_image");
function ImageSlide({ slide: image, offset, render, rect, imageFit, imageProps, onClick, onLoad, style }) {
  var _a, _b, _c, _d, _e, _f, _g;
  const [status, setStatus] = React.useState(SLIDE_STATUS_LOADING);
  const { publish } = useEvents();
  const { setTimeout } = useTimeouts();
  const imageRef = React.useRef(null);
  React.useEffect(() => {
    if (offset === 0) {
      publish(activeSlideStatus(status));
    }
  }, [offset, status, publish]);
  const handleLoading = useEventCallback((img) => {
    ("decode" in img ? img.decode() : Promise.resolve())
      .catch(() => {})
      .then(() => {
        if (!img.parentNode) {
          return;
        }
        setStatus(SLIDE_STATUS_COMPLETE);
        setTimeout(() => {
          onLoad === null || onLoad === void 0 ? void 0 : onLoad(img);
        }, 0);
      });
  });
  const setImageRef = React.useCallback(
    (img) => {
      imageRef.current = img;
      if (img === null || img === void 0 ? void 0 : img.complete) {
        handleLoading(img);
      }
    },
    [handleLoading],
  );
  const handleOnLoad = React.useCallback(
    (event) => {
      handleLoading(event.currentTarget);
    },
    [handleLoading],
  );
  const onError = React.useCallback(() => {
    setStatus(SLIDE_STATUS_ERROR);
  }, []);
  const cover = isImageFitCover(image, imageFit);
  const nonInfinite = (value, fallback) => (Number.isFinite(value) ? value : fallback);
  const maxWidth = nonInfinite(
    Math.max(
      ...((_b = (_a = image.srcSet) === null || _a === void 0 ? void 0 : _a.map((x) => x.width)) !== null &&
      _b !== void 0
        ? _b
        : []
      )
        .concat(image.width ? [image.width] : [])
        .filter(Boolean),
    ),
    ((_c = imageRef.current) === null || _c === void 0 ? void 0 : _c.naturalWidth) || 0,
  );
  const maxHeight = nonInfinite(
    Math.max(
      ...((_e = (_d = image.srcSet) === null || _d === void 0 ? void 0 : _d.map((x) => x.height)) !== null &&
      _e !== void 0
        ? _e
        : []
      )
        .concat(image.height ? [image.height] : [])
        .filter(Boolean),
    ),
    ((_f = imageRef.current) === null || _f === void 0 ? void 0 : _f.naturalHeight) || 0,
  );
  const defaultStyle =
    maxWidth && maxHeight
      ? {
          maxWidth: `min(${maxWidth}px, 100%)`,
          maxHeight: `min(${maxHeight}px, 100%)`,
        }
      : {
          maxWidth: "100%",
          maxHeight: "100%",
        };
  const srcSet =
    (_g = image.srcSet) === null || _g === void 0
      ? void 0
      : _g
          .sort((a, b) => a.width - b.width)
          .map((item) => `${item.src} ${item.width}w`)
          .join(", ");
  const estimateActualWidth = () =>
    rect && !cover && image.width && image.height ? (rect.height / image.height) * image.width : Number.MAX_VALUE;
  const sizes =
    srcSet && rect && hasWindow() ? `${Math.round(Math.min(estimateActualWidth(), rect.width))}px` : undefined;
  const { style: imagePropsStyle, className: imagePropsClassName, ...restImageProps } = imageProps || {};
  return React.createElement(
    React.Fragment,
    null,
    React.createElement("img", {
      ref: setImageRef,
      onLoad: handleOnLoad,
      onError: onError,
      onClick: onClick,
      draggable: false,
      className: clsx(
        cssClass(slideImagePrefix()),
        cover && cssClass(slideImagePrefix("cover")),
        status !== SLIDE_STATUS_COMPLETE && cssClass(slideImagePrefix("loading")),
        imagePropsClassName,
      ),
      style: { ...defaultStyle, ...style, ...imagePropsStyle },
      ...restImageProps,
      alt: image.alt,
      sizes: sizes,
      srcSet: srcSet,
      src: image.src,
    }),
    status !== SLIDE_STATUS_COMPLETE &&
      React.createElement(
        "div",
        { className: cssClass(slidePrefix(SLIDE_STATUS_PLACEHOLDER)) },
        status === SLIDE_STATUS_LOADING &&
          ((render === null || render === void 0 ? void 0 : render.iconLoading)
            ? render.iconLoading()
            : React.createElement(LoadingIcon, {
                className: clsx(cssClass(ELEMENT_ICON), cssClass(slidePrefix(SLIDE_STATUS_LOADING))),
              })),
        status === SLIDE_STATUS_ERROR &&
          ((render === null || render === void 0 ? void 0 : render.iconError)
            ? render.iconError()
            : React.createElement(ErrorIcon, {
                className: clsx(cssClass(ELEMENT_ICON), cssClass(slidePrefix(SLIDE_STATUS_ERROR))),
              })),
      ),
  );
}

var SwipeState;
(function (SwipeState) {
  SwipeState[(SwipeState["NONE"] = 0)] = "NONE";
  SwipeState[(SwipeState["SWIPE"] = 1)] = "SWIPE";
  SwipeState[(SwipeState["PULL_DOWN"] = 2)] = "PULL_DOWN";
  SwipeState[(SwipeState["ANIMATION"] = 3)] = "ANIMATION";
})(SwipeState || (SwipeState = {}));

function usePointerEvents(subscribeSensors, onPointerDown, onPointerMove, onPointerUp, disabled) {
  React.useEffect(
    () =>
      !disabled
        ? cleanup(
            subscribeSensors(EVENT_ON_POINTER_DOWN, onPointerDown),
            subscribeSensors(EVENT_ON_POINTER_MOVE, onPointerMove),
            subscribeSensors(EVENT_ON_POINTER_UP, onPointerUp),
            subscribeSensors(EVENT_ON_POINTER_LEAVE, onPointerUp),
            subscribeSensors(EVENT_ON_POINTER_CANCEL, onPointerUp),
          )
        : () => {},
    [subscribeSensors, onPointerDown, onPointerMove, onPointerUp, disabled],
  );
}

var Gesture;
(function (Gesture) {
  Gesture[(Gesture["NONE"] = 0)] = "NONE";
  Gesture[(Gesture["SWIPE"] = 1)] = "SWIPE";
  Gesture[(Gesture["PULL_DOWN"] = 2)] = "PULL_DOWN";
})(Gesture || (Gesture = {}));
const SWIPE_THRESHOLD = 30;
function usePointerSwipe(
  subscribeSensors,
  isSwipeValid,
  containerWidth,
  swipeAnimationDuration,
  onSwipeStart,
  onSwipeProgress,
  onSwipeFinish,
  onSwipeCancel,
  pullDownEnabled,
  onPullDownStart,
  onPullDownProgress,
  onPullDownFinish,
  onPullDownCancel,
) {
  const offset = React.useRef(0);
  const pointers = React.useRef([]);
  const activePointer = React.useRef();
  const startTime = React.useRef(0);
  const gesture = React.useRef(Gesture.NONE);
  const clearPointer = React.useCallback((event) => {
    if (activePointer.current === event.pointerId) {
      activePointer.current = undefined;
      gesture.current = Gesture.NONE;
    }
    const currentPointers = pointers.current;
    currentPointers.splice(
      0,
      currentPointers.length,
      ...currentPointers.filter((p) => p.pointerId !== event.pointerId),
    );
  }, []);
  const addPointer = React.useCallback(
    (event) => {
      clearPointer(event);
      event.persist();
      pointers.current.push(event);
    },
    [clearPointer],
  );
  const onPointerDown = useEventCallback((event) => {
    addPointer(event);
  });
  const onPointerUp = useEventCallback((event) => {
    if (pointers.current.find((x) => x.pointerId === event.pointerId) && activePointer.current === event.pointerId) {
      const duration = Date.now() - startTime.current;
      const currentOffset = offset.current;
      if (gesture.current === Gesture.SWIPE) {
        if (
          Math.abs(currentOffset) > 0.3 * containerWidth ||
          (Math.abs(currentOffset) > 5 && duration < swipeAnimationDuration)
        ) {
          onSwipeFinish(currentOffset, duration);
        } else {
          onSwipeCancel(currentOffset);
        }
      } else if (gesture.current === Gesture.PULL_DOWN) {
        if (currentOffset > 2 * SWIPE_THRESHOLD) {
          onPullDownFinish(currentOffset, duration);
        } else {
          onPullDownCancel(currentOffset);
        }
      }
      offset.current = 0;
      gesture.current = Gesture.NONE;
    }
    clearPointer(event);
  });
  const onPointerMove = useEventCallback((event) => {
    if (event.pointerType === "touch" && pointers.current.length > 1) return;
    if (event.pointerType === "mouse" && event.buttons !== 1) return;
    const pointer = pointers.current.find((p) => p.pointerId === event.pointerId);
    if (pointer) {
      const isCurrentPointer = activePointer.current === event.pointerId;
      if (event.buttons === 0) {
        if (isCurrentPointer && offset.current !== 0) {
          onPointerUp(event);
        } else {
          clearPointer(pointer);
        }
        return;
      }
      const deltaX = event.clientX - pointer.clientX;
      const deltaY = event.clientY - pointer.clientY;
      if (activePointer.current === undefined) {
        const startGesture = (newGesture) => {
          addPointer(event);
          activePointer.current = event.pointerId;
          startTime.current = Date.now();
          gesture.current = newGesture;
        };
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > SWIPE_THRESHOLD && isSwipeValid(deltaX)) {
          startGesture(Gesture.SWIPE);
          onSwipeStart();
        } else if (pullDownEnabled && Math.abs(deltaY) > Math.abs(deltaX) && deltaY > SWIPE_THRESHOLD) {
          startGesture(Gesture.PULL_DOWN);
          onPullDownStart();
        }
      } else if (isCurrentPointer) {
        if (gesture.current === Gesture.SWIPE) {
          offset.current = deltaX;
          onSwipeProgress(deltaX);
        } else if (gesture.current === Gesture.PULL_DOWN) {
          offset.current = deltaY;
          onPullDownProgress(deltaY);
        }
      }
    }
  });
  usePointerEvents(subscribeSensors, onPointerDown, onPointerMove, onPointerUp);
}

const WHEEL = "wheel";
function preventDefault(event) {
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.ctrlKey) {
    event.preventDefault();
  }
}
function usePreventSwipeNavigation() {
  const ref = React.useRef(null);
  return React.useCallback((node) => {
    var _a;
    if (node) {
      node.addEventListener(WHEEL, preventDefault, { passive: false });
    } else {
      (_a = ref.current) === null || _a === void 0 ? void 0 : _a.removeEventListener(WHEEL, preventDefault);
    }
    ref.current = node;
  }, []);
}

function useWheelSwipe(
  swipeState,
  subscribeSensors,
  isSwipeValid,
  containerWidth,
  swipeAnimationDuration,
  onSwipeStart,
  onSwipeProgress,
  onSwipeFinish,
  onSwipeCancel,
) {
  const offset = React.useRef(0);
  const intent = React.useRef(0);
  const intentCleanup = React.useRef();
  const resetCleanup = React.useRef();
  const wheelResidualMomentum = React.useRef(0);
  const startTime = React.useRef(0);
  const { setTimeout, clearTimeout } = useTimeouts();
  const cancelSwipeIntentCleanup = React.useCallback(() => {
    if (intentCleanup.current) {
      clearTimeout(intentCleanup.current);
      intentCleanup.current = undefined;
    }
  }, [clearTimeout]);
  const cancelSwipeResetCleanup = React.useCallback(() => {
    if (resetCleanup.current) {
      clearTimeout(resetCleanup.current);
      resetCleanup.current = undefined;
    }
  }, [clearTimeout]);
  const handleCleanup = useEventCallback(() => {
    if (swipeState !== SwipeState.SWIPE) {
      offset.current = 0;
      startTime.current = 0;
      cancelSwipeIntentCleanup();
      cancelSwipeResetCleanup();
    }
  });
  React.useEffect(handleCleanup, [swipeState, handleCleanup]);
  const handleCancelSwipe = useEventCallback((currentSwipeOffset) => {
    resetCleanup.current = undefined;
    if (offset.current === currentSwipeOffset) {
      onSwipeCancel(offset.current);
    }
  });
  const onWheel = useEventCallback((event) => {
    if (event.ctrlKey) {
      return;
    }
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      return;
    }
    if (swipeState === SwipeState.NONE) {
      if (Math.abs(event.deltaX) <= 1.2 * Math.abs(wheelResidualMomentum.current)) {
        wheelResidualMomentum.current = event.deltaX;
        return;
      }
      if (!isSwipeValid(-event.deltaX)) {
        return;
      }
      intent.current += event.deltaX;
      cancelSwipeIntentCleanup();
      if (Math.abs(intent.current) > 30) {
        intent.current = 0;
        wheelResidualMomentum.current = 0;
        startTime.current = Date.now();
        onSwipeStart();
      } else {
        const currentSwipeIntent = intent.current;
        intentCleanup.current = setTimeout(() => {
          intentCleanup.current = undefined;
          if (currentSwipeIntent === intent.current) {
            intent.current = 0;
          }
        }, swipeAnimationDuration);
      }
    } else if (swipeState === SwipeState.SWIPE) {
      let newSwipeOffset = offset.current - event.deltaX;
      newSwipeOffset = Math.min(Math.abs(newSwipeOffset), containerWidth) * Math.sign(newSwipeOffset);
      offset.current = newSwipeOffset;
      onSwipeProgress(newSwipeOffset);
      cancelSwipeResetCleanup();
      if (Math.abs(newSwipeOffset) > 0.2 * containerWidth) {
        wheelResidualMomentum.current = event.deltaX;
        onSwipeFinish(newSwipeOffset, Date.now() - startTime.current);
        return;
      }
      resetCleanup.current = setTimeout(() => handleCancelSwipe(newSwipeOffset), 2 * swipeAnimationDuration);
    } else {
      wheelResidualMomentum.current = event.deltaX;
    }
  });
  React.useEffect(() => subscribeSensors(EVENT_ON_WHEEL, onWheel), [subscribeSensors, onWheel]);
}

const cssContainerPrefix = makeComposePrefix("container");
const ControllerContext = React.createContext(null);
const useController = makeUseContext("useController", "ControllerContext", ControllerContext);
function Controller({ children, ...props }) {
  var _a;
  const { carousel, animation, customAnimation, controller, on, styles, render } = props;
  const [toolbarWidth, setToolbarWidth] = React.useState();
  const state = useLightboxState();
  const dispatch = useLightboxDispatch();
  const [swipeState, setSwipeState] = React.useState(SwipeState.NONE);
  const swipeOffset = React.useRef(0);
  const pullDownOffset = React.useRef(0);
  const pullDownOpacity = React.useRef(1);
  const { registerSensors, subscribeSensors } = useSensors();
  const { subscribe, publish } = useEvents();
  const cleanupAnimationIncrement = useDelay();
  const cleanupSwipeOffset = useDelay();
  const cleanupPullDownOffset = useDelay();
  const { containerRef, setContainerRef, containerRect } = useContainerRect();
  const handleContainerRef = useForkRef(usePreventSwipeNavigation(), setContainerRef);
  const carouselRef = React.useRef(null);
  const setCarouselRef = useForkRef(carouselRef, undefined);
  const isRTL = useRTL();
  const rtl = (value) => (isRTL ? -1 : 1) * (typeof value === "number" ? value : 1);
  const focus = useEventCallback(() => {
    var _a;
    return (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.focus();
  });
  const getLightboxProps = useEventCallback(() => props);
  const getLightboxState = useEventCallback(() => state);
  const prev = React.useCallback((params) => publish(ACTION_PREV, params), [publish]);
  const next = React.useCallback((params) => publish(ACTION_NEXT, params), [publish]);
  const close = React.useCallback(() => publish(ACTION_CLOSE), [publish]);
  const isSwipeValid = (offset) =>
    !(
      carousel.finite &&
      ((rtl(offset) > 0 && state.currentIndex === 0) ||
        (rtl(offset) < 0 && state.currentIndex === state.slides.length - 1))
    );
  const setSwipeOffset = (offset) => {
    var _a;
    swipeOffset.current = offset;
    (_a = containerRef.current) === null || _a === void 0
      ? void 0
      : _a.style.setProperty(cssVar("swipe_offset"), `${Math.round(offset)}px`);
  };
  const { closeOnPullDown } = controller;
  const setPullDownOffset = (offset) => {
    var _a, _b;
    pullDownOffset.current = offset;
    pullDownOpacity.current = (() => {
      const threshold = 60;
      const minOpacity = 0.5;
      return Math.min(Math.max(round(1 - (offset / threshold) * (1 - minOpacity), 2), minOpacity), 1);
    })();
    (_a = containerRef.current) === null || _a === void 0
      ? void 0
      : _a.style.setProperty(cssVar("pull_down_offset"), `${Math.round(offset)}px`);
    (_b = containerRef.current) === null || _b === void 0
      ? void 0
      : _b.style.setProperty(cssVar("pull_down_opacity"), `${pullDownOpacity.current}`);
  };
  const { prepareAnimation: preparePullDownAnimation } = useAnimation(carouselRef, (snapshot, rect, translate) => {
    if (carouselRef.current && containerRect) {
      return {
        keyframes: [
          {
            transform: `translate(0, ${snapshot.rect.y - rect.y + translate.y}px)`,
            opacity: snapshot.opacity,
          },
          { transform: "translate(0, 0)", opacity: 1 },
        ],
        duration: snapshot.duration,
        easing: animation.easing.fade,
      };
    }
    return undefined;
  });
  const pullDown = (offset, cancel) => {
    if (closeOnPullDown) {
      setPullDownOffset(offset);
      let duration = 0;
      if (carouselRef.current) {
        duration = animation.fade * (cancel ? 2 : 1);
        preparePullDownAnimation({
          rect: carouselRef.current.getBoundingClientRect(),
          opacity: pullDownOpacity.current,
          duration,
        });
      }
      cleanupPullDownOffset(() => {
        setPullDownOffset(0);
        setSwipeState(SwipeState.NONE);
      }, duration);
      setSwipeState(SwipeState.ANIMATION);
      if (!cancel) {
        close();
      }
    }
  };
  const { prepareAnimation, isAnimationPlaying } = useAnimation(carouselRef, (snapshot, rect, translate) => {
    var _a;
    if (
      carouselRef.current &&
      containerRect &&
      ((_a = state.animation) === null || _a === void 0 ? void 0 : _a.duration)
    ) {
      const parsedSpacing = parseLengthPercentage(carousel.spacing);
      const spacingValue =
        (parsedSpacing.percent ? (parsedSpacing.percent * containerRect.width) / 100 : parsedSpacing.pixel) || 0;
      return {
        keyframes: [
          {
            transform: `translate(${
              rtl(state.globalIndex - snapshot.index) * (containerRect.width + spacingValue) +
              snapshot.rect.x -
              rect.x +
              translate.x
            }px, 0)`,
          },
          { transform: "translate(0, 0)" },
        ],
        duration: state.animation.duration,
        easing: state.animation.easing,
      };
    }
    return undefined;
  });
  const swipe = useEventCallback((action) => {
    var _a, _b;
    const currentSwipeOffset = action.offset || 0;
    const swipeDuration = !currentSwipeOffset
      ? (_a = animation.navigation) !== null && _a !== void 0
        ? _a
        : animation.swipe
      : animation.swipe;
    const swipeEasing =
      !currentSwipeOffset && !isAnimationPlaying() ? animation.easing.navigation : animation.easing.swipe;
    let { direction } = action;
    const count = (_b = action.count) !== null && _b !== void 0 ? _b : 1;
    let newSwipeState = SwipeState.ANIMATION;
    let newSwipeAnimationDuration = swipeDuration * count;
    if (!direction) {
      const containerWidth = containerRect === null || containerRect === void 0 ? void 0 : containerRect.width;
      const elapsedTime = action.duration || 0;
      const expectedTime = containerWidth
        ? (swipeDuration / containerWidth) * Math.abs(currentSwipeOffset)
        : swipeDuration;
      if (count !== 0) {
        if (elapsedTime < expectedTime) {
          newSwipeAnimationDuration =
            (newSwipeAnimationDuration / expectedTime) * Math.max(elapsedTime, expectedTime / 5);
        } else if (containerWidth) {
          newSwipeAnimationDuration =
            (swipeDuration / containerWidth) * (containerWidth - Math.abs(currentSwipeOffset));
        }
        direction = rtl(currentSwipeOffset) > 0 ? ACTION_PREV : ACTION_NEXT;
      } else {
        newSwipeAnimationDuration = swipeDuration / 2;
      }
    }
    let increment = 0;
    if (direction === ACTION_PREV) {
      if (isSwipeValid(rtl(1))) {
        increment = -count;
      } else {
        newSwipeState = SwipeState.NONE;
        newSwipeAnimationDuration = swipeDuration;
      }
    } else if (direction === ACTION_NEXT) {
      if (isSwipeValid(rtl(-1))) {
        increment = count;
      } else {
        newSwipeState = SwipeState.NONE;
        newSwipeAnimationDuration = swipeDuration;
      }
    }
    newSwipeAnimationDuration = Math.round(newSwipeAnimationDuration);
    cleanupSwipeOffset(() => {
      setSwipeOffset(0);
      setSwipeState(SwipeState.NONE);
    }, newSwipeAnimationDuration);
    if (carouselRef.current) {
      prepareAnimation({
        rect: carouselRef.current.getBoundingClientRect(),
        index: state.globalIndex,
      });
    }
    setSwipeState(newSwipeState);
    publish(ACTION_SWIPE, {
      type: "swipe",
      increment,
      duration: newSwipeAnimationDuration,
      easing: swipeEasing,
    });
  });
  const customSwipe = useEventCallback((action) => {
    var _a, _b;
    const currentSwipeOffset = action.offset || 0;
    const swipeDuration = !currentSwipeOffset
      ? (_a = customAnimation.navigation) !== null && _a !== void 0
        ? _a
        : customAnimation.swipe
      : customAnimation.swipe;
    const swipeEasing =
      !currentSwipeOffset && !isAnimationPlaying() ? customAnimation.easing.navigation : customAnimation.easing.swipe;
    let { direction } = action;
    const count = (_b = action.count) !== null && _b !== void 0 ? _b : 1;
    let newSwipeState = SwipeState.ANIMATION;
    let newSwipeAnimationDuration = swipeDuration * count;
    if (!direction) {
      const containerWidth = containerRect === null || containerRect === void 0 ? void 0 : containerRect.width;
      const elapsedTime = action.duration || 0;
      const expectedTime = containerWidth
        ? (swipeDuration / containerWidth) * Math.abs(currentSwipeOffset)
        : swipeDuration;
      if (count !== 0) {
        if (elapsedTime < expectedTime) {
          newSwipeAnimationDuration =
            (newSwipeAnimationDuration / expectedTime) * Math.max(elapsedTime, expectedTime / 5);
        } else if (containerWidth) {
          newSwipeAnimationDuration =
            (swipeDuration / containerWidth) * (containerWidth - Math.abs(currentSwipeOffset));
        }
        direction = rtl(currentSwipeOffset) > 0 ? ACTION_PREV : ACTION_NEXT;
      } else {
        newSwipeAnimationDuration = swipeDuration / 2;
      }
    }
    let increment = 0;
    if (direction === ACTION_PREV) {
      if (isSwipeValid(rtl(1))) {
        increment = -count;
      } else {
        newSwipeState = SwipeState.NONE;
        newSwipeAnimationDuration = swipeDuration;
      }
    } else if (direction === ACTION_NEXT) {
      if (isSwipeValid(rtl(-1))) {
        increment = count;
      } else {
        newSwipeState = SwipeState.NONE;
        newSwipeAnimationDuration = swipeDuration;
      }
    }
    newSwipeAnimationDuration = Math.round(newSwipeAnimationDuration);
    cleanupSwipeOffset(() => {
      setSwipeOffset(0);
      setSwipeState(SwipeState.NONE);
    }, newSwipeAnimationDuration);
    if (carouselRef.current) {
      prepareAnimation({
        rect: carouselRef.current.getBoundingClientRect(),
        index: state.globalIndex,
      });
    }
    setSwipeState(newSwipeState);
    publish(ACTION_SWIPE, {
      type: "swipe",
      increment,
      duration: newSwipeAnimationDuration,
      easing: swipeEasing,
    });
  });
  React.useEffect(() => {
    var _a, _b;
    if (
      ((_a = state.animation) === null || _a === void 0 ? void 0 : _a.increment) &&
      ((_b = state.animation) === null || _b === void 0 ? void 0 : _b.duration)
    ) {
      cleanupAnimationIncrement(() => dispatch({ type: "swipe", increment: 0 }), state.animation.duration);
    }
  }, [state.animation, dispatch, cleanupAnimationIncrement]);
  const swipeParams = [
    subscribeSensors,
    isSwipeValid,
    (containerRect === null || containerRect === void 0 ? void 0 : containerRect.width) || 0,
    animation.swipe,
    () => setSwipeState(SwipeState.SWIPE),
    (offset) => setSwipeOffset(offset),
    (offset, duration) => customSwipe({ offset, duration, count: 1 }),
    (offset) => customSwipe({ offset, count: 0 }),
  ];
  const pullDownParams = [
    () => {
      if (closeOnPullDown) {
        setSwipeState(SwipeState.PULL_DOWN);
      }
    },
    (offset) => setPullDownOffset(offset),
    (offset) => pullDown(offset),
    (offset) => pullDown(offset, true),
  ];
  usePointerSwipe(...swipeParams, closeOnPullDown, ...pullDownParams);
  useWheelSwipe(swipeState, ...swipeParams);
  const focusOnMount = useEventCallback(() => {
    var _a;
    if (controller.focus) {
      (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    }
  });
  React.useEffect(focusOnMount, [focusOnMount]);
  const onViewCallback = useEventCallback(() => {
    var _a;
    (_a = on.view) === null || _a === void 0 ? void 0 : _a.call(on, { index: state.currentIndex });
  });
  React.useEffect(onViewCallback, [state.globalIndex, onViewCallback]);
  React.useEffect(
    () =>
      cleanup(
        subscribe(ACTION_PREV, (action) => swipe({ direction: ACTION_PREV, ...action })),
        subscribe(ACTION_NEXT, (action) => swipe({ direction: ACTION_NEXT, ...action })),
        subscribe(ACTION_SWIPE, (action) => dispatch(action)),
      ),
    [subscribe, swipe, dispatch],
  );
  const context = React.useMemo(
    () => ({
      prev,
      next,
      close,
      focus,
      slideRect: containerRect ? computeSlideRect(containerRect, carousel.padding) : { width: 0, height: 0 },
      containerRect: containerRect || { width: 0, height: 0 },
      subscribeSensors,
      containerRef,
      setCarouselRef,
      toolbarWidth,
      setToolbarWidth,
    }),
    [
      prev,
      next,
      close,
      focus,
      subscribeSensors,
      containerRect,
      containerRef,
      setCarouselRef,
      toolbarWidth,
      setToolbarWidth,
      carousel.padding,
    ],
  );
  React.useImperativeHandle(
    controller.ref,
    () => ({
      prev,
      next,
      close,
      focus,
      getLightboxProps,
      getLightboxState,
    }),
    [prev, next, close, focus, getLightboxProps, getLightboxState],
  );
  return React.createElement(
    "div",
    {
      ref: handleContainerRef,
      className: clsx(cssClass(cssContainerPrefix()), cssClass(CLASS_FLEX_CENTER)),
      style: {
        ...(swipeState === SwipeState.SWIPE
          ? { [cssVar("swipe_offset")]: `${Math.round(swipeOffset.current)}px` }
          : null),
        ...(swipeState === SwipeState.PULL_DOWN
          ? {
              [cssVar("pull_down_offset")]: `${Math.round(pullDownOffset.current)}px`,
              [cssVar("pull_down_opacity")]: `${pullDownOpacity.current}`,
            }
          : null),
        ...(controller.touchAction !== "none" ? { [cssVar("controller_touch_action")]: controller.touchAction } : null),
        ...styles.container,
      },
      ...(controller.aria ? { role: "presentation", "aria-live": "polite" } : null),
      tabIndex: -1,
      ...registerSensors,
    },
    containerRect &&
      React.createElement(
        ControllerContext.Provider,
        { value: context },
        children,
        (_a = render.controls) === null || _a === void 0 ? void 0 : _a.call(render),
      ),
  );
}
const ControllerModule = createModule(MODULE_CONTROLLER, Controller);

function cssPrefix$2(value) {
  return composePrefix(MODULE_CAROUSEL, value);
}
function cssSlidePrefix(value) {
  return composePrefix("slide", value);
}
function CarouselSlide({ slide, offset }) {
  const containerRef = React.useRef(null);
  const { currentIndex } = useLightboxState();
  const { slideRect, close } = useController();
  const {
    render,
    carousel: { imageFit, imageProps },
    on: { click: onClick },
    controller: { closeOnBackdropClick },
    styles: { slide: style },
  } = useLightboxProps();
  const renderSlide = () => {
    var _a, _b, _c, _d;
    let rendered =
      (_a = render.slide) === null || _a === void 0 ? void 0 : _a.call(render, { slide, offset, rect: slideRect });
    if (!rendered && isImageSlide(slide)) {
      rendered = React.createElement(ImageSlide, {
        slide: slide,
        offset: offset,
        render: render,
        rect: slideRect,
        imageFit: imageFit,
        imageProps: imageProps,
        onClick:
          offset === 0
            ? () => (onClick === null || onClick === void 0 ? void 0 : onClick({ index: currentIndex }))
            : undefined,
      });
    }
    return rendered
      ? React.createElement(
          React.Fragment,
          null,
          (_b = render.slideHeader) === null || _b === void 0 ? void 0 : _b.call(render, { slide }),
          ((_c = render.slideContainer) !== null && _c !== void 0 ? _c : ({ children }) => children)({
            slide,
            children: rendered,
          }),
          (_d = render.slideFooter) === null || _d === void 0 ? void 0 : _d.call(render, { slide }),
        )
      : null;
  };
  const handleBackdropClick = (event) => {
    const container = containerRef.current;
    const target = event.target instanceof HTMLElement ? event.target : undefined;
    if (
      closeOnBackdropClick &&
      target &&
      container &&
      (target === container ||
        (Array.from(container.children).find((x) => x === target) &&
          target.classList.contains(cssClass(CLASS_FULLSIZE))))
    ) {
      close();
    }
  };
  return React.createElement(
    "div",
    {
      ref: containerRef,
      className: clsx(
        cssClass(cssSlidePrefix()),
        offset === 0 && cssClass(cssSlidePrefix("current")),
        cssClass(CLASS_FLEX_CENTER),
      ),
      onClick: handleBackdropClick,
      style: style,
    },
    renderSlide(),
  );
}
function Placeholder() {
  const style = useLightboxProps().styles.slide;
  return React.createElement("div", { className: cssClass("slide"), style: style });
}
function Carousel({ carousel }) {
  const { slides, currentIndex, globalIndex } = useLightboxState();
  const { setCarouselRef } = useController();
  const spacingValue = parseLengthPercentage(carousel.spacing);
  const paddingValue = parseLengthPercentage(carousel.padding);
  const items = [];
  const preload = calculatePreload(carousel, slides, 1);
  if (hasSlides(slides)) {
    for (let i = currentIndex - preload; i < currentIndex; i += 1) {
      const key = globalIndex + i - currentIndex;
      items.push(
        !carousel.finite || i >= 0
          ? React.createElement(CarouselSlide, {
              key: key,
              slide: slides[(i + preload * slides.length) % slides.length],
              offset: i - currentIndex,
            })
          : React.createElement(Placeholder, { key: key }),
      );
    }
    items.push(React.createElement(CarouselSlide, { key: globalIndex, slide: slides[currentIndex], offset: 0 }));
    for (let i = currentIndex + 1; i <= currentIndex + preload; i += 1) {
      const key = globalIndex + i - currentIndex;
      items.push(
        !carousel.finite || i <= slides.length - 1
          ? React.createElement(CarouselSlide, { key: key, slide: slides[i % slides.length], offset: i - currentIndex })
          : React.createElement(Placeholder, { key: key }),
      );
    }
  }
  return React.createElement(
    "div",
    {
      ref: setCarouselRef,
      className: clsx(cssClass(cssPrefix$2()), items.length > 0 && cssClass(cssPrefix$2("with_slides"))),
      style: {
        [`${cssVar(cssPrefix$2("slides_count"))}`]: items.length,
        [`${cssVar(cssPrefix$2("spacing_px"))}`]: spacingValue.pixel || 0,
        [`${cssVar(cssPrefix$2("spacing_percent"))}`]: spacingValue.percent || 0,
        [`${cssVar(cssPrefix$2("padding_px"))}`]: paddingValue.pixel || 0,
        [`${cssVar(cssPrefix$2("padding_percent"))}`]: paddingValue.percent || 0,
      },
    },
    items,
  );
}
const CarouselModule = createModule(MODULE_CAROUSEL, Carousel);

function useNavigationState() {
  const { carousel } = useLightboxProps();
  const { slides, currentIndex } = useLightboxState();
  const prevDisabled = slides.length === 0 || (carousel.finite && currentIndex === 0);
  const nextDisabled = slides.length === 0 || (carousel.finite && currentIndex === slides.length - 1);
  return { prevDisabled, nextDisabled };
}

function useKeyboardNavigation(subscribeSensors) {
  var _a;
  const isRTL = useRTL();
  const { publish } = useEvents();
  const { animation } = useLightboxProps();
  const { prevDisabled, nextDisabled } = useNavigationState();
  const throttle = ((_a = animation.navigation) !== null && _a !== void 0 ? _a : animation.swipe) / 2;
  const prev = useThrottle(() => publish(ACTION_PREV), throttle);
  const next = useThrottle(() => publish(ACTION_NEXT), throttle);
  const handleKeyDown = useEventCallback((event) => {
    switch (event.key) {
      case VK_ESCAPE:
        publish(ACTION_CLOSE);
        break;
      case VK_ARROW_LEFT:
        if (!(isRTL ? nextDisabled : prevDisabled)) (isRTL ? next : prev)();
        break;
      case VK_ARROW_RIGHT:
        if (!(isRTL ? prevDisabled : nextDisabled)) (isRTL ? prev : next)();
        break;
      default:
    }
  });
  React.useEffect(() => subscribeSensors(EVENT_ON_KEY_DOWN, handleKeyDown), [subscribeSensors, handleKeyDown]);
}

function NavigationButton({ label, icon, renderIcon, action, onClick, disabled, style }) {
  return React.createElement(IconButton, {
    label: label,
    icon: icon,
    renderIcon: renderIcon,
    className: cssClass(`navigation_${action}`),
    disabled: disabled,
    onClick: onClick,
    style: style,
    ...useLoseFocus(useController().focus, disabled),
  });
}
function Navigation({ render: { buttonPrev, buttonNext, iconPrev, iconNext }, styles }) {
  const { prev, next, subscribeSensors } = useController();
  const { prevDisabled, nextDisabled } = useNavigationState();
  useKeyboardNavigation(subscribeSensors);
  return React.createElement(
    React.Fragment,
    null,
    buttonPrev
      ? buttonPrev()
      : React.createElement(NavigationButton, {
          label: "Previous",
          action: ACTION_PREV,
          icon: PreviousIcon,
          renderIcon: iconPrev,
          style: styles.navigationPrev,
          disabled: prevDisabled,
          onClick: prev,
        }),
    buttonNext
      ? buttonNext()
      : React.createElement(NavigationButton, {
          label: "Next",
          action: ACTION_NEXT,
          icon: NextIcon,
          renderIcon: iconNext,
          style: styles.navigationNext,
          disabled: nextDisabled,
          onClick: next,
        }),
  );
}
const NavigationModule = createModule(MODULE_NAVIGATION, Navigation);

const noScroll = cssClass(CLASS_NO_SCROLL);
const noScrollPadding = cssClass(CLASS_NO_SCROLL_PADDING);
function isHTMLElement(element) {
  return "style" in element;
}
function padScrollbar(element, padding, rtl) {
  const styles = window.getComputedStyle(element);
  const property = rtl ? "padding-left" : "padding-right";
  const computedValue = rtl ? styles.paddingLeft : styles.paddingRight;
  const originalValue = element.style.getPropertyValue(property);
  element.style.setProperty(property, `${(parseInt(computedValue, 10) || 0) + padding}px`);
  return () => {
    if (originalValue) {
      element.style.setProperty(property, originalValue);
    } else {
      element.style.removeProperty(property);
    }
  };
}
function NoScroll({ noScroll: { disabled }, children }) {
  const rtl = useRTL();
  useLayoutEffect(() => {
    if (disabled) return () => {};
    const cleanup = [];
    const { body, documentElement } = document;
    const scrollbar = Math.round(window.innerWidth - documentElement.clientWidth);
    if (scrollbar > 0) {
      cleanup.push(padScrollbar(body, scrollbar, rtl));
      const elements = body.getElementsByTagName("*");
      for (let i = 0; i < elements.length; i += 1) {
        const element = elements[i];
        if (
          isHTMLElement(element) &&
          window.getComputedStyle(element).getPropertyValue("position") === "fixed" &&
          !element.classList.contains(noScrollPadding)
        ) {
          cleanup.push(padScrollbar(element, scrollbar, rtl));
        }
      }
    }
    body.classList.add(noScroll);
    return () => {
      body.classList.remove(noScroll);
      cleanup.forEach((clean) => clean());
    };
  }, [rtl, disabled]);
  return React.createElement(React.Fragment, null, children);
}
const NoScrollModule = createModule(MODULE_NO_SCROLL, NoScroll);

function cssPrefix$1(value) {
  return composePrefix(MODULE_PORTAL, value);
}
function setAttribute(element, attribute, value) {
  const previousValue = element.getAttribute(attribute);
  element.setAttribute(attribute, value);
  return () => {
    if (previousValue) {
      element.setAttribute(attribute, previousValue);
    } else {
      element.removeAttribute(attribute);
    }
  };
}
function Portal({ children, animation, styles, className, on, portal, close }) {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const cleanup = React.useRef([]);
  const { setTimeout } = useTimeouts();
  const { subscribe } = useEvents();
  const reduceMotion = useMotionPreference();
  const animationDuration = !reduceMotion ? animation.fade : 0;
  React.useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
      setVisible(false);
    };
  }, []);
  const handleClose = useEventCallback(() => {
    var _a;
    setVisible(false);
    (_a = on.exiting) === null || _a === void 0 ? void 0 : _a.call(on);
    setTimeout(() => {
      var _a;
      (_a = on.exited) === null || _a === void 0 ? void 0 : _a.call(on);
      close();
    }, animationDuration);
  });
  React.useEffect(() => subscribe(ACTION_CLOSE, handleClose), [subscribe, handleClose]);
  const handleEnter = useEventCallback((node) => {
    var _a, _b, _c;
    node.scrollTop;
    setVisible(true);
    (_a = on.entering) === null || _a === void 0 ? void 0 : _a.call(on);
    const elements =
      (_c = (_b = node.parentNode) === null || _b === void 0 ? void 0 : _b.children) !== null && _c !== void 0
        ? _c
        : [];
    for (let i = 0; i < elements.length; i += 1) {
      const element = elements[i];
      if (["TEMPLATE", "SCRIPT", "STYLE"].indexOf(element.tagName) === -1 && element !== node) {
        cleanup.current.push(setAttribute(element, "inert", "true"));
        cleanup.current.push(setAttribute(element, "aria-hidden", "true"));
      }
    }
    setTimeout(() => {
      var _a;
      (_a = on.entered) === null || _a === void 0 ? void 0 : _a.call(on);
    }, animationDuration);
  });
  const handleExit = useEventCallback(() => {
    cleanup.current.forEach((clean) => clean());
    cleanup.current = [];
  });
  const handleRef = React.useCallback(
    (node) => {
      if (node) {
        handleEnter(node);
      } else {
        handleExit();
      }
    },
    [handleEnter, handleExit],
  );
  return mounted
    ? createPortal(
        React.createElement(
          "div",
          {
            ref: handleRef,
            className: clsx(
              className,
              cssClass("root"),
              cssClass(cssPrefix$1()),
              cssClass(CLASS_NO_SCROLL_PADDING),
              visible && cssClass(cssPrefix$1("open")),
            ),
            role: "presentation",
            "aria-live": "polite",
            style: {
              ...(animation.fade !== LightboxDefaultProps.animation.fade
                ? { [cssVar("fade_animation_duration")]: `${animationDuration}ms` }
                : null),
              ...(animation.easing.fade !== LightboxDefaultProps.animation.easing.fade
                ? { [cssVar("fade_animation_timing_function")]: animation.easing.fade }
                : null),
              ...styles.root,
            },
          },
          children,
        ),
        portal.root || document.body,
      )
    : null;
}
const PortalModule = createModule(MODULE_PORTAL, Portal);

function Root({ children }) {
  return React.createElement(React.Fragment, null, children);
}
const RootModule = createModule(MODULE_ROOT, Root);

function cssPrefix(value) {
  return composePrefix(MODULE_TOOLBAR, value);
}
function Toolbar({ toolbar: { buttons, title }, render: { buttonClose, iconClose }, styles }) {
  const { close, setToolbarWidth } = useController();
  const { setContainerRef, containerRect } = useContainerRect();
  useLayoutEffect(() => {
    setToolbarWidth(containerRect === null || containerRect === void 0 ? void 0 : containerRect.width);
  }, [setToolbarWidth, containerRect === null || containerRect === void 0 ? void 0 : containerRect.width]);
  const renderCloseButton = () => {
    if (buttonClose) return buttonClose();
    return React.createElement(IconButton, {
      key: ACTION_CLOSE,
      label: "Close",
      icon: CloseIcon,
      renderIcon: iconClose,
      onClick: close,
    });
  };
  return React.createElement(
    "div",
    {
      ref: setContainerRef,
      style: styles.toolbar,
      className: cssClass(cssPrefix()),
      ...stopNavigationEventsPropagation(),
    },
    React.createElement("div", { className: cssClass(cssPrefix(TOOLBAR_TITLE)) }, title),
    React.createElement(
      "div",
      { className: cssClass(cssPrefix(TOOLBAR_BUTTONS)) },
      buttons === null || buttons === void 0
        ? void 0
        : buttons.map((button) => (button === ACTION_CLOSE ? renderCloseButton() : button)),
    ),
  );
}
const ToolbarModule = createModule(MODULE_TOOLBAR, Toolbar);

function renderNode(node, props) {
  var _a;
  return React.createElement(
    node.module.component,
    { key: node.module.name, ...props },
    (_a = node.children) === null || _a === void 0 ? void 0 : _a.map((child) => renderNode(child, props)),
  );
}
function mergeAnimation(defaultAnimation, animation = {}) {
  const { easing: defaultAnimationEasing, ...restDefaultAnimation } = defaultAnimation;
  const { easing, ...restAnimation } = animation;
  return {
    easing: { ...defaultAnimationEasing, ...easing },
    ...restDefaultAnimation,
    ...restAnimation,
  };
}
function Lightbox({
  carousel,
  animation,
  customAnimation,
  render,
  toolbar,
  controller,
  noScroll,
  on,
  plugins,
  slides,
  index,
  ...restProps
}) {
  const {
    animation: defaultAnimation,
    customAnimation: defaultCustomAnimation,
    carousel: defaultCarousel,
    render: defaultRender,
    toolbar: defaultToolbar,
    controller: defaultController,
    noScroll: defaultNoScroll,
    on: defaultOn,
    slides: defaultSlides,
    index: defaultIndex,
    plugins: defaultPlugins,
    ...restDefaultProps
  } = LightboxDefaultProps;
  React.useEffect(() => {
    window.addEventListener(
      "keydown",
      function (e) {
        if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(e.code) > -1) {
          e.preventDefault();
        }
      },
      false,
    );
  }, []);
  const { config, augmentation } = withPlugins(
    [
      createNode(PortalModule, [
        createNode(NoScrollModule, [
          createNode(ControllerModule, [
            createNode(CarouselModule),
            createNode(ToolbarModule),
            createNode(NavigationModule),
          ]),
        ]),
      ]),
    ],
    plugins || defaultPlugins,
  );
  const props = augmentation({
    animation: mergeAnimation(defaultAnimation, animation),
    customAnimation: mergeAnimation(defaultCustomAnimation, customAnimation),
    carousel: { ...defaultCarousel, ...carousel },
    render: { ...defaultRender, ...render },
    toolbar: { ...defaultToolbar, ...toolbar },
    controller: { ...defaultController, ...controller },
    noScroll: { ...defaultNoScroll, ...noScroll },
    on: { ...defaultOn, ...on },
    ...restDefaultProps,
    ...restProps,
  });
  if (!props.open) return null;
  return React.createElement(
    LightboxPropsProvider,
    { ...props },
    React.createElement(
      LightboxStateProvider,
      { slides: slides || defaultSlides, index: index || defaultIndex },
      React.createElement(
        TimeoutsProvider,
        null,
        React.createElement(EventsProvider, null, renderNode(createNode(RootModule, config), props)),
      ),
    ),
  );
}

export {
  ACTION_CLOSE,
  ACTION_NEXT,
  ACTION_PREV,
  ACTION_SWIPE,
  CLASS_FLEX_CENTER,
  CLASS_FULLSIZE,
  CLASS_NO_SCROLL,
  CLASS_NO_SCROLL_PADDING,
  Carousel,
  CarouselModule,
  CloseIcon,
  Controller,
  ControllerContext,
  ControllerModule,
  ELEMENT_BUTTON,
  ELEMENT_ICON,
  EVENT_ON_KEY_DOWN,
  EVENT_ON_KEY_UP,
  EVENT_ON_POINTER_CANCEL,
  EVENT_ON_POINTER_DOWN,
  EVENT_ON_POINTER_LEAVE,
  EVENT_ON_POINTER_MOVE,
  EVENT_ON_POINTER_UP,
  EVENT_ON_WHEEL,
  ErrorIcon,
  EventsContext,
  EventsProvider,
  IMAGE_FIT_CONTAIN,
  IMAGE_FIT_COVER,
  IconButton,
  ImageSlide,
  Lightbox,
  LightboxDefaultProps,
  LightboxDispatchContext,
  LightboxPropsContext,
  LightboxPropsProvider,
  LightboxStateContext,
  LightboxStateProvider,
  LoadingIcon,
  MODULE_CAROUSEL,
  MODULE_CONTROLLER,
  MODULE_NAVIGATION,
  MODULE_NO_SCROLL,
  MODULE_PORTAL,
  MODULE_ROOT,
  MODULE_TOOLBAR,
  Navigation,
  NavigationButton,
  NavigationModule,
  NextIcon,
  NoScroll,
  NoScrollModule,
  Portal,
  PortalModule,
  PreviousIcon,
  Root,
  RootModule,
  SLIDE_STATUS_COMPLETE,
  SLIDE_STATUS_ERROR,
  SLIDE_STATUS_LOADING,
  SLIDE_STATUS_PLACEHOLDER,
  SwipeState,
  TOOLBAR_BUTTONS,
  TOOLBAR_TITLE,
  TimeoutsContext,
  TimeoutsProvider,
  Toolbar,
  ToolbarModule,
  UNKNOWN_ACTION_TYPE,
  VK_ARROW_LEFT,
  VK_ARROW_RIGHT,
  VK_ESCAPE,
  activeSlideStatus,
  addToolbarButton,
  calculatePreload,
  cleanup,
  clsx,
  composePrefix,
  computeSlideRect,
  createIcon,
  createIconDisabled,
  createModule,
  createNode,
  cssClass,
  cssVar,
  Lightbox as default,
  devicePixelRatio,
  getSlide,
  getSlideIfPresent,
  getSlideIndex,
  hasSlides,
  hasWindow,
  isImageFitCover,
  isImageSlide,
  label,
  makeComposePrefix,
  makeUseContext,
  parseLengthPercentage,
  round,
  setRef,
  stopNavigationEventsPropagation,
  useAnimation,
  useContainerRect,
  useController,
  useDelay,
  useEventCallback,
  useEvents,
  useForkRef,
  useKeyboardNavigation,
  useLayoutEffect,
  useLightboxDispatch,
  useLightboxProps,
  useLightboxState,
  useLoseFocus,
  useMotionPreference,
  useNavigationState,
  usePointerEvents,
  usePointerSwipe,
  usePreventSwipeNavigation,
  useRTL,
  useSensors,
  useThrottle,
  useTimeouts,
  useWheelSwipe,
  withPlugins,
};
