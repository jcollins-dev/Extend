// 3rd Party Libraries
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { toISO8601 } from 'helpers/dates';
import { skipToken } from '@reduxjs/toolkit/query';
import moment, { MomentInput } from 'moment';
import { useTranslation } from 'react-i18next';

// Hooks
import { usePaginatedQueryOffset } from 'hooks';

// Types
import {
  useLazyGetProsealProductionAnalysisAllDataExcelQuery,
  useGetProsealProductionAnalysisAllDataQuery
} from 'api';
import { DateRange } from 'helpers';

// Components
import { DateRangePicker, Pagination } from 'components';
import { DataRenderer } from 'components/machine-health';
import { AllDataTable } from 'pages/Proseal/components';
import { ProsealMachineProductionAnalysisAllData } from 'types/proseal';
import {
  ActionsDropdownButton,
  ActionButtonListContainer,
  ActionButtonStyled,
  ActionButtonIcon,
  actionTypes,
  Container,
  DayRangePickerContainer
} from '../../styles';

// Constants
import { ITEMS_PER_PAGE } from 'constants/proseal';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import theme from 'themes';
import saveAs from 'file-saver';

interface AllDataProps {
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

const AllData: FC<AllDataProps> = (): ReactElement => {
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();
  const { onPageChange, pageNumber } = usePaginatedQueryOffset();
  const [showActions, setShowActions] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: aDayAgo(),
    to: base().toDate()
  });

  const { data, isLoading, error } = useGetProsealProductionAnalysisAllDataQuery(
    dateRange.from === undefined || dateRange.to === undefined
      ? skipToken
      : {
          machineId: machineId,
          startDatetime: toISO8601(dateRange.from, timeZone),
          endDatetime: toISO8601(dateRange.to, timeZone),
          limit: ITEMS_PER_PAGE,
          offset: pageNumber
        }
  );

  const [trigger] = useLazyGetProsealProductionAnalysisAllDataExcelQuery();

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
      endDatetime: toISO8601(dateRange.to, timeZone)
    })
      .unwrap()
      .then((result) => {
        const fromStr = moment(dateRange.from).tz(timeZone).format('YY-MM-DD');
        const toStr = moment(dateRange.to).tz(timeZone).format('YY-MM-DD');
        saveAs(result.url, `all-data_${fromStr}_${toStr}.xlsx`);
      })
      .catch((error) => {
        toast.error(t('error_while_creating_excel'));
        console.error(error);
      });
  }

  function executeActionFunction(actionType: actionTypes) {
    switch (actionType) {
      case actionTypes.EXCEL: {
        downloadExcel();
        break;
      }
      default:
        console.log(actionType);
    }
    setShowActions(false);
  }

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
        <AllDataTable rows={(data?.items as ProsealMachineProductionAnalysisAllData[]) ?? []} />
      </DataRenderer>
      {data && (
        <Container>
          <Pagination
            onPageChange={onPageChange}
            itemsPerPage={ITEMS_PER_PAGE}
            numItems={data?.total}
            currentPage={pageNumber}
          />
        </Container>
      )}
    </Container>
  );
};

export default AllData;
