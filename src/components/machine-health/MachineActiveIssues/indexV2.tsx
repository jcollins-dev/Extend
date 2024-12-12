import React, { useEffect, useRef, useState } from 'react';
import { WidgetUi, useDateRange } from 'components/StyledUi';
import { default as NoIssuesBell } from './assets/no_issues_bell.svg';
import { useMachineIssues } from 'hooks/useMachineAlarmsAlerts';
import { filterGivenDataByKeyValue, formatDataForTable } from './utils';
import { TableXS } from './TableXS/TableXS';
import { default as Bell } from './assets/bell.svg';
import moment from 'moment';

interface WrapperProps {
  gridArea?: string;
}

export const MachineIssuesWrapperAvure = ({ gridArea }: WrapperProps): JSX.Element => {
  const { alerts, isLoading, hasError } = useMachineIssues();

  const { startTime, endTime } = useDateRange().utcTZConvertedISO;

  const duration = moment.duration(moment(endTime).diff(moment(startTime)));
  const hours = duration.asHours();

  const [issuesData, setIssuesData] = useState<Record<string, unknown>[]>([]);

  const filter = {
    description: [
      'Rise in intensifier stroke count',
      'Pressurization time significantly higher than expected'
    ]
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    const alertsT = alerts as unknown as Record<string, unknown>[];
    const filteredData = filterGivenDataByKeyValue(alertsT, filter);
    const tableData = formatDataForTable(filteredData);

    setIssuesData(tableData);
  }, [alerts]);

  const hasDataToDisplay = issuesData.length === 0 ? false : true;

  const title = (
    <p>
      <span>Potential Health Concerns </span>
      <span className={`color-coded-title${hasDataToDisplay ? `--red` : `--green`}`}>
        ({issuesData.length} in last{' '}
        {hours > 48 ? `${parseInt(hours / 24)}days` : `${parseInt(hours)}hrs`})
      </span>
    </p>
  );

  const columnSettings = [
    {
      key: 'id',
      label: <img src={Bell} alt="alert" />
    },
    {
      key: 'timestamp',
      label: (e: string) => (
        <>
          <span>{e.split(',')[0]}</span>
          <span>{e.split(',')[1]}</span>
        </>
      )
    },
    {
      key: 'description',
      label: 'Message'
    }
  ];

  const tableSettings = {
    columnSettings: columnSettings,
    data: issuesData,
    customClass: 'active-issues'
  };

  const widgetSettings = {
    gridArea: gridArea,
    className: 'color-coded-widget',
    styleType: 'v2',
    title: title as unknown as HTMLElement,
    isLoading: isFirstRender.current ? (isLoading ? true : false) : false,
    hasError: hasError ? 'Error loading data' : undefined,
    Main: !hasDataToDisplay ? (
      <div className="widget-ui-main widget-ui-main--no_data">
        <img src={NoIssuesBell} title="No heath issues" />
        <p>No Health Issues</p>
      </div>
    ) : (
      <TableXS {...tableSettings} />
    )
  };

  return <WidgetUi {...widgetSettings} />;
};
