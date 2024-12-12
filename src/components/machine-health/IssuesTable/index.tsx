// 3rd party libs
import React, { useCallback, useMemo, useState } from 'react';
import styled, { useTheme, DefaultTheme } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGear,
  faScrewdriverWrench,
  faArrowRight,
  faTriangleExclamation,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from 'rc-tooltip';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BaseTable, Typography, Flyout } from 'components';
import { AlertDataScienceSurvey } from 'components/machine-health';

// Types
import { ColumnConfig, BaseType } from 'types';
import { Alarm } from 'types/machine-health/alarms';
import {
  Alert,
  AlertType,
  AlertStatus,
  MachineAlert,
  AlertColor,
  AlertCriticality
} from 'types/machine-health/alerts';

// Helpers
import { getDurationBetweenTimestamps, formatDate } from 'helpers';

// Icons
import { RewindIcon } from 'icons';

export enum RowType {
  Alarm,
  Alert,
  MachineAlert
}

export interface TableRow extends BaseType {
  rowType: RowType;
  key: string;
  duration?: string;
  startDateTime: Date;
  description?: string;
  alarmCode?: string;
  alertStatus?: AlertStatus;
  alertId?: string;
  alertType?: string;
  severity?: AlertColor;
  importance?: AlertCriticality;
}

interface Props {
  alarmsData?: Alarm[];
  alertsData?: Alert[];
  machineAlerts?: MachineAlert[];
  isLoading?: boolean;
  showHeader?: boolean;
  // Setting scrollheight sets a fixed height and enables vertical scrolling
  scrollHeight?: number;
  // Reduce cell padding, when space is limited
  compact?: boolean;
  // Machine timezone
  timeZone?: string;
}

const IconButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  width: 2.75rem;
  height: 2.75rem;
`;

const DateLabel = styled.span`
  font-weight: bold;
`;

// Generate the configurations for each column of this table
const generateColumnConfigs = (
  theme: DefaultTheme,
  onButtonClick: (id: string) => void,
  compact: boolean,
  t: TFunction<'mh'[], undefined>,
  timeZone?: string
): ColumnConfig[] => {
  return [
    {
      title: '',
      dataIndex: 'icon',
      key: 'icon',
      width: compact ? '2rem' : '2.9375rem',
      render(_, data) {
        const rowData = data as TableRow;
        let bgColor = 'transparent';
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
          tooltipContent = t('alarm');
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
              bgColor = theme.colors.atRiskYellow4;
              return faGear;

            case rowData.rowType === RowType.MachineAlert:
              return faBell;

            default:
              return faScrewdriverWrench;
          }
        };

        const icon = getIcon();

        return {
          props: {
            style: { padding: 0, background: bgColor, textAlign: 'center' }
          },
          children: (
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
          )
        };
      }
    },
    {
      title: t('start_date', { ns: 'common' }) as string,
      dataIndex: 'startDate',
      key: 'startDate',
      render(_, data) {
        const rowData = data as TableRow;
        const durationNode = (
          <span>
            <DateLabel>{formatDate(rowData.startDateTime, 'long', timeZone)}</DateLabel>
            <br />
            {formatDate(rowData.startDateTime, 'hours-minutes-seconds', timeZone)}
          </span>
        );
        // Only show duration tooltip for Alarms
        if (rowData.rowType === RowType.Alarm && rowData?.duration !== '-') {
          return {
            children: (
              <Tooltip
                placement="top"
                overlay={
                  <Typography color="white" size="0.8125rem" mb={0}>
                    {t('duration', { ns: 'common' })}: {rowData.duration}
                  </Typography>
                }
              >
                {durationNode}
              </Tooltip>
            )
          };
        } else {
          return durationNode;
        }
      }
    },
    {
      title: t('description', { ns: 'common' }) as string,
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: t('id_type') as string,
      dataIndex: 'alarmCode',
      key: 'alarmCode'
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: '2.9375rem',
      render(_, data) {
        const rowData = data as TableRow;
        // Do not show button for Alarms
        if (rowData.rowType === RowType.Alarm || rowData.rowType === RowType.MachineAlert) {
          return null;
        }

        let children;
        if (rowData.alertStatus === AlertStatus.Complete) {
          children = (
            <Tooltip
              placement="left"
              overlay={
                <Typography color="white" size="0.8125rem" mb={0}>
                  {t('response_has_already')}
                  <br />
                  {t('been_recorder')}
                </Typography>
              }
            >
              {RewindIcon()}
            </Tooltip>
          );
        } else {
          children = (
            <IconButton
              onClick={() => {
                rowData.alertId && onButtonClick(rowData.alertId);
              }}
            >
              <FontAwesomeIcon style={{ fontSize: '1rem' }} icon={faArrowRight} />
            </IconButton>
          );
        }

        return {
          props: {
            style: {
              padding: 0,
              textAlign: 'center'
            }
          },
          children
        };
      }
    }
  ];
};

/**
 * Component to display combined machine Alarms and Alerts in one table, ordered by date
 */
const IssuesTable = ({
  alarmsData,
  alertsData,
  machineAlerts,
  isLoading,
  scrollHeight,
  showHeader,
  compact = false,
  timeZone
}: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation(['mh']);

  const formattedData: TableRow[] = useMemo(() => {
    if (!alarmsData || !alertsData) {
      return [];
    }

    // Convert Alarms to TableRows to be rendered by the table
    const alarmRows: TableRow[] = alarmsData.map((alarm: Alarm, index) => {
      const startDateTime = new Date(alarm.startTimestamp);
      return {
        key: `${alarm.startTimestamp}-${alarm.endTimestamp}-${alarm.code}-${index}`,
        duration: getDurationBetweenTimestamps(alarm.startTimestamp, alarm.endTimestamp),
        startDateTime,
        rowType: RowType.Alarm,
        description: alarm.description,
        alarmCode: alarm.code
      };
    });

    // Convert Alerts to TableRows to be rendered by the table
    const alertRows: TableRow[] = alertsData.map((alert: Alert) => {
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
    });

    // Convert Machine Alerts to TableRows to be rendered by the table
    const machineAlertRows: TableRow[] =
      machineAlerts?.map((alert: MachineAlert) => {
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

    // Combine Alarms and Alerts rows into one array
    const combinedRows: TableRow[] = [...alarmRows, ...alertRows, ...machineAlertRows];

    // Then order rows by startDateTime
    const sortedRows = combinedRows.sort((a, b) => {
      // sort in descending order (from newest to oldest)
      return b.startDateTime.getTime() - a.startDateTime.getTime();
    });

    return sortedRows;
  }, [alarmsData, alertsData, machineAlerts]);

  // Flyout
  const [alertIdDetail, setAlertIdDetail] = useState('');
  const closeFlyout = useCallback(() => setAlertIdDetail(''), []);

  const onAlertDetailsButtonClick = (id: string) => {
    setAlertIdDetail(id);
  };

  return (
    <>
      <BaseTable
        columnConfigs={generateColumnConfigs(
          theme,
          onAlertDetailsButtonClick,
          compact,
          t,
          timeZone
        )}
        alternatingRowColoring={false}
        data={formattedData}
        borderBottomRow
        headerBgColor={theme.colors.white}
        isDataLoading={isLoading}
        scroll={scrollHeight ? { y: scrollHeight } : {}}
        outerBorderColor={theme.colors.mediumGrey1}
        showHeader={showHeader}
        cellPadding={compact ? '0.5rem 0.3rem' : undefined}
        renderCustomEmptyText={() => {
          return (
            <Typography
              color="darkGrey"
              weight="medium"
              style={{ marginLeft: '1.25rem', marginTop: '1.5rem' }}
            >
              {t('no_issues_to_report')}
            </Typography>
          );
        }}
      />
      <Flyout width="28.125rem" visible={!!alertIdDetail} onClose={closeFlyout}>
        <AlertDataScienceSurvey dataScienceAlertId={alertIdDetail} onClose={closeFlyout} />
      </Flyout>
    </>
  );
};

export default IssuesTable;
