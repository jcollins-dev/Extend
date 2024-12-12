import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

// Api
import {
  useGetProsealDowntimeQuery,
  useGetProsealProductionOverviewKpiQuery,
  useGetProsealProductionPacksPerIntervalQuery,
  useGetProsealProductionStatusesQuery,
  useGetProsealProductionRecipesQuery,
  useGetProsealRecipeStatsQuery
} from 'api';

// Components
import { DataRenderer } from 'components/machine-health';
import { DateRangePicker } from 'components';
import {
  HistoricPackIntervalChart,
  DowntimeTable,
  RecipeTable,
  OEEGraph
} from 'pages/Proseal/components';

// Helpers
import { DowntimeRow, ProsealRecipeSegment } from 'types/proseal';
import { DateRange, toISO8601 } from 'helpers/dates';

// Styled Components
const Root = styled.div`
  width: 100%;
  height: auto;
  padding: 1.375rem 3.25rem;
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: end;
  width: 100%;
`;

const Container = styled.div`
  padding-top: 1rem;
`;

const timeZone = 'Europe/London';

const last3Days = () => {
  const startTime = moment().subtract(3, 'days').startOf('days').toDate();
  const endTime = moment().endOf('day').toDate();
  return { from: startTime, to: endTime };
};

/// Converts a date's YY/MM/DD part, with a 'timeZone' and a 'startOrEnd'
/// to an exact point in time.
function dateToMoment(date: Date, tz: string): moment.Moment {
  return moment()
    .tz(tz)
    .year(date.getFullYear())
    .month(date.getMonth())
    .date(date.getDate())
    .startOf('date');
}

const HistoricView = (): JSX.Element => {
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();

  // YY/MM/DD the only parts that matther in this variable
  const [dateRange, setDateRange] = useState<DateRange>(last3Days());

  function onRangeUpdate(range: DateRange) {
    setDateRange(range);
  }

  const startMoment = useMemo(
    () => dateToMoment(dateRange.from || new Date(2000, 1, 1), timeZone),
    [dateRange]
  );
  const endMoment = useMemo(
    () => dateToMoment(dateRange.to || new Date(2000, 1, 1), timeZone).add(1, 'days'),
    [dateRange]
  );
  const startDatetime = toISO8601(startMoment.toDate());
  const endDatetime = toISO8601(endMoment.toDate());
  const {
    data: downtimeTableData,
    isFetching: isDowntimeTableLoading,
    error: downtimeTableError
  } = useGetProsealDowntimeQuery({
    machineId: machineId,
    startDatetime,
    endDatetime
  });

  const {
    data: recipeStats,
    isFetching: isRecipeStatsLoading,
    error: recipeStatsError
  } = useGetProsealRecipeStatsQuery({
    machineId: machineId,
    startDatetime,
    endDatetime
  });
  const {
    data: packs,
    isLoading: isPacksLoading,
    error: packsError
  } = useGetProsealProductionPacksPerIntervalQuery({
    machineId,
    startDatetime,
    endDatetime
  });
  const {
    data: statuses,
    isLoading: isStatusLoading,
    error: statusError
  } = useGetProsealProductionStatusesQuery({
    machineId,
    startDatetime,
    endDatetime
  });
  const {
    data: recipes = [],
    isLoading: isRecipesLoading,
    error: recipeError
  } = useGetProsealProductionRecipesQuery({
    machineId,
    startDatetime,
    endDatetime
  });

  const {
    data: OEEData,
    isFetching: isOEEDataLoading,
    error: OEELoadError
  } = useGetProsealProductionOverviewKpiQuery({
    machineId,
    startDatetime,
    endDatetime,
    interval: 'daily'
  });

  return (
    <Root>
      <Header>
        <DateRangePicker range={dateRange} onRangeUpdate={onRangeUpdate} />
      </Header>
      <Container>
        <DataRenderer
          isLoading={isOEEDataLoading}
          error={OEELoadError && (t('failed_to_load_data', { ns: 'common' }) as string)}
        >
          <OEEGraph data={OEEData} startDate={startMoment} endDate={endMoment} />
        </DataRenderer>
      </Container>
      <Container>
        <DataRenderer
          isLoading={isDowntimeTableLoading}
          error={downtimeTableError && (t('failed_to_load_data', { ns: 'common' }) as string)}
        >
          <DowntimeTable enableShowAll data={(downtimeTableData as DowntimeRow[]) || []} />
        </DataRenderer>
      </Container>
      <Container>
        <DataRenderer
          isLoading={isPacksLoading || isStatusLoading || isRecipesLoading}
          error={
            (packsError || statusError || recipeError) &&
            (t('failed_to_load_data', { ns: 'common' }) as string)
          }
        >
          <HistoricPackIntervalChart
            startTime={startMoment}
            endTime={endMoment}
            packs={packs}
            statuses={statuses}
            recipes={recipes as ProsealRecipeSegment[]}
            graphOptions={{
              containerHeight: '30rem'
            }}
          />
        </DataRenderer>
      </Container>
      <Container>
        <DataRenderer
          isLoading={isRecipeStatsLoading}
          error={recipeStatsError && (t('failed_to_load_data', { ns: 'common' }) as string)}
        >
          <RecipeTable data={recipeStats || []} />
        </DataRenderer>
      </Container>
    </Root>
  );
};

export default HistoricView;
