import React, { useState } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip } from 'victory';

import { ChartTooltipWrapper, ChartTooltipWrapperPropsTooltip } from '../../../components';
import { GlobalChartProps } from '../Charts.types';
import {
  globalTickMarkStyles,
  globalChartStyles,
  globalBarSettings,
  globalChartHandlers,
  globalChartSettings
} from '../_helpers';

export interface BarChartProps extends GlobalChartProps {
  data?: Record<string, unknown>[];
  barRatio?: number;
}

export const BarChart = ({
  data,
  dimensions,
  colors,
  handleClick,
  checkIfSelected,
  colorScale,
  colorKey,
  barRatio,
  formatLabels,
  formatCategoryAxisLabels,
  CustomTooltip,
  domainPadding
}: BarChartProps): JSX.Element => {
  const [tooltipProps, setTooltipProps] = useState<ChartTooltipWrapperPropsTooltip | undefined>(
    undefined
  );

  const width = dimensions?.width;
  const height = dimensions?.height;

  // return empty if no data.
  // this should be checked for higher up, in case data is loading.
  // if this loads and there is no data, there should a message saying no data
  // in a parent component
  if (!data) return <></>;

  if (!width || !height) {
    console.log('Warning: Width and height not set in bar chart.  This will affect font size.');
  }

  const handleHover = (props?: Record<string, unknown>) => {
    if (!props) return setTooltipProps(undefined);
    // thanks TS
    const tProps = props as { x: number; y: number; datum?: Record<string, unknown> };
    const { x, y, datum } = tProps;
    return setTooltipProps({ x, y, datum });
  };

  return (
    <>
      {CustomTooltip && <ChartTooltipWrapper {...{ tooltipProps, CustomTooltip, handleHover }} />}
      <VictoryChart {...globalChartSettings({ width, height, domainPadding })}>
        <VictoryBar
          {...{
            data,
            style: globalChartStyles({ checkIfSelected, colors, colorScale, colorKey }),
            events: globalChartHandlers({ handleClick, handleHover }),
            labelComponent: <VictoryTooltip renderInPortal text={''} />,
            ...globalBarSettings({ barRatio, formatLabels })
          }}
        />
        <VictoryAxis dependentAxis style={{ ...globalTickMarkStyles() }} />
        <VictoryAxis tickFormat={formatCategoryAxisLabels} style={{ ...globalTickMarkStyles() }} />
      </VictoryChart>
    </>
  );
};
