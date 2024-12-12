import React from 'react';
import { VirtualizedTable, VirtualizedTablePropsColumnsConfig } from '../../components';
import { format, parseISO } from 'date-fns';
import { useData } from '../../';

const demoColumnsConfig: VirtualizedTablePropsColumnsConfig[] = [
  {
    label: `Start Date`,
    dataKey: `startTimestamp`,
    width: 110,
    cellRenderer: ({ cellData }) => {
      const date = format(parseISO(cellData), 'P - p');
      return date;
    },
    flexGrow: 1
  },
  {
    label: `Duration`,
    dataKey: `duration`,
    width: 50,
    flexGrow: 1
  },
  {
    label: `ID`,
    dataKey: `id`,
    width: 80,
    flexGrow: 1
  },
  {
    label: `Type`,
    dataKey: `alarmType`,
    width: 100,
    flexGrow: 1
  },
  {
    label: `Description`,
    dataKey: `description`,
    width: 200,
    flexGrow: 1
  }
];

export const AllAlarmsTable = (): JSX.Element => {
  const { data, isLoading, hasError, hasMessage } = useData();

  return (
    <VirtualizedTable
      columnsConfig={demoColumnsConfig}
      {...{ data, isLoading, hasError, hasMessage }}
    />
  );
};
