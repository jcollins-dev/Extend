import React from 'react';
import { BarChartCounterTooltipContainer } from './BarChartTooltips.elements';

export const BarChartCounterTooltip = (props: Record<string, unknown>): JSX.Element => {
  const datum = props?.datum as Record<string, unknown>;
  const className = props?.className as string;

  if (!datum) return <></>;

  const group = datum?.label as string;
  const count = datum?.y as string;

  return (
    <BarChartCounterTooltipContainer {...{ className }}>
      <div className="tooltip-group">{group}:</div>
      <div className="tooltip-value">{count}</div>
    </BarChartCounterTooltipContainer>
  );
};
