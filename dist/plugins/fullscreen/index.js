import {
  makeUseContext,
  useLayoutEffect,
  useEventCallback,
  cssClass,
  clsx,
  createIcon,
  useLightboxProps,
  IconButton,
  addToolbarButton,
  createModule,
} from "../../index.js";
import * as React from "react";
import { PLUGIN_FULLSCREEN, CLASS_FULLSIZE, PLUGIN_THUMBNAILS, MODULE_CONTROLLER } from "../../types.js";

const defaultFullscreenProps = {
  auto: false,
  ref: null,
};
const resolveFullscreenProps = (fullscreen) => ({
  ...defaultFullscreenProps,
  ...fullscreen,
});

const FullscreenContext = React.createContext(null);
const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);
function FullscreenContextProvider({ fullscreen: fullscreenProps, children }) {
  const { auto, ref } = resolveFullscreenProps(fullscreenProps);
  const containerRef = React.useRef(null);
  const [fullscreen, setFullscreen] = React.useState(false);
  const [disabled, setDisabled] = React.useState();
  useLayoutEffect(() => {
    var _a, _b, _c, _d;
    setDisabled(
      !((_d =
        (_c =
          (_b = (_a = document.fullscreenEnabled) !== null && _a !== void 0 ? _a : document.webkitFullscreenEnabled) !==
            null && _b !== void 0
            ? _b
            : document.mozFullScreenEnabled) !== null && _c !== void 0
          ? _c
          : document.msFullscreenEnabled) !== null && _d !== void 0
        ? _d
        : false),
    );
  }, []);
  const getFullscreenElement = React.useCallback(() => {
    var _a, _b, _c;
    return (_c =
      (_b = (_a = document.fullscreenElement) !== null && _a !== void 0 ? _a : document.webkitFullscreenElement) !==
        null && _b !== void 0
        ? _b
        : document.mozFullScreenElement) !== null && _c !== void 0
      ? _c
      : document.msFullscreenElement;
  }, []);
  const enter = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
      try {
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(() => {});
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
      } catch (err) {}
    }
  }, []);
  const exit = React.useCallback(() => {
    if (getFullscreenElement()) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } catch (err) {}
    }
  }, [getFullscreenElement]);
  const fullscreenChangeListener = React.useCallback(() => {
    if (getFullscreenElement() === containerRef.current) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  }, [getFullscreenElement]);
  React.useEffect(() => {
    const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];
    events.forEach((event) => {
      document.addEventListener(event, fullscreenChangeListener);
    });
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, fullscreenChangeListener);
      });
    };
  }, [fullscreenChangeListener]);
  const handleAutoFullscreen = useEventCallback(() => {
    var _a;
    return (_a = auto ? enter : null) === null || _a === void 0 ? void 0 : _a();
  });
  React.useEffect(() => {
    handleAutoFullscreen();
    return () => exit();
  }, [handleAutoFullscreen, exit]);
  const context = React.useMemo(
    () => ({
      fullscreen,
      disabled,
      enter,
      exit,
    }),
    [fullscreen, disabled, enter, exit],
  );
  React.useImperativeHandle(ref, () => context, [context]);
  return React.createElement(
    "div",
    { ref: containerRef, className: clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE)) },
    React.createElement(FullscreenContext.Provider, { value: context }, children),
  );
}

const EnterFullscreenIcon = createIcon(
  "EnterFullscreen",
  React.createElement("path", { d: "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" }),
);
const ExitFullscreenIcon = createIcon(
  "ExitFullscreen",
  React.createElement("path", { d: "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" }),
);
function FullscreenButton() {
  var _a;
  const { fullscreen, disabled, enter, exit } = useFullscreen();
  const { render } = useLightboxProps();
  if (disabled) return null;
  if (render.buttonFullscreen) {
    return React.createElement(
      React.Fragment,
      null,
      (_a = render.buttonFullscreen) === null || _a === void 0
        ? void 0
        : _a.call(render, { fullscreen, disabled, enter, exit }),
    );
  }
  return React.createElement(IconButton, {
    disabled: disabled,
    label: fullscreen ? "Exit Fullscreen" : "Enter Fullscreen",
    icon: fullscreen ? ExitFullscreenIcon : EnterFullscreenIcon,
    renderIcon: fullscreen ? render.iconExitFullscreen : render.iconEnterFullscreen,
    onClick: fullscreen ? exit : enter,
  });
}

function Fullscreen({ augment, contains, addParent }) {
  augment(({ fullscreen, toolbar, ...restProps }) => ({
    toolbar: addToolbarButton(toolbar, PLUGIN_FULLSCREEN, React.createElement(FullscreenButton, null)),
    fullscreen: resolveFullscreenProps(fullscreen),
    ...restProps,
  }));
  addParent(
    contains(PLUGIN_THUMBNAILS) ? PLUGIN_THUMBNAILS : MODULE_CONTROLLER,
    createModule(PLUGIN_FULLSCREEN, FullscreenContextProvider),
  );
}

export { Fullscreen as default };
