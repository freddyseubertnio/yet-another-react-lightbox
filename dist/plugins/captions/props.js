export const defaultCaptionsProps = {
    descriptionTextAlign: "start",
    descriptionMaxLines: 3,
};
export const resolveCaptionsProps = (captions) => ({
    ...defaultCaptionsProps,
    ...captions,
});
