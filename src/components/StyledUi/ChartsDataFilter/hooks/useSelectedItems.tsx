import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';

export type SelectedItemsPropsSelected = Record<string, string[]> | undefined;
export type SelectedItemsPropsHandle = (type: string, x?: Record<string, string>) => void;
export type SelectedItemsPropsHistory = SelectedItemsPropsSelected[] | [];

export type SelectedItemsProviderReturnProps = [
  SelectedItemsPropsHandle,
  SelectedItemsPropsSelected,
  {
    hasUndo?: boolean;
    hasRedo?: boolean;
    hasClear?: boolean;
  }
];

interface HandlersProps extends SelectedItemsPropsHandle {
  selected: SelectedItemsPropsSelected;
}

export const SelectedItemsProvider = ({ children }: Props): JSX.Element => {
  const [history, setHistory] = useState<SelectedItemsPropsHistory>([]);
  const [current, setCurrent] = useState(0);

  const selected: SelectedItemsPropsSelected | undefined = history[current] || undefined;

  useEffect(() => {
    setCurrent(0);
  }, [history]);

  const handleSelect = (x: Record<string, string>) => {
    let newItem = selected ? JSON.parse(JSON.stringify(selected)) : {};
    Object.entries(x).map(([key, value]) =>
      !newItem[key]
        ? (newItem = { ...newItem, [key]: [value] })
        : !newItem?.[key]?.includes(value) && newItem[key].push(value)
    );

    return setHistory([newItem, ...history]);
  };

  const handleDeselect = (x: Record<string, string>) => {
    let newItem = selected ? JSON.parse(JSON.stringify(selected)) : {};

    Object.entries(x).map(
      ([key, value]) =>
        newItem[key]?.includes(value) && newItem[key].splice(newItem[key].indexOf(value), 1)
    );

    if (JSON.stringify(newItem) === `{}`) newItem = undefined;

    return setHistory([newItem, ...history]);
  };

  const handleToggle = (x: Record<string, string>) => {
    const newItem = selected ? JSON.parse(JSON.stringify(selected)) : {};
    let count = 0;

    const selectedKeyCount = Object.entries(x).reduce((acc: boolean[], [key, value]) => {
      console.log({ key, value });
      count = count + 1;

      if (newItem[key]?.includes(value)) {
        //console.log('is present');
      }
      return (acc = newItem[key]?.includes(value) ? [...acc, true] : acc);
    }, []).length;

    console.log({ selectedKeyCount, count });
    if (selectedKeyCount == 0) return handleSelect(x);
    else {
      if (selectedKeyCount < count) return handleSelect(x);
      else return handleDeselect(x);
    }
  };

  let hasUndo = false;
  let hasRedo = false;
  let hasClear = false;

  if (selected) {
    const count = history.length;
    hasUndo = count > 0;
    hasRedo = current > 0 && current < count;
    hasClear = hasUndo || hasRedo ? true : false;
  }

  const handle: SelectedItemsPropsHandle = (type, x) => {
    if (!x) {
      if (type === `undo` && hasUndo) return setCurrent(current + 1);
      if (type === `redo` && hasRedo) return setCurrent(current - 1);
      if (type === `clear` && hasClear) return setHistory([]);
    } else {
      if (type === 'toggle') return handleToggle(x);
      if (type === 'select') return handleSelect(x);
      if (type === 'deselect') return handleDeselect(x);
    }
  };

  return (
    <SelectedItemsContext.Provider value={[handle, selected, { hasUndo, hasRedo, hasClear }]}>
      {children}
    </SelectedItemsContext.Provider>
  );
};

const SelectedItemsContext = createContext<SelectedItemsProviderReturnProps>([
  (type, x) => console.log(`${type} not set`, x),
  undefined,
  {}
]);

export const useSelectedItems = (): SelectedItemsProviderReturnProps =>
  useContext(SelectedItemsContext);

export interface SelectListItemsProviderProps {
  data: SelectedItemsProviderReturnProps;
}

interface Props {
  children?: ReactNode | ReactNode[];
}
