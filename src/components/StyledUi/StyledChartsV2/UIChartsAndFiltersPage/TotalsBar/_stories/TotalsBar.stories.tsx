import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { TotalsBar } from '../TotalsBar';
import { demoData } from './demoData';
import { convertSecondsToTime } from 'components/StyledUi/js';
export default {
  title: 'V2/StyledCharts/TotalsBar',
  component: TotalsBar,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof TotalsBar>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof TotalsBar> = (args) => {
  // const chartData = convertToStackedChartData(barChartDemoData as Record<string, unknown>[], 'code', 'date')

  return <TotalsBar {...args} data={demoData} />;
};

export const Demo = Template.bind({});
Demo.args = {
  groupKey: 'type',
  groupKeys: ['type', 'code'],
  valueKey: 'duration',
  cells: {
    count: {
      title: 'All Alarms',
      label: 'Total Alarms'
    },
    sum: {
      title: 'All Alarms',
      label: 'Total Duration',
      excludeKeys: ['Warning'],
      format: {}
    },
    average: {
      title: 'All Alarms',
      label: 'Average Duration',
      excludeKeys: ['Warning']
    }
  }
};
