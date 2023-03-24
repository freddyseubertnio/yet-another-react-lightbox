import { isImageFitCover, isImageSlide, round, useLightboxProps, useLightboxState } from "../../../core/index.js";
import { useZoomProps } from "./useZoomProps.js";
export function useZoomImageRect(slideRect, imageDimensions) {
    var _a, _b;
    let imageRect = { width: 0, height: 0 };
    let maxImageRect = { width: 0, height: 0 };
    const { slides, currentIndex } = useLightboxState().state;
    const { imageFit } = useLightboxProps().carousel;
    const { maxZoomPixelRatio } = useZoomProps();
    if (slideRect && currentIndex < slides.length) {
        const slide = { ...slides[currentIndex], ...imageDimensions };
        if (isImageSlide(slide)) {
            const cover = isImageFitCover(slide, imageFit);
            const width = Math.max(...(((_a = slide.srcSet) === null || _a === void 0 ? void 0 : _a.map((x) => x.width)) || []).concat(slide.width ? [slide.width] : []));
            const height = Math.max(...(((_b = slide.srcSet) === null || _b === void 0 ? void 0 : _b.map((x) => x.height)) || []).concat(slide.height ? [slide.height] : []));
            if (width > 0 && height > 0 && slideRect.width > 0 && slideRect.height > 0) {
                maxImageRect = cover
                    ? {
                        width: Math.round(Math.min(width, (slideRect.width / slideRect.height) * height)),
                        height: Math.round(Math.min(height, (slideRect.height / slideRect.width) * width)),
                    }
                    : { width, height };
                maxImageRect = {
                    width: maxImageRect.width * maxZoomPixelRatio,
                    height: maxImageRect.height * maxZoomPixelRatio,
                };
                imageRect = cover
                    ? {
                        width: Math.min(slideRect.width, maxImageRect.width, width),
                        height: Math.min(slideRect.height, maxImageRect.height, height),
                    }
                    : {
                        width: Math.round(Math.min(slideRect.width, (slideRect.height / height) * width, width)),
                        height: Math.round(Math.min(slideRect.height, (slideRect.width / width) * height, height)),
                    };
            }
        }
    }
    const maxZoom = imageRect.width ? Math.max(round(maxImageRect.width / imageRect.width, 5), 1) : 1;
    return { imageRect, maxZoom };
}
