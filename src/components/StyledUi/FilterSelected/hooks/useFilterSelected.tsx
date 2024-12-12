import React, { ReactNode, createContext, useContext, useState, useEffect } from 'react';

export type FilterSelectedPropsSelected = Record<string, string[]> | undefined;
export type FilterSelectedPropsHandle = (
  type: string,
  x?: Record<string, string | string[]>
) => void;
export type FilterSelectedPropsHistory = FilterSelectedPropsSelected[];
export interface FilterSelectedPropsStates {
  hasUndo?: boolean;
  hasRedo?: boolean;
  hasClear?: boolean;
}

export type FilterSelectedReturnProps = [
  FilterSelectedPropsSelected,
  FilterSelectedPropsHandle,
  FilterSelectedPropsStates
];

export interface FilterSelectedProviderProps {
  children?: ReactNode | ReactNode[];
}

export const FilterSelectedProvider = ({ children }: FilterSelectedProviderProps): JSX.Element => {
  const [history, setHistory] = useState<FilterSelectedPropsHistory | undefined>(undefined);
  const [current, setCurrent] = useState(0);

  const selected: FilterSelectedPropsSelected | undefined = history?.[current] || undefined;

  useEffect(() => {
    setCurrent(0);
  }, [history]);

  let hasUndo = false;
  let hasRedo = false;
  let hasClear = false;

  const count = history?.length;

  if (selected && count) {
    hasUndo = count > 0 ? true : false;
    hasRedo = current > 0 && count > 1 ? true : false;
    hasClear = hasUndo || hasRedo ? true : false;
  }

  const handleHistory: FilterSelectedPropsHandle = (type) => {
    if (type === `undo` && hasUndo) return setCurrent(current + 1);
    if (type === `redo` && hasRedo) return setCurrent(current - 1);
    if (type === `clear` && hasClear) return setHistory([]);
  };

  const handleSelect: FilterSelectedPropsHandle = (type, x) => {
    if (!x) return false;

    if (type === `set`) {
      let setItem = {};
      Object.entries(x).map(([key, val]) => {
        setItem = { ...setItem, [key]: [val] };
      });
      return setHistory(history ? [setItem, ...history] : [setItem]);
    }

    let newItem = selected ? JSON.parse(JSON.stringify(selected)) : {};

    Object.entries(x).map(([key, value]) =>
      !newItem[key]
        ? // check to see if any filters exist for this key, if not add filter
          (newItem = { ...newItem, [key]: [value] })
        : // check to see if we need to turn off the filter or not
        !newItem?.[key]?.includes(value)
        ? // turn on filter
          newItem[key].push(value)
        : // turn off filter
          newItem[key].splice(newItem[key].indexOf(value), 1)
    );

    Object.keys(newItem).map((key) => {
      if (newItem[key].length == 0) delete newItem[key];
    });

    const compare = JSON.stringify(newItem);

    if (compare === `{}`) newItem = undefined;
    setHistory(history ? [newItem, ...history] : [newItem]);
  };

  const handle = (type: string, item?: Record<string, string | string[]>) => {
    if (!item) return handleHistory(type);
    else return handleSelect(type, item);
  };

  return (
    <FilterSelectedContext.Provider value={[selected, handle, { hasUndo, hasRedo, hasClear }]}>
      {children}
    </FilterSelectedContext.Provider>
  );
};

const FilterSelectedContext = createContext<FilterSelectedReturnProps>([
  undefined,
  () => console.log('filter not set'),
  {
    hasUndo: false,
    hasRedo: false,
    hasClear: false
  }
]);

export const useFilterSelected = (): FilterSelectedReturnProps => useContext(FilterSelectedContext);

export interface SelectListItemsProviderProps {
  data: FilterSelectedReturnProps;
}

/*
  console.log('history', history)
  const handleSelect = (x: Record<string, string>) => {
    let newItem = selected ? JSON.parse(JSON.stringify(selected)) : {}
    console.log('handleSelect', x)
    Object.entries(x).map(([key, value]) =>
      !newItem[key]
        ? newItem = { ...newItem, [key]: [value] }
        : !newItem?.[key]?.includes(value) && newItem[key].push(value)
    )

    return setHistory([newItem, ...history])
  }

  const handleDeselect = (x: Record<string, string>) => {
    let newItem = selected ? JSON.parse(JSON.stringify(selected)) : {}

    Object.entries(x).map(([key, value]) =>
      newItem[key]?.includes(value) && newItem[key].splice(newItem[key].indexOf(value), 1))

    if (JSON.stringify(newItem) === `{}`) newItem = undefined

    return setHistory([newItem, ...history])
  }

  const handleToggle = (x: Record<string, string>) => {
    const newItem = selected ? JSON.parse(JSON.stringify(selected)) : {}
    let count = 0

    const selectedKeyCount = Object.entries(x).reduce((acc: boolean[], [key, value]) => {
      console.log({ key, value })
      count = count + 1

      console.log(newItem[key])
      if (newItem[key]?.includes(value)) {
        console.log('is present')
      }
      return acc = newItem[key]?.includes(value) ? [...acc, true] : acc
    }, []).length

    console.log({ selectedKeyCount, count })
    if (selectedKeyCount == 0) return handleSelect(x)
    else {
      if (selectedKeyCount < count) return handleSelect(x)
      else return handleDeselect(x)
    }
  }
  */
