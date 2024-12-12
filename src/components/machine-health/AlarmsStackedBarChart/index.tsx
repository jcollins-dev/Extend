// 3rd party libs
import React, { useMemo } from 'react';
import _, { groupBy } from 'lodash';

// Components
import { StackedBarChartOverTime, WidgetUi } from 'components';
import ToolTipContent from './ToolTipContent';

// Hooks
import { useContainerSize } from 'hooks';

// Types
import { Alarm, AlarmType } from 'types/machine-health/alarms';
import { BarDatum } from 'components/StackedBarChartOverTime';

// Helpers
import { DateRange, formatDate } from 'helpers';

// Theme
import theme from 'themes';

// Providers
import moment from 'moment';
import { StackedBarChartOverTime2 } from 'components/StackedBarChartOverTime/StackedBarChartOverTime2';

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
): BarDatum[][] => {
  const dataGroups: DataGroup[] = [];

  const alarmsGroupedByDay = groupBy(data, (alarm: Alarm) => {
    return moment(alarm.startTimestamp).tz(timeZone).startOf('day').format();
  });

  for (const day in alarmsGroupedByDay) {
    const alarmGroup = alarmsGroupedByDay[day];

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
      group.value = group.value / (1000 * 60 * 60);
      group.value = parseFloat(group.value.toFixed(3));
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
    group[AlarmType.AvureWarningAlarm] || []
  ]);

  return orderedByAlarmType.map((dataGroup): BarDatum[] => [
    {
      id: dataGroup.alarmId ?? '',
      name: dataGroup.alarmType,
      x: new Date(dataGroup.day),
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
  title: string;
  data: Alarm[];
  dateRange: DateRange;
  timeZone: string;
  barValueType: BarValueType;
  selectedId?: string;
  selectedType?: AlarmType;
  getColorById: (id: string) => string;
  onBarClick: (date: string) => void;
  gridArea?: string;
  chartVersion?: number;
}

const AlarmsStackedBarChart = ({
  title,
  data,
  dateRange,
  timeZone,
  barValueType,
  selectedId,
  selectedType,
  getColorById,
  onBarClick,
  gridArea,
  chartVersion
}: Props): JSX.Element => {
  const barData = useMemo(
    () => groupIntoBars(data, barValueType, getColorById, timeZone, selectedId, selectedType),
    [data, selectedId, selectedType]
  );

  // Measure the graph container and pass the size into victory, so it can size itself to fit
  const { width: graphWidth, containerRef: graphContainerRef } = useContainerSize();

  const chart =
    chartVersion && chartVersion === 2 ? (
      <StackedBarChartOverTime2
        stackedData={barData}
        onBarClick={(datum) => {
          const day = moment(datum.x).tz(timeZone).format();
          onBarClick(day);
        }}
        height={220}
        width={graphWidth}
        dateRange={dateRange}
        renderToolTipContent={(toolTipData) => (
          <ToolTipContent
            label={toolTipData.label as string}
            day={formatDate(moment(toolTipData.day as string).toDate(), 'long')}
            count={toolTipData.count as number}
          />
        )}
        timeZone={timeZone}
      />
    ) : (
      <StackedBarChartOverTime
        stackedData={barData}
        onBarClick={(datum) => {
          const day = moment(datum.x).tz(timeZone).format();
          onBarClick(day);
        }}
        height={220}
        width={graphWidth}
        dateRange={dateRange}
        renderToolTipContent={(toolTipData) => (
          <ToolTipContent
            label={toolTipData.label as string}
            day={formatDate(moment(toolTipData.day as string).toDate(), 'long')}
            count={toolTipData.count as number}
          />
        )}
        timeZone={timeZone}
      />
    );

  const widgetUiSettings = {
    gridArea,
    title,
    className: 'is-centered',
    Main: (
      <div className="widget-ui-main" ref={graphContainerRef}>
        {chart}
      </div>
    )
  };
  return <WidgetUi {...widgetUiSettings} />;
};

export default AlarmsStackedBarChart;
