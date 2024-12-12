type DataItemProps = {
  [key: string]: any;
};

export type GroupKeysToArrayReturnProps = string[];

export const groupKeysToArray = (data: DataItemProps[], groupKey: string): string[] =>
  data.reduce((acc: string[], item) => {
    if (!acc.includes(item[groupKey])) acc = [...acc, item[groupKey]];
    return acc;
  }, []);
