export const defaultSlideshowProps = {
    autoplay: false,
    delay: 3000,
    ref: null,
};
export const resolveSlideshowProps = (slideshow) => ({
    ...defaultSlideshowProps,
    ...slideshow,
});
