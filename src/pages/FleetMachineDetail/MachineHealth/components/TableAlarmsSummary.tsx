import React, { useMemo } from 'react';

import { VirtualizedTablePropsColumnsConfig } from 'components/StyledUi/PageLayouts/ChartsWithFiltersPage';
import { WidgetUi } from 'components';
import { useFilterSelected, filterSelectedData } from 'components';
import { VirtualizedTable } from 'components/StyledUi/StyledChartsV2/VirtualizedTable/VirtualizedTable';
import { useChartsAndFiltersPageData } from 'components/StyledUi/StyledChartsV2/UIChartsAndFiltersPage/_hooks/useChartsAndFiltersPageData';
import { convertSecondsToTime } from 'components/StyledUi/js';
import { useTranslation } from 'react-i18next';

const summaryTableConfig: VirtualizedTablePropsColumnsConfig[] = [
  {
    label: `ID`,
    dataKey: `id`,
    width: 80,
    flexGrow: 1
  },
  {
    label: `Description`,
    dataKey: `description`,
    width: 200,
    flexGrow: 1
  },
  {
    label: `Total Duration`,
    dataKey: `totalTime`,
    cellRenderer: ({ cellData }) => convertSecondsToTime(cellData),
    width: 50,
    flexGrow: 1
  },
  {
    label: `Count`,
    dataKey: `count`,
    width: 100,
    flexGrow: 1
  }
];

export const TableAlarmsSummary = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const { data, isLoading, hasError, hasMessage } = useChartsAndFiltersPageData(); //useData();
  const [selected] = useFilterSelected();

  const filteredData = filterSelectedData({ data, selected });

  const countObj = filteredData?.reduce(
    (acc: Record<string, Record<string, unknown>>, item: Record<string, unknown>) => {
      const id = item.code as string;

      if (!acc[id])
        acc = {
          ...acc,
          [id]: {
            ...item,
            id: id as string,
            description: item.description as string
          }
        };

      if (!acc[id].count) acc[id] = { ...acc[id], count: 0 };
      if (!acc[id].totalTime) acc[id] = { ...acc[id], totalTime: 0 };

      acc[id].count = (acc[id].count as number) + 1;
      acc[id].totalTime = Number(acc[id].totalTime) + Number(item.duration as number);

      return acc;
    },
    {}
  );

  const newData = useMemo(
    () =>
      countObj &&
      Object.values(countObj).sort((a, b) => {
        const idA = a.id as string;
        const idB = b.id as string;

        if (idA < idB) {
          return -1;
        }
        if (idA > idB) {
          return 1;
        }

        return 0;
      }),
    [countObj, selected]
  );

  return (
    <WidgetUi
      {...{ isLoading, hasError, hasMessage, title: t('alarms_summary') as string }}
      Main={
        <VirtualizedTable
          columnsConfig={summaryTableConfig}
          {...{
            data: newData,
            isLoading,
            hasError,
            hasMessage,
            className: 'widget-ui-main no-padding'
          }}
        />
      }
    />
  );
};
