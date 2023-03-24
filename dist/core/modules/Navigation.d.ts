import * as React from "react";
import { ComponentProps, RenderFunction } from "../../types.js";
export type NavigationButtonProps = {
    label: string;
    icon: React.ElementType;
    renderIcon?: RenderFunction;
    action: "prev" | "next";
    onClick: () => void;
    disabled?: boolean;
};
export declare function NavigationButton({ label, icon, renderIcon, action, onClick, disabled }: NavigationButtonProps): JSX.Element;
export declare function Navigation({ carousel: { finite }, animation, render: { buttonPrev, buttonNext, iconPrev, iconNext }, }: ComponentProps): JSX.Element;
export declare const NavigationModule: import("../../types.js").Module;
