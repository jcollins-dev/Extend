import React, { ComponentProps } from 'react';
import { Story, Meta } from '@storybook/react/types-6-0';
import { CellContext } from '@tanstack/react-table';
import { TableColumnConfigs } from 'types';
import NewBaseTable from './NewBaseTable';

import { IcoCheckIn } from 'icons/IcoCheckIn';
import { IcoError } from 'icons/IcoError';

export default {
  title: 'UI/NewWidgetTable',
  component: NewBaseTable
} as Meta;

const Template: Story<ComponentProps<typeof NewBaseTable>> = (args) => (
  <div style={{ width: '900px' }}>
    <NewBaseTable {...args} />
  </div>
);

const tableData = [
  {
    batchNumber: '002',
    batchSuccessful: true,
    cycleTime: '542',
    deltaPressurizeTime: '-3.92999267578125',
    endTime: '2023-08-18T15:39:36+02:00',
    idealPressurizeTime: '190',
    lotId: 'OL-23000566',
    pressurizeTime: '186.07000732421875',
    startTime: '2023-08-18T15:30:34+02:00',
    systemId: 'AVM1'
  },
  {
    batchNumber: '001',
    batchSuccessful: true,
    cycleTime: '540',
    deltaPressurizeTime: '-6.9550018310546875',
    endTime: '2023-08-18T15:30:23+02:00',
    idealPressurizeTime: '190',
    lotId: 'OL-23000566',
    pressurizeTime: '183.0449981689453',
    startTime: '2023-08-18T15:21:23+02:00',
    systemId: 'AVM1'
  },
  {
    batchNumber: '005',
    batchSuccessful: true,
    cycleTime: '460',
    deltaPressurizeTime: '-0.9010009765625',
    endTime: '2023-08-18T14:50:20+02:00',
    idealPressurizeTime: '190',
    lotId: 'SI23000565',
    pressurizeTime: '189.0989990234375',
    startTime: '2023-08-18T14:42:40+02:00',
    systemId: 'AVM1'
  }
];

const columns = [
  {
    id: 'batchSuccessful',
    header: 'batchSuccessful',
    isEnableSorting: false,
    isSelected: true,
    renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
      cellValue.getValue() ? <IcoCheckIn /> : <IcoError />
  },
  {
    id: 'startTime',
    header: 'startTime',
    isEnableSorting: true,
    isSelected: true,
    renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
  },
  {
    id: 'lotId',
    header: 'lotId',
    isEnableSorting: true,
    isSelected: true,
    renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
  },
  {
    id: 'batchNumber',
    header: 'batchNumber',
    isEnableSorting: true,
    isSelected: false,
    renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
  },
  {
    id: 'cycleTime',
    header: 'cycleTime',
    isEnableSorting: true,
    isSelected: true,
    renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
      `${cellValue.renderValue()} sec`
  },
  {
    id: 'endTime',
    header: 'endTime',
    isEnableSorting: true,
    isSelected: true,
    renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
  }
];

const defaultSortState = {
  id: 'startTime',
  desc: true
};

export const Default = Template.bind({});
Default.args = {
  newTableData: tableData,
  columnConfigs: columns,
  sortState: defaultSortState,
  isShowColumnOptions: true
};
