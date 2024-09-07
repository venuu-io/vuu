import {
  GridLayoutItemProps,
  Stack,
  renderTabsForStack,
  useDraggable,
  useGridLayoutDragStartHandler,
  useGridLayoutProps,
} from "@finos/vuu-layout";
import { useComponentCssInjection } from "@salt-ds/styles";
import { useWindow } from "@salt-ds/window";
import cx from "clsx";
import { DragEvent, useCallback, useLayoutEffect, useState } from "react";
import { useAsDropTarget } from "./useAsDropTarget";
import { useNotDropTarget } from "./useNotDropTarget";

import { queryClosest } from "@finos/vuu-utils";
import gridLayoutCss from "./GridLayout.css";
import gridSplitterCss from "./GridSplitter.css";
import { Tabstrip, useEditableText } from "@finos/vuu-ui-controls";

const classBaseItem = "vuuGridLayoutItem";

export const GridLayoutStackedItem = ({
  active: activeProp = 0,
  children,
  className: classNameProp,
  header,
  id,
  isDropTarget = true,
  resizeable,
  style: styleProp,
  title,
  ...htmlAttributes
}: GridLayoutItemProps & {
  active?: number;
}) => {
  const targetWindow = useWindow();
  useComponentCssInjection({
    testId: "vuu-grid-layout",
    css: gridLayoutCss,
    window: targetWindow,
  });
  useComponentCssInjection({
    testId: "vuu-grid-splitter",
    css: gridSplitterCss,
    window: targetWindow,
  });

  const layoutProps = useGridLayoutProps(id);
  const onDragStart = useGridLayoutDragStartHandler();
  const [active, setActive] = useState(activeProp);

  useLayoutEffect(() => {
    console.log(`activeProp changed ${activeProp}`);
    setActive(activeProp);
  }, [activeProp]);

  const getPayload = useCallback(
    (evt: DragEvent<Element>): [string, string] => {
      const draggedItem = queryClosest(evt.target, ".vuuGridLayoutItem");
      if (draggedItem) {
        return ["text/plain", draggedItem.id];
      }
      throw Error("GridLayoutItem no found");
    },
    [],
  );

  const useDropTargetHook = isDropTarget ? useAsDropTarget : useNotDropTarget;
  const { dropTargetClassName, ...droppableProps } = useDropTargetHook();
  const draggableProps = useDraggable({
    draggableClassName: classBaseItem,
    getPayload,
    onDragStart,
  });

  // const TabstripProps = useMemo<TabstripProps>(() => ({}), []);

  const className = cx(classBaseItem, {
    [`${classBaseItem}-resizeable-h`]: resizeable === "h",
    [`${classBaseItem}-resizeable-v`]: resizeable === "v",
    [`${classBaseItem}-resizeable-vh`]: resizeable === "hv",
  });

  const style = {
    ...styleProp,
    ...layoutProps,
  };

  const stackId = `stack-${id}`;

  return (
    <div
      {...htmlAttributes}
      {...droppableProps}
      {...draggableProps}
      className={cx(className)}
      id={id}
      key={id}
      style={style}
    >
      <div
        className={cx(`${classBaseItem}Header`, dropTargetClassName)}
        data-drop-target="tabs"
      >
        <Tabstrip activeTabIndex={active} onActiveChange={setActive}>
          {renderTabsForStack(stackId, children)}
        </Tabstrip>
      </div>
      <div className={cx(`${classBaseItem}Content`, dropTargetClassName)}>
        <Stack active={active} id={stackId} showTabs={false}>
          {children}
        </Stack>
      </div>
    </div>
  );
};
