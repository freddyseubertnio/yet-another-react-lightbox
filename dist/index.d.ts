import * as React from "react";
import {
  LightboxExternalProps,
  LightboxProps,
  Labels,
  Slide,
  SlideImage,
  LengthOrPercentage,
  ContainerRect,
  ToolbarSettings,
  CarouselSettings,
  Component,
  Module,
  Node,
  Plugin,
  Augmentation,
  EventTypes,
  ComponentProps,
  LightboxStateSwipeAction,
  LightboxStateUpdateAction,
  LightboxState,
  Render,
  ControllerRef,
  Callback,
  RenderFunction,
} from "./types.js";
export {
  ACTION_CLOSE,
  ACTION_NEXT,
  ACTION_PREV,
  ACTION_SWIPE,
  ACTIVE_SLIDE_COMPLETE,
  ACTIVE_SLIDE_ERROR,
  ACTIVE_SLIDE_LOADING,
  ACTIVE_SLIDE_PLAYING,
  AnimationSettings,
  CLASS_FLEX_CENTER,
  CLASS_FULLSIZE,
  CLASS_NO_SCROLL,
  CLASS_NO_SCROLL_PADDING,
  Callbacks,
  ClickCallbackProps,
  ControllerSettings,
  DeepPartial,
  DeepPartialValue,
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
  GenericSlide,
  IMAGE_FIT_CONTAIN,
  IMAGE_FIT_COVER,
  ImageFit,
  ImageSource,
  MODULE_CAROUSEL,
  MODULE_CONTROLLER,
  MODULE_NAVIGATION,
  MODULE_NO_SCROLL,
  MODULE_PORTAL,
  MODULE_ROOT,
  MODULE_TOOLBAR,
  NavigationAction,
  NoScrollSettings,
  PLUGIN_CAPTIONS,
  PLUGIN_COUNTER,
  PLUGIN_DOWNLOAD,
  PLUGIN_FULLSCREEN,
  PLUGIN_INLINE,
  PLUGIN_SHARE,
  PLUGIN_SLIDESHOW,
  PLUGIN_THUMBNAILS,
  PLUGIN_ZOOM,
  PluginProps,
  PortalSettings,
  RenderSlideContainerProps,
  RenderSlideFooterProps,
  RenderSlideHeaderProps,
  RenderSlideProps,
  SLIDE_STATUS_COMPLETE,
  SLIDE_STATUS_ERROR,
  SLIDE_STATUS_LOADING,
  SLIDE_STATUS_PLACEHOLDER,
  SLIDE_STATUS_PLAYING,
  SlideStatus,
  SlideTypeKey,
  SlideTypes,
  Slot,
  SlotStyles,
  SlotType,
  TOOLBAR_BUTTONS,
  TOOLBAR_TITLE,
  ToolbarButtonKey,
  ToolbarButtonKeys,
  UNKNOWN_ACTION_TYPE,
  VK_ARROW_LEFT,
  VK_ARROW_RIGHT,
  VK_ESCAPE,
  ViewCallbackProps,
  activeSlideStatus,
} from "./types.js";

/** Lightbox component */
declare function Lightbox({
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
}: LightboxExternalProps): React.JSX.Element | null;

declare const LightboxDefaultProps: LightboxProps;

declare const clsx: (...classes: (string | boolean | undefined)[]) => string;
declare const cssClass: (name: string) => string;
declare const cssVar: (name: string) => string;
declare const composePrefix: (base: string, prefix?: string) => string;
declare const makeComposePrefix: (base: string) => (prefix?: string) => string;
declare const label: (labels: Labels | undefined, lbl: string) => string;
declare const cleanup: (...cleaners: (() => void)[]) => () => void;
declare const makeUseContext: <T>(
  name: string,
  contextName: string,
  context: React.Context<T | null>,
) => () => NonNullable<T>;
declare const hasWindow: () => boolean;
declare function round(value: number, decimals?: number): number;
declare const isImageSlide: (slide: Slide) => slide is SlideImage;
declare const isImageFitCover: (image: SlideImage, imageFit?: LightboxProps["carousel"]["imageFit"]) => boolean;
declare function parseLengthPercentage(input: LengthOrPercentage):
  | {
      pixel: number;
      percent?: undefined;
    }
  | {
      percent: number;
      pixel?: undefined;
    };
declare function computeSlideRect(
  containerRect: ContainerRect,
  padding: LengthOrPercentage,
): {
  width: number;
  height: number;
};
declare const devicePixelRatio: () => number;
declare const getSlideIndex: (index: number, slidesCount: number) => number;
declare const hasSlides: (slides: Slide[]) => slides is [SlideImage, ...SlideImage[]];
declare const getSlide: (slides: [Slide, ...Slide[]], index: number) => SlideImage;
declare const getSlideIfPresent: (slides: Slide[], index: number) => SlideImage | undefined;
declare function addToolbarButton(toolbar: ToolbarSettings, key: string, button: React.ReactNode): ToolbarSettings;
declare function stopNavigationEventsPropagation(): {
  onPointerDown: (event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent) => void;
  onKeyDown: (event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent) => void;
  onWheel: (event: React.PointerEvent | React.KeyboardEvent | React.WheelEvent) => void;
};
declare function calculatePreload(carousel: CarouselSettings, slides: Slide[], minimum?: number): number;

declare function createModule(name: string, component: Component): Module;
declare function createNode(module: Module, children?: Node[]): Node;
declare function withPlugins(
  root: Node[],
  plugins?: Plugin[],
  augmentations?: Augmentation[],
): {
  config: Node[];
  augmentation: Augmentation;
};

type ComputeAnimation<T> = (
  snapshot: T,
  rect: DOMRect,
  translate: {
    x: number;
    y: number;
    z: number;
  },
) =>
  | {
      keyframes: Keyframe[];
      duration: number;
      easing?: string;
      onfinish?: () => void;
    }
  | undefined;
declare function useAnimation<T>(
  nodeRef: React.RefObject<HTMLElement | null>,
  computeAnimation: ComputeAnimation<T>,
): {
  prepareAnimation: (currentSnapshot: T | undefined) => void;
  isAnimationPlaying: () => boolean;
};

declare function useContainerRect<T extends HTMLElement = HTMLElement>(): {
  setContainerRef: (node: T | null) => void;
  containerRef: React.MutableRefObject<T | null>;
  containerRect: ContainerRect | undefined;
};

declare function useDelay(): (callback: () => void, delay: number) => void;

declare function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
): (...args: Args) => Return;

declare function setRef<T>(
  ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
  value: T | null,
): void;
declare function useForkRef<InstanceA, InstanceB>(
  refA: React.Ref<InstanceA> | null | undefined,
  refB: React.Ref<InstanceB> | null | undefined,
): React.Ref<InstanceA & InstanceB> | null;

declare const useLayoutEffect: typeof React.useEffect;

declare function useLoseFocus(
  focus: () => void,
  disabled?: boolean,
): {
  onFocus: () => void;
  onBlur: () => void;
};

declare function useMotionPreference(): boolean;

declare function useRTL(): boolean;

type PointerEventType = "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerLeave" | "onPointerCancel";
type KeyboardEventType = "onKeyDown" | "onKeyUp";
type WheelEventType = "onWheel";
type SupportedEventType = PointerEventType | KeyboardEventType | WheelEventType;
type ReactEventType<T, K> = K extends KeyboardEventType
  ? React.KeyboardEvent<T>
  : K extends WheelEventType
  ? React.WheelEvent<T>
  : K extends PointerEventType
  ? React.PointerEvent<T>
  : never;
type SensorCallback<
  T extends Element,
  P extends React.PointerEvent<T> | React.KeyboardEvent<T> | React.WheelEvent<T>,
> = (event: P) => void;
type SubscribeSensors<T extends Element> = <ET extends SupportedEventType>(
  type: ET,
  callback: SensorCallback<T, ReactEventType<T, ET>>,
) => () => void;
type RegisterSensors<T extends Element> = Required<Pick<React.HTMLAttributes<T>, PointerEventType>> &
  Required<Pick<React.HTMLAttributes<T>, KeyboardEventType>> &
  Required<Pick<React.HTMLAttributes<T>, WheelEventType>>;
type UseSensors<T extends Element> = {
  registerSensors: RegisterSensors<T>;
  subscribeSensors: SubscribeSensors<T>;
};
declare function useSensors<T extends Element>(): UseSensors<T>;

declare function useThrottle(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void;

type Topic = keyof EventTypes;
type Event<T extends Topic> = EventTypes[T];
type EventCallback<T extends Topic> = (...args: Event<T> extends void ? [] : [event: Event<T>]) => void;
type Subscribe = <T extends Topic>(topic: T, callback: EventCallback<T>) => () => void;
type Unsubscribe = <T extends Topic>(topic: T, callback: EventCallback<T>) => void;
type Publish = <T extends Topic>(...args: Event<T> extends void ? [topic: T] : [topic: T, event: Event<T>]) => void;
type EventsContextType = {
  subscribe: Subscribe;
  unsubscribe: Unsubscribe;
  publish: Publish;
};
declare const EventsContext: React.Context<EventsContextType | null>;
declare const useEvents: () => EventsContextType;
declare function EventsProvider({ children }: React.PropsWithChildren): React.JSX.Element;

type LightboxPropsContextType = Omit<ComponentProps, "children">;
declare const LightboxPropsContext: React.Context<LightboxPropsContextType | null>;
declare const useLightboxProps: () => LightboxPropsContextType;
declare function LightboxPropsProvider({ children, ...props }: ComponentProps): React.JSX.Element;

type LightboxStateAction = LightboxStateSwipeAction | LightboxStateUpdateAction;
type LightboxStateContextType = LightboxState & {
  /** @deprecated - use `useLightboxState` props directly */
  state: LightboxState;
  /** @deprecated - use `useLightboxDispatch` instead */
  dispatch: React.Dispatch<LightboxStateAction>;
};
declare const LightboxStateContext: React.Context<LightboxStateContextType | null>;
declare const useLightboxState: () => NonNullable<LightboxStateContextType>;
type LightboxDispatchContextType = React.Dispatch<LightboxStateAction>;
declare const LightboxDispatchContext: React.Context<LightboxDispatchContextType | null>;
declare const useLightboxDispatch: () => LightboxDispatchContextType;
type LightboxStateProviderProps = React.PropsWithChildren<Pick<LightboxProps, "slides" | "index">>;
declare function LightboxStateProvider({ slides, index, children }: LightboxStateProviderProps): React.JSX.Element;

type TimeoutsContextType = {
  setTimeout: (fn: () => void, delay?: number) => number;
  clearTimeout: (id?: number) => void;
};
declare const TimeoutsContext: React.Context<TimeoutsContextType | null>;
declare const useTimeouts: () => TimeoutsContextType;
declare function TimeoutsProvider({ children }: React.PropsWithChildren): React.JSX.Element;

type IconButtonProps = Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "type" | "aria-label"
> & {
  label: string;
  icon: React.ElementType;
  renderIcon?: () => React.ReactNode;
};
declare const IconButton: React.ForwardRefExoticComponent<
  Omit<IconButtonProps, "ref"> & React.RefAttributes<HTMLButtonElement>
>;

declare function createIcon(
  name: string,
  glyph: React.ReactNode,
): {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};
declare function createIconDisabled(
  name: string,
  glyph: React.ReactNode,
): {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};
declare const CloseIcon: {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};
declare const PreviousIcon: {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};
declare const NextIcon: {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};
declare const LoadingIcon: {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};
declare const ErrorIcon: {
  (props: React.SVGProps<SVGSVGElement>): React.JSX.Element;
  displayName: string;
};

type ImageSlideProps = Partial<Pick<CarouselSettings, "imageFit" | "imageProps">> & {
  slide: SlideImage;
  offset?: number;
  render?: Render;
  rect?: ContainerRect;
  onClick?: () => void;
  onLoad?: (image: HTMLImageElement) => void;
  style?: React.CSSProperties;
};
declare function ImageSlide({
  slide: image,
  offset,
  render,
  rect,
  imageFit,
  imageProps,
  onClick,
  onLoad,
  style,
}: ImageSlideProps): React.JSX.Element;

declare function Carousel({ carousel }: ComponentProps): React.JSX.Element;
declare const CarouselModule: Module;

declare enum SwipeState {
  NONE = 0,
  SWIPE = 1,
  PULL_DOWN = 2,
  ANIMATION = 3,
}

declare function usePointerSwipe<T extends Element = Element>(
  subscribeSensors: UseSensors<T>["subscribeSensors"],
  isSwipeValid: (offset: number) => boolean,
  containerWidth: number,
  swipeAnimationDuration: number,
  onSwipeStart: () => void,
  onSwipeProgress: (offset: number) => void,
  onSwipeFinish: (offset: number, duration: number) => void,
  onSwipeCancel: (offset: number) => void,
  pullDownEnabled: boolean,
  onPullDownStart: () => void,
  onPullDownProgress: (offset: number) => void,
  onPullDownFinish: (offset: number, duration: number) => void,
  onPullDownCancel: (offset: number) => void,
): void;

/** prevent browser back/forward navigation on touchpad left/right swipe (especially noticeable in Safari)
 * this has to be done via non-passive native event handler */
declare function usePreventSwipeNavigation<T extends HTMLElement = HTMLElement>(): (node: T | null) => void;

declare function useWheelSwipe<T extends Element = Element>(
  swipeState: SwipeState,
  subscribeSensors: UseSensors<T>["subscribeSensors"],
  isSwipeValid: (offset: number) => boolean,
  containerWidth: number,
  swipeAnimationDuration: number,
  onSwipeStart: () => void,
  onSwipeProgress: (offset: number) => void,
  onSwipeFinish: (offset: number, duration: number) => void,
  onSwipeCancel: (offset: number) => void,
): void;

type ControllerContextType = Pick<ControllerRef, "prev" | "next" | "close"> & {
  focus: Callback;
  slideRect: ContainerRect;
  containerRect: ContainerRect;
  subscribeSensors: SubscribeSensors<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  setCarouselRef: React.Ref<HTMLDivElement>;
  toolbarWidth: number | undefined;
  setToolbarWidth: (width: number | undefined) => void;
};
declare const ControllerContext: React.Context<ControllerContextType | null>;
declare const useController: () => NonNullable<ControllerContextType>;
declare function Controller({ children, ...props }: ComponentProps): React.JSX.Element;
declare const ControllerModule: Module;

type NavigationButtonProps = {
  label: string;
  icon: React.ElementType;
  renderIcon?: RenderFunction;
  action: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
};
declare function NavigationButton({
  label,
  icon,
  renderIcon,
  action,
  onClick,
  disabled,
  style,
}: NavigationButtonProps): React.JSX.Element;
declare function Navigation({
  render: { buttonPrev, buttonNext, iconPrev, iconNext },
  styles,
}: ComponentProps): React.JSX.Element;
declare const NavigationModule: Module;

declare function useKeyboardNavigation<T extends Element>(subscribeSensors: UseSensors<T>["subscribeSensors"]): void;

declare function useNavigationState(): {
  prevDisabled: boolean;
  nextDisabled: boolean;
};

declare function NoScroll({ noScroll: { disabled }, children }: ComponentProps): React.JSX.Element;
declare const NoScrollModule: Module;

declare function Portal({
  children,
  animation,
  styles,
  className,
  on,
  portal,
  close,
}: ComponentProps): React.ReactPortal | null;
declare const PortalModule: Module;

declare function Root({ children }: ComponentProps): React.JSX.Element;
declare const RootModule: Module;

declare function Toolbar({
  toolbar: { buttons, title },
  render: { buttonClose, iconClose },
  styles,
}: ComponentProps): React.JSX.Element;
declare const ToolbarModule: Module;

export {
  Augmentation,
  Callback,
  Carousel,
  CarouselModule,
  CarouselSettings,
  CloseIcon,
  Component,
  ComponentProps,
  type ComputeAnimation,
  ContainerRect,
  Controller,
  ControllerContext,
  type ControllerContextType,
  ControllerModule,
  ControllerRef,
  ErrorIcon,
  type Event,
  type EventCallback,
  EventTypes,
  EventsContext,
  type EventsContextType,
  EventsProvider,
  IconButton,
  type IconButtonProps,
  ImageSlide,
  type ImageSlideProps,
  type KeyboardEventType,
  Labels,
  LengthOrPercentage,
  Lightbox,
  LightboxDefaultProps,
  LightboxDispatchContext,
  type LightboxDispatchContextType,
  LightboxExternalProps,
  LightboxProps,
  LightboxPropsContext,
  type LightboxPropsContextType,
  LightboxPropsProvider,
  LightboxState,
  type LightboxStateAction,
  LightboxStateContext,
  type LightboxStateContextType,
  LightboxStateProvider,
  type LightboxStateProviderProps,
  LightboxStateSwipeAction,
  LightboxStateUpdateAction,
  LoadingIcon,
  Module,
  Navigation,
  NavigationButton,
  type NavigationButtonProps,
  NavigationModule,
  NextIcon,
  NoScroll,
  NoScrollModule,
  Node,
  Plugin,
  type PointerEventType,
  Portal,
  PortalModule,
  PreviousIcon,
  type Publish,
  type ReactEventType,
  type RegisterSensors,
  Render,
  RenderFunction,
  Root,
  RootModule,
  type SensorCallback,
  Slide,
  SlideImage,
  type Subscribe,
  type SubscribeSensors,
  type SupportedEventType,
  SwipeState,
  TimeoutsContext,
  type TimeoutsContextType,
  TimeoutsProvider,
  Toolbar,
  ToolbarModule,
  ToolbarSettings,
  type Topic,
  type Unsubscribe,
  type UseSensors,
  type WheelEventType,
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
  usePointerSwipe,
  usePreventSwipeNavigation,
  useRTL,
  useSensors,
  useThrottle,
  useTimeouts,
  useWheelSwipe,
  withPlugins,
};
