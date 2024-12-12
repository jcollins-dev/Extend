// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEnumName = (enumType: Record<string, any>, enumValue: string): string => {
  const enumKey = Object.keys(enumType).find((key) => enumType[key] === enumValue);
  return enumKey ? enumKey.replace(/-/g, ' ') : '';
};
