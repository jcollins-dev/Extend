// 3rd party libs
import React, { Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faGear,
  faScrewdriverWrench,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';

// Components
import { UiDataGrid } from '../elements/UiDataGrid.elements';
import { TableRow } from 'components/machine-health/IssuesTable';
import { Typography, Loader } from 'components';

// Helpers
import { getDurationBetweenTimestamps, formatDate } from 'helpers';

// Providers
import { useTimeZone } from 'providers/timeZoneProvider';

// API
import {
  useGetAlertsByMachineIdQuery,
  useGetMachineDataScienceAlertsQuery,
  useGetMachineOverviewAlarmsQuery
} from 'api';

// Types
import {
  Alert,
  AlertType,
  AlertStatus,
  MachineAlert,
  AlertColor
} from 'types/machine-health/alerts';
import { Alarm } from 'types/machine-health/alarms';

// Styles
const StyledHelperTextWrapper = styled.div`
  padding-left: 0.5rem;
  white-space: nowrap;
`;

interface ActiveIssuesTableProps {
  machineId: string;
}

enum RowType {
  Alarm,
  Alert,
  MachineAlert
}

const DateLabel = styled.span`
  font-weight: bold;
`;

const ActiveIssuesTable = ({ machineId }: ActiveIssuesTableProps): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh', 'common']);

  const { timeZone } = useTimeZone();

  const {
    data: alarmsData,
    isLoading: alarmsLoading,
    error: alarmsError
  } = useGetMachineOverviewAlarmsQuery({ machineId });
  const {
    data: alertsData,
    isLoading: alertsLoading,
    error: alertsError
  } = useGetMachineDataScienceAlertsQuery({
    machineId,
    status: AlertStatus.NotComplete
  });
  const {
    data: machineAlertsData,
    error: machineAlertsError,
    isLoading: machineAlertsLoading
  } = useGetAlertsByMachineIdQuery({
    machineId,
    active: true
  });

  const isLoading = alarmsLoading || alertsLoading || machineAlertsLoading;
  const isError = alarmsError || alertsError || machineAlertsError;

  const excludeHiddenAlarms = alarmsData?.filter(
    (alarm) => alarm?.location?.trim().toLocaleLowerCase() !== 'hidden'
  );

  const generateAlertIcon = (data: TableRow) => {
    const rowData = data as TableRow;
    let iconColor = theme.colors.atRiskYellow;
    let tooltipContent;

    if (rowData.rowType === RowType.Alert && rowData.alertType === AlertType.Operations) {
      tooltipContent = (
        <>
          {t('data_science_alert')}
          <br />
          {t('please_provide_feedback', { ns: 'common' })}
        </>
      );
    }

    if (rowData.rowType === RowType.Alarm) {
      iconColor = theme.colors.darkRed;
      tooltipContent = 'Alarm';
    }

    if (rowData.rowType === RowType.MachineAlert) {
      iconColor =
        rowData.severity === AlertColor.RED ? theme.colors.darkRed : theme.colors.atRiskYellow;
      tooltipContent = `${t('alert')}: ${rowData.importance}`;
    }

    const getIcon = () => {
      switch (true) {
        case rowData.rowType === RowType.Alarm:
          return faTriangleExclamation;
        case rowData.alertType === AlertType.Operations:
          return faGear;
        case rowData.rowType === RowType.MachineAlert:
          return faBell;
        default:
          return faScrewdriverWrench;
      }
    };

    const icon = getIcon();

    return (
      <Tooltip
        placement="top"
        overlay={
          <Typography color="white" size="0.8125rem" mb={0}>
            {tooltipContent}
          </Typography>
        }
      >
        <FontAwesomeIcon
          style={{ fontSize: '1.3rem', margin: '0 0.3rem' }}
          color={iconColor}
          icon={icon}
        />
      </Tooltip>
    );
  };

  const formatAlertTimeStmp = (data: TableRow) => {
    const rowData = data as TableRow;
    const durationNode = (
      <span>
        <DateLabel>{formatDate(rowData.startDateTime, 'long', timeZone)}</DateLabel>
        <br />
        {formatDate(rowData.startDateTime, 'hours-minutes-seconds', timeZone)}
      </span>
    );
    // Only show duration tooltip for Alarms
    if (rowData.rowType === RowType.Alarm) {
      return (
        <Tooltip
          placement="top"
          overlay={
            <Typography color="white" size="0.8125rem" mb={0}>
              {`${t('duration')}: ${rowData.duration}`}
            </Typography>
          }
        >
          {durationNode}
        </Tooltip>
      );
    } else {
      return durationNode;
    }
  };

  const formattedData: TableRow[] = useMemo(() => {
    // Convert Alarms to TableRows to be rendered by the table
    const alarmRows: TableRow[] | undefined =
      excludeHiddenAlarms?.map((alarm: Alarm, index) => {
        const startDateTime = new Date(alarm.startTimestamp);
        return {
          key: `${alarm.startTimestamp}-${alarm.endTimestamp}-${alarm.code}-${index}`,
          duration: getDurationBetweenTimestamps(alarm.startTimestamp, alarm.endTimestamp),
          startDateTime,
          rowType: RowType.Alarm,
          description: alarm.description,
          alarmCode: alarm.code
        };
      }) || [];

    // Convert Alerts to TableRows to be rendered by the table
    const alertRows: TableRow[] | undefined =
      alertsData?.map((alert: Alert) => {
        const startDateTime = new Date(alert.createdAt);
        return {
          key: alert.id,
          startDateTime,
          rowType: RowType.Alert,
          alertType: alert.alertType,
          description: alert.description,
          alertStatus: alert.status,
          alertId: alert.id
        };
      }) || [];

    // Converts MachineAlerts to TableRows to be rendered by the table
    const machineAlertRows: TableRow[] | undefined =
      machineAlertsData?.map((alert: MachineAlert) => {
        const startDateTime = alert.startTimestamp ? new Date(alert.startTimestamp) : new Date();
        const alarmCode = alert.triggerRule && t(alert.triggerRule);
        return {
          key: alert.id,
          startDateTime,
          rowType: RowType.MachineAlert,
          alertType: alert.triggerRule,
          description: alert.description,
          alarmCode,
          severity: alert.severity, // handle color
          importance: alert.importance // tooltip
        };
      }) || [];

    const combinedRows: TableRow[] = [...alarmRows, ...alertRows, ...machineAlertRows];

    // Then order rows by startDateTime
    const sortedRows = combinedRows.sort((a, b) => {
      // sort in descending order (from newest to oldest)
      return b.startDateTime.getTime() - a.startDateTime.getTime();
    });

    return sortedRows;
  }, [alarmsData, alertsData, machineAlertsData]);

  const GridRows = formattedData.map((item, i) => {
    let cellClass = i + 1 < formattedData.length ? `ui-cell` : `ui-cell last`;
    cellClass = item.alertType ? `${cellClass} ui-color-${item.alertType}` : cellClass;

    return (
      <Fragment key={`${item.key}${i}`}>
        <div className={`ui-icon ${cellClass}`}>
          <span className="sr-only">{item.alertType}</span>
          {generateAlertIcon(item)}
        </div>
        <div className={cellClass}>{formatAlertTimeStmp(item)}</div>
        <div className={cellClass}>{item.description}</div>
        <div className={cellClass}>{item.alarmCode}</div>
      </Fragment>
    );
  });

  const rows = GridRows.length ? (
    GridRows
  ) : (
    <StyledHelperTextWrapper>
      <p>{t('no_issues')}</p>
    </StyledHelperTextWrapper>
  );

  return (
    <UiDataGrid colSizes="1fr 2fr 3fr 1fr" className="style-alerts">
      <div className="ui-grid-header">{t('active_issues')}</div>
      <div className="ui-grid-column-headers">
        <div className={`ui-icon ui-cell column-header`}>
          <FontAwesomeIcon
            style={{ fontSize: '1.3rem', margin: '0 0.3rem' }}
            color={theme.colors.white}
            icon={faBell}
          />
        </div>
        <div className={'ui-cell column-header'}>{t('start_date', { ns: 'common' }) as string}</div>
        <div className={'ui-cell column-header'}>
          {t('description', { ns: 'common' }) as string}
        </div>
        <div className={'ui-cell column-header'}>{t('id_type') as string}</div>
      </div>
      <div className="ui-grid">
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <StyledHelperTextWrapper>
            <p>{t('error_loading_active_issues')}</p>
          </StyledHelperTextWrapper>
        ) : (
          rows
        )}
      </div>
    </UiDataGrid>
  );
};

export default ActiveIssuesTable;
