// 3rd party libs
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { isEqual } from 'lodash';
import { useTranslation } from 'react-i18next';
import { uuid4 } from '@sentry/utils';

// Components
import { Button, CleaningStepsChart, CleaningStepsTable, Flyout, Typography } from 'components';

import { useDateRange } from 'components/StyledUi/DateRange';

import {
  AlarmDetail,
  IssuesPastSessionCard,
  CleaningSessionDurationCard
} from 'components/machine-health';
import SessionSelector, { DateRange } from 'components/machine-health/SessionSelector';
import SingleValueCard from 'components/KPICard/SingleValueCard';
import { DashboardWidget } from 'components';

// API
import {
  useGetMachineCleaningSessionDetailsQuery,
  useGetMachineCleaningSessionsKpiQuery,
  useGetMachineCleaningSessionsQuery,
  useGetMachineCleaningStatesQuery,
  useGetMachineCleaningUtilityMetricsKpiQuery,
  useGetMachineLastCleaningSessionQuery
} from 'api';

// Local shared components
import { ActionItemsContainer } from '../';

// Types
import { CleaningSession, ProteinMachineRouteQueryParams } from 'types/protein';
import { Alarm } from 'types/machine-health/alarms';
import { Alert } from 'types/machine-health/alerts';

// Helpers
import { changeTimeZoneToLocal, formatDate } from 'helpers';

// Theme
import theme from 'themes';

// Hooks
import { useColorMap } from 'hooks';
import { useTimeZone } from 'providers';

// Create a session name from a given session
export const formatSessionName = (session?: CleaningSession, timeZone?: string): string => {
  if (!session) {
    return 'Select session';
  }
  const tz = useTimeZone();
  timeZone = `${timeZone || tz}`;

  return formatDate(
    changeTimeZoneToLocal(moment(session?.startTimestamp).toDate(), timeZone),
    'long'
  );
};

const CardsContainer = styled.div`
  display: flex;
  gap: 1.25rem;

  > * {
    flex: 1;
  }
`;

const NoSessionsMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;

  p {
    max-width: 15rem;
    margin-left: 2rem;
  }
`;

const StyledLabel = styled.div`
  label {
    white-space: nowrap;
  }
`;

const SingleSession = (): JSX.Element => {
  const [sessionSelectorVisible, setSessionSelectorVisible] = useState(false);
  const {
    dateRange: dateRange2,
    setDateRange: setDateRange2,
    timeZone,
    isoDateRange
  } = useDateRange();
  const { t } = useTranslation(['mh']);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: moment().subtract(6, 'days').startOf('days').toDate(),
    to: moment().endOf('days').toDate()
  });

  const [selectedSession, setSelectedSession] = useState<CleaningSession>();
  const [averageDuration, setAverageDuration] = useState(10);
  const [selectedAlarms, setSelectedAlarms] = useState<Alarm[]>();
  const [selectedAlerts, setSelectedAlerts] = useState<Alert[]>();
  const [noSessionsMessageVisible, setNoSessionsMessageVisible] = useState(false);
  // Array of step ids that are currently selected. If empty, all steps will be active.
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [allStepsIds, setAllStepsIds] = useState<string[]>([]);

  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const getColorById = useColorMap(theme.colors.orderedCleaningStepColors);

  /**
   * Query for all sessions over a given date range, once that date range is defined
   */
  const {
    data: sessionsData,
    isFetching: isSessionsFetching,
    error: sessionsError
  } = useGetMachineCleaningSessionsQuery(
    dateRange2.startTime && dateRange2.endTime
      ? {
          machineId,
          // Date range is from the very start of the 'from' date to the very end of the 'to' date
          startDatetime: isoDateRange.startTime,
          endDatetime: isoDateRange.endTime
        }
      : skipToken
  );

  /**
   * Query for grouped cleaning steps once we have selected a session
   */
  const {
    data: stepsData,
    isFetching: stepsFetching,
    error: stepsError
  } = useGetMachineCleaningSessionDetailsQuery(
    selectedSession
      ? {
          grouped: true,
          alarmsInfo: true,
          machineId,
          startDatetime: selectedSession.startTimestamp,
          endDatetime: selectedSession.endTimestamp,
          avgSessions: averageDuration
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
   * Query for cleaning states (returning waiting time only) once we have selected a session
   */
  const {
    data: waitingStatesData,
    isFetching: waitingStatesFetching,
    error: waitingStatesError
  } = useGetMachineCleaningStatesQuery(
    selectedSession
      ? {
          machineId,
          waitingTime: true,
          startDatetime: selectedSession.startTimestamp,
          endDatetime: selectedSession.endTimestamp
        }
      : skipToken
  );

  /**
   * Query for all utility metrics once we have selected a session
   */
  const {
    data: utilityMetricsData,
    isFetching: utilityMetricsFetching,
    error: utilityMetricsError
  } = useGetMachineCleaningUtilityMetricsKpiQuery(
    selectedSession
      ? {
          machineId,
          startDatetime: selectedSession.startTimestamp,
          endDatetime: selectedSession.endTimestamp
        }
      : skipToken
  );

  /**
   * Query for sessions kpi
   */
  const {
    data: cleaningSessionKpiData,
    isFetching: cleaningSessionKpiFetching,
    error: cleaningSessionKpiError
  } = useGetMachineCleaningSessionsKpiQuery(
    selectedSession
      ? {
          machineId,
          avgSessions: averageDuration
        }
      : skipToken
  );

  /**
   * Attempt to get the last cleaning session by default when the page loads.
   */
  const {
    data: lastSessionData,
    isLoading: lastSessionLoading,
    error: errorLastSession
  } = useGetMachineLastCleaningSessionQuery({ machineId });

  /**
   * Set the selected session to the last session once it is available
   */
  useEffect(() => {
    // Exit early if there already is a selected session (e.g. if the user has already selected a session using
    // the session selection UI, before the latest session data has loaded)
    if (selectedSession) {
      return;
    }

    if (lastSessionData) {
      if (lastSessionData?.startTime && lastSessionData?.endTime) {
        // The API response that returns lastSessionData returns the session in a slightly
        // different format to useGetMachineCleaningSessionsQuery. So we must manually
        // construct a CleaningSession type from this data.
        const session: CleaningSession = {
          startTimestamp: lastSessionData?.startTime,
          endTimestamp: lastSessionData?.endTime,
          // alarms is not used in the UI, but is required to satisfy the type, so we just set it to 0
          alarms: 0
        };
        setSelectedSession(session);
      } else {
        // lastSessionData has loaded, but there was no valid session data contained in it.
        setNoSessionsMessageVisible(true);
      }
    }
  }, [lastSessionData, selectedSession]);

  const closeSessionSelector = () => {
    setSessionSelectorVisible(false);
  };

  const onSelectSteps = (steps: string[]) => {
    if (isEqual(selectedSteps, allStepsIds)) {
      setSelectedSteps([...steps]);
    } else if (steps.every((step) => selectedSteps.includes(step))) {
      setSelectedSteps(allStepsIds);
    } else {
      setSelectedSteps([...selectedSteps, ...steps]);
    }
  };

  // Aggregate data, error, and loading  state from all requests necessary to render the page
  const pageIsFetching =
    stepsFetching || waitingStatesFetching || utilityMetricsFetching || cleaningSessionKpiFetching;

  const pageHasError =
    stepsError || waitingStatesError || utilityMetricsError || cleaningSessionKpiError;

  let lastSessionError = '';
  if (errorLastSession) {
    if ('data' in errorLastSession) {
      const sessionErr = errorLastSession.data as Record<string, unknown>;
      if (sessionErr.detail) {
        lastSessionError = sessionErr.detail as string;
      }
    }
  }

  const cleaningStateWidgetSettings = {
    title: 'Cleaning State',
    hasError: lastSessionError,
    isLoading: lastSessionLoading
  };

  const issuesWidgetSettings = {
    title: 'Issues Selected Session',
    hasError: t('error_loading_issues_data_no_cleaning_session'),
    linksToPathTooltipContent: t('all_alarms_and_alerts_within_session'),
    showIconHelper: true
  };

  return (
    <>
      <ActionItemsContainer>
        <>
          <StyledLabel>
            <Typography mb={0} size="0.8rem" as="label" weight="bold">
              {t('show_me')}
            </Typography>
          </StyledLabel>
          <Button
            arrow={true}
            onClick={() => setSessionSelectorVisible(true)}
            variant={'thin'}
            width="auto"
          >
            {formatSessionName(selectedSession, timeZone)}
          </Button>
        </>
      </ActionItemsContainer>

      {!pageIsFetching && pageHasError && (
        <Typography color="negativeRed">{t('failed_to_load_cleaning_session_data')}</Typography>
      )}

      {noSessionsMessageVisible && (
        <NoSessionsMessage>
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <Typography size="0.875rem" mb={0}>
            {t('no_cleaning_session_data_available')}
          </Typography>
        </NoSessionsMessage>
      )}
      <>
        <CardsContainer>
          <CleaningSessionDurationCard
            isLoading={cleaningSessionKpiFetching}
            cleaningSessionKpiData={cleaningSessionKpiData}
            selectedSession={selectedSession}
            setSessionSelectorVisible={setSessionSelectorVisible}
          />
          <DashboardWidget {...cleaningStateWidgetSettings}>
            <SingleValueCard
              value1={{
                value: utilityMetricsData ? utilityMetricsData.status : '-',
                unit: 'Finished State',
                weight: 'normal',
                size: '1.3125rem',
                mb: '0.625rem'
              }}
            />
          </DashboardWidget>
          {selectedSession ? (
            <IssuesPastSessionCard
              machineId={machineId}
              startTimestamp={selectedSession && selectedSession.startTimestamp}
              endTimestamp={selectedSession && selectedSession.endTimestamp}
            />
          ) : (
            <DashboardWidget {...issuesWidgetSettings} />
          )}
        </CardsContainer>
        <CleaningStepsTable
          // Add a unique key for this session to force a re-mount of CleaningStepsTable when the session changes
          // (to clear out its internal state)
          key={
            selectedSession
              ? `${selectedSession.startTimestamp}-${selectedSession.endTimestamp}`
              : uuid4()
          }
          data={stepsData || []}
          setSelectedAlarms={(alarms) => setSelectedAlarms(alarms)}
          setSelectedAlerts={(alerts) => setSelectedAlerts(alerts)}
        />
        <CleaningStepsChart
          stepsData={stepsData || []}
          waitingStatesData={waitingStatesData || []}
          // stepsCategoryColors={stepCategoryColorMap}
          getColorById={getColorById}
          dataIsGrouped={true}
          selectedSteps={selectedSteps}
          onSelectSteps={onSelectSteps}
        />
      </>
      <Flyout
        overflow={'visible'} // necessary for date selector to be visible
        width="28.125rem"
        visible={sessionSelectorVisible}
        onClose={closeSessionSelector}
      >
        <SessionSelector
          isV2
          close={closeSessionSelector}
          session={selectedSession}
          dateRange2={dateRange2}
          setDateRange2={setDateRange2}
          dateRange={dateRange}
          onSelectSession={setSelectedSession}
          onDateRangeChange={setDateRange}
          averageDuration={averageDuration}
          onAverageDurationChange={setAverageDuration}
          data={sessionsData}
          isLoading={isSessionsFetching}
          error={sessionsError}
          handleDateOpen={() => ({})}
        />
      </Flyout>
      <Flyout
        width="28.125rem"
        visible={!!(selectedAlarms || selectedAlerts)}
        onClose={() => {
          setSelectedAlarms(undefined);
          setSelectedAlerts(undefined);
        }}
      >
        <AlarmDetail
          alarms={selectedAlarms}
          alerts={selectedAlerts}
          onClose={() => {
            setSelectedAlarms(undefined);
            setSelectedAlerts(undefined);
          }}
        />
      </Flyout>
    </>
  );
};

export default SingleSession;
