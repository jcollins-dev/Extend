import React from 'react';
import {
  SelectListHistoryButtonContainer,
  SelectListHistoryButtonContainerProps
} from './SelectListHistoryButtons.elements';

export interface SelectListHistoryButtonsProps extends SelectListHistoryButtonContainerProps {
  hasUndo?: boolean;
  hasRedo?: boolean;
  hasClear?: boolean;
  handle: (type: string) => void;
}

export const SelectListHistoryButtons = ({
  hasUndo,
  hasRedo,
  hasClear,
  handle
}: SelectListHistoryButtonsProps): JSX.Element => {
  const Buttons = (
    <>
      <SelectListHistoryButtonContainer
        disabled={!hasUndo}
        onClick={() => hasUndo && handle('undo')}
      >
        undo
      </SelectListHistoryButtonContainer>
      <SelectListHistoryButtonContainer
        disabled={!hasClear}
        onClick={() => hasClear && handle('clear')}
      >
        clear
      </SelectListHistoryButtonContainer>
      <SelectListHistoryButtonContainer
        disabled={!hasRedo}
        onClick={() => hasRedo && handle('redo')}
      >
        redo
      </SelectListHistoryButtonContainer>
    </>
  );

  return Buttons;
};
