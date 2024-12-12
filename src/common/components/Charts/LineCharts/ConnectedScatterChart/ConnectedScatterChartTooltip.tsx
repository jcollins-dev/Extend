import React, { useContext } from 'react';
import { TooltipContext } from '../../ChartTooltipWrapper/ChartTooltipWrapper';
import { ConnectedScatterChartTooltipContainer } from './ConnectedScatterChartTooltip.elements';

export interface ChartTooltipWrapperProps {
  width?: number;
  height?: number;
  axisMargins?: {
    t?: number;
    r?: number;
    b?: number;
    l?: number;
  };
  TooltipComponent?: (props: Record<string, unknown>) => JSX.Element;
}

export const ConnectedScatterChartTooltip = ({
  TooltipComponent,
  ...rest
}: ChartTooltipWrapperProps): JSX.Element => {
  if (!TooltipComponent) return <></>;

  const { tooltip } = useContext(TooltipContext);

  if (!tooltip?.left || !tooltip?.top) return <></>;

  return (
    <ConnectedScatterChartTooltipContainer
      {...{ left: `${tooltip?.left}px`, top: `${tooltip?.top}px` }}
      className="chart-tooltip"
    >
      <div className="chart-tooltip__content-wrapper">
        <div className="chart-tooltip__content">
          <TooltipComponent {...tooltip} {...rest} />
        </div>
        <div className="chart-tooltip__arrow"></div>
      </div>
    </ConnectedScatterChartTooltipContainer>
  );
};
