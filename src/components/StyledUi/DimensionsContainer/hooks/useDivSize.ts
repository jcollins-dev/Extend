import { useState, useLayoutEffect, useCallback } from 'react';

/**
 * useDivSize: This hook gets the width and height of a div and retuns an object {width: number, height: number }
 * the dimensions will update if the container is resized and is not dependant of the window being resized.
 * This is good if the interface resizes but the window stays the same size.
 *
 * note: there is a 250ms delay to update the new dimensions
 *
 * USAGE:
 * In the component using this hook, use
 * import { useRef} from 'react'
 *
 * const Demo = () => {
 *   const divRef = useRef<HTMLDivElement>(null);
 *   const {width, height} = useDivSize(divRef)
 *
 *   return <div>width: {width} - height: {height}</div>
 * }
 */

interface RefType {
  current: HTMLElement | null;
}

export interface UseDivWidthReturnProps {
  width?: number;
  height?: number;
}

export const useDivSize = (ref?: RefType): UseDivWidthReturnProps => {
  const [dims, setDims] = useState<UseDivWidthReturnProps>({ width: undefined, height: undefined });

  const handleResize = useCallback(() => {
    let timeoutId: number | null = null;
    const delayedHandleResize = () => {
      if (ref?.current) {
        setDims({
          width: ref?.current.offsetWidth as number,
          height: ref?.current.offsetHeight as number
        });
      }
    };

    const resizeObserverCallback = () => {
      if (timeoutId !== null) clearTimeout(timeoutId);
      timeoutId = setTimeout(delayedHandleResize, 250) as unknown as number;
    };

    const resizeObserver = new ResizeObserver(resizeObserverCallback);

    if (ref?.current) resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  useLayoutEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (ref?.current) resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [handleResize, ref]);

  useLayoutEffect(() => handleResize(), [handleResize]);

  return dims;
};
