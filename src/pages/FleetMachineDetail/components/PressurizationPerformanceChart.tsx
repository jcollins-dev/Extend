import React, { useEffect, useMemo, useRef } from 'react';
import { HorizontalWidget } from 'components/StyledUi/widgets/HorizontalWidget';
import { usePressurizeCycleDataById } from '../hooks';
import { LineChart } from 'components/StyledUi/ChartsV2/LineChart/LineChart';

export const PressurizationPerformanceChart = ({ gridArea }: { gridArea: string }): JSX.Element => {
  const { isLoading, hasError, hasMessage, lineChartData } = usePressurizeCycleDataById();

  // On a first render we show load icon, but hide when page stays open and keeps recieveing new data
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }
  }, [isLoading, hasError, hasMessage, lineChartData]);

  const widgetSettings = {
    title: 'Sum Of The Delta Pressurization Time',
    gridArea,
    isLoading: isFirstRender.current ? isLoading : false,
    hasError,
    hasMessage
  };

  const Cacher = useMemo(() => {
    return (
      <HorizontalWidget
        {...widgetSettings}
        Chart={(props) => (
          <LineChart data={lineChartData} canZoom axisLeftTickLabel="sec" {...props} />
        )}
      />
    );
  }, [lineChartData, isLoading, hasError, hasMessage]);

  return Cacher;
};
