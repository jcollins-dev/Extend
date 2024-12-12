import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { hookDemoData } from './hookDemoData';
import { defaultLabelStyles } from '../StyledCharts.styles';
import { useStyledChart } from './useStyledCharts';
import { FilterSelectedProvider } from 'components/StyledUi/FilterSelected';
import { styledTheme } from 'components/StyledUi/theme';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;

  .widget-ui--pie-chart-ui {
    max-width: 300px;
  }

  .widget-ui--bar-chart {
    width: 100%;
  }

  .widget-ui--pie-chart-ui.has-legend {
    width: 350px;
  }
`;

export default {
  title: 'V2/StyledCharts/hooks',
  component: useStyledChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof useStyledChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof useStyledChart> = (args) => {
  // this converts the api call to a smaller data set for use with pie charts.
  // this makes filtering and sorting faster.
  // it gourps all the etries by type, then adds them up and groups them together.
  // which normally adds up to less than 10 entries, rather than the entire api call.
  const Charts = () =>
    useStyledChart({
      data: hookDemoData,
      ...args
    });

  return (
    <DemoContainer className="demo-container">
      <FilterSelectedProvider>
        <Charts />
      </FilterSelectedProvider>
    </DemoContainer>
  );
};

const alarmsColors = styledTheme.charts.alarms;

const alarmsLegendItems = [
  {
    label: `A-Alarm (Critical)`,
    id: `Critical`
  },
  {
    label: `B-Alarm (Product)`,
    id: `Product Alarm`
  },
  {
    label: `C-Alarm (Warning)`,
    id: `Warning`
  }
];

export const UseStyledChartHook = Template.bind({});
UseStyledChartHook.args = {
  title: 'Stacked Bar Chart Demo',
  type: 'bar-over-time',
  groupKey: 'type',
  categoryKey: 'date',
  chartKeys: [
    {
      xKey: 'startTimestamp',
      yKey: 'duration'
    }
  ],
  useDataReturnDateRange: true,
  colors: alarmsColors,
  legendSettings: {
    items: alarmsLegendItems
  },
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;
      return [`${datum.x}: ${datum.count}`, ` \n `, `${Math.round(Number(datum.y))}%`];
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
  ]
};
