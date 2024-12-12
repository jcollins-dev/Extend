import React from 'react';
import { PieChartCounterTooltipContainer } from './PieChartTooltips.elements';

export const PieChartCounterTooltip = (props: Record<string, unknown>): JSX.Element => {
  const datum = props?.datum as Record<string, unknown>;
  const className = props?.className as string;

  if (!datum) return <></>;

  const group = datum?.label;
  const count = datum?.y as string;

  return (
    <PieChartCounterTooltipContainer {...{ className }}>
      <div className="tooltip-group">{group}:</div>
      <div className="tooltip-value">{count}</div>
    </PieChartCounterTooltipContainer>
  );
};
