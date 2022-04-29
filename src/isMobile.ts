export const isMobile = () => {
    return window.matchMedia('(any-pointer:coarse)').matches;
};
