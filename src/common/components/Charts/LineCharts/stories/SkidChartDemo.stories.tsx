import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConnectedScatterChart } from '../ConnectedScatterChart/ConnectedScatterChart';

import styled from 'styled-components';

const DemoHolder = styled.div`
  width: 100%;
`;

const SkidChartTooltipContainer = styled.div`
  display: flex;
  gap: 0.4em;
  flex-direction: column;

  .tooltip__date {
    font-weight: 500;
    width: 100%;
    padding-bottom: 0.4em;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.3);
    border-width: 0px 0px 1px 0px;
  }
`;
const SkidChartTooltipItem = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.4em;

  &:before {
    content: '';
    width: 0.8em;
    height: 0.8em;
    border-radius: 50%;
    background-color: ${({ color }) => color || 'black'};
    flex-grow: 0;
  }
`;

export default {
  title: 'V2/Charts/SkidChartDemo',
  component: ConnectedScatterChart,
  parameters: {
    // Use the excludeProps option to hide the 'data' prop from the "Show code" tab
    docs: {
      //excludeProps: ['data', 'xKey', 'yKey']
    }
  }
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof ConnectedScatterChart>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ConnectedScatterChart> = (args) => {
  return (
    <DemoHolder>
      <ConnectedScatterChart {...args} />
    </DemoHolder>
  );
};

export const SkidChartD = Template.bind({});
SkidChartD.args = {
  labelLeft: 'Utilization Percentage',
  groupKey: 'day_machine_local_time',
  valueKeys: [
    'intensifier_utilization_1_1',
    'intensifier_utilization_1_2',
    'intensifier_utilization_1_3',
    'intensifier_utilization_1_4'
  ],
  height: 300,
  legendItems: {
    items: [
      { id: 'intensifier_utilization_1_1', label: 'Intensifiers 1.1' },
      { id: 'intensifier_utilization_1_2', label: 'Intensifiers 1.2' },
      { id: 'intensifier_utilization_1_3', label: 'Intensifiers 1.3' },
      { id: 'intensifier_utilization_1_4', label: 'Intensifiers 1.4' }
    ]
  },
  dateRange: ['2023-09-07', '2023-09-11'],
  colors: {
    intensifier_utilization_1_1: 'rgba(17, 141, 255, 1)',
    intensifier_utilization_1_2: 'rgba(58, 75, 198, 1)',
    intensifier_utilization_1_3: 'rgba(230, 108, 55, 1)',
    intensifier_utilization_1_4: 'rgba(200, 61, 149, 1)'
  },
  isOutlined: true,
  bottomTickCount: 5,
  TooltipComponent: (props: Record<string, unknown>) => {
    const colors = props?.colors as Record<string, string>;
    return (
      <SkidChartTooltipContainer className="tooltip">
        <div className="tooltip__date">{props?.day_machine_local_time as string}</div>
        <SkidChartTooltipItem
          color={colors?.['intensifier_utilization_1_1']}
          className={`tooltip__item intensifier_utilization_1_1`}
        >
          Intensifiers 1.1 - <b>{props?.intensifier_utilization_1_1}%</b>
        </SkidChartTooltipItem>
        <SkidChartTooltipItem
          color={colors?.['intensifier_utilization_1_2']}
          className={`tooltip__item intensifier_utilization_1_2`}
        >
          Intensifiers 1.2 - <b>{props?.intensifier_utilization_1_2}%</b>
        </SkidChartTooltipItem>
        <SkidChartTooltipItem
          color={colors?.['intensifier_utilization_1_3']}
          className={`tooltip__item intensifier_utilization_1_3`}
        >
          Intensifiers 1.3 - <b>{props?.intensifier_utilization_1_3}%</b>
        </SkidChartTooltipItem>
        <SkidChartTooltipItem
          color={colors?.['intensifier_utilization_1_4']}
          className={`tooltip__item intensifier_utilization_1_4`}
        >
          Intensifiers 1.4 - <b>{props?.intensifier_utilization_1_4}%</b>
        </SkidChartTooltipItem>
      </SkidChartTooltipContainer>
    );
  },
  data: [
    {
      intensifier_utilization_1_1: 15,
      intensifier_utilization_1_2: 20,
      intensifier_utilization_1_3: 74,
      intensifier_utilization_1_4: 85,
      day_machine_local_time: '2023-09-07'
    },
    {
      intensifier_utilization_1_1: 10,
      intensifier_utilization_1_2: 22,
      intensifier_utilization_1_3: 78,
      intensifier_utilization_1_4: 80,
      day_machine_local_time: '2023-09-08'
    },
    {
      intensifier_utilization_1_1: 15,
      intensifier_utilization_1_2: 27,
      intensifier_utilization_1_3: 85,
      intensifier_utilization_1_4: 87,
      day_machine_local_time: '2023-09-09'
    },
    {
      intensifier_utilization_1_1: 15,
      intensifier_utilization_1_2: 20,
      intensifier_utilization_1_3: 74,
      intensifier_utilization_1_4: 85,
      day_machine_local_time: '2023-09-10'
    },
    {
      intensifier_utilization_1_1: 10,
      intensifier_utilization_1_2: 22,
      intensifier_utilization_1_3: 78,
      intensifier_utilization_1_4: 80,
      day_machine_local_time: '2023-09-11'
    }
  ]
};
