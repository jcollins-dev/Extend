// 3rd party libs
import React, { useEffect, useState, useCallback } from 'react';
import { VictoryAxisProps } from 'victory';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Components
import { BarChart, DashboardWidget, useDateRange } from 'components';

// Types
import { ProteinMachineRouteQueryParams, MachineUtilization } from 'types/protein';

// Api
import { useGetMachineUtilizationQuery } from 'api';

// Theme
import theme from 'themes';
import victoryTheme from 'themes/victory';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';

const InitYAxisStyle: VictoryAxisProps = {
  style: {
    tickLabels: {
      padding: 2,
      fill: theme.colors.mediumGrey2,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: 400
    }
  }
};

const InitXAxisStyle: VictoryAxisProps = {
  style: {
    tickLabels: {
      padding: 4,
      fill: theme.colors.mediumGrey3,
      fontSize: 11,
      lineHeight: 13,
      fontWeight: 400
    }
  }
};

const toBarChartInput = (t: TFunction<'mh'[], undefined>, data?: MachineUtilization) => {
  if (!data) return [];
  const { run, clean, idle, stopped, stopByAlarm } = theme.colors.machineUtilizationColors;
  return [
    { x: t('running'), y: data.running, color: run },
    { x: t('cleaning'), y: data.cleaning, color: clean },
    { x: t('idle'), y: data.idle, color: idle },
    { x: t('paused'), y: data.stopped, color: stopped },
    { x: t('stop_by_alarm'), y: data.stopAlarm || 0, color: stopByAlarm }
  ];
};

const getBarWidth = (chartWidth: number, data?: MachineUtilization) => {
  if (!data) return 0;
  return chartWidth / Object.keys(data).length;
};

interface ChartProps {
  width: number;
  height: number;
  data?: MachineUtilization;
}
const MachineUtilizationChart = ({ width, height, data }: ChartProps): JSX.Element => {
  const [xAxis, setXAxis] = useState<VictoryAxisProps>(InitXAxisStyle);
  const [yAxis, setYAxis] = useState<VictoryAxisProps>(InitYAxisStyle);
  const { t } = useTranslation(['mh']);
  useEffect(() => {
    // Make the labels tilt when the width becomes too small
    if (width < 350) {
      const nextXAxis: VictoryAxisProps = { ...xAxis };
      nextXAxis.style = {
        ...nextXAxis.style,
        tickLabels: {
          ...xAxis.style?.tickLabels,
          angle: -35,
          fontSize: 10,
          textAnchor: 'end'
        }
      };
      setXAxis(nextXAxis);
    } else setXAxis(InitXAxisStyle);

    if (width < 250) {
      const nextYAxis: VictoryAxisProps = { ...yAxis };
      nextYAxis.style = {
        ...nextYAxis.style,
        tickLabels: {
          ...yAxis.style?.tickLabels,
          angle: 35,
          fontSize: 11,
          textAnchor: 'start'
        }
      };
      setYAxis(nextYAxis);
    } else setYAxis(InitYAxisStyle);
  }, [width]);

  return (
    <BarChart
      domainPadding={{
        x: getBarWidth(width, data) / 2.5
      }}
      theme={victoryTheme}
      dims={{ width, height }}
      bars={toBarChartInput(t, data)}
      format={(tick) => `${tick}%`}
      config={{
        bar: {
          barRatio: 1,
          labels: ({ datum }) => `${datum.y}%`,
          style: { labels: { fontSize: 11 } }
        },
        xAxis,
        yAxis
      }}
      padding={{ bottom: width < 350 ? 45 : 40 }}
    />
  );
};

const MachineUtilzation = (): JSX.Element => {
  const { dateRange } = useDateRange();
  const { t } = useTranslation(['mh']);

  const startDatetime = dateRange.startTime.toISOString();
  const endDatetime = dateRange.endTime.toISOString();

  const { machineId } = useParams<ProteinMachineRouteQueryParams>();

  const { data, isLoading, error } = useGetMachineUtilizationQuery({
    machineId,
    startDatetime,
    endDatetime
  });

  const widgetSettings = {
    isLoading,
    title: t('machine_utilization') as string,
    showDateRange: true,
    hasDatePicker: true,
    hasGoBackDateLimit: DATA_DATE_LIMIT_DAYS,
    hasError: error && t('failed_to_load_machine_utilization'),
    dateRange
  };

  const Chart = useCallback(
    ({ width, height }: ChartProps): JSX.Element => {
      return <MachineUtilizationChart {...{ width, height, data }} />;
    },
    [data]
  );

  return <DashboardWidget {...widgetSettings} Load={Chart} />;
};
export default MachineUtilzation;
