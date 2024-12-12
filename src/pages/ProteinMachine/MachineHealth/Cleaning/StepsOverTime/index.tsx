// 3rd party libs
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import {
  Button,
  CleaningStepCategoriesPieChart,
  CleaningStepDurationsBarChart,
  CleaningStepsChart,
  CleaningStepsDurationsTable,
  Loader,
  Switch,
  Typography,
  useDateRange
} from 'components';
import { AlarmsTable } from 'components/machine-health';

// Local shared components
import { ActionPillsContainer, Bar } from '../';

// Api
import { useGetMachineCleaningSessionDetailsQuery, useGetMachineAlarmsQuery } from 'api';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';
import { AlarmLocation } from 'types/machine-health/alarms';

// Helpers
import { toISO8601 } from 'helpers';
import { processData } from './helpers';

// Theme
import theme from 'themes';

// Hooks
import { useColorMap } from 'hooks';

enum TableView {
  Steps,
  Alarms
}

const ChartsContainer = styled.div`
  display: flex;
  gap: 1rem;

  > * {
    flex: 1;
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StepsOverTime = (): JSX.Element => {
  // Array of step ids that are currently selected. If empty, all steps will be active.
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [allStepsIds, setAllStepsIds] = useState<string[]>([]);
  const [tableView, setTableView] = useState(TableView.Steps);
  const [stepsIndex, setStepsIndex] = useState<number>(0);
  const [stepsHistory, setStepsHistory] = useState<string[][]>([allStepsIds]);
  const [steps, setSteps] = useState<string[]>([]);

  const { t } = useTranslation(['mh']);

  // Initial date range of 14 days
  const { dateRange } = useDateRange();

  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const getColorById = useColorMap(theme.colors.orderedCleaningStepColors);

  // Date range to query over is from the very start of the 'from' date to the very end of the 'to' date
  const queryStartDateTime = toISO8601(dateRange.startTime);
  const queryEndDateTime = toISO8601(dateRange.endTime);

  /**
   * Query for cleaning steps once we have a date range
   */
  const {
    data: stepsData,
    isFetching: stepsFetching,
    error: stepsError
  } = useGetMachineCleaningSessionDetailsQuery(
    dateRange.startTime && dateRange.endTime
      ? {
          grouped: false,
          machineId,
          startDatetime: queryStartDateTime,
          endDatetime: queryEndDateTime
        }
      : skipToken
  );

  useEffect(() => {
    const selectedSteps: string[] = [];
    stepsData?.map((step) => {
      selectedSteps.push(step.id);
    });
    setSelectedSteps(selectedSteps);
    setAllStepsIds(selectedSteps);
  }, [stepsData]);

  /**
   * Query for all alarms if the table is visible
   */
  const {
    data: alarmsData,
    isFetching: alarmsFetching,
    error: alarmsError
  } = useGetMachineAlarmsQuery(
    tableView === TableView.Alarms
      ? {
          machineId,
          location: AlarmLocation.CLE,
          startDatetime: queryStartDateTime,
          endDatetime: queryEndDateTime
        }
      : skipToken
  );

  const onSelectFilters = (filters: string[]) => {
    setStepsHistory((prev) => [...prev, filters]);
    setStepsIndex((prev) => prev + 1);
  };

  const onSelectSteps = (steps: string[]) => {
    if (isEqual(selectedSteps, allStepsIds)) {
      setSelectedSteps([...steps]);
      onSelectFilters([...steps]);
    } else if (steps.every((step) => selectedSteps.includes(step))) {
      setSelectedSteps(allStepsIds);
      onSelectFilters(allStepsIds);
    } else {
      const newValue = [...selectedSteps, ...steps];
      setSelectedSteps(newValue);
      onSelectFilters(newValue);
    }
  };

  const currentSteps = useMemo(() => stepsHistory[stepsIndex], [stepsIndex, stepsHistory]);

  const { orderedGroupedSteps, decoratedSteps } = useMemo(
    () => processData(stepsData),
    [stepsData]
  );

  const { orderedGroupedSteps: orderedGroupedStepsWithoutAnomalies } = useMemo(
    () => processData(stepsData),
    [stepsData]
  );

  // Pre-populate color map, so that all charts use the same colors
  orderedGroupedSteps?.forEach((stepGroup) => getColorById(stepGroup.id));

  // Aggregate data, error, and loading  state from all requests necessary to render the page
  const pageIsFetching = stepsFetching;

  let stepsOverTimeError = '';
  if (stepsError) {
    if ('data' in stepsError) {
      const sessionErr = stepsError.data as Record<string, unknown>;
      if (sessionErr.detail) {
        stepsOverTimeError = sessionErr.detail as string;
      }
    }
  }

  stepsError && stepsOverTimeError
    ? console.warn(stepsOverTimeError)
    : console.warn(t('failed_to_load_cleaning_session_data'));

  const onUndoClick = useCallback(() => {
    setStepsIndex((prev) => prev - 1);
  }, []);

  const onRedoClick = useCallback(() => {
    setStepsIndex((prev) => prev + 1);
  }, []);

  const onClearClick = useCallback(() => {
    onSelectSteps(steps);
  }, []);

  return (
    <>
      <Bar>
        <ActionPillsContainer>
          <Button
            width="25%"
            variant="default"
            size="small"
            disabled={stepsIndex === 0}
            onClick={onUndoClick}
          >
            {t('undo')}
          </Button>
          <Button
            width="25%"
            variant="default"
            size="small"
            disabled={stepsIndex === stepsHistory.length - 1}
            onClick={onRedoClick}
          >
            {t('redo')}
          </Button>
          <Button
            width="25%"
            variant="default"
            size="small"
            disabled={stepsHistory.length === 1}
            onClick={onClearClick}
          >
            {t('clear_all')}
          </Button>
        </ActionPillsContainer>
      </Bar>
      {pageIsFetching && <Loader />}
      {!pageIsFetching && (
        <>
          <ChartsContainer>
            <>
              <CleaningStepCategoriesPieChart
                data={orderedGroupedSteps || []}
                selectedSteps={currentSteps}
                onSelectSteps={onSelectSteps}
                getColorById={getColorById}
                setSteps={setSteps}
              />
              <CleaningStepDurationsBarChart
                selectedSteps={currentSteps}
                onSelectSteps={onSelectSteps}
                data={decoratedSteps || []}
                groupedData={orderedGroupedSteps || []}
                getColorById={getColorById}
              />
            </>
          </ChartsContainer>

          <CleaningStepsChart
            selectedSteps={currentSteps}
            onSelectSteps={onSelectSteps}
            stepsData={stepsData || []}
            dataIsGrouped={false}
            getColorById={getColorById}
          />

          <SwitchContainer>
            <Typography
              weight={tableView === TableView.Steps ? 'bold' : 'normal'}
              size="0.875rem"
              as="span"
              color="darkGrey"
              mb={0}
            >
              {t('steps')}
            </Typography>
            <Switch
              checked={tableView === TableView.Alarms}
              onChange={(val) => setTableView(val ? TableView.Alarms : TableView.Steps)}
            />
            <Typography
              weight={tableView === TableView.Alarms ? 'bold' : 'normal'}
              size="0.875rem"
              as="span"
              color="darkGrey"
              mb={0}
            >
              {t('alarms')}
            </Typography>
          </SwitchContainer>
          {tableView === TableView.Steps && (
            <CleaningStepsDurationsTable
              selectedSteps={currentSteps}
              data={orderedGroupedStepsWithoutAnomalies || []}
            />
          )}

          {tableView === TableView.Alarms &&
            (alarmsError ? (
              <Typography color="negativeRed">{t('failed_to_load_alarms_data')}</Typography>
            ) : (
              <AlarmsTable data={alarmsData} isLoading={alarmsFetching} />
            ))}
        </>
      )}
    </>
  );
};

export default StepsOverTime;
