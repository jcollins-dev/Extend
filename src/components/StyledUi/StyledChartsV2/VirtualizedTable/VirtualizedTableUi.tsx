import React from 'react';
import { VirtualizedTable, VirtualizedTableProps } from './VirtualizedTable';
import { WidgetUi, WidgetUiProps } from 'components';
import { useChartsAndFiltersPageData } from '../UIChartsAndFiltersPage/_hooks/useChartsAndFiltersPageData';
export interface VirtualizedTableUiProps extends VirtualizedTableProps {
  widgetSettings?: WidgetUiProps;
  title?: string;
}

/*/ alarms summary table example
const tableAlarmsSummary: VirtualizedTableProps = {
  rowClassName: (props) => {
    if (!props.duration) return 'is-active';
    return 'not-active';
  },
  // setup the columns for the table
  columnsConfig: [
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
      flexGrow: 1,
      cellRenderer: ({ cellData }) => convertSecondsToTime(cellData as number)
    },
    {
      label: `Description`,
      dataKey: `description`,
      width: 200,
      flexGrow: 1
    },
    {
      label: `Area`,
      dataKey: `location`,
      width: 80,
      flexGrow: 1
    },
    {
      label: `ID`,
      dataKey: `code`,
      width: 80,
      flexGrow: 1
    },
    {
      label: `Type`,
      dataKey: `type`,
      width: 100,
      flexGrow: 1
    }
  ]
};
/*/

export const VirtualizedTableUi = ({
  title,
  widgetSettings,
  ...tableSettings
}: VirtualizedTableUiProps): JSX.Element => {
  const { data, ...apiStatus } = useChartsAndFiltersPageData();

  const widgetUiSettings = {
    ...widgetSettings,
    ...apiStatus,
    title
  };

  if (data) tableSettings = { ...tableSettings, data };

  return <WidgetUi {...widgetUiSettings} Main={<VirtualizedTable {...tableSettings} />} />;
};
