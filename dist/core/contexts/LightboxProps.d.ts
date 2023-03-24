import * as React from "react";
import { ComponentProps } from "../../types.js";
export type LightboxPropsContextType = Omit<ComponentProps, "children">;
export declare const LightboxPropsContext: React.Context<LightboxPropsContextType | null>;
export declare const useLightboxProps: () => LightboxPropsContextType;
export declare function LightboxPropsProvider({ children, ...props }: ComponentProps): JSX.Element;
