// 3rd party libs
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import ParallelTagData from './ParallelTagData';
import { DataRenderer } from '..';
import { KPIOverTimeGraph, MachineModesGraphWidget } from 'components';

// Types
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { ProteinMachineRouteQueryParams, KeyIndicatorHistory, BaseTag } from 'types/protein';
import { SerializedError } from '@reduxjs/toolkit';
import { Series } from 'types/graph';
import { DateTuple } from 'types';

// Helpers
import { getYaxisOffset } from 'helpers/graph';
import { toISO8601 } from 'helpers';

// Utils
import {
  axisH,
  axisV,
  formatLineSeriesTooltip,
  formatScatterSeriesTooltip,
  toLineSeries,
  toScatterPoints,
  toScatterSeries
} from './utils';
import { useMachineKpi } from '../MachineKpi/utils';
import { mappedStateProtein } from '../../MachineStatus/utils/BUsMachineStatusMapping';

// Api
import { useGetMachineStatesCategoriesQuery } from 'api';

// Providers
import { useTimeZone } from 'providers';

const MachineStatesContainer = styled.div`
  margin-top: 1rem;
`;

const MachineIndicatorsGraph = (): JSX.Element => {
  const { timeZone } = useTimeZone();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { t } = useTranslation(['mh']);

  const [hasKPIData, setHasKPIData] = useState(false);
  const [tagsData, setTagData] = useState<BaseTag[]>([]);
  const [parallelLoading, setParallelLoading] = useState<Record<string, boolean>>({});
  const [errorParallel, setErrorParallel] = useState<
    Record<string, FetchBaseQueryError | SerializedError | undefined>
  >({});

  const startDatetime = useMemo(() => moment().subtract(13, 'days').endOf('day').toDate(), []);
  const endDatetime = useMemo(() => moment().toDate(), []);

  const localStartDatetimeString = toISO8601(startDatetime, timeZone);
  const localEndDatetimeString = toISO8601(endDatetime, timeZone);

  // We use the same tags that are in the machine overview card (MachineKpi), so we retrieve the same
  // data here, and use those tags to populate the line chart
  const {
    data: machineKpiData,
    isLoading: machineKpiLoading,
    error: machineKpiError
  } = useMachineKpi(0, hasKPIData);

  useEffect(() => {
    !!machineKpiData && setHasKPIData(true);
  }, [machineKpiData]);

  // Plot tags that are in the main machine overview card, _and_ belong to a group
  const tagsToPlot = machineKpiData
    ?.filter((tag) => {
      return tag.mainTag === 'True' && tag.tagGroupId;
    })
    .map((tag) => tag.tagId);

  const {
    data: states,
    isLoading: statesLoading,
    error: statesError
  } = useGetMachineStatesCategoriesQuery({
    machineId,
    startDatetime: localStartDatetimeString
  });

  const newStates = states?.map((state) => ({
    endTimestamp: state.endTimestamp,
    startTimestamp: state.timestamp,
    stateCode:
      state.value === 10
        ? '0'
        : state.value === 40
        ? '1'
        : state.value === 41
        ? '2'
        : state.value === 50
        ? '4'
        : '5',
    stateName: mappedStateProtein[state.name]
  }));

  const linesSeries: Series[] = useMemo(() => {
    /**
     * Transform data into graph input format
     * First, convert BaseTag type into KeyIndicatorHistory type, so data can be processed by existing helpers.
     */
    const indicators: KeyIndicatorHistory[] = (tagsData ?? []).map(
      (baseTag) =>
        ({
          unit: baseTag.unit as string,
          tagId: baseTag.id,
          values: baseTag.values,
          name: baseTag.name
        } as KeyIndicatorHistory)
    );

    return toLineSeries(indicators);
  }, [tagsData]);

  /**
   * Process data
   */
  const scatterSeries: Series = useMemo(() => {
    const { min } = getYaxisOffset(linesSeries);
    return toScatterSeries(states || [], Math.round(min), timeZone);
  }, [linesSeries, states, timeZone]);

  const series: Series[] = useMemo(
    () => [
      ...formatLineSeriesTooltip(linesSeries, timeZone),
      toScatterPoints(states || []),
      formatScatterSeriesTooltip(scatterSeries as Series)
    ],
    [linesSeries, scatterSeries, states, timeZone]
  );

  const xDomain: DateTuple = useMemo(
    () => [startDatetime, endDatetime],
    [startDatetime, endDatetime]
  );

  const loading =
    Object.values(parallelLoading).some((load) => !!load) || statesLoading || machineKpiLoading;
  const error =
    Object.values(errorParallel).some((error) => !!error) || statesError || machineKpiError;

  return (
    <>
      <DataRenderer
        isLoading={loading && tagsData.length === 0}
        error={error && (t('failed_to_load_key_indicators_history') as string)}
      >
        <KPIOverTimeGraph
          title={t('key_indicators_history') as string}
          graphContainerHeight="18.3125rem"
          series={series}
          axisH={axisH(timeZone)}
          axisV={axisV()}
          displayZeroLine={true}
          xDomain={xDomain}
        />
      </DataRenderer>

      <MachineStatesContainer>
        <MachineModesGraphWidget
          isLoading={statesLoading}
          intervalSpacing={false}
          title={t('machine_state') as string}
          data={[
            {
              id: 1,
              label: t('state_timeline') as string,
              parentProperty: '1',
              data: newStates ?? []
            }
          ]}
        />
      </MachineStatesContainer>

      {tagsToPlot?.map((tagId) => (
        <ParallelTagData
          currentTagValue={tagsData.find((tag) => tag.id === tagId)}
          endDatetime={localEndDatetimeString}
          key={tagId}
          machineId={machineId}
          setError={setErrorParallel}
          setLoading={setParallelLoading}
          setTagData={setTagData}
          startDatetime={localStartDatetimeString}
          tagId={tagId}
        />
      ))}
    </>
  );
};

export default MachineIndicatorsGraph;
