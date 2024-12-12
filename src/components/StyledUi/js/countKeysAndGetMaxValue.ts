export type CountKeysAndGetMaxValueDataItemProps = {
  [key: string]: any;
};

export type CountKeysAndGetMaxValueReturnProps = [{ [key: string]: number }, number];

export const getMaxValueFromObjArr = (
  data: CountKeysAndGetMaxValueDataItemProps[],
  countKey: string
): number => {
  let maxNumber = 0;

  data.reduce((acc, obj) => {
    const id = obj[countKey];
    if (!acc[id]) acc = { ...acc, [id]: 0 };
    const count = acc[id] + 1;
    if (count > maxNumber) maxNumber = count;
    return (acc = { ...acc, [id]: count }), {};
  });

  return maxNumber;
};

export const countKeysAndGetMaxValue = (
  data: CountKeysAndGetMaxValueDataItemProps[],
  countKey: string
): CountKeysAndGetMaxValueReturnProps => {
  let maxNumber = 0;
  const counter = data.reduce(
    (acc, obj) => ({ ...acc, [obj[countKey]]: (acc[obj[countKey]] || 0) + 1 }),
    {}
  );

  Object.values(counter).map((val) => {
    if (val > maxNumber) maxNumber = val;
  });

  return [counter, maxNumber];
};
