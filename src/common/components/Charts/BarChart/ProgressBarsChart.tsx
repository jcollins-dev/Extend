import React, { ReactNode } from 'react';

import { BarContainer, ProgressBarsChartContainer } from './ProgressBarsChart.elements';
import { StyledUiContainerProps } from 'components';

export type ProgressBarsChartPropsData = Record<string, unknown>[];

export interface ProgressBarsChartPropsFormat {
  barTitle?: (props: Record<string, unknown>) => ReactNode | ReactNode[];
  barLabel?: (props: Record<string, unknown>) => ReactNode | ReactNode[];
}

export interface ProgressBarsChartProps extends StyledUiContainerProps {
  data?: Record<string, unknown>[];
  format?: ProgressBarsChartPropsFormat;
  // for this chart, the colors are set based on value, so the first
  // color in the array would be the lowest value bar, going from left to right
  // lowest to highest
  colors?: string[];
}

interface ProgressBarProps {
  color?: string;
  barData?: Record<string, unknown>;
  format?: ProgressBarsChartPropsFormat;
}

const ProgressBar = ({ barData, format, color }: ProgressBarProps) => {
  if (!color) return <>error: missing color</>;
  if (!barData) return <>error: missing barData</>;

  const Label = format?.barLabel ? format.barLabel(barData) : <>{barData.value}%</>;
  const Title = format?.barTitle ? format.barTitle(barData) : <>{barData.barTitle}</>;

  return (
    <BarContainer {...{ color, value: Number(barData?.value) || 0 }}>
      <div className="progress-bars-chart__bar-col">
        {Title && <div className="progress-bars-chart__bar-title">{Title}</div>}
        <div className="progress-bars-chart__bar">
          {Label && <div className="progress-bars-chart__bar-label">{Label}</div>}
        </div>
      </div>
    </BarContainer>
  );
};

export const ProgressBarsChart = ({
  className,
  data,
  format,
  colors
}: ProgressBarsChartProps): JSX.Element => {
  className = className ? `progress-bars-chart ${className}` : `progress-bars-chart`;

  if (!data) return <>error: missing data</>;

  const count = data.length;

  // sort the values to display lowest to highest
  data = data.sort((a, b) => {
    if (!a.value || !b.value) return 0;
    return Number(a.value) - Number(b.value);
  });

  return (
    <ProgressBarsChartContainer {...{ className, count }}>
      {data.map((barData, i) => {
        const value = barData?.value as number;
        if (!value) return <div key={i}>error, no value</div>;
        return <ProgressBar key={i} {...{ barData, format, color: colors?.[i] }} />;
      })}
    </ProgressBarsChartContainer>
  );
};
