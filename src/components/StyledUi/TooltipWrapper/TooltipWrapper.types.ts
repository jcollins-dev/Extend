import { ReactNode } from 'react';
import { TooltipWrapperContainerProps } from './TooltipWrapper.elements';

export type TooltipPositionProps = 'top' | 'bottom' | 'left' | 'right';
export interface TooltipWrapperProps extends TooltipWrapperContainerProps {
  /** displays in the tooltip */
  Tooltip: ReactNode | ReactNode[];
  /** control externally */
  isOpen?: boolean;
  /** use this to set position */
  tooltipPosition?: TooltipPositionProps;
}
