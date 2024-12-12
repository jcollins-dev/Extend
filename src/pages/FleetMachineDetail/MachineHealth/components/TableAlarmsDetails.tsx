import React from 'react';
import { WidgetUi } from 'components';
import {
  VirtualizedTable,
  VirtualizedTablePropsColumnsConfig
} from 'components/StyledUi/StyledChartsV2/VirtualizedTable/VirtualizedTable';

import { useChartsAndFiltersPageData } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/_hooks/useChartsAndFiltersPageData';
import { convertSecondsToTime, formatLocaleDate } from 'components/StyledUi/js';
import { useTranslation } from 'react-i18next';

const tableConfig: VirtualizedTablePropsColumnsConfig[] = [
  {
    label: `Start Date`,
    dataKey: `startTimestamp`,
    width: 155,
    cellRenderer: ({ cellData }) => formatLocaleDate(cellData, 'short'),
    flexGrow: 1
  },
  {
    label: `Duration`,
    dataKey: `duration`,
    width: 60,
    cellRenderer: ({ cellData }) => convertSecondsToTime(cellData),
    flexGrow: 1
  },
  {
    label: `ID`,
    dataKey: `code`,
    width: 70,
    flexGrow: 1
  },
  {
    label: `Type`,
    dataKey: `type`,
    width: 80,
    flexGrow: 1
  },
  {
    label: `Description`,
    dataKey: `description`,
    width: 200,
    flexGrow: 1
  }
];

export const TableAllAlarms = (): JSX.Element => {
  const { data, isLoading, hasError, hasMessage } = useChartsAndFiltersPageData(); //useData();

  const { t } = useTranslation(['mh']);

  return (
    <WidgetUi
      {...{ isLoading, hasError, hasMessage, title: t('alarm_details') as string }}
      Main={
        <VirtualizedTable
          columnsConfig={tableConfig}
          {...{ data, isLoading, hasError, hasMessage }}
        />
      }
    />
  );
};
