import { useRef } from 'react';
import { getGoldenRatioColor } from 'themes';

type HookReturnValue = (id: string) => string;

/**
 * useColorMap accepts an ordered list of colors on instantiation.
 * getColorById returns colors for a given id, on a first-come-first-serve basis.
 * i.e. The first call to getColorById will return the first color in the list, and so on,
 * Caching the value, so requesting the same id will return the same color.
 *
 * If there are not enough colors in the list to fulfil all requests for a given  id,
 * it will return a random color.
 */
const useColorMap = (sourceColors: string[]): HookReturnValue => {
  // Take a copy of sourceColors so we do not directly modify the theme object
  const sourceColorsRef = useRef<string[]>([...sourceColors]);
  const colorMapRef = useRef<{ [id: string]: string }>({});
  const currentHueRef = useRef<number>(0);
  const getColorById = (id: string): string => {
    // If there is a color already defined for this id, return that
    const existingStep = colorMapRef.current[id];
    if (existingStep) {
      return existingStep;
    }

    // Otherwise, return the next unassigned color from the list
    if (sourceColorsRef.current.length > 0) {
      const nextColor = sourceColorsRef.current.shift();
      if (nextColor) {
        colorMapRef.current[id] = nextColor;
        return nextColor;
      }
    }

    // We have run out of source colors, so we return a random one
    const [randomColor, currentHue] = getGoldenRatioColor(currentHueRef.current);

    currentHueRef.current = currentHue;
    colorMapRef.current[id] = randomColor;

    return randomColor;
  };

  return getColorById;
};

export default useColorMap;
