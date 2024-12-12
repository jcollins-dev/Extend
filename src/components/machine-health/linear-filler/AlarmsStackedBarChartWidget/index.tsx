// 3rd party libs
import React, { useMemo } from 'react';
import styled from 'styled-components';
import _, { groupBy, sortBy } from 'lodash';

// Components
import ToolTipContent from './ToolTipContent';

// Hooks
import { useContainerSize } from 'hooks';

// Types
import { Alarm, AlarmType } from 'types/machine-health/alarms';

// Helpers
import { DateRange } from 'helpers';

// Theme
import theme from 'themes';

// Providers
import StackedBarChartOverLane, {
  BarDatumLane
} from 'components/machine-health/linear-filler/StackedBarChartOverLane';

const GraphContainer = styled.div`
  flex: 1;
  padding-top: 2rem;
  padding-right: 2rem;
`;

type BarValueType = 'count' | 'hours';

interface DataGroup {
  alarmId?: string;
  alarmType: AlarmType;
  day: string; // ISO format at start of day with machine tz
  value: number;
  color: string;
}

// Aggregate Alarms data by date and type to render stacked bar chart
export const groupIntoBars = (
  data: Alarm[],
  barValueType: BarValueType,
  getColorById: (id: string) => string,
  timeZone: string,
  selectedId?: string,
  selectedType?: AlarmType
): BarDatumLane[][] => {
  const dataGroups: DataGroup[] = [];
  const alarmsGroupedByLane = groupBy(data, (alarm: Alarm) => {
    return alarm.location;
  });
  const alarmsGroupedByLaneSorted = sortBy(alarmsGroupedByLane);

  const alarmsGroupedByLaneSortedTop6 = alarmsGroupedByLaneSorted.reverse().slice(0, 6);
  for (const lane in alarmsGroupedByLaneSortedTop6) {
    const alarmGroup = alarmsGroupedByLaneSortedTop6[lane];
    const day = alarmGroup[0].location;
    const filteredAlarmGroups =
      selectedId || selectedType
        ? alarmGroup.filter((alarm) => {
            return (
              (!selectedId || alarm.code === selectedId) &&
              (!selectedType || alarm.type === selectedType)
            );
          })
        : alarmGroup;

    // Count the occurrences of each alarm type
    filteredAlarmGroups.map((alarm) => {
      const trackedCount = dataGroups.findIndex(
        (dataGroup) => alarm.type === dataGroup.alarmType && dataGroup.day === day
      );

      let delta = 1;
      if (barValueType == 'hours') {
        const end = alarm.endTimestamp ? new Date(alarm.endTimestamp) : new Date();
        delta = end.getTime() - new Date(alarm.startTimestamp).getTime();
      }

      trackedCount > -1
        ? (dataGroups[trackedCount].value += delta)
        : dataGroups.push({
            alarmId: alarm.code,
            alarmType: alarm.type,
            color: selectedId
              ? getColorById(selectedId)
              : theme.colors.alarmStatusColors[alarm.type],
            day: day,
            value: delta
          });
    });
  }

  if (barValueType == 'hours') {
    for (const group of dataGroups) {
      group.value = Math.round(group.value / 60000);
    }
  }

  const group = _(dataGroups)
    .groupBy((d) => d.alarmType)
    .value();

  const orderedByAlarmType = _.flattenDeep([
    group[AlarmType.CriticalAlarm] || [],
    group[AlarmType.Alarm] || [],
    group[AlarmType.WarningInformation] || [],
    group[AlarmType.Undefined] || [],
    group[AlarmType.AvureCriticalAlarm] || [],
    group[AlarmType.AvureProductAlarm] || [],
    group[AlarmType.AvureWarningAlarm] || [],
    group[AlarmType.AsepticFoilAlarm] || [],
    group[AlarmType.AsepticInfeedModule] || [],
    group[AlarmType.AsepticSealing] || []
  ]);

  return orderedByAlarmType.map((dataGroup): BarDatumLane[] => [
    {
      id: dataGroup.alarmId ?? '',
      name: dataGroup.alarmType,
      x: dataGroup.day,
      y: dataGroup.value,
      color: dataGroup.color,
      label: selectedId || selectedType ? dataGroup.value.toString() : undefined,
      toolTipData: {
        label: dataGroup.alarmType,
        day: dataGroup.day,
        count: dataGroup.value
      }
    }
  ]);
};

interface Props {
  data: Alarm[];
  dateRange?: DateRange;
  timeZone: string;
  barValueType: BarValueType;
  selectedId?: string;
  selectedType?: AlarmType;
  getColorById: (id: string) => string;
  onBarClick: (date: string) => void;
}

const AlarmsStackedBarChartWidget = ({
  data,
  dateRange,
  timeZone,
  barValueType,
  selectedId,
  selectedType,
  getColorById,
  onBarClick
}: Props): JSX.Element => {
  const barData = useMemo(
    () => groupIntoBars(data, barValueType, getColorById, timeZone, selectedId, selectedType),
    [data, selectedId, selectedType]
  );
  // Measure the graph container and pass the size into victory, so it can size itself to fit
  const { width: graphWidth, containerRef: graphContainerRef } = useContainerSize();

  return (
    <GraphContainer ref={graphContainerRef}>
      <StackedBarChartOverLane
        stackedData={barData}
        onBarClick={(datum) => {
          const day = datum.x;
          onBarClick(day);
        }}
        height={220}
        width={graphWidth}
        dateRange={dateRange}
        renderToolTipContent={(toolTipData) => (
          <ToolTipContent
            label={toolTipData.label as string}
            day={toolTipData.day as string}
            count={toolTipData.count as number}
          />
        )}
        timeZone={timeZone}
      />
    </GraphContainer>
  );
};

export default AlarmsStackedBarChartWidget;
