import { StateHistoryButtonsProps } from '../StateHistoryButtons';

export const stateHistoryButtonsDemoSettings = {
  undo: {
    handleClick: () => alert('undo clicked')
  },
  clear: {
    label: `custom clearnlabel`,
    isDisabled: true
  },
  redo: {
    handleClick: () => alert('redo clicked')
  }
};
