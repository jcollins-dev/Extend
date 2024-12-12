import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  AlarmChartsAndDataFilter,
  AlarmChartsAndDataFilterProps
} from '../AlarmChartsAndDataFilter';
import data from '../demo/demoRecipesHistoryData';
import { useGetAvureAlarmsQueryDemoDataFormatted } from 'components/StyledUi/demoData/avureAlarmsQueryDemoData';
import { filterDataBySelectedItems, useGroupSelectList } from 'components/StyledUi/SelectListV2';
import { useSelectedItems } from '../hooks/useSelectedItems';
import styled from 'styled-components';
import { useFilterSelected } from 'components/StyledUi/FilterSelected';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 200px;
  margin: 0 auto;
`;

export default {
  title: 'StyledUi/GroupedLayouts/AlarmChartsAndDataFilter'
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof AlarmChartsAndDataFilter>;

export interface FilterSelectedItemsProps {
  data?: Record<string, unknown>[];
  selected?: Record<string, string[]>;
}
const filterSelectedItems = ({
  data,
  selected
}: FilterSelectedItemsProps): Record<string, unknown>[] | undefined => {
  if (!data) return undefined;
  else if (!selected) return data;
  else
    return data.reduce((acc: Record<string, unknown>[], obj) => {
      Object.entries(obj).map(([key, val]) => {
        key = `${key}`;
        val = `${val}`;
        if (selected[key]?.includes(val as string)) {
          acc = [obj, ...acc];
        }
      });
      return acc;
    }, []);
};

const Provided = ({ data }: AlarmChartsAndDataFilterProps) => {
  //const { selected } = useGroupSelectList();

  const [selected] = useFilterSelected();
  //if (!selected) return <div>Loading</div>;

  const filteredData = filterSelectedItems({ data, selected });
  //console.log('story', { selected });
  return (
    <div>
      <h3>Filtered Data new</h3>
      <div>{JSON.stringify(filteredData)}</div>
    </div>
  );
};

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AlarmChartsAndDataFilter> = (args) => {
  return (
    <AlarmChartsAndDataFilter {...args}>
      <Provided {...args} />
    </AlarmChartsAndDataFilter>
  );
};

export const AlarmChartsAndDataFilterDemo = Template.bind({});
AlarmChartsAndDataFilterDemo.args = {
  data,
  groupKey: `activerecipe`,
  itemKey: `date`,
  containerHeight: `370px`,
  charts: [
    {
      title: 'Stacked Bar Chart',
      chartType: 'stacked-bar',
      groupKey: 'activerecipe',
      itemKey: 'date'
    },
    {
      title: 'Pie Chart',
      chartType: 'pie',
      groupKey: 'activerecipe',
      itemKey: 'date'
    }
  ]
};

export const AvureAlarmChartsAndDataFilterDemo = Template.bind({});
AvureAlarmChartsAndDataFilterDemo.args = {
  groupKey: `type`,
  itemKey: `startTimestamp`,
  charts: [
    {
      title: 'Stacked Bar Chart',
      chartType: 'stacked-bar',
      groupKey: 'type',
      itemKey: 'startTimestamp'
    },
    {
      title: 'Pie Chart By Type',
      chartType: 'pie',
      groupKey: 'type',
      itemKey: 'startTimestamp'
    },
    {
      title: 'Pie Chart By Code',
      chartType: 'pie',
      groupKey: 'code',
      itemKey: 'type'
    }
  ],
  containerHeight: `370px`,
  data: useGetAvureAlarmsQueryDemoDataFormatted
};

export const Loading = Template.bind({});
Loading.args = {
  isLoading: true,
  containerHeight: `270px`
};

export const Error = Template.bind({});
Error.args = {
  hasError: `Storybook Error Message`,
  containerHeight: `270px`
};

export const Message = Template.bind({});
Message.args = {
  hasMessage: `Have A Nice Day`,
  containerHeight: `270px`
};

export const NoValuesInRange = Template.bind({});
NoValuesInRange.args = {
  data: [],
  containerHeight: `270px`
};
