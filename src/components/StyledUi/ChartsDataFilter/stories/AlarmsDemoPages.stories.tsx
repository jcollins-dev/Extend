import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Table, Column, AutoSizer } from 'react-virtualized';
import {
  AlarmChartsAndDataFilter,
  AlarmChartsAndDataFilterProps
} from '../AlarmChartsAndDataFilter';
import data from '../demo/demoRecipesHistoryData';
import { useGetAvureAlarmsQueryDemoDataFormatted } from 'components/StyledUi/demoData/avureAlarmsQueryDemoData';
import { filterDataBySelectedItems, useGroupSelectList } from 'components/StyledUi/SelectListV2';
import { useSelectedItems } from '../hooks/useSelectedItems';
import styled from 'styled-components';
import { AvureAlarmsInnerDemo } from '../demo/AvureAlarmsDemoPage';
import { ProteinMachineDemoPage } from '../demo/ProteinMachineDemoPage';
import { useGetMachineAlarmsQueryDemoData } from 'components/StyledUi/demoData/useGetMachineAlarmsQueryDemoData';

import { useFilterSelected } from 'components/StyledUi/FilterSelected';

const DemoContainer = styled.div`
  width: 30vw;
  min-width: 200px;
  margin: 0 auto;
`;

export default {
  title: 'StyledUi/DemoPage/AlarmsPages'
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

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AlarmChartsAndDataFilter> = (args) => {
  return <AlarmChartsAndDataFilter {...args} />;
};
export const AvureAlarmChartsAndDataFilterDemo = Template.bind({});
AvureAlarmChartsAndDataFilterDemo.args = {
  groupKey: `type`,
  itemKey: `startTimestamp`,
  csvFileName: `alarms_demo-id_startTime-endTime`,
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
    }
  ],
  data: useGetAvureAlarmsQueryDemoDataFormatted,
  containerHeight: `370px`,
  children: <AvureAlarmsInnerDemo />
};

export const ProtienMachineAlarmsPageDemo = Template.bind({});
ProtienMachineAlarmsPageDemo.args = {
  groupKey: `date`,
  itemKey: `type`,
  charts: [
    {
      title: 'Stacked Bar Chart',
      chartType: 'stacked-bar',
      groupKey: 'date',
      itemKey: 'type'
    },
    {
      title: 'Pie Chart By Type',
      chartType: 'pie',
      groupKey: 'type',
      itemKey: 'date'
    },
    {
      title: 'Pie Chart By Code',
      chartType: 'pie',
      groupKey: 'code',
      itemKey: 'date'
    }
  ],
  csvFileName: `machineId-03/06/2023-06/06/2023-alarms`,
  data: useGetMachineAlarmsQueryDemoData as Record<string, unknown>[],
  children: <ProteinMachineDemoPage />
};
