import { FilterSelectedPropsSelected } from '../hooks/useFilterSelected';

export interface CheckIfSelectedProps {
  selected?: FilterSelectedPropsSelected;
  groupKey: string;
  itemKey: string;
  item: string;
  group: string;
}

export const checkIfSelected = ({
  selected,
  groupKey,
  itemKey,
  item,
  group
}: CheckIfSelectedProps): boolean => {
  //console.log({ item, group, selected, groupKey, itemKey });
  let isSelected = !selected ? true : false;

  if (isSelected) return true;

  if (
    selected?.[itemKey] &&
    selected?.[groupKey] &&
    selected?.[groupKey]?.includes(group) &&
    selected?.[itemKey]?.includes(item)
  ) {
    isSelected = true;
  }

  if (!selected?.[itemKey] && selected?.[groupKey] && selected?.[groupKey]?.includes(group))
    isSelected = true;
  if (!selected?.[groupKey] && selected?.[itemKey] && selected?.[itemKey]?.includes(item))
    isSelected = true;

  /*
  if (selected?.[groupKey] || selected?.[itemKey]) {
    if (!selected?.[itemKey] && selected[groupKey]?.includes(group)) isSelected = false
    else if (selected[itemKey]?.includes(item) && selected[groupKey]?.includes(group)) isSelected = true
  }
  */

  return isSelected;
};
