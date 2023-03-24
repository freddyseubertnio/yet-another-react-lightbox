import * as React from "react";
import { makeUseContext } from "../utils.js";
export const LightboxPropsContext = React.createContext(null);
export const useLightboxProps = makeUseContext("useLightboxProps", "LightboxPropsContext", LightboxPropsContext);
export function LightboxPropsProvider({ children, ...props }) {
    return React.createElement(LightboxPropsContext.Provider, { value: props }, children);
}
