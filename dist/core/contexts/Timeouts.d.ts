import * as React from "react";
export type TimeoutsContextType = {
    setTimeout: (fn: () => void, delay?: number) => number;
    clearTimeout: (id?: number) => void;
};
export declare const TimeoutsContext: React.Context<TimeoutsContextType | null>;
export declare const useTimeouts: () => TimeoutsContextType;
export declare function TimeoutsProvider({ children }: React.PropsWithChildren): JSX.Element;
