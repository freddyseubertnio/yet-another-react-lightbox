import { useLightboxProps } from "../../core/index.js";
export const defaultThumbnailsProps = {
    position: "bottom",
    width: 120,
    height: 80,
    border: 1,
    borderRadius: 4,
    padding: 4,
    gap: 16,
    imageFit: "contain",
    vignette: true,
};
export const resolveThumbnailsProps = (thumbnails) => ({
    ...defaultThumbnailsProps,
    ...thumbnails,
});
export function useThumbnailsProps() {
    const { thumbnails } = useLightboxProps();
    return resolveThumbnailsProps(thumbnails);
}
