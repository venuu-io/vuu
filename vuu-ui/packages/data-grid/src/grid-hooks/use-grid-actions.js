import { useCallback } from 'react';
import * as Action from '../context-menu/context-menu-actions';

export const useGridActions = ({
  invokeDataSourceAction,
  handleSelectionChange,
  invokeScrollAction
}) => {
  const dispatchAction = useCallback(
    (action) => {
      switch (action.type) {
        case Action.Sort:
        case 'group':
        case 'openTreeNode':
        case 'closeTreeNode':
          return invokeDataSourceAction(action), true;
        case 'selection':
        case 'deselection':
          return handleSelectionChange(action), true;
        case 'scroll-start-horizontal':
        case 'scroll-end-horizontal':
          return invokeScrollAction(action), true;
        default:
          console.log(`useGridAction, no built-in handler for ${action.type}`);
          return false;
      }
    },
    [invokeDataSourceAction, handleSelectionChange, invokeScrollAction]
  );

  return dispatchAction;
};
