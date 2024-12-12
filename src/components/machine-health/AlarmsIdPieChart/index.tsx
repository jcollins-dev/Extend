// 3rd party libs
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

// Components
import { Card, Typography, PieChart } from 'components';
import ToolTip from './ToolTip';

// Types
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import { PieSliceDatum } from 'components/PieChart';

// Helpers
import { sortPieChartData } from 'helpers/machine-health';

interface Props {
  data: Alarm[];
  selectedId?: string;
  selectedType?: AlarmType;
  onSliceClick: (id: string, type: AlarmType) => void;
  getColorById: (id: string) => string;
}

const CardContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface DataGroup {
  alarmId: string;
  alarmDescription: string;
  count: number;
}

export const groupData = (
  data: Alarm[],
  getColorById: (id: string) => string,
  selectedId?: string,
  selectedType?: AlarmType
): PieSliceDatum[] => {
  const dataGroups: DataGroup[] = [];

  // count occurrences of each alarm
  data.forEach((alarm) => {
    const trackedCount = dataGroups.findIndex((dataGroup) => dataGroup.alarmId === alarm.code);
    trackedCount > -1
      ? (dataGroups[trackedCount].count += 1)
      : dataGroups.push({
          alarmId: alarm.code,
          alarmDescription: alarm.description ?? '',
          count: 1
        });
  });

  return dataGroups.map((dataGroup): PieSliceDatum => {
    const computedPercentage = (dataGroup.count / data.length) * 100;

    // logic to hide/show slice of pie chart
    const isNotSelectedId = !!selectedId && selectedId !== dataGroup.alarmId;
    const isNotSelectedType =
      !!selectedType &&
      selectedType !== data.find((alarm) => alarm.code === dataGroup.alarmId)?.type;
    const isHidden = isNotSelectedId || isNotSelectedType;

    return {
      id: dataGroup.alarmId,
      label: `${computedPercentage.toFixed(2)}%`,
      percent: computedPercentage,
      color: getColorById(dataGroup.alarmId),
      hidden: isHidden,
      tooltip: (
        <ToolTip
          label={`${dataGroup.alarmId} - ${dataGroup.alarmDescription}`}
          count={dataGroup.count}
          percent={computedPercentage}
        />
      )
    };
  });
};

export const AlarmsIdPieChartOnly = ({
  data,
  selectedId,
  selectedType,
  onSliceClick,
  getColorById
}: Props): JSX.Element => {
  const pieChartData = useMemo(
    () => groupData(data, getColorById, selectedId, selectedType).sort(sortPieChartData),
    [data, getColorById, selectedId, selectedType]
  );

  const onIdSliceClick = (slice: PieSliceDatum) => {
    // find the type associated with a given alarm code (each alarm code can only have one type)
    const filterAlarmsByCode = data.filter((alarm) => alarm.code === slice.id);
    const selectedType = filterAlarmsByCode[0]?.type;

    onSliceClick(slice.id, selectedType);
  };

  return (
    <CardContentContainer>
      <PieChart data={pieChartData} onSliceClick={onIdSliceClick} />
    </CardContentContainer>
  );
};

const AlarmsIdPieChart = ({
  data,
  selectedId,
  selectedType,
  onSliceClick,
  getColorById
}: Props): JSX.Element => {
  const theme = useTheme();

  const pieChartData = useMemo(
    () => groupData(data, getColorById, selectedId, selectedType).sort(sortPieChartData),
    [data, getColorById, selectedId, selectedType]
  );

  const onIdSliceClick = (slice: PieSliceDatum) => {
    // find the type associated with a given alarm code (each alarm code can only have one type)
    const filterAlarmsByCode = data.filter((alarm) => alarm.code === slice.id);
    const selectedType = filterAlarmsByCode[0]?.type;

    onSliceClick(slice.id, selectedType);
  };

  return (
    <Card borderColor={theme.colors.mediumGrey1}>
      <Card.Header bgColor={theme.colors.lightGrey1}>
        <Typography color="darkGrey" weight="medium" size="1rem" as="span" mb={0}>
          By Alarm ID
        </Typography>
      </Card.Header>
      <Card.Body>
        <CardContentContainer>
          <PieChart data={pieChartData} onSliceClick={onIdSliceClick} />
        </CardContentContainer>
      </Card.Body>
    </Card>
  );
};

export default AlarmsIdPieChart;
