import { cssClass, clsx, createModule } from "../../index.js";
import * as React from "react";
import { ACTION_CLOSE, MODULE_NO_SCROLL, MODULE_PORTAL, PLUGIN_INLINE } from "../../types.js";

function InlineContainer({ inline: { className, style, ...rest } = {}, styles, children }) {
  return React.createElement(
    "div",
    {
      className: clsx(cssClass("root"), cssClass("relative"), className),
      style: { ...styles.root, ...style },
      ...rest,
    },
    children,
  );
}

function Inline({ augment, replace, remove }) {
  augment(
    ({
      toolbar: { buttons, ...restToolbar },
      open,
      close,
      controller: { focus, aria, touchAction, ...restController },
      className,
      ...restProps
    }) => ({
      open: true,
      close: () => {},
      toolbar: {
        buttons: buttons.filter((button) => button !== ACTION_CLOSE),
        ...restToolbar,
      },
      inline: { style: { width: "100%", height: "100%" }, className },
      controller: { focus: false, aria: true, touchAction: "pan-y", ...restController },
      className,
      ...restProps,
    }),
  );
  remove(MODULE_NO_SCROLL);
  replace(MODULE_PORTAL, createModule(PLUGIN_INLINE, InlineContainer));
}

export { Inline as default };
