import React, { useState } from 'react';
import styled from 'styled-components';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { StyledBarChartGrouped } from '../StyledBarChartGrouped';
import { barChartDemoData } from './barChartDemoData';
import { formatLocaleDate } from 'components/StyledUi/js';
import { defaultLabelStyles } from '../../StyledCharts.styles';
import { convertToStackedChartData } from '../../helpers';

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
  component: StyledBarChartGrouped,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof StyledBarChartGrouped>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof StyledBarChartGrouped> = (args) => {
  const chartData = convertToStackedChartData(
    // this data has already been run through the processApiData function,
    // see barChartDemoData file for more info
    barChartDemoData as Record<string, unknown>[],
    // first we group them all bt type from 'type' key in data
    // this add's up all values for each type
    'type',
    // then we group them by categoryKey, in this case 'date'
    // this is how the bars will line up, or be stacked.
    // in thise care, the 'date' value for each alarm is YYYY-MM-DD, set
    // with processApiData function above.
    // this makes it easier to group them by category as well as count how many
    // alarms occured on that day, of each type.
    'date'
  );

  const [selected, setSelected] = useState<string[]>([]);
  // custom for this story
  const checkIfSelected = (datum: Record<string, unknown>) =>
    !selected.length || !selected ? true : selected.includes(datum.type as string);

  // custom for this story
  const handle = {
    click: (d: Record<string, unknown>) =>
      setSelected(selected.includes(d.type as string) ? [] : [...selected, d.type as string])
  };

  return (
    <DemoContainer>
      <div>
        <StyledBarChartGrouped
          {...args}
          data={chartData}
          handle={handle}
          checkIfSelected={checkIfSelected}
        />
      </div>
    </DemoContainer>
  );
};

export const BarChartOverTimeStacked = Template.bind({});
BarChartOverTimeStacked.args = {
  type: 'stacked-bar-over-time',
  groupKey: 'type',
  categoryKey: 'date',
  useDataReturnDateRange: true,
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;
      return [`${datum.x}`, ` \n `, `${datum.type}: ${Math.round(Number(datum.y))}`];
    },
    axisY: (datum: string) => datum
  },

  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
  ]
};

/*
export const DualLineChart = Template.bind({});
DualLineChart.args = {
  chartKeys: [{
    xKey: 'timestamp',
    yKey: 'value',
    stroke: 'blue',
  }, {
    xKey: 'timestamp',
    yKey: 'target',
    stroke: 'red'
  }],
  format: {
    tooltip: (d) => {
      const datum = d?.datum as Record<string, unknown>;
      const date = formatLocaleDate(datum['timestamp'] as string, 'short');
      return [
        `${date}`,
        ` \n `,
        `${d?.yKey as string}: ${Math.round(Number(datum[d?.yKey as string]))}%`
      ];
    },
    axisY: (datum: string) => {
      const [date, timetz] = datum.split('T');
      const [time] = timetz.split('+' || '-');
      return `${date}\n${time} `;
    }
  },
  tooltipStyles: [
    defaultLabelStyles,
    { fontSize: 5 },
    { ...defaultLabelStyles, fontSize: 15, fontWeight: 500 }
  ]
};*/
