import { Augmentation, Component, Module, Node, Plugin } from "../types.js";
export declare function createModule(name: string, component: Component): Module;
export declare function createNode(module: Module, children?: Node[]): Node;
export declare function withPlugins(root: Node[], plugins?: Plugin[], augmentations?: Augmentation[]): {
    config: Node[];
    augmentation: Augmentation;
};
