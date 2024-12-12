import { useEffect, useMemo, useState } from 'react';

// Types
import { BaseType, SortState } from 'types';

// Helpers
import { getSortedData } from 'helpers';

// sortBy object should provide properties in the desired order for sorting.
// e.g., { price: 100, stock: 4 } will sort by price, then by stock
const useSort = <T extends BaseType>(sortBy: Record<string, SortState>, data?: T[]): T[] => {
  const items = useMemo(() => {
    if (!data) return [];
    else return data;
  }, [data]);
  const [sortedVals, setSortedVals] = useState<T[]>(items);

  useEffect(() => {
    setSortedVals(getSortedData<T>(sortBy, items));
  }, [sortBy, items]);

  return sortedVals;
};

export default useSort;
