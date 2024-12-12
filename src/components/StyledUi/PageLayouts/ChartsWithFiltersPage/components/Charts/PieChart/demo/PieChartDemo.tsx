import React from 'react';
import { PieChart } from '../PieChart';
import { demoAlarmsData } from './demoData';
import { convertToChartData } from 'components/StyledUi/js/chartDataHelpers';
import { PieChartDemoContainer } from './PieChartDemo.elements';
import { DimensionsContainer } from 'components/StyledUi/DimensionsContainer';
import { styledTheme } from 'components/StyledUi/theme';

import { FilterSelectedProvider, useFilterSelected } from 'components/StyledUi/FilterSelected';
import { PieChartCounterTooltip } from '../PieChartTooltips';

const groupKey = `type`;

const PieChartData =
  demoAlarmsData &&
  convertToChartData(demoAlarmsData, groupKey, { addLabelKey: true, calculatePercents: true });

export const Provided = (): JSX.Element => {
  // use all of these functions for live component
  const [selected, handleSelect] = useFilterSelected();

  const handleClick = (x?: Record<string, unknown>) => {
    return handleSelect('set', {
      [groupKey]: x?.group as string
    });
  };

  const checkIfSelected = (x: Record<string, unknown>): boolean => {
    const { group } = x;
    if (!selected) return true;
    if (selected?.[groupKey]) {
      if (selected?.[groupKey]?.includes(group as string)) return true;
      return false;
    }
    return false;
  };

  return (
    <PieChartDemoContainer>
      {/* DEMO START */}
      <DimensionsContainer
        Component={(dimensions) => (
          <PieChart
            {...{
              // click handler sends the group and category values to selected filter objects
              handleClick,
              // checks if item is selected by comparing the group and category values
              // to the selected filter object group and category values
              checkIfSelected,
              // the width and height of container that is typically provided by DimensionsContianer
              dimensions,
              // the converted data in the for of { [groupId]: Record<string, uknown> }
              data: PieChartData,
              // a key value object for colors.  the keys in the colors object should match up with the
              // value of colorKey that is set below
              colors: styledTheme.charts.alarms,
              // the key in each chartData object to use to pair up with the colors object
              colorKey: 'label',
              // a component that takes the data values of each bar for custom html formatting
              CustomTooltip: PieChartCounterTooltip,
              // since there are only 3 bars, we're going to increase the domainPadding and barRatio
              domainPadding: 150,
              barRatio: 0.8
            }}
          />
        )}
      />
      {/* DEMO END */}
    </PieChartDemoContainer>
  );
};

export const PieChartDemo = (): JSX.Element => {
  return (
    // in order for this demo to work, we have to have a parent that wraps PieChart in a FilterSelectProvider
    <FilterSelectedProvider>
      <Provided />
    </FilterSelectedProvider>
  );
};
