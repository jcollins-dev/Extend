// 3rd party
import React from 'react';

// Hooks
import { useGroupSelectList } from './hooks/useSelectList';

// Elements
import { SelectListHistoryButtonContainerProps } from './SelectListHistoryButtons.elements';

// Components
import { StateHistoryButtons } from '../StateHistoryButtons';

const baseClass = `select-list-history-buttons`;

// This component MUST HAVE a parent <UseGroupSelectListProvider /> in order for it to work
export const SelectListHistoryButtons = ({
  gridArea,
  className
}: SelectListHistoryButtonContainerProps): JSX.Element => {
  className = className ? `${baseClass} ${className}` : baseClass;

  const { hasUndo, hasRedo, hasClear, handle } = useGroupSelectList();

  const stateHistoryButtonsSettings = {
    className,
    gridArea,
    undo: {
      disabled: !hasUndo,
      handleClick: () => handle?.('undo')
    },
    redo: {
      disabled: !hasRedo,
      handleClick: () => handle?.('redo')
    },
    clear: {
      disabled: !hasClear,
      handleClick: () => handle?.('clear')
    }
  };

  return <StateHistoryButtons {...stateHistoryButtonsSettings} />;
};
