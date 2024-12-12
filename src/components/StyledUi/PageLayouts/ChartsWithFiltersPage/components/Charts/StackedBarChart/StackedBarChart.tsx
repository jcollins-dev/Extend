import React, { useState } from 'react';
import { VictoryBar, VictoryChart, VictoryStack, VictoryAxis } from 'victory';
import { useDateRange } from 'components/StyledUi/DateRange';
import { ChartTooltipWrapper, ChartTooltipWrapperPropsTooltip } from '../../../components';
import { GlobalChartProps, StackedChartPropsData } from '../Charts.types';
import {
  globalTickMarkStyles,
  globalChartStyles,
  globalBarSettings,
  globalChartHandlers,
  globalChartSettings
} from '../_helpers';
import { generateDateRangeCategoriesAsDate } from '../../../helpers/chartDataHelpers';

export interface StackedBarChartProps extends GlobalChartProps {
  stackedData?: StackedChartPropsData;
}

export const StackedBarChart = ({
  stackedData,
  dimensions,
  colors,
  handleClick,
  checkIfSelected,
  colorScale,
  colorKey,
  barRatio,
  formatLabels,
  formatCategoryAxisLabels,
  CustomTooltip
}: StackedBarChartProps): JSX.Element => {
  const [tooltipProps, setTooltipProps] = useState<ChartTooltipWrapperPropsTooltip | undefined>(
    undefined
  );

  const { dateRange, timeZone } = useDateRange();
  const { startTime, endTime } = dateRange;

  const width = dimensions?.width;
  const height = dimensions?.height;

  // return empty if no data.
  // this should be checked for higher up, in case data is loading.
  // if this loads and there is no data, there should a message saying no data
  // in a parent component
  if (!stackedData) return <></>;

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

  const ticks = generateDateRangeCategoriesAsDate({ startTime, endTime, timeZone });
  const count = ticks?.length;

  return (
    <>
      {CustomTooltip && <ChartTooltipWrapper {...{ tooltipProps, CustomTooltip, handleHover }} />}
      <VictoryChart
        {...globalChartSettings({ width, height, count })}
        padding={{
          top: 30,
          left: 50,
          right: 30,
          bottom: 50
        }}
      >
        <VictoryStack>
          {Object.entries(stackedData).map(([id, data]) => {
            return (
              <VictoryBar
                key={id}
                {...{
                  data,
                  id: `bar-${id}`,
                  style: globalChartStyles({ checkIfSelected, colors, colorScale, colorKey }),
                  events: globalChartHandlers({ handleClick, handleHover }),
                  ...globalBarSettings({ barRatio, formatLabels, width, height, count })
                }}
              />
            );
          })}
        </VictoryStack>
        <VictoryAxis
          fixLabelOverlap
          scale={{ x: 'time' }}
          tickValues={ticks}
          tickFormat={formatCategoryAxisLabels}
          style={{ ...globalTickMarkStyles() }}
        />
        <VictoryAxis dependentAxis style={{ ...globalTickMarkStyles() }} />
      </VictoryChart>
    </>
  );
};

/*

        */
