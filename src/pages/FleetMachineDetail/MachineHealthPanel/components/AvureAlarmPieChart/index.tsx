// 3rd party libs
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { lighten } from 'polished';
import _ from 'lodash';
import { WidgetUi } from 'components';

// Components
import { PieChart, GraphLegend } from 'components';

// Types
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import { PieSliceDatum } from 'components/PieChart';

// Helpers
import { sortPieChartData } from 'helpers/machine-health';
import { getEnumName } from 'helpers';

// Theme
import theme from 'themes';
import ToolTip from 'components/machine-health/AlarmsTypePieChart/Tooltip';

import { useTranslation } from 'react-i18next';

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
    group[AlarmType.AvureCriticalAlarm] || [],
    group[AlarmType.AvureProductAlarm] || [],
    group[AlarmType.AvureWarningAlarm] || []
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

const mapAvureAlarmTypeToLabel = (alarmType: AlarmType) => {
  const { t } = useTranslation(['mh']);

  switch (alarmType) {
    case AlarmType.AvureCriticalAlarm:
      return (
        t(getEnumName(AlarmType, AlarmType.AvureCriticalAlarm)) +
        ' (' +
        t(getEnumName(AlarmType, AlarmType.AvureCriticalAlarmOld)) +
        ')'
      );
    case AlarmType.AvureProductAlarm:
      return (
        t(getEnumName(AlarmType, AlarmType.AvureProductAlarm)) +
        ' (' +
        t(getEnumName(AlarmType, AlarmType.AvureProductAlarmOld)) +
        ')'
      );
    case AlarmType.AvureWarningAlarm:
      return (
        t(getEnumName(AlarmType, AlarmType.AvureWarningAlarm)) +
        ' (' +
        t(getEnumName(AlarmType, AlarmType.AvureWarningAlarmOld)) +
        ')'
      );
    default:
      return '';
  }
};

const AvureAlarmPieChart = ({
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
    <WidgetUi title="Alarms Types">
      <CardContentContainer>
        <PieChart
          data={pieChartData}
          onSliceClick={(slice) => onSliceClick(slice.id as AlarmType)}
        />
        <LegendsContainer>
          {[
            AlarmType.AvureCriticalAlarm,
            AlarmType.AvureProductAlarm,
            AlarmType.AvureWarningAlarm
          ].map((alarmType) => {
            const isActive =
              (!selectedType || alarmType === selectedType) &&
              (!selectedIdType || alarmType === selectedIdType) &&
              true;

            const label = mapAvureAlarmTypeToLabel(alarmType);

            return (
              <GraphLegend
                id={alarmType}
                key={alarmType}
                label={label}
                active={isActive}
                color={theme.colors.alarmStatusColors[alarmType as AlarmType]}
                onClick={() => onSliceClick(alarmType as AlarmType)}
              />
            );
          })}
        </LegendsContainer>
      </CardContentContainer>
    </WidgetUi>
  );
};

export default AvureAlarmPieChart;
