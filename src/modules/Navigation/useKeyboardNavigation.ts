import * as React from "react";

import { useEvents, useLightboxProps } from "../../contexts/index.js";
import { useEventCallback, useRTL, UseSensors, useThrottle } from "../../hooks/index.js";
import {
  ACTION_CLOSE,
  ACTION_NEXT,
  ACTION_PREV,
  EVENT_ON_KEY_DOWN,
  VK_ARROW_LEFT,
  VK_ARROW_RIGHT,
  VK_ESCAPE,
} from "../../consts.js";
import { useNavigationState } from "./useNavigationState.js";

export function useKeyboardNavigation<T extends Element>(subscribeSensors: UseSensors<T>["subscribeSensors"]) {
  const isRTL = useRTL();
  const { publish } = useEvents();
  const { animation } = useLightboxProps();
  const { prevDisabled, nextDisabled } = useNavigationState();

  const throttle = (animation.navigation ?? animation.swipe) / 2;

  const prev = useThrottle(() => publish(ACTION_PREV), throttle);
  const next = useThrottle(() => publish(ACTION_NEXT), throttle);

  const handleKeyDown = useEventCallback((event: React.KeyboardEvent) => {
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
