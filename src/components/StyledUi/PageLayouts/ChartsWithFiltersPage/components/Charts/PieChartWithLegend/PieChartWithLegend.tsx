import React from 'react';
import { WidgetUiProps } from 'components/StyledUi/WidgetUi';
import { PieChartLegend, PieChartLegendProps } from './PieChartLegend';
import { PieChart, PieChartProps } from '../PieChart/PieChart';
import { PieChartTooltip } from './PieChartTooltips';
import { DimensionsContainer } from 'components/StyledUi/DimensionsContainer';
/*
export interface PieChartWithLegendWidgetProps2 extends WidgetUiProps, PieChartProps {
  children?: ReactNode | ReactNode[];
  groupKey: string;
  handleClick?: (x: string) => void;
  selected?: string[];
  colors?: Record<string, string>;
  showCount?: boolean;
  legendItems?: PieChartLegendPropsItem[]
}
*/

export interface PieChartWithLegendWidgetProps extends WidgetUiProps {
  chartSettings?: PieChartProps;
  legendSettings?: PieChartLegendProps;
}

export const PieChartWithLegend = ({
  chartSettings,
  legendSettings
}: PieChartWithLegendWidgetProps): JSX.Element => {
  chartSettings = {
    ...chartSettings,
    dimensions: { width: 175, height: 175 },
    CustomTooltip: PieChartTooltip
  };

  return (
    <>
      <DimensionsContainer
        className="pie-chart-with-legend__pie-chart"
        Component={() => <PieChart {...chartSettings} />}
      />
      <div className="pie-chart-with-legend__legend">
        <PieChartLegend {...legendSettings} />
      </div>
    </>
  );
};

//
