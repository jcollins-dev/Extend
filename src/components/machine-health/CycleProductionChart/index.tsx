// 3rd party libs
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import _, { groupBy } from 'lodash';
import { default as LoaderBase } from 'react-loader-spinner';

// Components
import { Card, StackedBarChartOverTime, Typography, WidgetUi } from 'components';
import ToolTipContent from './ToolTipContent';

// Hooks
import { useContainerSize } from 'hooks';

import { PressurizeCycle } from 'types/protein';

import { BarDatum } from 'components/StackedBarChartOverTime';

// Helpers
import { DateRange, formatDate } from 'helpers';

// Theme
import theme from 'themes';

// Providers
import moment from 'moment';

const GraphContainer = styled.div`
  flex: 1;
  padding-top: 1rem;

  .widget-ui-content__loader {
    text-align: center;
  }
`;

const StyledContainer = styled.div`
  display: flex;
`;
const TxtContainer = styled.div`
  background-color: ${theme.colors.lightGrey1};
  padding: 1rem;
  width: 10rem;
`;

type BarValueType = 'count' | 'hours';

interface DataGroup {
  alarmId?: string;
  day: string; // ISO format at start of day with machine tz
  value: number;
  color: string;
}

// Aggregate Alarms data by date and type to render stacked bar chart
export const groupIntoBars = (
  data: PressurizeCycle[],
  barValueType: BarValueType,
  getColorById: (id: string) => string,
  timeZone: string,
  selectedId?: boolean
): BarDatum[][] => {
  const dataGroups: DataGroup[] = [];

  const alarmsGroupedByDay = groupBy(data, (alarm: PressurizeCycle) => {
    return moment(alarm.startTime).tz(timeZone).startOf('day').format();
  });

  for (const day in alarmsGroupedByDay) {
    const alarmGroup = alarmsGroupedByDay[day];

    const filteredAlarmGroups = alarmGroup.filter((alarm) => {
      return alarm.batchSuccessful === selectedId;
    });

    // Count the occurrences of each alarm type
    filteredAlarmGroups.map((alarm) => {
      const trackedCount = dataGroups.findIndex((dataGroup) => dataGroup.day === day);

      let delta = 1;
      if (barValueType == 'hours') {
        const end = alarm.endTimestamp ? new Date(alarm.endTime) : new Date();
        delta = end.getTime() - new Date(alarm.startTime).getTime();
      }

      trackedCount > -1
        ? (dataGroups[trackedCount].value += delta)
        : dataGroups.push({
            alarmId: alarm.batchSuccessful ? 'Processed' : 'Reprocessed',
            color: alarm.batchSuccessful ? '#28b981' : '#f04444',
            day: day,
            value: delta
          });
    });
  }

  if (barValueType == 'hours') {
    for (const group of dataGroups) {
      group.value = group.value / (1000 * 60 * 60);
      group.value = parseFloat(group.value.toFixed(1));
    }
  }

  const group = _(dataGroups)
    .groupBy((d) => d.alarmId)
    .value();

  const orderedByAlarmType = _.flattenDeep([
    selectedId ? group['Processed'] || [] : group['Reprocessed'] || []
  ]);

  return orderedByAlarmType.map((dataGroup): BarDatum[] => [
    {
      id: dataGroup.alarmId ?? '',
      name: dataGroup.alarmId,
      x: new Date(dataGroup.day),
      y: dataGroup.value,
      color: dataGroup.color,
      label: dataGroup.value.toString(),
      toolTipData: {
        label: dataGroup.alarmId,
        day: dataGroup.day,
        count: dataGroup.value
      }
    }
  ]);
};

interface Props {
  title: string;
  count: string;
  totalTitle: string;
  data: PressurizeCycle[];
  dateRange: DateRange;
  timeZone: string;
  barValueType: BarValueType;
  selectedId?: boolean;
  getColorById: (id: string) => string;
  onBarClick: (date: string) => void;
  isLoading?: boolean;
  className?: string;
}

const CycleProductionChart = ({
  title,
  count,
  totalTitle,
  data,
  dateRange,
  timeZone,
  barValueType,
  selectedId,
  getColorById,
  onBarClick,
  isLoading,
  className
}: Props): JSX.Element => {
  const theme = useTheme();
  const barData = useMemo(
    () => groupIntoBars(data, barValueType, getColorById, timeZone, selectedId),
    [data, selectedId]
  );

  const totalSumCount = barData.reduce((total, item) => {
    if (item && item[0].toolTipData?.count) {
      return total + item[0].toolTipData?.count;
    } else {
      return total;
    }
  }, 0);

  // Measure the graph container and pass the size into victory, so it can size itself to fit
  const { width: graphWidth, containerRef: graphContainerRef } = useContainerSize();

  const widgetSettings = {
    className: className
      ? `${className} widget-ui--machine-overview-widget`
      : `widget-ui--machine-overview-widget`,
    isLoading
  };

  const chart = (
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

  const content =
    isLoading || barData.length === 0 ? (
      <div className="widget-ui-content__loader">
        <LoaderBase type="TailSpin" color="#d0d0d0" height={40} width={40} />
      </div>
    ) : (
      chart
    );

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <Card borderColor={theme.colors.mediumGrey1}>
          <StyledContainer>
            <TxtContainer>
              <Typography color="greyfont" weight="medium" size="1rem" as="span" mb={0}>
                {title}
              </Typography>

              <Typography color="#a9a9a9" weight="medium" size="1rem" as="p" mb="2.75rem">
                {count}
              </Typography>

              <Typography color="#greyfont" weight="bold" size="2rem" as="p" mb={0}>
                {totalSumCount}
              </Typography>
              <Typography color="greyfont" weight="normal" size="1rem" as="span" mb={0}>
                {totalTitle}
              </Typography>
            </TxtContainer>
            <GraphContainer ref={graphContainerRef}>{content}</GraphContainer>
          </StyledContainer>
        </Card>
      }
    />
  );
};

export default CycleProductionChart;
