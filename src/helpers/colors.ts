// Convert a 0-255 value to a two-digit hex number.
const byteToHex = (v: number): string =>
  v < 16 ? '0' + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);

// Convert a color to its #RRGGBB hex string.
export const toString = (rgb: number[]): string =>
  '#' + byteToHex(rgb[0]) + byteToHex(rgb[1]) + byteToHex(rgb[2]);

export const getRandomColor = (): string => {
  const rgb = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256)
  ];
  return toString(rgb);
};
