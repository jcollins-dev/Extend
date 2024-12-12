export interface SelectListDataItemProps {
  [key: string]: any;
}

export interface SelectListGroupItemProps {
  [key: string]: { [id: string]: boolean };
}

export const generateSelectListItems = (
  data: SelectListDataItemProps[],
  groupKey: string,
  itemKey: string
): SelectListGroupItemProps =>
  data.reduce((acc, item) => {
    const groupId = item[groupKey];
    const itemId = item[itemKey];
    if (!acc[groupId]) acc = { ...acc, [groupId]: {} };
    acc[groupId] = { ...acc[groupId], [itemId]: true };
    return acc;
  }, {});
