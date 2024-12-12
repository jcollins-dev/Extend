// 3rd Party Libraries
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { toISO8601 } from 'helpers/dates';
import { skipToken } from '@reduxjs/toolkit/query';
import moment, { MomentInput } from 'moment';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import saveAs from 'file-saver';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Types
import { useGetProsealDowntimeQuery, useLazyGetProsealDowntimeQuery } from 'api';
import { DateRange } from 'helpers';

// Components
import { BaseTable, DateRangePicker } from 'components';
import { DataRenderer } from 'components/machine-health';
import { DowntimeRow, ProsealExcelUrl } from 'types/proseal';
import { ColumnConfig } from 'types';
import {
  ActionsDropdownButton,
  ActionButtonListContainer,
  ActionButtonStyled,
  ActionButtonIcon,
  actionTypes,
  Container,
  DayRangePickerContainer
} from '../../styles';
import theme from 'themes';

interface RecipeReportProps {
  placeholder?: string;
}

function aDayAgo(): Date {
  const d = base().toDate();
  d.setDate(d.getDate() - 1);
  return d;
}

function convertTZ(date: Date, tzString: string) {
  return new Date(
    (typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
      timeZone: tzString
    })
  );
}

const timeZone = 'Europe/London';
const base = (momentArgs?: MomentInput) => moment(convertTZ(moment(momentArgs).toDate(), timeZone));

const TableContainer = styled.div`
  table {
    width: 100%;
    table-layout: fixed !important;
  }
`;

function secsToHours(totsecs: number): string {
  const secs = totsecs % 60;
  const mins = Math.floor((totsecs % 3600) / 60);
  const hours = Math.floor(totsecs / 3600);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
    secs
  ).padStart(2, '0')}`;
}

const generateColumnConfigs = (t: TFunction<'mh'[], undefined>): ColumnConfig[] => {
  return [
    {
      title: t('downtime') as string,
      dataIndex: 'name',
      key: 'name',
      render(value) {
        return <>{value}</>;
      }
    },
    {
      title: t('duration') as string,
      dataIndex: 'totalTime',
      key: 'totalTime',
      render(_, data) {
        const rowData = data as DowntimeRow;
        return secsToHours(rowData.totalTime);
      }
    },
    {
      title: t('count') as string,
      dataIndex: 'count',
      key: 'count',
      render(value) {
        return value;
      }
    },
    {
      title: t('production_time') as string,
      dataIndex: 'productionTime',
      key: 'productionTime',
      render(_, data) {
        const rowData = data as DowntimeRow;
        return `${rowData.productionShare.toFixed(2)}%`;
      }
    },
    {
      title: t('average_time') as string,
      dataIndex: 'averageTime',
      key: 'averageTime',
      render(_, data) {
        const rowData = data as DowntimeRow;
        return `${rowData.averageTime ? secsToHours(rowData.averageTime) : ' '}`;
      }
    },
    {
      title: t('max_time') as string,
      dataIndex: 'maxTime',
      key: 'maxTime',
      render(_, data) {
        const rowData = data as DowntimeRow;
        return `${rowData.maxTime ? secsToHours(rowData.maxTime) : ' '}`;
      }
    },
    {
      title: t('min_time') as string,
      dataIndex: 'minTime',
      key: 'minTime',
      render(_, data) {
        const rowData = data as DowntimeRow;
        return `${rowData.minTime ? secsToHours(rowData.minTime) : ' '}`;
      }
    }
  ];
};

interface DowntimeTableProps {
  rows: DowntimeRow[];
}

const DowntimeReportTable = (props: DowntimeTableProps): JSX.Element => {
  const { t } = useTranslation(['mh']);
  return (
    <TableContainer>
      <BaseTable
        rowKey={(_, index?: number) => index?.toString() || '?'}
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(t)}
        data={props.rows}
        isDataLoading={false}
        borderBottomRow
      />
    </TableContainer>
  );
};

const DowntimeReport: FC<RecipeReportProps> = (): ReactElement => {
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();
  const [showActions, setShowActions] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: aDayAgo(),
    to: base().toDate()
  });

  const { data, isLoading, error } = useGetProsealDowntimeQuery(
    dateRange.from === undefined || dateRange.to === undefined
      ? skipToken
      : {
          machineId: machineId,
          startDatetime: toISO8601(dateRange.from, timeZone),
          endDatetime: toISO8601(dateRange.to, timeZone)
        }
  );

  const [trigger] = useLazyGetProsealDowntimeQuery();

  useEffect(() => {
    if (error) {
      toast(t('data_not_found_for_selected_date_range'));
    }
  }, [error]);

  function downloadExcel() {
    if (dateRange.from === undefined || dateRange.to === undefined) {
      console.error('This should not happen');
      return;
    }
    trigger({
      machineId: machineId,
      startDatetime: toISO8601(dateRange.from, timeZone),
      endDatetime: toISO8601(dateRange.to, timeZone),
      exportToExcel: true
    })
      .unwrap()
      .then((result) => {
        const fromStr = moment(dateRange.from).tz(timeZone).format('YY-MM-DD');
        const toStr = moment(dateRange.to).tz(timeZone).format('YY-MM-DD');
        saveAs((result as ProsealExcelUrl).url, `downtime-report_${fromStr}_${toStr}.xlsx`);
      })
      .catch((error) => {
        toast.error(t('error_while_creating_excel'));
        console.error(error);
      });
  }

  const executeActionFunction = (actionType: actionTypes) => {
    switch (actionType) {
      case actionTypes.EXCEL: {
        downloadExcel();
        break;
      }
      default:
        console.log(actionType);
    }
    setShowActions(false);
  };

  return (
    <Container>
      <DayRangePickerContainer>
        <DateRangePicker range={dateRange} onRangeUpdate={setDateRange} maxDate={base().toDate()} />
        <ActionsDropdownButton downArrow={true} onClick={() => setShowActions(!showActions)}>
          {t('actions')}
        </ActionsDropdownButton>
        {showActions && (
          <ActionButtonListContainer>
            <ActionButtonStyled
              hideArrow={true}
              onClick={() => executeActionFunction(actionTypes.EXCEL)}
            >
              <ActionButtonIcon icon={faTable} color={theme.colors.darkGrey} />
              {t('excel_xls')}
            </ActionButtonStyled>
          </ActionButtonListContainer>
        )}
      </DayRangePickerContainer>
      <DataRenderer
        isLoading={isLoading}
        error={error && (t('data_not_found_for_selected_date_range') as string)}
      >
        <DowntimeReportTable rows={(data as DowntimeRow[]) || []} />
      </DataRenderer>
    </Container>
  );
};

export default DowntimeReport;
