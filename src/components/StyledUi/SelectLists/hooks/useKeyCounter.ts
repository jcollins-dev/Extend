export type UseKeyCounterDataItemProps = {
  [key: string]: any;
};

export type UseKeyCounterReturnProps = [{ [key: string]: number }, number];

export const useKeyCounter = (
  data: UseKeyCounterDataItemProps[],
  countKey: string
): UseKeyCounterReturnProps => {
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
