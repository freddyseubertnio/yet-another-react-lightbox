import * as React from "react";
import { LightboxDefaultProps } from "./props.js";
import { CarouselModule, ControllerModule, createNode, EventsProvider, LightboxPropsProvider, LightboxStateProvider, NavigationModule, NoScrollModule, PortalModule, RootModule, TimeoutsProvider, ToolbarModule, withPlugins, } from "./core/index.js";
function renderNode(node, props) {
    var _a;
    return React.createElement(node.module.component, { key: node.module.name, ...props }, (_a = node.children) === null || _a === void 0 ? void 0 : _a.map((child) => renderNode(child, props)));
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
export function Lightbox({ carousel, animation, customAnimation, render, toolbar, controller, on, plugins, slides, index, ...restProps }) {
    const { animation: defaultAnimation, customAnimation: defaultCustomAnimation, carousel: defaultCarousel, render: defaultRender, toolbar: defaultToolbar, controller: defaultController, on: defaultOn, slides: defaultSlides, index: defaultIndex, plugins: defaultPlugins, ...restDefaultProps } = LightboxDefaultProps;
    const { config, augmentation } = withPlugins([
        createNode(PortalModule, [
            createNode(NoScrollModule, [
                createNode(ControllerModule, [
                    createNode(CarouselModule),
                    createNode(ToolbarModule),
                    createNode(NavigationModule),
                ]),
            ]),
        ]),
    ], plugins || defaultPlugins);
    const props = augmentation({
        animation: mergeAnimation(defaultAnimation, animation),
        customAnimation: mergeAnimation(defaultCustomAnimation, customAnimation),
        carousel: { ...defaultCarousel, ...carousel },
        render: { ...defaultRender, ...render },
        toolbar: { ...defaultToolbar, ...toolbar },
        controller: { ...defaultController, ...controller },
        on: { ...defaultOn, ...on },
        ...restDefaultProps,
        ...restProps,
    });
    if (!props.open)
        return null;
    return (React.createElement(LightboxPropsProvider, { ...props },
        React.createElement(LightboxStateProvider, { slides: slides || defaultSlides, index: index || defaultIndex },
            React.createElement(TimeoutsProvider, null,
                React.createElement(EventsProvider, null, renderNode(createNode(RootModule, config), props))))));
}
