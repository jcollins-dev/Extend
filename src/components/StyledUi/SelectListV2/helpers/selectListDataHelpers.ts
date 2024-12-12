import {
  SelectListGroupItemProps,
  SelectListItemProps,
  SelectListDataItemProps
} from '../SelectList.types';

export * from './countGroupSelectItems';

// This function generates grouped select list items based on the provided data
// it looops through the data and groups data items by groupKey, then adds items
// to each group based on the itemKey
export const generateGroupedSelectListItems = (
  data: Record<string, unknown>[], // An array of data items used to generate the select list
  groupKey?: string, // The key used to group the select list items
  itemKey?: string, // The key used to identify the individual select list items
  startUnselected?: boolean // Whether or not to start with the items unselected
): SelectListGroupItemProps =>
  !groupKey || !itemKey
    ? {}
    : // Use the reduce function to iterate over each data item and generate the select list items
      data.reduce((acc: SelectListGroupItemProps, item: Record<string, unknown>) => {
        // Get the group ID and item ID for the current data item
        const groupId = item[groupKey] as string;
        const itemId = item[itemKey] as string;
        // If the group doesn't exist yet, create it
        if (!acc[groupId]) acc = { ...acc, [groupId]: {} };
        // Set the value for the item ID in the current group based on whether or not it should be unselected to start
        acc[groupId] = { ...acc[groupId], [itemId]: !startUnselected };
        // Return the updated accumulator
        return acc;
      }, {});

// This function generates select list items based on the provided data
export const generateSelectListItems = (
  data: Record<string, unknown>[], // An array of data items used to generate the select list
  groupKey: string, // The key used to group the select list items
  startUnselected?: boolean // Whether or not to start with the items unselected
): SelectListItemProps =>
  // Use the reduce function to iterate over each data item and generate the select list items
  data.reduce((acc: SelectListItemProps, item: Record<string, unknown>) => {
    // Get the group ID for the current data item
    const groupId = item[groupKey] as string;
    // If the group doesn't exist yet, create it
    if (!acc[groupId]) acc = { ...acc, [groupId]: !startUnselected };
    // Return the updated accumulator
    return acc;
  }, {});

// This function gets the selected groups from the provided select list data
// returns an array with the value of the items groupKey.
// if nothing in that group is selected, the value of the items groupKey is not added
// this is used in pie charts or to see if any item in a group is selected
export const getSelectedGroups = (data?: SelectListGroupItemProps): string[] =>
  !data
    ? [] // If no data is provided, return an empty array
    : // Otherwise, use the reduce function to iterate over each group and determine if it has any selected items
      // start looping through data
      Object.entries(data).reduce(
        // loop through data item (object)
        (acc: string[], [groupId, items]) =>
          // check if anything of the items in this group are selected
          (acc = Object.values(items).filter((x) => x).length ? [...acc, groupId] : acc),
        []
      );

// Filters the data aray by selected keys
export const filterDataBySelectedItems = (
  groupKey?: string,
  itemKey?: string,
  data?: SelectListDataItemProps[],
  selected?: SelectListGroupItemProps
): SelectListDataItemProps[] =>
  !data || !selected || !groupKey || !itemKey
    ? [] // If either data or selected is undefined or null, return an empty array.
    : // Otherwise, iterate over the data array.
      data.reduce((acc: SelectListDataItemProps[], item: SelectListDataItemProps) => {
        // Get the group ID for the current item.
        const groupId = item[groupKey] as string;
        // Get the item ID for the current item.
        const itemId = item[itemKey] as string;
        // If the current item is selected, add it to the array. Otherwise, return the existing array without current item.
        return (acc = selected?.[groupId]?.[itemId] ? [item, ...acc] : acc);
      }, []);

export const searchForString = (
  data: Record<string, unknown>[],
  searchTerm?: string
): Record<string, unknown>[] =>
  !searchTerm
    ? data
    : data.filter((item) =>
        Object.values(item).some(
          (value) => value && `${value}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

export const searchForStringAndGetSelected = (
  groupKey: string,
  itemKey: string,
  data: Record<string, unknown>[],
  searchTerm: string
): SelectListGroupItemProps | undefined => {
  let hasSelected = false;
  let selected: SelectListGroupItemProps = {};

  data.map((item: Record<string, unknown>) => {
    const groupId = item[groupKey] as string;
    const itemId = item[itemKey] as string;
    Object.values(item).map((val: unknown) => {
      const value = `${val}`.toLowerCase();
      const term = `${searchTerm}`.toLowerCase();
      const hasTerm = value.includes(term);
      if (hasTerm) hasSelected = true;
      if (!selected[groupId]) selected = { ...selected, [groupId]: {} };
      if (!selected[groupId][itemId])
        selected[groupId] = { ...selected[groupId], [itemId]: hasTerm };
    });
  });

  return hasSelected ? selected : undefined;
};

export const searchForStringAndGetSelectedV1 = (
  groupKey: string,
  itemKey: string,
  data: Record<string, unknown>[],
  searchTerm: string
): SelectListGroupItemProps =>
  data.reduce((acc: SelectListGroupItemProps, item) => {
    const groupId = item[groupKey] as string;
    const itemId = item[itemKey] as string;
    const hasTerm =
      Object.values((item: unknown) => {
        const yes = `${item}`.toLowerCase().includes(searchTerm.toLowerCase());
        console.log({ item, yes });
      }).filter((x) => x).length > 0;
    if (!acc[groupId]) acc = { ...acc, [groupId]: {} };
    if (!acc[groupId][itemId]) acc[groupId] = { ...acc[groupId], [itemId]: hasTerm };
    return acc;
  }, {});
