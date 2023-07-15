import { CSSProperties, RefObject, useCallback, useMemo, useRef } from "react";

export const useAnimatedSelectionThumb = (
  containerRef: RefObject<HTMLElement>,
  activeTabIndex: number
) => {
  const onTransitionEnd = useCallback(() => {
    containerRef.current?.style.setProperty("--tab-thumb-transition", "none");
    containerRef.current?.removeEventListener("transitionend", onTransitionEnd);
  }, [containerRef]);
  const lastSelectedRef = useRef(-1);
  return useMemo(() => {
    let offset = 0;
    let width = 0;
    if (lastSelectedRef.current !== -1) {
      const oldSelected =
        containerRef.current?.querySelector(".vuuTab-selected");
      const newSelected = containerRef.current?.querySelector(
        `[data-index="${activeTabIndex}"] .vuuTab`
      );
      if (oldSelected && newSelected) {
        const { left: oldLeft, width: oldWidth } =
          oldSelected.getBoundingClientRect();
        const { left: newLeft } = newSelected.getBoundingClientRect();
        offset = oldLeft - newLeft;
        width = oldWidth;
        const duration = Math.abs(offset / 1100 /* this is our speed */);
        requestAnimationFrame(() => {
          containerRef.current?.style.setProperty("--tab-thumb-offset", "0px");
          containerRef.current?.style.setProperty("--tab-thumb-width", "100%");
          containerRef.current?.style.setProperty(
            "--tab-thumb-transition",
            `all ${duration}s ease`
          );
          containerRef.current?.addEventListener(
            "transitionend",
            onTransitionEnd
          );
        });
      }
    }
    lastSelectedRef.current = activeTabIndex;
    return {
      "--tab-thumb-offset": `${offset}px`,
      "--tab-thumb-width": width ? `${width}px` : undefined,
    } as CSSProperties;
  }, [containerRef, onTransitionEnd, activeTabIndex]);
};
