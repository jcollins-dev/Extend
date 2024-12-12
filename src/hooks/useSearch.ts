import { useEffect, useMemo, useState } from 'react';

// Types
import { BaseType } from 'types';

// Helpers
import { hasOwnPropertyString } from 'helpers';

const getSearchedData = <T extends Record<string, unknown>>(
  searchVal: string,
  data: T[],
  propNames?: string[]
): T[] => {
  const searchedData = data.filter((item) => {
    // If properties to search by are provided
    if (propNames) {
      // Keep the ones that have any of the property names and a match for at least one.
      return propNames.some(
        (prop) =>
          hasOwnPropertyString(item, prop) &&
          item[prop]?.toLowerCase().trim().includes(searchVal.trim().toLowerCase())
      );
    } else {
      // Otherwise, it is just a do it by all properties
      return Object.keys(item).filter(
        (prop) =>
          hasOwnPropertyString(item, prop) &&
          item[prop]?.toLowerCase().trim().includes(searchVal.trim().toLowerCase())
      );
    }
  });

  return searchedData;
};

// TODO - Update this to call the backend, passing URL params for search, filter, and sort
// The propNames should be a variable that is not redeclared on render (i.e. either a constant or something that is controlled by a state variable with useState)
const useSearch = <T extends BaseType>(
  searchValue: string,
  data?: T[],
  propNames?: string[]
): T[] => {
  const items = useMemo(() => {
    if (!data) return [];
    else return data;
  }, [data]);

  const [searchedVals, setSearchedVals] = useState<T[]>(items);

  useEffect(() => {
    setSearchedVals(getSearchedData<T>(searchValue, items, propNames));
  }, [searchValue, items, propNames]);

  return searchedVals;
};

export default useSearch;
