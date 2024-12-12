// 3rd Party Libraries
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { toISO8601 } from 'helpers/dates';
import { skipToken } from '@reduxjs/toolkit/query';
import moment, { MomentInput } from 'moment';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Types
import { useGetProsealProductionRecipesQuery, useLazyGetProsealProductionRecipesQuery } from 'api';
import { DateRange } from 'helpers';

// Components
import { BaseTable, DateRangePicker } from 'components';
import { DataRenderer } from 'components/machine-health';
import { ProsealExcelUrl, ProsealRecipeSegment } from 'types/proseal';
import { useTimeZone } from 'providers';
import { ColumnConfig } from 'types';
import {
  ActionButtonIcon,
  ActionButtonListContainer,
  ActionButtonStyled,
  ActionsDropdownButton,
  actionTypes,
  Container,
  DayRangePickerContainer
} from '../../styles';

import theme from 'themes';
import saveAs from 'file-saver';

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

function formatLongDate(date: Date, timeZone: string | undefined) {
  return date.toLocaleDateString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    weekday: 'short',
    timeZone
  });
}

function secsToHours(totsecs: number): string {
  const secs = totsecs % 60;
  const mins = Math.floor((totsecs % 3600) / 60);
  const hours = Math.floor(totsecs / 3600);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(
    secs
  ).padStart(2, '0')}`;
}

const generateColumnConfigs = (
  timeZone: string | undefined,
  t: TFunction<'mh'[], undefined>
): ColumnConfig[] => {
  return [
    {
      title: t('recipe') as string,
      dataIndex: 'name',
      key: 'status',
      render(_, record) {
        const rec = record as ProsealRecipeSegment;
        return `${rec.name} (${rec.numberOfImpressions} imp)`;
      }
    },
    {
      title: t('start_time') as string,
      dataIndex: 'startTime',
      key: 'startTime',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        return <>{formatLongDate(new Date(rowData.startTime), timeZone)}</>;
      }
    },
    {
      title: t('end_time') as string,
      dataIndex: 'endTime',
      key: 'endTime',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        return <>{formatLongDate(new Date(rowData.endTime), timeZone)}</>;
      }
    },
    {
      title: t('production_time') as string,
      dataIndex: 'productionTime',
      key: 'productionTime',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        const ellapsedSecs = Math.round(
          (new Date(rowData.endTime).getTime() - new Date(rowData.startTime).getTime()) / 1000
        );
        return secsToHours(ellapsedSecs);
      }
    },
    {
      title: t('oee') as string,
      dataIndex: 'oee',
      key: 'oee',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        return `${Math.round(rowData.kpis.oee * 100)}%`;
      }
    },
    {
      title: t('availability') as string,
      dataIndex: 'availability',
      key: 'availability',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        return `${Math.round(rowData.kpis.availability * 100)}%`;
      }
    },
    {
      title: t('performance') as string,
      dataIndex: 'performance',
      key: 'performance',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        return `${Math.round(rowData.kpis.performance * 100)}%`;
      }
    },
    {
      title: t('run_time') as string,
      dataIndex: 'runtime',
      key: 'runtime',
      render(_, data) {
        const rowData = data as ProsealRecipeSegment;
        return secsToHours(rowData.kpis.totalSeconds);
      }
    }
  ];
};

interface RecipeTableProps {
  rows: ProsealRecipeSegment[];
}

const RecipeReportTable = (props: RecipeTableProps): JSX.Element => {
  //const slicedData = useMemo(() => (props.rows ?? []).slice(1), [props.rows]);
  const { t } = useTranslation(['mh']);
  const { timeZone } = useTimeZone();

  return (
    <TableContainer>
      <BaseTable
        rowKey={(_, index?: number) => index?.toString() || '?'}
        alternatingRowColoring={false}
        columnConfigs={generateColumnConfigs(timeZone, t)}
        data={props.rows}
        isDataLoading={false}
        borderBottomRow
      />
    </TableContainer>
  );
};

const RecipeReport: FC<RecipeReportProps> = (): ReactElement => {
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();
  const [showActions, setShowActions] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: aDayAgo(),
    to: base().toDate()
  });

  const { data, isLoading, error } = useGetProsealProductionRecipesQuery(
    dateRange.from === undefined || dateRange.to === undefined
      ? skipToken
      : {
          machineId: machineId,
          startDatetime: toISO8601(dateRange.from, timeZone),
          endDatetime: toISO8601(dateRange.to, timeZone)
        }
  );

  const [trigger] = useLazyGetProsealProductionRecipesQuery();

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
        saveAs((result as ProsealExcelUrl).url, `recipe-report_${fromStr}_${toStr}.xlsx`);
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
        <RecipeReportTable rows={(data as ProsealRecipeSegment[]) || []} />
      </DataRenderer>
    </Container>
  );
};

export default RecipeReport;
