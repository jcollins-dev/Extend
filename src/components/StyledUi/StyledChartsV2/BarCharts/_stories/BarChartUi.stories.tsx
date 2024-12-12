import React from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { BarChartUi } from '../BarChartUi';
import { barChartDemoData } from './barChartDemoData';
import { formatLocaleDate } from 'components/StyledUi/js';
import { defaultLabelStyles } from '../../StyledCharts.styles';
import { convertToStackedChartData } from '../../helpers';
import { BarChartUiContainer } from '../BarChartUi.elements';

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 300px;

  div {
    width: 650px;
    height: 300px;
  }
`;

export default {
  title: 'V2/StyledCharts/BarCharts',
  component: BarChartUi,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof BarChartUi>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof BarChartUi> = (args) => {
  return <BarChartUi {...args} data={barChartDemoData} />;
};

export const BarChartOverTimeWithUi = Template.bind({});
BarChartOverTimeWithUi.args = {
  groupKey: 'type',
  dateKey: 'date',
  type: 'bar-over-time',
  title: 'Demo Bar Chart UI',
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
