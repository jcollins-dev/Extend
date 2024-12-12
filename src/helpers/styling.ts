/**
 * Converts the given number of rem to pixels. 
 * Defaults to 16px per rem if it can't retrieve the actual browser default.
 * 
 * @param rem number of rem to convert to pixels
 * @returns pixel equivalent to the supplied rem
 */

export function convertRemToPixels(rem: number): number {    
  let baseFontSize = 16;
  const docBaseFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  if (!isNaN(docBaseFontSize))
    baseFontSize = docBaseFontSize;
  
  return rem * baseFontSize;
}