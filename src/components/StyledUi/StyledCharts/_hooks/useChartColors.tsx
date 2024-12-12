import { useState, useLayoutEffect } from 'react';

// a function that takes an id selects the html element with that id
// selects all path children in that object, gets the value of aria-label and the value of fill
// and adds the fill value to a new object with the aria-label value as the key
// returns that object

export const useChartColors = (id: string): Record<string, string> | undefined => {
  const [colorsUse, setColors] = useState<Record<string, string> | undefined>(undefined);

  const elements = document.getElementsByClassName(id);

  useLayoutEffect(() => {
    if (!elements) return;
    if (!colorsUse && elements && elements.length > 0) {
      const colors: Record<string, string> = {};
      const chart = elements[0].getElementsByTagName('svg');
      Array.from(chart).forEach((element) => {
        const paths = element.getElementsByTagName('path');
        Array.from(paths).forEach((path) => {
          const label = path.getAttribute('aria-label');
          let fill = path.getAttribute('fill');
          if (!fill) {
            const style = window.getComputedStyle(path);
            fill = style.fill;
          }
          if (label && fill) {
            colors[label] = fill;
          }
        });
      });

      setColors(colors);
    }
  }, [elements]);

  return colorsUse;
};
