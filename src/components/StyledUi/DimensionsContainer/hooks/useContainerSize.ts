import { useState, useLayoutEffect, useCallback, RefObject } from 'react';
import { debounce } from 'lodash';

/**
 * Returns a ref that can be attached to a container element (a div, etc), and the dimensions of that element, updating on window resize
 * This can be consumed by child elements (e.g. Victory graphs) so they can re-render to best fit the space available
 */

export interface UseContainerSizeReturnProps {
  width: number;
  height: number;
  triggerResize?: () => void;
  divRef?: RefObject<HTMLDivElement>;
}

export const useContainerSize = (
  ref: RefObject<HTMLDivElement>,
  time?: number
): UseContainerSizeReturnProps => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const setDimensions = useCallback(() => {
    if (!ref) {
      return;
    } else {
      const rect = ref.current?.getBoundingClientRect();

      if (rect) {
        setWidth(Math.floor(rect.width));
        setHeight(Math.floor(rect.height));
      }
    }
  }, []);

  const debouncedSetDimensions = debounce(setDimensions, time || 300);

  useLayoutEffect(() => {
    window.addEventListener('resize', debouncedSetDimensions);

    return () => {
      window.removeEventListener('resize', debouncedSetDimensions);
    };
  }, [debouncedSetDimensions]);

  useLayoutEffect(() => {
    setDimensions();
  }, [setDimensions]);

  return {
    width,
    height,
    triggerResize: setDimensions,
    divRef: ref
  };
};

export default useContainerSize;
