import React from 'react';
import { StackedBarChart } from '../StackedBarChart';
import { demoAlarmsData } from './demoData';
import { convertToStackedChartData } from 'components/StyledUi/js/chartDataHelpers';
import { StackedBarChartDemoContainer } from './StackedBarChartDemo.elements';
import { DimensionsContainer } from 'components/StyledUi/DimensionsContainer';
import { styledTheme } from 'components/StyledUi/theme';
import { processAlarmsData } from 'components/StyledUi/js/processAlarmsData';
import { TickProps } from 'victory-core';
import { parseISO, format } from 'date-fns';
import { FilterSelectedProvider, useFilterSelected } from 'components/StyledUi/FilterSelected';
import { StackedBarChartOverTimeTooltip } from '../StackedBarChartTooltips';

const groupKey = `type`;
const categoryKey = `date`;

const processedData = processAlarmsData(demoAlarmsData, {
  addDateAsKey: `date`,
  startTimeKey: `startTimestamp`,
  endTimeKey: `endTimestamp`
});

const stackedBarChartData =
  processedData &&
  convertToStackedChartData(processedData, groupKey, categoryKey, {
    includeCategory: true,
    includeGroup: true
  });

export const Provided = (): JSX.Element => {
  // use all of these functions for live component
  const [selected, handleSelect] = useFilterSelected();

  const handleClick = (x?: Record<string, unknown>) => {
    return handleSelect('set', {
      [groupKey]: x?.group as string,
      [categoryKey as string]: x?.category as string
    });
  };

  // for this demo, we're formatting the category tick marks to only display
  // the month and day of the alarm
  const formatCategoryAxisLabels = (props: TickProps) => {
    const date = format(parseISO(props as string), 'M-d');
    return date;
  };

  const checkIfSelected = (x: Record<string, unknown>): boolean => {
    const { category, group } = x;
    if (!selected?.[categoryKey] && !selected?.[groupKey]) return true;
    if (selected?.[categoryKey] && !selected?.[categoryKey]?.includes(category as string))
      return false;
    if (selected?.[groupKey]) {
      if (selected?.[groupKey]?.includes(group as string)) return true;
      return false;
    }
    return false;
  };

  return (
    <StackedBarChartDemoContainer>
      {/* DEMO START */}
      <DimensionsContainer
        Component={(dimensions) => (
          <StackedBarChart
            {...{
              formatCategoryAxisLabels,
              // click handler sends the group and category values to selected filter objects
              handleClick,
              // checks if item is selected by comparing the group and category values
              // to the selected filter object group and category values
              checkIfSelected,
              // the width and height of container that is typically provided by DimensionsContianer
              dimensions,
              // the converted data in the for of { [groupId]: Record<string, uknown> }
              stackedData: stackedBarChartData,
              // a key value object for colors.  the keys in the colors object should match up with the
              // value of colorKey that is set below
              colors: styledTheme.charts.alarms,
              // the key in each chartData object to use to pair up with the colors object
              colorKey: 'group',
              // a component that takes the data values of each bar for custom html formatting
              CustomTooltip: StackedBarChartOverTimeTooltip
            }}
          />
        )}
      />
      {/* DEMO END */}
    </StackedBarChartDemoContainer>
  );
};

export const StackedBarChartDemo = (): JSX.Element => {
  return (
    // in order for this demo to work, we have to have a parent that wraps StackedBarChart in a FilterSelectProvider
    <FilterSelectedProvider>
      <Provided />
    </FilterSelectedProvider>
  );
};
