import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import WidgetTable from '.';
import { WidgetTableDataItem } from 'types/machine-health';
import { WidgetTableProvider } from './WidgetTableContext';
import { WidgetType } from 'types/protein';
import { WidgetTableColumnConfigs, WidgetTableTagColumnConfigs } from 'constants/machineConfig';

export default {
  title: 'UI/WidgetTable',
  component: WidgetTable,
  decorators: [
    (Story: Story) => (
      <WidgetTableProvider>
        <Story />
      </WidgetTableProvider>
    )
  ]
} as Meta;

const Template: Story<ComponentProps<typeof WidgetTable>> = (args) => <WidgetTable {...args} />;

const exampleRowData: WidgetTableDataItem[] = [...new Array(3)].map((_, i) => ({
  active: i % 2 === 0,
  editable: i <= 1,
  members: [...new Array(3)].map((_, j) => ({
    active: false,
    editable: true,
    members:
      j <= 1
        ? [...new Array(3)].map((_, k) => ({
            editable: true,
            id: `row-1-${i}-${j}-${k}`,
            name: `Tag Group ${i}-${j}-${k} name`,
            tags: [...new Array(2)].map((_, l) => ({
              id: `tag${i}-${j}-${k}-${l}`,
              name: `Tag ${l} Name`,
              type: WidgetType.State,
              values: [...new Array(2)].map((_, m) => ({
                value: `Tag ${l} Value ${m}`,
                name: 'Running'
              }))
            })),
            widgetType: WidgetType.TagGroup
          }))
        : null,
    id: `row-1-${i}-${j}`,
    name: `Widget ${i}-${j} name`,
    tags: [...new Array(2)].map((_, l) => ({
      id: `tag-${i}-${j}-${l}`,
      name: `Tag ${l} Name`,
      type: WidgetType.State,
      values: [...new Array(2)].map((_, m) => ({
        value: `Tag ${l} Value ${m}`,
        name: 'Running'
      }))
    })),
    toggleActive: true,
    widgetType: WidgetType.MatrixWidget
  })),
  id: `row-0-${i}`,
  name: i <= 0 ? undefined : `Widget Group ${i} name`,
  tags:
    i === 2
      ? [...new Array(10)].map((_, l) => ({
          id: `tag${l}`,
          name: `Tag ${l} Name`,
          type: WidgetType.State,
          values: [...new Array(2)].map((_, m) => ({
            value: `Tag ${l} Value ${m}`,
            name: 'Running'
          }))
        }))
      : null,
  toggleActive: i <= 3,
  widgetType:
    i <= 0
      ? WidgetType.MatrixWidgetGroup
      : i === 1
      ? WidgetType.CurrentIssues
      : WidgetType.TorqueChart
}));

const exampleWidgetTableData = {
  editable: true,
  id: 'test-id-1',
  name: 'Lorem ipsum dolor sit amet',
  toggleActive: true
};

export const Default = Template.bind({});
Default.args = {
  columnConfigs: WidgetTableColumnConfigs,
  data: exampleRowData,
  parent: exampleWidgetTableData
};

export const RenderTags = Template.bind({});
RenderTags.args = {
  columnConfigs: WidgetTableTagColumnConfigs,
  data: exampleRowData,
  hideCrudButtons: true,
  parent: exampleWidgetTableData,
  shouldRenderTags: true,
  tags: [...new Array(10)].map((_, l) => ({
    // mock tag master list
    value: `new-tag-${l}`,
    label: `Tag ${l} Name`,
    id: `new-tag-${l}`,
    name: `Tag ${l} Name`,
    type: WidgetType.State,
    index: l,
    values: [...new Array(2)].map((_, m) => ({
      value: `Tag ${l} Value ${m}`,
      name: 'Running'
    }))
  }))
};

export const EditingDisabled = Template.bind({});
EditingDisabled.args = {
  columnConfigs: WidgetTableColumnConfigs,
  data: exampleRowData.map((row) => ({
    ...row,
    editable: false,
    toggleActive: false,
    members: row.members?.map((child) => ({
      ...child,
      editable: false,
      toggleActive: false
    }))
  })),
  parent: { ...exampleWidgetTableData, editable: false, toggleActive: false }
};

export const Loading = Template.bind({});
Loading.args = {
  columnConfigs: WidgetTableColumnConfigs,
  isDataLoading: true,
  data: [],
  parent: exampleWidgetTableData
};

export const NoData = Template.bind({});
NoData.args = {
  columnConfigs: WidgetTableColumnConfigs,
  data: [],
  parent: { ...exampleWidgetTableData, editable: false, toggleActive: false }
};
