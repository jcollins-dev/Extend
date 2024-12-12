import { useState, useLayoutEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

/**
 * Returns a ref that can be attached to a container element (a div, etc), and the dimensions of that element, updating on window resize
 * This can be consumed by child elements (e.g. Victory graphs) so they can re-render to best fit the space available
 */
const useContainerSize = (): {
  containerRef: React.RefObject<HTMLDivElement>;
  width: number;
  height: number;
  triggerResize: () => void;
} => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);

  const setDimensions = useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    setWidth(Math.floor(rect.width));
    setHeight(Math.floor(rect.height));
  }, []);

  const debouncedSetDimensions = debounce(setDimensions, 300);

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
    containerRef,
    width,
    height,
    triggerResize: setDimensions
  };
};

export default useContainerSize;
