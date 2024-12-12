import React from 'react';
import { WidgetUi } from 'common/components/WidgetUi/WidgetUi';
import { DailyMetricsContainer } from './DailyRateMetrics.elements';
import { useOEEData } from '../../../hooks/useOEEData';
import { OEEValueTiles } from './OEEValueTiles';
import { PieChart } from 'common/components/Charts/PieChart/PieChart';

const demoColors = {
  orange: 'rgba(230, 108, 55, 1)',
  red: '#FF1A1A',
  green: '#20E01C'
};

const dailyMetricsColors = {
  oee: demoColors.orange,
  performance: demoColors.green,
  availability: demoColors.red
};

export const DailyRateMetrics = (): JSX.Element => {
  // the data has already been cached at this point
  const { data, isLoading, hasMessage, hasError } = useOEEData();

  const widgetSettings = {
    title: 'Daily Rate Metrics',
    className: 'daily-rate-metrics-widget',
    isLoading,
    hasError,
    hasMessage,
    hasButtons: {
      headerRight: ['settings']
    }
  };

  // return early if there's no data
  if (isLoading || hasMessage || hasError) return <WidgetUi {...widgetSettings} />;
  if (!data) return <WidgetUi {...widgetSettings} hasError="error: no data" />;

  // set the chart settings
  // we need to find out if the charts change color based on percentage
  // or if the colors are assigned based on the data
  const charts = [
    {
      label: 'OEE',
      progress: Number(data.oee) * 100,
      color: dailyMetricsColors.oee
    },
    {
      label: 'Performance',
      progress: Number(data.performance) * 100,
      color: dailyMetricsColors.performance
    },
    {
      label: 'Availability',
      progress: Number(data.availability) * 100,
      color: dailyMetricsColors.availability
    }
  ];

  // need to check if these will always be colors
  // and if we should use the same colors as the progress rings
  // in this widget
  const tiles = [
    {
      label: 'OEE Rate - Yesterday',
      value: `58%`,
      color: `#BA4E00`,
      id: `oee`
    },
    {
      label: 'Performance Rate - Yesterday ',
      value: `70%`,
      id: `performance`
    },
    {
      label: 'Availability Rate - Yesterday ',
      value: `90%`,
      id: `availability`
    }
  ];

  return (
    <WidgetUi
      {...widgetSettings}
      Main={
        <DailyMetricsContainer className="widget-ui__main">
          <div className="daily-rate-metrics-widget__charts-wrapper">
            {charts.map((chart, i) => (
              <PieChart
                key={i}
                InsideLabel={
                  <OEEValueTiles
                    tiles={[
                      {
                        label: chart.label,
                        value: `${chart.progress}%`
                      }
                    ]}
                  />
                }
                {...chart}
              />
            ))}
          </div>
          <OEEValueTiles className="daily-rate-metrics-widget__stats" tiles={tiles} />
        </DailyMetricsContainer>
      }
    />
  );
};
