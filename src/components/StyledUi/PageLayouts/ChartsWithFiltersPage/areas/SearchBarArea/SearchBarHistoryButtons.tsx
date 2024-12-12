import React from 'react';
import { useFilterSelected, StateHistoryButtons } from 'components';

export const SearchBarHistoryButtons = (): JSX.Element => {
  const selects = useFilterSelected();

  const handle = selects[1];

  const { hasUndo, hasRedo, hasClear } = selects[2];

  const stateHistoryButtonsSettings = {
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
