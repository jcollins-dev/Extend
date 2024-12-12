// 3rd party
import mapKeys from 'lodash/mapKeys';
import camelCase from 'lodash/camelCase';
import { snakeCase } from 'lodash';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import mapValues from 'lodash/mapValues';

// Types
import { BaseType, SortState } from 'types';

export const hasOwnPropertyString = <X extends Record<string, unknown>, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, string> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const hasOwnPropertyNumStrArr = <X extends Record<string, unknown>, Y extends PropertyKey>(
  obj: X,
  prop: Y
): obj is X & Record<Y, number | string | Array<number | string>> => {
  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const mapKeysDeep = (
  object: BaseType[] | BaseType,
  iteratee?: (value: unknown, key: string) => string
): BaseType[] | BaseType => {
  if (isArray(object)) {
    return object.map((innerObj: BaseType) => mapKeysDeep(innerObj, iteratee)) as BaseType[];
  } else if (isObject(object)) {
    return mapValues(mapKeys(object, iteratee), (val: BaseType[] | BaseType) =>
      mapKeysDeep(val, iteratee)
    );
  } else {
    return object;
  }
};

export const getSortedData = <T extends Record<string, unknown>>(
  sortBy: Record<string, SortState>,
  data: T[]
): T[] => {
  const sortedData = [...data];

  Object.keys(sortBy).forEach((sortProp) => {
    sortedData.sort((a, b) => {
      if (hasOwnPropertyNumStrArr(a, sortProp) && hasOwnPropertyNumStrArr(b, sortProp)) {
        const aVal = (a[sortProp] as number | string | undefined)?.toString().trim();
        const bVal = (b[sortProp] as number | string | undefined)?.toString().trim();
        const isAscending = sortBy[sortProp] === SortState.ascending;
        const isDescending = sortBy[sortProp] === SortState.descending;

        if (aVal && bVal) {
          // Perform natural sort via localeCompare, adapted from https://stackoverflow.com/a/38641281
          const compareOptions = {
            numeric: true, // true: "1", "2", "100" sort as numbers; false: "1", "100", "2" sort as strings
            sensitivity: 'base' // 'base': case insensitive; see https://www.techonthenet.com/js/string_localecompare.php
          };
          return isAscending
            ? aVal.localeCompare(bVal, undefined, compareOptions)
            : isDescending
            ? bVal.localeCompare(aVal, undefined, compareOptions)
            : 0;
        } else if (aVal) {
          // If only a has the property
          return isAscending ? 1 : isDescending ? -1 : 0;
        } else if (bVal) {
          // If only b has the property
          return isAscending ? -1 : isDescending ? 1 : 0;
        }
        return 0;
      } else {
        return 0;
      }
    });
  });

  return sortedData;
};

export const camelCaseKeysDeep = <X extends BaseType>(obj: X): BaseType | BaseType[] =>
  mapKeysDeep(obj, (_value, key) => camelCase(key));

export const snakeCaseKeysDeep = <X extends BaseType | BaseType[] | null>(
  obj: X
): BaseType | BaseType[] | null => (obj ? mapKeysDeep(obj, (_value, key) => snakeCase(key)) : null);
