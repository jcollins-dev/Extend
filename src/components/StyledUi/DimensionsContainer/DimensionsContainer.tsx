import React, { useRef, FC } from 'react';
import { useContainerSize, UseContainerSizeReturnProps } from './hooks/useContainerSize';

import {
  DimensionsContainerWrapper,
  DimensionsContainerWrapperProps
} from './DimensionsContainer.elements';

/** ************************************************************************************
 *
 * DimensionsContainer uses the useRef hook to create a reference to a div element that will be attached
 *  to the DimensionsContainerWrapper. This reference is used to track the size of the container.
 *
 *  Then, the useContainerSize hook is used to get the width, height, triggerResize, and divRef properties.
 *  This hook calculates the size of the container based on the size of its parent element.
 *
 *  The className property is added to the base class dimensions-container if it exists.
 * Finally, the DimensionsContainerWrapper is rendered with the divRef and Component with the width and height props.
 *
 *************************************************************************************** */
export type DimensionsContainerReturnProps = FC<UseContainerSizeReturnProps>;

export interface DimensionsContainerProps extends DimensionsContainerWrapperProps {
  Component: DimensionsContainerReturnProps;
  className?: string;
  gridArea?: string;
  debounce?: number;
  isDoughnut?: boolean;
}
const baseClass = `dimensions-container`;

export const DimensionsContainer = ({
  Component,
  className,
  gridArea,
  debounce,
  dims,
  isDoughnut
}: DimensionsContainerProps): JSX.Element => {
  // Create a ref that will be attached to the DimensionsContainerWrapper to track the size of the container
  const newRef = useRef<HTMLDivElement>(null);

  // Use the useContainerSize hook to get the width and height of the container
  const { width, height, triggerResize, divRef } = useContainerSize(newRef, debounce || 150);

  // Add the base class to the className if it exists
  className = className ? `${baseClass} ${className}` : baseClass;

  // Render the DimensionsContainerWrapper with the divRef and the Component with the width and height props
  return (
    <DimensionsContainerWrapper ref={newRef} {...{ className, gridArea, dims, isDoughnut }}>
      <Component {...{ width, height, triggerResize, divRef }} />
    </DimensionsContainerWrapper>
  );
};
