import React, { ReactNode } from 'react';

import { TooltipWrapperContainer } from './TooltipWrapper.elements';
import { TooltipWrapperProps } from './';

interface Props extends TooltipWrapperProps {
  children: ReactNode | ReactNode[];
}

// TODO: Add collision detection for automatic positioning
export const TooltipWrapper = ({
  children,
  Tooltip,
  className,
  gridArea,
  top,
  bottom,
  left,
  right,
  isOpen,
  width,
  ...rest
}: Props): JSX.Element => {
  const wrapperClassName = className ? `tooltip-wrapper ${className}` : `tooltip-wrapper`;
  const tooltipClassName = `tooltip tooltip--${bottom ? `bottom` : `top`}`;
  const settings = {
    className: wrapperClassName,
    gridArea,
    top,
    bottom,
    left,
    right,
    isOpen,
    width
  };

  return (
    <TooltipWrapperContainer {...settings} {...rest}>
      {children}
      <div className={tooltipClassName}>{Tooltip}</div>
    </TooltipWrapperContainer>
  );
};
