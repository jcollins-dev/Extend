export interface FilterSelectedDataProps {
  data?: Record<string, unknown>[];
  selected?: Record<string, string[]>;
}

/**
 * CHECKS
 */
export interface CheckIfSelectedProps {
  groupKey: string;
  selected?: Record<string, string[]>;
  value: string | number;
  data?: Record<string, unknown>[];
}

export const checkIfSelected = ({ groupKey, selected, data }: CheckIfSelectedProps): boolean => {
  if (!data) return false;
  if (!selected || selected?.[groupKey]) return true;

  data.map((dataItem: Record<string, unknown>) => {
    //Object.entries(dataItem).map(
    console.log({ dataItem });
    //)
  });

  /*
  const filtered = Object.entries(selected).map(([filterKey, values]) => {
    if (values.includes(dataItem?.[filterKey] as string)) return true
    else return false
  })
  */

  //const count = filtered.filter(x => x).length

  return false; //filtered.length == count ? true : false
};

export interface CheckIfFilteredProps {
  data: Record<string, unknown>;
  selected: Record<string, string[]>;
}

export const checkIfFiltered = (
  dataItem: Record<string, unknown>,
  selected?: Record<string, string[]> | undefined
): boolean => {
  if (!selected) return true;

  const filtered = Object.entries(selected).map(([filterKey, values]) => {
    if (values.includes(dataItem?.[filterKey] as string)) return true;
    else return false;
  });

  const count = filtered.filter((x) => x).length;

  return filtered.length == count ? true : false;
};

export const filterSelectedData = ({
  data,
  selected
}: FilterSelectedDataProps): Record<string, unknown>[] | undefined => {
  if (!data) return undefined;
  if (!selected) return data;
  if (selected.searchTerm) {
    const filteredRecords = data.filter((record) =>
      Object.values(record).some((value) =>
        selected.searchTerm.some((term) => String(value).includes(term))
      )
    );

    return filteredRecords;
  }
  // loop through data to begin filtering
  else
    return data.reduce(
      (acc: Record<string, unknown>[], dataItem) =>
        (acc = checkIfFiltered(dataItem, selected) ? [dataItem, ...acc] : acc),
      []
    );
};
