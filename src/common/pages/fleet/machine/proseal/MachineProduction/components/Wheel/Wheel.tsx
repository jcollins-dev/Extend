import React from 'react';
import { useLifeFeedData } from '../../../hooks/useLifeFeedData';
import { WheelZoomChart } from 'common/ui/WheelZoomChart/WheelZoomChart';
import { WheekZoomChartWrapper } from './WheekZoomChartWrapper.elements';
import { styledTheme } from 'common/theme';

export const Wheel = (): JSX.Element => {
  const { data } = useLifeFeedData();

  if (!data || data.length === 0) return <p>No data</p>;

  const wheelSettings = {
    data,
    height: 125,
    dataKeyArea: 'uv',
    dataKeyXAxis: 'timestamp',
    dataKeyBrush: 'timestamp',
    accentColor: styledTheme.colors.secondary,
    showCartesianGrid: false
  };

  return (
    <WheekZoomChartWrapper>
      {/* <DimensionsContainer
        Component={({ width }) => {
          return <WheelZoomChart {...wheelSettings} width={width} />;
        }}
      /> */}
      <WheelZoomChart {...wheelSettings} />
    </WheekZoomChartWrapper>
  );
};
