import React, { ReactElement } from "react";

export const getChildComponent = (
  children: ReactElement[],
  gridItemId: string
): ReactElement => {
  const targetGridItem = children.find(
    (child) => child.props.id === gridItemId
  );
  if (targetGridItem) {
    const childComponent = targetGridItem.props.children;
    if (React.isValidElement(childComponent)) {
      return childComponent;
    } else if (Array.isArray(childComponent)) {
      return childComponent.at(0) as ReactElement;
    } else {
      throw Error(`invalid child component`);
    }
  } else {
    throw Error(`getChildComponent #${gridItemId} not found`);
  }
};

export const addChildComponentToStack = (
  stackElement: ReactElement,
  childElement: ReactElement
) => {
  if (Array.isArray(stackElement.props.children)) {
    console.log(`children is an array`);
  }

  const stackChildren = stackElement.props.children;
  // can we add an imperative API method to Stack ?
  return React.cloneElement(
    stackElement,
    {},
    stackChildren.concat(childElement)
  );
};
