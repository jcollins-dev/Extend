/**
 * Capitalize the first character of a string.
 */
export const capitalizeFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Add a zero to numbers less than 10
 */
export const digitLeadingZero = (num: number): string => {
  const symbol = num < 0 ? '-' : '';
  const str = `${Math.abs(num)}`.padStart(2, '0');
  return `${symbol}${str}`;
};

/**
 * Replace underscores with spaces and capitalize the first letter of the first word
 */
export const unUnderscore = (underscored: string): string => {
  return capitalizeFirst(underscored.replaceAll('_', ' ').toLocaleLowerCase());
};

/**
 * Add quotes to a string
 */
export const addQuotes = (str: string): string => {
  return `"${str.replaceAll('"', '""')}"`;
};
export const onlyLettersAndNumbers = (str: string): boolean => {
  return /^[A-Za-z0-9]*$/.test(str);
};
export const onlyLettersAndSpace = (str: string): boolean => {
  return /(^[A-Za-z]+[? ]?[A-Za-z]*)$/.test(str) || str === '';
};
