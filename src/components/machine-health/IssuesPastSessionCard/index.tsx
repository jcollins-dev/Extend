import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

// 3rd party
import styled from 'styled-components';

// Helpers
import { toISO8601 } from 'helpers';

// Components
import { IssuesTable } from 'components/machine-health';
import { DashboardWidget } from 'components';

// Types
import { AlarmLocation } from 'types/machine-health/alarms';
import { AlertConfigAlertLocation, AlertLocation } from 'types/machine-health/alerts';

// Api
import {
  useGetAlertsByMachineIdQuery,
  useGetMachineAlarmsQuery,
  useGetMachineDataScienceAlertsQuery
} from 'api';
import { useTimeZone } from 'providers';

interface IssuesPastSessionCardProps {
  machineId: string;
  startTimestamp: string;
  endTimestamp?: string;
}

const TableContainer = styled.div`
  overflow-y: auto;
  height: 100%;
  max-height: 12.5rem;
  padding: 0.5rem;
`;

const MIN_SCROLL_HEIGHT = 145;

const IssuesPastSessionCard = ({
  machineId,
  startTimestamp,
  endTimestamp
}: IssuesPastSessionCardProps): ReactElement => {
  const startDatetime = startTimestamp && toISO8601(new Date(startTimestamp));
  const endDatetime = endTimestamp && toISO8601(new Date(endTimestamp));
  const { timeZone } = useTimeZone();
  const {
    data: alarmsData,
    isLoading: alarmsLoading,
    error: alarmsError
  } = useGetMachineAlarmsQuery({
    machineId,
    location: AlarmLocation.CLE,
    startDatetime,
    endDatetime
  });

  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError
  } = useGetMachineDataScienceAlertsQuery({
    machineId,
    startDatetime,
    endDatetime,
    location: AlertLocation.Cleaning
  });

  const {
    data: machineAlerts,
    error: machineAlertsError,
    isLoading: machineAlertsLoading
  } = useGetAlertsByMachineIdQuery({
    machineId,
    active: true,
    startDatetime,
    endDatetime,
    locations: [AlertConfigAlertLocation.Cleaning]
  });

  const isLoading = alarmsLoading || alertsLoading || machineAlertsLoading;
  const hasError = alarmsError || alertsError || machineAlertsError;
  const { t } = useTranslation(['mh']);

  const widgetSettings = {
    title: 'Issues Selected Session',
    isLoading: isLoading ? true : false,
    hasError: hasError && t('failed_to_load_issues_data'),
    linksToPathTooltipContent: t('all_alarms_and_alerts_within_session'),
    showIconHelper: true
  };

  return (
    <DashboardWidget {...widgetSettings}>
      <TableContainer>
        <IssuesTable
          scrollHeight={MIN_SCROLL_HEIGHT}
          alarmsData={isLoading ? [] : alarmsData}
          alertsData={isLoading ? [] : alertsData}
          machineAlerts={isLoading ? [] : machineAlerts}
          isLoading={isLoading}
          compact={true}
          timeZone={timeZone}
        />
      </TableContainer>
    </DashboardWidget>
  );
};

export default IssuesPastSessionCard;
