import { SelectListGroupItemProps } from '../js/selectListHelpers';

export interface UseSelectListCounterItemProps {
  [key: string]: number;
}

export interface UseSelectListCounterGroupProps {
  [key: string]: UseSelectListCounterItemProps;
}

export interface UseSelectListCounterReturnProps {
  groupTotals: UseSelectListCounterItemProps;
  itemTotals: UseSelectListCounterItemProps;
}

export const useSelectListCounter = (
  selected: SelectListGroupItemProps
): UseSelectListCounterReturnProps => {
  let groupTotals: UseSelectListCounterItemProps = {};
  let itemTotals: UseSelectListCounterItemProps = {};

  Object.entries(selected).map(([groupId, items]) => {
    const itemsTotal = Object.keys(items).length;
    if (!groupTotals[groupId]) groupTotals = { ...groupTotals, [groupId]: itemsTotal };

    Object.entries(items).map(([itemId, val]) => {
      if (!itemTotals[itemId]) itemTotals = { ...itemTotals, [itemId]: 0 };
      if (val) itemTotals[itemId] = itemTotals[itemId] + 1;
    });
  });

  return { groupTotals, itemTotals };
};
