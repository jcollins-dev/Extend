type DataProps = Record<string, unknown>;

export type CountGroupSelectItemProps = Record<string, number>;
export type CountGroupSelectReturnProps = Record<string, CountGroupSelectItemProps> | undefined;

export const countGroupSelectItems = (
  groupKey: string,
  itemKey: string,
  data?: DataProps[]
): CountGroupSelectReturnProps => {
  if (!data) {
    console.warn(`Error in countGroupSelectItems.ts:
    no 'data' to process.
    `);
    return undefined;
  }

  const counter = data.reduce((acc: Record<string, CountGroupSelectItemProps>, item: DataProps) => {
    const groupId = item[groupKey] as string;
    const itemId = item[itemKey] as string;

    if (!acc[groupId]) acc = { ...acc, [groupId]: {} };
    if (!acc[groupId][itemId]) acc[groupId] = { ...acc[groupId], [itemId]: 0 };

    acc[groupId][itemId] = acc[groupId][itemId] + 1;

    return acc;
  }, {});

  return counter;
};
