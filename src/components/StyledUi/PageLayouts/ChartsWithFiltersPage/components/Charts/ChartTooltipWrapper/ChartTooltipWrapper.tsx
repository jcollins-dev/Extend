import React from 'react';
import { ChartTooltipWrapperContainer } from './ChartTooltipWrapper.elements';
import { StyledUiContainerProps } from 'components';

export interface ChartTooltipWrapperProps extends StyledUiContainerProps {
  datum?: Record<string, unknown>;
}

export interface ChartTooltipWrapperPropsTooltip extends ChartTooltipWrapperProps {
  x: number;
  y: number;
}

export type CustomTooltipProps = (props: Record<string, unknown>) => JSX.Element;

export interface ChartTooltipWrapperProps extends StyledUiContainerProps {
  tooltipProps?: ChartTooltipWrapperPropsTooltip;
  CustomTooltip?: CustomTooltipProps;
  handleHover?: (x?: Record<string, unknown>) => void;
}

export const ChartTooltipWrapper = ({
  tooltipProps,
  CustomTooltip,
  handleHover
}: ChartTooltipWrapperProps): JSX.Element => {
  if (!CustomTooltip) return <></>;

  const x = tooltipProps?.x as number;
  const y = tooltipProps?.y as number;
  const datum = tooltipProps?.datum;

  return (
    <ChartTooltipWrapperContainer
      onMouseEnter={() => handleHover?.(undefined)}
      pos={tooltipProps ? { x, y } : undefined}
    >
      <CustomTooltip className="tooltip-inner" {...{ datum }} />
    </ChartTooltipWrapperContainer>
  );
};
