// 3rd party libs
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

// Components
import { WidgetUi, Icon, useDateRange } from 'components';

import { IssuesTable } from 'components/machine-health';

// hooks
// import useMachineActiveIssues from 'hooks/useMachineActiveIssues';

// Providers
import { useTimeZone } from 'providers/timeZoneProvider';

// API
import {
  useGetAlertsByMachineIdQuery,
  useGetMachineAlarmsQuery,
  useGetMachineDataScienceAlertsQuery
} from 'api';

// Types
import { ProteinMachineRouteQueryParams } from 'types/protein';
import { Alarm } from 'types/machine-health/alarms';
import { Alert } from 'types/machine-health/alerts';
import { MachineType } from 'types/machine-health';

const MIN_SCROLL_HEIGHT = 175;

type Props = {
  machineType?: MachineType.Aseptic | MachineType.DSI | undefined;
  linksToPath?: string;
  onClick?: () => void;
  scrollHeight?: number;
  height?: string;
  title?: string;
  tooltipContent?: string;
  alarmsDataIn?: Alarm[];
  alertsDataIn?: Alert[];
  hideArrow?: boolean;
  ga?: string;
};

const StyledIssuesTable = styled.div`
  max-height: 200px;
  overflow: auto;

  .rc-table {
    border-radius: 0 !important;
    border-width: 0;

    tbody {
      height: 100%;
    }
  }
`;

interface MachineAlertsOnlyWidgetProps {
  machineId: string;
  gridArea?: string;
}

/* please keep for reference: 
alert data return obj: {
  id: string;
  internalId: string;
  description: string;
  alertType: AlertType ('operations' || 'maintenance');
  createdAt: string;
  status: AlertStatus ('completed' || 'no_completed);
}*/

export const MachineAlertsOnlyWidget = ({
  machineId,
  gridArea
}: MachineAlertsOnlyWidgetProps): JSX.Element => {
  const { t } = useTranslation(['mh']);

  /* const { data, isLoading, error } = useGetMachineDataScienceAlertsQuery(
    {
      machineId,
      status: AlertStatus.NotComplete
    },
    { pollingInterval: 30000 }
  ) */

  const {
    data: machineAlerts,
    error: machineAlertsError,
    isLoading: machineAlertsLoading
  } = useGetAlertsByMachineIdQuery({
    machineId,
    active: true
  });

  const widgetSettings = {
    gridArea,
    title: t('alerts') as string,
    isLoading: machineAlertsLoading ? true : false,
    hasError: machineAlertsError && (t('failed_to_alerts_data') as string),
    hasMessage:
      !machineAlertsLoading && !machineAlertsError && !machineAlerts?.length
        ? `No ${t('alerts')} to Report`
        : undefined,
    Main: (
      <StyledIssuesTable className="widget-ui-main no-padding">
        <IssuesTable
          alarmsData={[]} //!alarmsDataIn ? (isLoading || !alarmsData ? [] : alarmsData) : alarmsDataIn}
          alertsData={[]} //!alertsDataIn ? (isLoading || !alertsData ? [] : alertsData) : alertsDataIn}
          machineAlerts={machineAlerts}
          //timeZone={timeZone}
          scrollHeight={125}
          compact={true}
        />
      </StyledIssuesTable>
    )
  };

  return <WidgetUi {...widgetSettings} />;
};

const MachineActiveIssues = ({ linksToPath, machineType, ga, ...rest }: Props): JSX.Element => {
  const { timeZone } = useTimeZone();
  const history = useHistory();
  const { machineId } = useParams<ProteinMachineRouteQueryParams>();
  const { t } = useTranslation(['mh']);

  const { startTime, endTime } = useDateRange().isoDateRange;

  const {
    data: alarmsData,
    isLoading: alarmsLoading,
    error: alarmsError
  } = useGetMachineAlarmsQuery({
    machineId,
    startDatetime: startTime,
    endDatetime: endTime
  });

  console.log('alarmsError', alarmsError);

  const filteredAlarmsData = alarmsData?.filter((alarmData) => !alarmData.endTimestamp);

  const {
    data: machineAlerts,
    error: machineAlertsError,
    isLoading: machineAlertsLoading
  } = useGetAlertsByMachineIdQuery({
    machineId,
    active: true
  });

  console.log('machineAlerts', machineAlerts);

  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError
  } = useGetMachineDataScienceAlertsQuery({
    machineId,
    startDatetime: startTime,
    endDatetime: endTime
  });

  const isLoading = alarmsLoading || alertsLoading || machineAlertsLoading;

  // On a first render we show load icon, but hide when page stays open and keeps receiving new data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [isLoading]);

  // TODO: Remove the check for DSI once DSI has alarms, just removing the error msg for DSI as requested temporarily*/
  const isDSI = machineType === MachineType.DSI;

  const hasError =
    (alarmsError || machineAlertsError) && !isDSI
      ? (t('failed_to_alarms_data') as string)
      : alertsError && (t('failed_to_alerts_data') as string);

  let hasMessage: string | undefined = undefined;

  if (!isLoading && !hasError) {
    if (!filteredAlarmsData?.length) {
      hasMessage = `No ${t('active_issues')} to Report`;
    }
  }

  const widgetSettings = {
    gridArea: ga,
    title: t('active_issues') as string,
    isLoading,
    //isLoading: isFirstRender.current ? (isLoading ? true : false) : false,
    hasError,
    IconRight: !hasMessage
      ? {
          Icon: <Icon.ArrowRight />,
          handleClick: () => linksToPath && history.push(linksToPath),
          tooltip: `view ${t('active_issues')}`,
          label: `view ${t('active_issues')}`
        }
      : undefined,
    hasMessage,
    Main: (
      <StyledIssuesTable className="widget-ui-main no-padding">
        <IssuesTable
          scrollHeight={MIN_SCROLL_HEIGHT}
          alarmsData={isLoading ? [] : filteredAlarmsData}
          alertsData={isLoading ? [] : alertsData}
          machineAlerts={isLoading ? [] : machineAlerts}
          isLoading={isLoading}
          timeZone={timeZone}
        />
      </StyledIssuesTable>
    ),
    ...rest
  };
  return <WidgetUi {...widgetSettings} />;
};

export default MachineActiveIssues;
