export type RemoveStringFromObjKeyReturnProps = Record<string, unknown>[];

export const removeStringFromObjKey = <T extends Record<string, unknown>>(
  data: T[],
  itemKey: keyof T,
  stringToRemove: string
): T[] => {
  return data.reduce((acc: T[], obj: T) => {
    let newObj = { ...obj };
    let newItem = newObj[itemKey] as string;

    if (!newItem) {
      console.warn('Error in removeStringFromObjKey');
    } else if (newItem.includes(stringToRemove)) {
      newItem = newItem.replace(stringToRemove, '');
      newObj = { ...newObj, [itemKey]: newItem };
    }
    return (acc = [...acc, newObj]);
  }, []);
};
