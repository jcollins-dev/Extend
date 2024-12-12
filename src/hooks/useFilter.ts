import { useEffect, useMemo, useState } from 'react';

// Types
import { BaseType, Filter } from 'types';

// Helpers
import { hasOwnPropertyNumStrArr } from 'helpers';

const getFilteredData = <T extends Record<string, unknown>>(filters: Filter[], data: T[]): T[] => {
  const filteredData = data.filter((item) => {
    return filters.some((filter) => {
      return filter.value
        ? hasOwnPropertyNumStrArr(item, filter.property) &&
            ((item[filter.property] as number | string) === filter.value ||
              (item[filter.property] as Array<number | string>).includes(filter.value))
        : true;
    });
  });

  return filteredData;
};

// TODO - Update to support filtering on properties with types other than just string and number (e.g., Array<string | number>)
const useFilter = <T extends BaseType>(filters: Filter[], data?: T[]): T[] => {
  const items = useMemo(() => {
    if (!data) return [];
    else return data;
  }, [data]);
  const [filteredVals, setFilteredVals] = useState<T[]>(items);

  useEffect(() => {
    setFilteredVals(getFilteredData<T>(filters, items));
  }, [filters, items]);

  return filteredVals;
};

export default useFilter;
