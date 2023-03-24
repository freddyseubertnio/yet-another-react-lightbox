import * as React from "react";
import { getSlideIndex, makeUseContext } from "../utils.js";
import { UNKNOWN_ACTION_TYPE } from "../consts.js";
export const LightboxStateContext = React.createContext(null);
export const useLightboxState = makeUseContext("useLightboxState", "LightboxStateContext", LightboxStateContext);
function reducer(state, action) {
    switch (action.type) {
        case "swipe": {
            const { slides } = state;
            const increment = (action === null || action === void 0 ? void 0 : action.increment) || 0;
            const globalIndex = state.globalIndex + increment;
            const currentIndex = getSlideIndex(globalIndex, slides.length);
            const animation = increment || action.duration
                ? {
                    increment,
                    duration: action.duration,
                    easing: action.easing,
                }
                : undefined;
            return { slides, currentIndex, globalIndex, animation };
        }
        case "update":
            return {
                slides: action.slides,
                currentIndex: action.index,
                globalIndex: action.index,
            };
        default:
            throw new Error(UNKNOWN_ACTION_TYPE);
    }
}
export function LightboxStateProvider({ slides, index, children }) {
    const [state, dispatch] = React.useReducer(reducer, { slides, currentIndex: index, globalIndex: index });
    React.useEffect(() => {
        dispatch({ type: "update", slides, index });
    }, [slides, index]);
    const context = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
    return React.createElement(LightboxStateContext.Provider, { value: context }, children);
}
