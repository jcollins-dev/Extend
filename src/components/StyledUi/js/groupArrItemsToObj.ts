import { JsDataItemProps } from './types';

export type GroupArrItemsToObjReturnProps = {
  [key: string]: { [key: string]: unknown }[];
};

export const groupArrItemsToObj = (
  data: JsDataItemProps[],
  groupKey: string
): GroupArrItemsToObjReturnProps =>
  data.reduce((acc, item: JsDataItemProps) => {
    const groupId = item[groupKey];
    if (!acc[groupId]) acc = { ...acc, [groupId]: [] };
    acc[groupId] = [...acc[groupId], item];
    return acc;
  }, {});
