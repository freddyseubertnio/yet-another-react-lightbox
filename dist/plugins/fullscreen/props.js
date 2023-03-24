export const defaultFullscreenProps = {
    auto: false,
    ref: null,
};
export const resolveFullscreenProps = (fullscreen) => ({
    ...defaultFullscreenProps,
    ...fullscreen,
});
