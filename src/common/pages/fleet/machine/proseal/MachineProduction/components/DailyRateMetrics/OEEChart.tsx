import React from 'react';
import { StyledPieChart } from 'components/StyledUi/StyledChartsV2/PieCharts/StyledPieChart';
import { StyledChartsTypesProps } from 'components/StyledUi/StyledChartsV2/StyledCharts.types';
import { useFeedFactorData } from '../../../hooks/useFeedFactorData';

const demoColors = {
  orange: '#FBBD44',
  red: '#FF1A1A',
  green: '#20E01C'
};

const dailyMetricsColors = {
  oee: demoColors.orange,
  performance: demoColors.green,
  availability: demoColors.red
};

export const OEEChart = (): JSX.Element => {
  const { chartData, average, isLoading, hasMessage } = useFeedFactorData();

  const chartSettings = {
    data: chartData,
    groupKey: 'name',
    colors: demoColors,
    type: 'doughnut' as StyledChartsTypesProps,
    width: 50
  };

  return (
    <>
      {JSON.stringify({ chartData })}
      <StyledPieChart {...chartSettings} />
    </>
  );
};
