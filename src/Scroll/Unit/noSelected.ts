export const stopSelect = (
    e: React.MouseEvent<HTMLElement>,
    selectedFn: { current: typeof document.onselectstart },
    stopPropagation?: boolean,
) => {
    stopPropagation && e.stopPropagation();
    window.getSelection()?.removeAllRanges();
    selectedFn.current = document.onselectstart;
    document.onselectstart = () => false;
};
