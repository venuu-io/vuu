import { useStateRef } from "@finos/vuu-ui-controls";
import { dispatchMouseEvent } from "@finos/vuu-utils";
import { KeyboardEventHandler, useCallback, useRef } from "react";

export const useControlledTableNavigation = (
  initialValue?: number,
  rowCount: number
) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const [highlightedIndexRef, setHighlightedIndex] = useStateRef<
    number | undefined
  >(initialValue);

  const handleKeyDown = useCallback<KeyboardEventHandler>(
    (e) => {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((index = -1) => Math.min(rowCount - 1, index + 1));
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((index = -1) => Math.max(0, index - 1));
      } else if (e.key === "Enter" || e.key === " ") {
        const { current: rowIdx } = highlightedIndexRef;
        // induce an onSelect event by 'clicking' the row
        const rowEl = tableRef.current?.querySelector(
          `[aria-rowindex="${rowIdx}"]`
        ) as HTMLElement;
        if (rowEl) {
          dispatchMouseEvent(rowEl, "click");
        }
      }
    },
    [highlightedIndexRef, setHighlightedIndex]
  );

  return {
    highlightedIndexRef,
    onKeyDown: handleKeyDown,
    tableRef,
  };
};
