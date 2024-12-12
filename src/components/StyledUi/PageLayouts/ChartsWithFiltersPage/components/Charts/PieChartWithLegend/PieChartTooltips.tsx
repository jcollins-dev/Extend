import React from 'react';
import { StackedBarChartOverTimeTooltipContainer } from './PieChartTooltips.elements';
import { format, parseISO } from 'date-fns';

export const PieChartTooltip = (props: Record<string, unknown>): JSX.Element => {
  const datum = props?.datum as Record<string, unknown>;
  const className = props?.className as string;

  if (!datum) return <></>;

  const group = datum?.group;
  const category = datum?.category ? format(parseISO(datum?.category as string), 'P') : ``;
  const count = datum?.y as string;

  return (
    <StackedBarChartOverTimeTooltipContainer {...{ className }}>
      <div className="tooltip-category">{category}</div>
      <div className="tooltip-group">{group}:</div>
      <div className="tooltip-value">{count}</div>
    </StackedBarChartOverTimeTooltipContainer>
  );
};
