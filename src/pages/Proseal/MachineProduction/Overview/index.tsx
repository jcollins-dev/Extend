// 3rd party libs
import React, { ReactElement, useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { toISO8601 } from 'helpers/dates';
import { useTranslation } from 'react-i18next';

// components
import { DataRenderer } from 'components/machine-health';
import {
  DowntimeTable,
  MachineStatusWidget,
  OEEWidget,
  ProductionMetricsWidget,
  PacksIntervalChart
} from 'pages/Proseal/components';
import { useParams } from 'react-router-dom';

// Api
import {
  useGetProsealDowntimeQuery,
  useGetProsealProductionOverviewKpiQuery,
  useGetProsealProductionPacksPerIntervalQuery,
  useGetProsealProductionStatusesQuery,
  useGetProsealProductionRecipesQuery,
  useSendProsealMachineLiveDataHeartbeatMutation
} from 'api';
import { DowntimeRow, ProsealRecipeSegment } from 'types/proseal';

// Styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.375rem 3.25rem;
`;

const Kpis = styled.div`
  display: flex;
  gap: 1rem;
`;

const DowntimeContainer = styled.div`
  padding-top: 1rem;
`;

// Contains 2 <Metrics />
const MachineMetrics = styled.div`
  flex: 0 0 calc(25% - 1rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PacksMetrics = styled.div`
  flex: 0 0 75%;
  display: flex;
  flex-direction: column;
  max-height: 42rem;
`;

const HEART_BEAT_INTERVAL = 30 * 1000;
const REFRESH_DATA_INTERVAL = 60 * 1000;
const INTERVAL_QUERY_OPTIONS = {
  refetchOnMountOrArgChange: true
};

const last4Hours = () => {
  const startTime = moment().subtract(4, 'hour');
  const endTime = moment();
  return { startTime, endTime };
};

const Overview = (): ReactElement => {
  const [timeDomain, setTimeDomain] = useState(last4Hours());
  const { t } = useTranslation(['mh']);
  const { machineId } = useParams<{ machineId: string }>();
  const {
    data,
    isLoading: isKPIsOverviewLoading,
    error: overviewKPIsError
  } = useGetProsealProductionOverviewKpiQuery(
    {
      machineId,
      startDatetime: toISO8601(timeDomain.startTime.toDate()),
      endDatetime: toISO8601(timeDomain.endTime.toDate())
    },
    INTERVAL_QUERY_OPTIONS
  );
  const {
    data: packs,
    isLoading: isPacksLoading,
    error: packsError
  } = useGetProsealProductionPacksPerIntervalQuery(
    {
      machineId,
      startDatetime: toISO8601(timeDomain.startTime.toDate()),
      endDatetime: toISO8601(timeDomain.endTime.toDate())
    },
    INTERVAL_QUERY_OPTIONS
  );
  const {
    data: statuses,
    isLoading: isStatusTagLoading,
    error: statusTagError
  } = useGetProsealProductionStatusesQuery(
    {
      machineId,
      startDatetime: toISO8601(timeDomain.startTime.toDate()),
      endDatetime: toISO8601(timeDomain.endTime.toDate())
    },
    INTERVAL_QUERY_OPTIONS
  );
  const {
    data: recipes = [],
    isLoading: isRecipesLoading,
    error: recipeError
  } = useGetProsealProductionRecipesQuery(
    {
      machineId,
      startDatetime: toISO8601(timeDomain.startTime.toDate()),
      endDatetime: toISO8601(timeDomain.endTime.toDate())
    },
    INTERVAL_QUERY_OPTIONS
  );
  const {
    data: downtimeTableData,
    isFetching: isDowntimeTableLoading,
    error: downtimeTableError
  } = useGetProsealDowntimeQuery(
    {
      machineId,
      startDatetime: toISO8601(timeDomain.startTime.toDate()),
      endDatetime: toISO8601(timeDomain.endTime.toDate())
    },
    INTERVAL_QUERY_OPTIONS
  );

  const [sendLiveDataHeartbeat] = useSendProsealMachineLiveDataHeartbeatMutation();

  useEffect(() => {
    const intervalReference = setInterval(() => {
      sendLiveDataHeartbeat({ machineId });
    }, HEART_BEAT_INTERVAL);
    return () => clearInterval(intervalReference);
  }, []);

  useEffect(() => {
    const intervalReference = setInterval(() => {
      setTimeDomain(last4Hours());
    }, REFRESH_DATA_INTERVAL);
    return () => clearInterval(intervalReference);
  }, []);

  const currentRecipe = useMemo(() => {
    if (recipes.length == 0) {
      return '-';
    }
    return (recipes as ProsealRecipeSegment[])[(recipes as ProsealRecipeSegment[]).length - 1].name;
  }, [recipes]);

  const currentJob = useMemo(() => {
    if (recipes.length == 0) {
      return '-';
    }
    return (
      (recipes as ProsealRecipeSegment[])[(recipes as ProsealRecipeSegment[]).length - 1].job || '-'
    );
  }, [recipes]);

  return (
    <Container>
      <Kpis>
        <MachineMetrics>
          <DataRenderer
            isLoading={isKPIsOverviewLoading}
            error={overviewKPIsError && (t('failed_to_load_data', { ns: 'common' }) as string)}
          >
            <MachineStatusWidget
              currentStatus={t('running')}
              currentRecipe={currentRecipe}
              jobNumber={currentJob}
            />
            <OEEWidget availabilityRate={data?.availability} performanceRate={data?.performance} />
            <ProductionMetricsWidget packCount={data?.packCount} feedFactor={undefined} />
          </DataRenderer>
        </MachineMetrics>
        <PacksMetrics>
          <DataRenderer
            isLoading={isPacksLoading || isStatusTagLoading || isRecipesLoading}
            error={(packsError || statusTagError || recipeError) && 'Failed to load data'}
          >
            <PacksIntervalChart
              startTime={timeDomain.startTime}
              endTime={timeDomain.endTime}
              packs={packs}
              statuses={statuses}
              recipes={recipes as ProsealRecipeSegment[]}
              showCurrentMarker={true}
              isZoomEnabled={false}
            />
          </DataRenderer>
        </PacksMetrics>
      </Kpis>
      <DowntimeContainer>
        <DataRenderer
          isLoading={isDowntimeTableLoading}
          error={downtimeTableError && 'Failed to load data'}
        >
          <DowntimeTable
            data={(downtimeTableData as DowntimeRow[]) || []}
            downtimeSubheader="Last 4 hours"
          />
        </DataRenderer>
      </DowntimeContainer>
    </Container>
  );
};

export default Overview;
