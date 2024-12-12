// 3rd party libs
import React, { useEffect, useRef } from 'react';

import { CellContext } from '@tanstack/react-table';

import { parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { usePressurizeCycleDataById } from '../../hooks';

import { IcoCheckIn } from 'icons/IcoCheckIn';
import { IcoError } from 'icons/IcoError';
import { useDateRange, NewBaseTable } from 'components';
import { StyledLoader } from 'components/StyledUi/elements/StyledLoader';
import { TableColumnConfigs } from 'types';

const calculateDifferenceFromNow = (endTime: string) => {
  const targetDate = new Date(endTime);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - targetDate.getTime();

  const secondsDiff = Math.floor(timeDiff / 1000);
  const minutesDiff = Math.floor(secondsDiff / 60);
  const hoursDiff = Math.floor(minutesDiff / 60);
  const daysDiff = Math.floor(hoursDiff / 24);

  let formattedTimeDiff;
  if (minutesDiff < 1) {
    formattedTimeDiff = 'Just now';
  } else if (hoursDiff < 1) {
    formattedTimeDiff = minutesDiff > 1 ? `${minutesDiff} minutes ago` : 'Last minute';
  } else if (hoursDiff < 24) {
    formattedTimeDiff = hoursDiff > 1 ? `Last ${hoursDiff} hours` : 'Last hour';
  } else {
    formattedTimeDiff = `${daysDiff} days ago`;
  }

  return formattedTimeDiff;
};

export const NewPerformanceTable = (): JSX.Element => {
  const { isLoading, tableData } = usePressurizeCycleDataById();
  // On a first render we show load icon, but hide when page stays open and keeps receiving new data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [isLoading, tableData]);

  const isLoadingState = isFirstRender.current ? isLoading : false;
  if (isLoadingState) return <StyledLoader />;

  const { timeZone } = useDateRange();

  const columns = [
    {
      id: 'batchSuccessful',
      header: '',
      isEnableSorting: false,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        cellValue.getValue() ? <IcoCheckIn /> : <IcoError />
    },
    {
      id: 'startTime',
      header: 'start Time',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        formatInTimeZone(parseISO(cellValue.getValue()), timeZone, `P' - 'p`)
    },
    {
      id: 'lotId',
      header: 'lot Id',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
    },
    {
      id: 'batchNumber',
      header: 'batch Number',
      isEnableSorting: true,
      isSelected: false,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) => cellValue.getValue()
    },
    {
      id: 'cycleTime',
      header: 'cycle Time',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        `${cellValue.renderValue()} sec`
    },
    {
      id: 'endTime',
      header: 'end Time',
      isEnableSorting: true,
      isSelected: true,
      renderer: (cellValue: CellContext<TableColumnConfigs, string>) =>
        calculateDifferenceFromNow(cellValue.getValue())
    }
  ];

  const defaultSortState = {
    id: 'startTime',
    desc: true
  };

  return (
    <>
      {tableData && (
        <NewBaseTable
          newTableData={tableData.slice(0, 10)}
          columnConfigs={columns}
          sortState={defaultSortState}
          isShowColumnOptions={false}
        />
      )}
    </>
  );
};
