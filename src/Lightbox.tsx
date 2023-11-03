import * as React from "react";

import { AnimationSettings, ComponentProps, LightboxExternalProps, Node } from "./types.js";
import { LightboxDefaultProps } from "./props.js";
import { createNode, withPlugins } from "./config.js";
import { EventsProvider, LightboxPropsProvider, LightboxStateProvider, TimeoutsProvider } from "./contexts/index.js";
import {
  CarouselModule,
  ControllerModule,
  NavigationModule,
  NoScrollModule,
  PortalModule,
  RootModule,
  ToolbarModule,
} from "./modules/index.js";

function renderNode(node: Node, props: ComponentProps): React.ReactElement {
  return React.createElement(
    node.module.component,
    { key: node.module.name, ...props },
    node.children?.map((child) => renderNode(child, props)),
  );
}

function mergeAnimation(defaultAnimation: AnimationSettings, animation: LightboxExternalProps["animation"] = {}) {
  const { easing: defaultAnimationEasing, ...restDefaultAnimation } = defaultAnimation;
  const { easing, ...restAnimation } = animation;
  return {
    easing: { ...defaultAnimationEasing, ...easing },
    ...restDefaultAnimation,
    ...restAnimation,
  };
}

/** Lightbox component */
export function Lightbox({
  carousel,
  animation,
  // Custom Animation
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
}: LightboxExternalProps) {
  const {
    animation: defaultAnimation,
    // Custom Animation
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
    // Custom Animation
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

  return (
    <LightboxPropsProvider {...props}>
      <LightboxStateProvider slides={slides || defaultSlides} index={index || defaultIndex}>
        <TimeoutsProvider>
          <EventsProvider>{renderNode(createNode(RootModule, config), props)}</EventsProvider>
        </TimeoutsProvider>
      </LightboxStateProvider>
    </LightboxPropsProvider>
  );
}
