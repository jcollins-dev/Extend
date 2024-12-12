// TODO - generalize it to support more than just string arrays
export const getUniqueListItems = (list: string[]): string[] => {
  return Array.from(new Set(list));
};
