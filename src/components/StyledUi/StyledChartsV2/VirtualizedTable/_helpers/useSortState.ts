import { useState } from 'react';

interface UseSortStatePropsState {
  dataKey: string;
  direction: string;
}

export type UseSortStateProps = UseSortStatePropsState[] | undefined;

export type UseSortStateContextReturnPropsHandle = (dataKey: string) => void;
export type UseSortStateContextReturnPropsSort = UseSortStatePropsState[] | undefined;
export type UseSortStateContextReturnProps = [
  UseSortStateContextReturnPropsHandle,
  UseSortStateContextReturnPropsSort
];

export const useSortState = (defaultStates?: UseSortStateProps): UseSortStateContextReturnProps => {
  // an array of sortkeys, used to filter in the order they were clicked.
  // clearing a filter removes it from the array
  const [sort, setSort] = useState<UseSortStateContextReturnPropsSort>(defaultStates);

  const handle: UseSortStateContextReturnPropsHandle = (dataKey) => {
    if (sort?.[0].dataKey === dataKey) {
      if (sort[0].direction === 'down') return setSort([{ dataKey, direction: 'up' }]);
      setSort([{ dataKey, direction: 'down' }]);
    } else return setSort([{ dataKey, direction: 'down' }]);

    /*  PLEASE KEEP THIS FOR LATER, I WANTED TO IMPLIMENT MULTIPLE SORTS AT ONCE
    if (!sort) return setSort([{ dataKey, direction: 'down' }]);

    const existingIndex = sort.findIndex((obj) => obj.dataKey === dataKey);

    if (existingIndex !== -1) {
      // DataKey already exists in the sort array
      const existingItem = { ...sort[existingIndex] };
      const updatedSort = [...sort];

      existingItem.direction = existingItem.direction === 'down' ? 'up' : 'down';

      updatedSort.unshift(existingItem);
      return setSort(updatedSort);
    } else {
      // DataKey is new, add it to the beginning of the array
      const newItem = {
        dataKey,
        direction: 'down'
      };

      return setSort([newItem, ...sort]);
    }
    */
  };

  return [handle, sort];
};

export interface SortByKeyProps {
  data?: Record<string, unknown>[];
  sortKeys?: UseSortStatePropsState[];
}

const isNumericDigit = (char: string | number) =>
  !isNaN(Number(char)) && !isNaN(parseInt(char as string, 10));

// sortKeys is an array of objects that contain the dataKey and direction
// dataKey is the key of the data to sort by  (e.g. 'name')
// direction is the direction to sort by (e.g. 'up' or 'down')
export const sortByKey = ({
  data,
  sortKeys
}: SortByKeyProps): Record<string, unknown>[] | undefined => {
  if (!data) return undefined;
  if (!sortKeys) return data;

  // make a copy of data to not affect the origional array
  const newData = [...data].sort((a, b) => {
    for (let i = 0; i < sortKeys.length; i++) {
      const { dataKey, direction } = sortKeys[i];
      const valueA = a[dataKey as string];
      const valueB = b[dataKey as string];

      // Check if the values are numbers
      const isNumeric = typeof valueA === 'number' && typeof valueB === 'number';
      if (isNumeric) {
        if (valueA < valueB) {
          return direction === 'down' ? -1 : 1;
        }
        if (valueA > valueB) {
          return direction === 'down' ? 1 : -1;
        }
      } else {
        // If the values are not numbers, convert them to strings and perform a string comparison
        const strValueA = String(valueA);
        const strValueB = String(valueB);
        let compareResult = 0;
        for (let j = 0; j < Math.min(strValueA.length, strValueB.length); j++) {
          const charA = strValueA[j];
          const charB = strValueB[j];

          if (charA !== charB) {
            const isNumericA = isNumericDigit(charA);
            const isNumericB = isNumericDigit(charB);

            if (isNumericA && isNumericB) {
              // Both characters are numeric, compare them numerically
              compareResult = parseInt(charA, 10) - parseInt(charB, 10);
            } else if (isNumericA) {
              // Only charA is numeric, so it should come before charB
              compareResult = -1;
            } else if (isNumericB) {
              // Only charB is numeric, so it should come before charA
              compareResult = 1;
            } else {
              // Neither character is numeric, perform a regular string comparison
              compareResult = charA.localeCompare(charB);
            }

            break;
          }
        }

        if (compareResult !== 0) {
          return direction === 'down' ? -compareResult : compareResult;
        }
      }
    }

    return 0;
  });

  return newData;
};

export const sortByKey2 = ({
  data,
  sortKeys
}: SortByKeyProps): Record<string, unknown>[] | undefined => {
  if (!data) return undefined;
  if (!sortKeys) return data;

  const newData = [...data].sort((a, b) => {
    for (let i = 0; i < sortKeys.length; i++) {
      const { dataKey, direction } = sortKeys[i];
      const valueA = String(a[dataKey as string]);
      const valueB = String(b[dataKey as string]);

      const compareResult = valueA.localeCompare(valueB);
      if (compareResult !== 0) {
        return direction === 'down' ? -compareResult : compareResult;
      }
    }

    return 0;
  });

  return newData;
};
