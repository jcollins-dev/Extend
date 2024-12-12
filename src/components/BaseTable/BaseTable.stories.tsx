import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import styled from 'styled-components';
import BaseTable from './BaseTable';

export default {
  title: 'UI/BaseTable',
  component: BaseTable
} as Meta;

const Template: Story<ComponentProps<typeof BaseTable>> = (args) => <BaseTable {...args} />;

const exampleColumnConfig = [
  {
    title: 'Column A',
    dataIndex: 'colA',
    key: 'colA'
  },
  {
    title: 'Column B',
    dataIndex: 'colB',
    key: 'colB'
  },
  {
    title: 'Column C',
    dataIndex: 'colC',
    key: 'colC'
  }
];

const exampleRowData = [...new Array(10)].map((_, i) => ({
  colA: `Row ${i} A`,
  colB: `Row ${i} B`,
  colC: `Row ${i} C`
}));

export const Default = Template.bind({});
Default.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData
};

export const Loading = Template.bind({});
Loading.args = {
  columnConfigs: exampleColumnConfig,
  isDataLoading: true,
  data: []
};

export const NoData = Template.bind({});
NoData.args = {
  columnConfigs: exampleColumnConfig,
  data: []
};

export const WithoutAlternatingRows = Template.bind({});
WithoutAlternatingRows.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData,
  alternatingRowColoring: false
};

export const WithTitle = Template.bind({});
WithTitle.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData,
  title: 'Lorem ipsum dolor sit amet'
};

export const YScrolling = Template.bind({});
YScrolling.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData,
  scroll: { y: 200 }
};

export const CustomHeaderColor = Template.bind({});
CustomHeaderColor.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData,
  headerBgColor: 'pink'
};

const CustomHeader = styled.thead`
  font-style: italic;
`;

export const CustomHeaderComponent = Template.bind({});
CustomHeaderComponent.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData,
  customHeader: CustomHeader
};

export const CustomOuterBorderColor = Template.bind({});
CustomOuterBorderColor.args = {
  columnConfigs: exampleColumnConfig,
  data: exampleRowData,
  outerBorderColor: 'red'
};
