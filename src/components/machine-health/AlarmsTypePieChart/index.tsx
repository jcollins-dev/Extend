// 3rd party libs
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { lighten } from 'polished';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

// Components
import { Card, Typography, PieChart, GraphLegend } from 'components';
import ToolTip from './Tooltip';

// Types
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import { PieSliceDatum } from 'components/PieChart';

// Helpers
import { sortPieChartData } from 'helpers/machine-health';

// Theme
import theme from 'themes';

interface Props {
  data: Alarm[];
  selectedType?: AlarmType;
  selectedId?: string;
  selectedIdType?: AlarmType;
  onSliceClick: (e: AlarmType) => void;
}

const CardContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LegendsContainer = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    margin: 0 0.5rem 0.5rem 0;
  }
`;

interface DataGroup {
  alarmType: AlarmType;
  alarmId?: string;
  count: number;
}

export const groupData = (
  data: Alarm[],
  selectedType?: AlarmType,
  selectedId?: string,
  selectedIdType?: AlarmType
): PieSliceDatum[] => {
  const selectedGroups: DataGroup[] = [];
  const dataGroups: DataGroup[] = [];

  // count occurrences of selected alarm id
  data
    .filter((alarm) => alarm.code === selectedId)
    .map((alarm) => {
      const trackedCount = selectedGroups.findIndex(
        (dataGroup) => dataGroup.alarmType === alarm.type
      );
      trackedCount > -1
        ? (selectedGroups[trackedCount].count += 1)
        : selectedGroups.push({ alarmType: alarm.type, count: 1, alarmId: alarm.code });
    });

  // count occurrences of each alarm type
  data
    .filter((alarm) => {
      return selectedIdType
        ? alarm.type === selectedIdType && alarm.code !== selectedId
        : alarm.code !== selectedId;
    })
    .map((alarm) => {
      const trackedCount = dataGroups.findIndex((dataGroup) => dataGroup.alarmType === alarm.type);
      trackedCount > -1
        ? (dataGroups[trackedCount].count += 1)
        : dataGroups.push({ alarmType: alarm.type, count: 1 });
    });

  const mergedDataGroups = [...dataGroups, ...selectedGroups];
  const totalFilteredAlarms = mergedDataGroups.reduce(
    (total, dataGroup) => total + dataGroup.count,
    0
  );

  const group = _(mergedDataGroups)
    .groupBy((d) => d.alarmType)
    .value();

  const orderedByAlarmType = _.flattenDeep([
    group[AlarmType.CriticalAlarm] || [],
    group[AlarmType.Alarm] || [],
    group[AlarmType.WarningInformation] || [],
    group[AlarmType.Undefined] || []
  ]);

  return orderedByAlarmType.map((dataGroup): PieSliceDatum => {
    const computedPercentage = (dataGroup.count / totalFilteredAlarms) * 100;
    const isNotSelectedType = !!selectedType && selectedType !== dataGroup.alarmType;
    return {
      id: dataGroup.alarmType,
      label: `${computedPercentage.toFixed(2)}%`,
      percent: computedPercentage,
      color: dataGroup.alarmId
        ? lighten(0.07, theme.colors.alarmStatusColors[dataGroup.alarmType])
        : theme.colors.alarmStatusColors[dataGroup.alarmType],
      hidden: isNotSelectedType,
      highlight: !isNotSelectedType && dataGroup.alarmId !== undefined,
      tooltip: (
        <ToolTip
          label={`${dataGroup.alarmId || dataGroup.alarmType}`}
          count={dataGroup.count}
          percent={computedPercentage}
        />
      )
    };
  });
};

export const AlarmsTypePieChartOnly = ({
  data,
  onSliceClick,
  selectedType,
  selectedId,
  selectedIdType
}: Props): JSX.Element => {
  const theme = useTheme();

  const pieChartData = useMemo(
    () => groupData(data, selectedType, selectedId, selectedIdType).sort(sortPieChartData),
    [data, selectedType, selectedId, selectedIdType]
  );

  return (
    <CardContentContainer>
      <PieChart data={pieChartData} onSliceClick={(slice) => onSliceClick(slice.id as AlarmType)} />
      <LegendsContainer>
        {[
          AlarmType.CriticalAlarm,
          AlarmType.Alarm,
          AlarmType.WarningInformation,
          AlarmType.Undefined
        ].map((alarmType) => {
          const isActive =
            (!selectedType || alarmType === selectedType) &&
            (!selectedIdType || alarmType === selectedIdType) &&
            true;

          return (
            <GraphLegend
              id={alarmType}
              key={alarmType}
              label={alarmType}
              active={isActive}
              color={theme.colors.alarmStatusColors[alarmType as AlarmType]}
              onClick={() => onSliceClick(alarmType as AlarmType)}
            />
          );
        })}
      </LegendsContainer>
    </CardContentContainer>
  );
};

const AlarmsTypePieChart = ({
  data,
  onSliceClick,
  selectedType,
  selectedId,
  selectedIdType
}: Props): JSX.Element => {
  const theme = useTheme();

  const pieChartData = useMemo(
    () => groupData(data, selectedType, selectedId, selectedIdType).sort(sortPieChartData),
    [data, selectedType, selectedId, selectedIdType]
  );

  const { t } = useTranslation(['mh']);

  return (
    <Card borderColor={theme.colors.mediumGrey1}>
      <Card.Header bgColor={theme.colors.lightGrey1}>
        <Typography color="darkGrey" weight="medium" size="1rem" as="span" mb={0}>
          {t('by_alarm_type')}
        </Typography>
      </Card.Header>
      <Card.Body>
        <CardContentContainer>
          <PieChart
            data={pieChartData}
            onSliceClick={(slice) => onSliceClick(slice.id as AlarmType)}
          />
          <LegendsContainer>
            {[
              AlarmType.CriticalAlarm,
              AlarmType.Alarm,
              AlarmType.WarningInformation,
              AlarmType.Undefined
            ].map((alarmType) => {
              const isActive =
                (!selectedType || alarmType === selectedType) &&
                (!selectedIdType || alarmType === selectedIdType) &&
                true;

              return (
                <GraphLegend
                  id={alarmType}
                  key={alarmType}
                  label={t(alarmType)}
                  active={isActive}
                  color={theme.colors.alarmStatusColors[alarmType as AlarmType]}
                  onClick={() => onSliceClick(alarmType as AlarmType)}
                />
              );
            })}
          </LegendsContainer>
        </CardContentContainer>
      </Card.Body>
    </Card>
  );
};

export default AlarmsTypePieChart;
