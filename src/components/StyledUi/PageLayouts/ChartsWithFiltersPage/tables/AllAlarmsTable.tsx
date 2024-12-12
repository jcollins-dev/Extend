import React from 'react';
import { VirtualizedTable, VirtualizedTablePropsColumnsConfig } from '../tables/VirtualizedTable';
import { format, parseISO } from 'date-fns';
import { useData } from '../hooks';

const demoColumnsConfig: VirtualizedTablePropsColumnsConfig[] = [
  {
    label: `Start Date`,
    dataKey: `startTimestamp`,
    width: 160,
    cellRenderer: ({ cellData }) => {
      const date = format(parseISO(cellData), 'P - p');
      return date;
    }
  },
  {
    label: `Duration`,
    dataKey: `duration`,
    width: 75
  },
  {
    label: `ID`,
    dataKey: `id`,
    width: 100
  },
  {
    label: `Type`,
    dataKey: `alarmType`,
    width: 100
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
