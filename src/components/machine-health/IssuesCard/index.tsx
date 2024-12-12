// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { DashboardWidget } from 'components';
import { IssuesTable } from 'components/machine-health';

// Types
import { AlarmLocation } from 'types/machine-health/alarms';
import { AlertConfigAlertLocation, AlertLocation } from 'types/machine-health/alerts';

// Api
import {
  useGetAlertsByMachineIdQuery,
  useGetMachineAlarmsQuery,
  useGetMachineDataScienceAlertsQuery
} from 'api';

// Helpers
import { toISO8601 } from 'helpers';
import { useTimeZone } from 'providers';

const MIN_SCROLL_HEIGHT = 175;

interface Props {
  machineId: string;
  alarmsLocation: AlarmLocation;
  alertsLocation: AlertLocation;
  machineAlertsLocation: AlertConfigAlertLocation;
  startTime: Date;
  endTime: Date;
}

const Container = styled.div<{ showBottomBorder: boolean }>`
  height: 100%;

  /* We override some BaseTable styles here, as in this use case we want the table to always take up the
  full height of the container, even when there are not enough Alarm rows to enable scrolling. (The default
  behaviour of BaseTable is to shrink vertically when there are not enough rows to fill up the scroll height,
  when vertical scrollling is enabled) */
  .rc-table-body {
    min-height: ${MIN_SCROLL_HEIGHT}px;
  }

  /* Enable border on the last row when there is not enough data to make it scroll.
  Do not show when loading. */
  .rc-table-container {
    div:last-of-type {
      table {
        border-bottom: ${({ theme, showBottomBorder }) =>
          showBottomBorder && theme.colors.borders.border02.border};
      }
    }
  }
`;

const StyledTableSpacer = styled.div`
  padding: 1.125rem;
`;

/**
 * Loads Alarms and Alerts data for a given time range, machine id, and location, and passes
 * data to an instance of IssuesTable to render.
 */
const IssuesCard = ({
  machineId,
  alarmsLocation,
  alertsLocation,
  machineAlertsLocation,
  startTime,
  endTime
}: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const {
    data: alarmsData,
    isLoading: alarmsLoading,
    error: alarmsError
  } = useGetMachineAlarmsQuery({
    machineId,
    locationId: alarmsLocation,
    startDatetime: toISO8601(startTime, timeZone),
    endDatetime: toISO8601(endTime, timeZone)
  });
  const filteredAlarmsData = alarmsData?.filter((alarmData) => !alarmData.endTimestamp);

  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError
  } = useGetMachineDataScienceAlertsQuery({
    machineId,
    startDatetime: toISO8601(startTime, timeZone),
    endDatetime: toISO8601(endTime, timeZone),
    location: alertsLocation
  });

  const {
    data: machineAlerts,
    error: machineAlertsError,
    isLoading: machineAlertsLoading
  } = useGetAlertsByMachineIdQuery({
    machineId,
    active: true,
    startDatetime: toISO8601(startTime, timeZone),
    endDatetime: toISO8601(endTime, timeZone),
    locations: [machineAlertsLocation]
  });

  const isLoading = alarmsLoading || alertsLoading || machineAlertsLoading;
  const hasError = alarmsError || alertsError || machineAlertsError;
  const { t } = useTranslation(['mh']);

  const totalItems =
    (filteredAlarmsData?.length || 0) + (alertsData?.length || 0) + (machineAlerts?.length || 0);
  const showBottomBorder = isLoading ? false : totalItems < 3;

  return (
    <Container showBottomBorder={showBottomBorder}>
      <DashboardWidget
        hasError={hasError && (t('failed_to_load_issues_data') as string)}
        title={t('active_issues') as string}
      >
        <StyledTableSpacer>
          <IssuesTable
            scrollHeight={MIN_SCROLL_HEIGHT}
            alarmsData={isLoading ? [] : filteredAlarmsData}
            alertsData={isLoading ? [] : alertsData}
            machineAlerts={isLoading ? [] : machineAlerts}
            isLoading={isLoading}
            timeZone={timeZone}
          />
        </StyledTableSpacer>
      </DashboardWidget>
    </Container>
  );
};

export default IssuesCard;
