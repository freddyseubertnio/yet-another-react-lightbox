import * as React from "react";
import { makeUseContext } from "../utils.js";
export const TimeoutsContext = React.createContext(null);
export const useTimeouts = makeUseContext("useTimeouts", "TimeoutsContext", TimeoutsContext);
export function TimeoutsProvider({ children }) {
    const [timeouts] = React.useState([]);
    React.useEffect(() => () => {
        timeouts.forEach((tid) => window.clearTimeout(tid));
        timeouts.splice(0, timeouts.length);
    }, [timeouts]);
    const context = React.useMemo(() => {
        const removeTimeout = (id) => {
            timeouts.splice(0, timeouts.length, ...timeouts.filter((tid) => tid !== id));
        };
        const setTimeout = (fn, delay) => {
            const id = window.setTimeout(() => {
                removeTimeout(id);
                fn();
            }, delay);
            timeouts.push(id);
            return id;
        };
        const clearTimeout = (id) => {
            if (id !== undefined) {
                removeTimeout(id);
                window.clearTimeout(id);
            }
        };
        return { setTimeout, clearTimeout };
    }, [timeouts]);
    return React.createElement(TimeoutsContext.Provider, { value: context }, children);
}
