import { useLightboxProps } from "../../core/index.js";
export const defaultVideoProps = {
    controls: true,
    playsInline: true,
};
export const resolveVideoProps = (video) => ({
    ...defaultVideoProps,
    ...video,
});
export function useVideoProps() {
    const { video } = useLightboxProps();
    return resolveVideoProps(video);
}
