import * as React from "react";
import { createModule } from "../config.js";
import { cleanup, clsx, computeSlideRect, cssClass, cssVar, makeComposePrefix, makeUseContext, parseLengthPercentage, } from "../utils.js";
import { useAnimation, useContainerRect, useDelay, useEventCallback, useForkRef, useRTL, useSensors, } from "../hooks/index.js";
import { useEvents, useLightboxState } from "../contexts/index.js";
import { SwipeState, usePointerSwipe, usePreventSwipeNavigation, useWheelSwipe } from "./controller/index.js";
import { ACTION_CLOSE, ACTION_NEXT, ACTION_PREV, ACTION_SWIPE, CLASS_FLEX_CENTER, EVENT_ON_KEY_UP, MODULE_CONTROLLER, VK_ESCAPE, } from "../consts.js";
const cssContainerPrefix = makeComposePrefix("container");
export const ControllerContext = React.createContext(null);
export const useController = makeUseContext("useController", "ControllerContext", ControllerContext);
export function Controller({ children, ...props }) {
    var _a;
    const { carousel, animation, customAnimation, controller, on, styles, render } = props;
    const [toolbarWidth, setToolbarWidth] = React.useState();
    const { state, dispatch } = useLightboxState();
    const [swipeState, setSwipeState] = React.useState(SwipeState.NONE);
    const swipeOffset = React.useRef(0);
    const { registerSensors, subscribeSensors } = useSensors();
    const { subscribe, publish } = useEvents();
    const cleanupAnimationIncrement = useDelay();
    const cleanupSwipeOffset = useDelay();
    const { containerRef, setContainerRef, containerRect } = useContainerRect();
    const handleContainerRef = useForkRef(usePreventSwipeNavigation(), setContainerRef);
    const carouselRef = React.useRef(null);
    const setCarouselRef = useForkRef(carouselRef, undefined);
    const isRTL = useRTL();
    const rtl = (value) => (isRTL ? -1 : 1) * (typeof value === "number" ? value : 1);
    const focus = useEventCallback(() => { var _a; return (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.focus(); });
    const getLightboxProps = useEventCallback(() => props);
    const getLightboxState = useEventCallback(() => state);
    const prev = React.useCallback((params) => publish(ACTION_PREV, params), [publish]);
    const next = React.useCallback((params) => publish(ACTION_NEXT, params), [publish]);
    const close = React.useCallback(() => publish(ACTION_CLOSE), [publish]);
    const isSwipeValid = (offset) => !(carousel.finite &&
        ((rtl(offset) > 0 && state.currentIndex === 0) ||
            (rtl(offset) < 0 && state.currentIndex === state.slides.length - 1)));
    const setSwipeOffset = (offset) => {
        var _a;
        swipeOffset.current = offset;
        (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.style.setProperty(cssVar("swipe_offset"), `${Math.round(offset)}px`);
    };
    const { prepareAnimation, isAnimationPlaying } = useAnimation(carouselRef, (snapshot, rect, translate) => {
        var _a;
        if (carouselRef.current && containerRect && ((_a = state.animation) === null || _a === void 0 ? void 0 : _a.duration)) {
            const parsedSpacing = parseLengthPercentage(carousel.spacing);
            const spacingValue = (parsedSpacing.percent
                ? (parsedSpacing.percent * containerRect.width) / 100
                : parsedSpacing.pixel) || 0;
            return {
                keyframes: [
                    {
                        transform: `translateX(${rtl(state.globalIndex - snapshot.index) * (containerRect.width + spacingValue) +
                            snapshot.rect.x -
                            rect.x +
                            translate.x}px)`,
                    },
                    { transform: "translateX(0)" },
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
        const swipeDuration = !currentSwipeOffset ? (_a = animation.navigation) !== null && _a !== void 0 ? _a : animation.swipe : animation.swipe;
        const swipeEasing = !currentSwipeOffset && !isAnimationPlaying() ? animation.easing.navigation : animation.easing.swipe;
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
                }
                else if (containerWidth) {
                    newSwipeAnimationDuration =
                        (swipeDuration / containerWidth) * (containerWidth - Math.abs(currentSwipeOffset));
                }
                direction = rtl(currentSwipeOffset) > 0 ? ACTION_PREV : ACTION_NEXT;
            }
            else {
                newSwipeAnimationDuration = swipeDuration / 2;
            }
        }
        let increment = 0;
        if (direction === ACTION_PREV) {
            if (isSwipeValid(rtl(1))) {
                increment = -count;
            }
            else {
                newSwipeState = SwipeState.NONE;
                newSwipeAnimationDuration = swipeDuration;
            }
        }
        else if (direction === ACTION_NEXT) {
            if (isSwipeValid(rtl(-1))) {
                increment = count;
            }
            else {
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
            ? (_a = customAnimation.navigation) !== null && _a !== void 0 ? _a : customAnimation.swipe
            : customAnimation.swipe;
        const swipeEasing = !currentSwipeOffset && !isAnimationPlaying()
            ? customAnimation.easing.navigation
            : customAnimation.easing.swipe;
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
                }
                else if (containerWidth) {
                    newSwipeAnimationDuration =
                        (swipeDuration / containerWidth) * (containerWidth - Math.abs(currentSwipeOffset));
                }
                direction = rtl(currentSwipeOffset) > 0 ? ACTION_PREV : ACTION_NEXT;
            }
            else {
                newSwipeAnimationDuration = swipeDuration / 2;
            }
        }
        let increment = 0;
        if (direction === ACTION_PREV) {
            if (isSwipeValid(rtl(1))) {
                increment = -count;
            }
            else {
                newSwipeState = SwipeState.NONE;
                newSwipeAnimationDuration = swipeDuration;
            }
        }
        else if (direction === ACTION_NEXT) {
            if (isSwipeValid(rtl(-1))) {
                increment = count;
            }
            else {
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
        if (((_a = state.animation) === null || _a === void 0 ? void 0 : _a.increment) && ((_b = state.animation) === null || _b === void 0 ? void 0 : _b.duration)) {
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
        (offset, duration) => swipe({ offset, duration, count: 1 }),
        (offset) => swipe({ offset, count: 0 }),
    ];
    const customSwipeParams = [
        subscribeSensors,
        isSwipeValid,
        (containerRect === null || containerRect === void 0 ? void 0 : containerRect.width) || 0,
        animation.swipe,
        () => setSwipeState(SwipeState.SWIPE),
        (offset) => setSwipeOffset(offset),
        (offset, duration) => customSwipe({ offset, duration, count: 1 }),
        (offset) => customSwipe({ offset, count: 0 }),
    ];
    usePointerSwipe(...customSwipeParams);
    useWheelSwipe(swipeState, ...customSwipeParams);
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
    React.useEffect(() => cleanup(subscribe(ACTION_PREV, (action) => swipe({ direction: ACTION_PREV, ...action })), subscribe(ACTION_NEXT, (action) => swipe({ direction: ACTION_NEXT, ...action })), subscribe(ACTION_SWIPE, (action) => dispatch(action))), [subscribe, swipe, dispatch]);
    React.useEffect(() => subscribeSensors(EVENT_ON_KEY_UP, (event) => {
        if (event.code === VK_ESCAPE) {
            close();
        }
    }), [subscribeSensors, close]);
    const context = React.useMemo(() => ({
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
    }), [
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
    ]);
    React.useImperativeHandle(controller.ref, () => ({
        prev,
        next,
        close,
        focus,
        getLightboxProps,
        getLightboxState,
    }), [prev, next, close, focus, getLightboxProps, getLightboxState]);
    return (React.createElement("div", { ref: handleContainerRef, className: clsx(cssClass(cssContainerPrefix()), cssClass(CLASS_FLEX_CENTER)), style: {
            ...(swipeState === SwipeState.SWIPE
                ? { [cssVar("swipe_offset")]: `${Math.round(swipeOffset.current)}px` }
                : null),
            ...(controller.touchAction !== "none"
                ? { [cssVar("controller_touch_action")]: controller.touchAction }
                : null),
            ...styles.container,
        }, ...(controller.aria ? { role: "presentation", "aria-live": "polite" } : null), tabIndex: -1, ...registerSensors }, containerRect && (React.createElement(ControllerContext.Provider, { value: context },
        children, (_a = render.controls) === null || _a === void 0 ? void 0 :
        _a.call(render)))));
}
export const ControllerModule = createModule(MODULE_CONTROLLER, Controller);
