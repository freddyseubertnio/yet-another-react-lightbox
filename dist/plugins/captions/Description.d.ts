/// <reference types="react" />
import { LightboxProps, Slide } from "../../types.js";
export type DescriptionProps = Required<Pick<Slide, "description">> & Pick<LightboxProps, "styles">;
export declare function Description({ description, styles }: DescriptionProps): JSX.Element;
