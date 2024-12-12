import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Source } from '@storybook/addon-docs/blocks';
import { StyledPieChart } from '../StyledPieChart/StyledPieChart';
import { processApiData } from 'components/StyledUi/js';
import { demoAlarmsData } from './demoAlarmData';

const meta: Meta<typeof StyledPieChart> = {
  title: 'StyledCharts/ChartDemos2',
  component: StyledPieChart,
  argTypes: {
    type: {
      type: 'select',
      options: ['pie', 'stacked-bar'],
      name: 'Friendly name'
    }
  },
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['apiData']
    },
    source: {
      code: `
        // Import the component
        import YourComponent from '../components/YourComponent';

        // Set up the default props
        const props = {
          prop1: 'This is prop1',
          prop2: 'This is prop2',
          data: { /* Your data object */ },
        };

        // Display only the variable name without its contents
        const code = '<YourComponent {...props} />';
      `
    }
  }
};

export default meta;
type Story = StoryObj<typeof StyledPieChart>;

// convert the api date to a standard format
const processedData = processApiData(demoAlarmsData, {
  startTimeKey: 'startTimestamp',
  endTimeKey: 'endTimestamp',
  // this adds just the yyyy-mm-dd part of the value of startTimekey in the data object to key 'date'
  addDateAsKey: 'date',
  // adds the duration in seconds between the start and end time to key 'duration'
  addDurationAsKey: 'duration'
});

export const WithProp: Story = {
  decorators: [],
  name: 'So simple too!',
  args: {
    groupKey: 'type',
    type: 'pie',
    apiData: {
      data: processedData,
      isLoading: false,
      hasMessage: undefined,
      hasError: undefined
    },
    setsColors: true,
    format: {
      tooltip: (datum?: Record<string, unknown>): string => `${datum?.type}\n${datum?.y}%`
    }
  }
};

export const Simple: Story = {
  decorators: [],
  name: 'So simple!',
  args: {
    groupKey: 'type',
    type: 'pie',
    apiData: {
      data: processedData,
      isLoading: false,
      hasMessage: undefined,
      hasError: undefined
    },
    setsColors: true,
    format: {
      tooltip: (datum?: Record<string, unknown>): string => `${datum?.type}\n${datum?.y}%`
    }
  }
};
