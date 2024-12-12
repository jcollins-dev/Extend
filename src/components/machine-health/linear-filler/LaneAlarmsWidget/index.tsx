// 3rd party libs
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import { KPICard } from 'components';
import { useContainerSize } from 'hooks';
import { Loader } from 'components';
import Typography from 'components/Typography/Typography';

// Theme
import theme from 'themes';

// Hooks
import { useColorMap } from 'hooks';

// Types
import { AsepticMachineHealthInterval } from 'types/machine-health';
import { useGetAsepticMachineHealthAlarmByLaneQuery } from 'api';

import { AlarmWithDay, filterBarChartData } from 'pages/ProteinMachine/MachineHealth/Alarms';
import { AlarmType } from 'types/machine-health/alarms';
import moment from 'moment';
import AlarmsStackedBarChartWidget from '../AlarmsStackedBarChartWidget';

const ChartContainer = styled.div`
height: 15.938rem;
width= 100%;
display: flex;
gap: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const headerRenderer = (heading?: string, address?: string) => {
  return (
    <HeaderContainer>
      <Typography mb={0} size="1rem" weight="bold">
        {heading}
      </Typography>
      <Typography mb={0} size="0.875rem" weight="normal">
        {address}
      </Typography>
    </HeaderContainer>
  );
};
const LaneAlarmsWidget = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { t } = useTranslation(['mh']);
  const {
    data,
    isFetching: isSessionsFetching,
    error: sessionsError
  } = useGetAsepticMachineHealthAlarmByLaneQuery({
    machineId,
    kpiDataInterval: AsepticMachineHealthInterval.Last3Days
  });
  // Process fetched data for empty strings in alarm type field - defaults to "Undefined"
  const alarmsData = cloneDeep(data)?.filter((alarm) => alarm) as AlarmWithDay[];

  alarmsData?.forEach((alarm) => {
    if ((alarm.type as string) === '') {
      alarm.type = AlarmType.Undefined;
    }

    // Codes come back as numbers from API
    alarm.code = alarm.code.toString();
    // Decorare alarm with start of day at machine time zone
    alarm.day = moment(alarm.startTimestamp).tz('UTC').startOf('day').format();
  });

  // Stacked Bar Chart
  const stackedBarChartData = useMemo(() => filterBarChartData(alarmsData), [alarmsData]);
  const { containerRef: graphContainerRef } = useContainerSize();
  const { containerRef: headerRef } = useContainerSize();
  const getColorById = useColorMap(theme.colors.alarmIdColors);
  const onDayFilterBarClick = useCallback((date: string) => ({ type: 'FILTER_BY_DATE', date }), []);

  return (
    <KPICard component={headerRenderer('Lane alarms', 'Last 3 days')} ref={headerRef}>
      <ChartContainer ref={graphContainerRef}>
        {sessionsError && (
          <Typography color="negativeRed" style={{ marginLeft: '2rem', marginTop: '1.5rem' }}>
            {t('failed_to_load_lane_alarms_data')}
          </Typography>
        )}
        {!sessionsError &&
          (isSessionsFetching ? (
            <Loader margin="auto" />
          ) : (
            data &&
            stackedBarChartData && (
              <AlarmsStackedBarChartWidget
                barValueType="count"
                onBarClick={onDayFilterBarClick}
                data={stackedBarChartData}
                timeZone={'UTC'}
                getColorById={getColorById}
              />
            )
          ))}
      </ChartContainer>
    </KPICard>
  );
};

export default LaneAlarmsWidget;
