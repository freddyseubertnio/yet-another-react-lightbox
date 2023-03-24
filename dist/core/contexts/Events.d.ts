import * as React from "react";
export interface EventTypes {
}
export type Topic = keyof EventTypes;
export type Event<T extends Topic> = EventTypes[T];
export type Callback<T extends Topic> = (...args: Event<T> extends void ? [] : [event: Event<T>]) => void;
export type Subscribe = <T extends Topic>(topic: T, callback: Callback<T>) => () => void;
export type Unsubscribe = <T extends Topic>(topic: T, callback: Callback<T>) => void;
export type Publish = <T extends Topic>(...args: Event<T> extends void ? [topic: T] : [topic: T, event: Event<T>]) => void;
export type EventsContextType = {
    subscribe: Subscribe;
    unsubscribe: Unsubscribe;
    publish: Publish;
};
export declare const EventsContext: React.Context<EventsContextType | null>;
export declare const useEvents: () => EventsContextType;
export declare function EventsProvider({ children }: React.PropsWithChildren): JSX.Element;
