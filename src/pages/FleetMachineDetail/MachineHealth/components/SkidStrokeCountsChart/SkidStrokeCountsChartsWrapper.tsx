import React from 'react';
import { DimensionsContainer } from 'components';
import { SkidStrokeCountsCharts } from './SkidStrokeCountsChart';

export const SkidStrokeCountsChartsWrapper = (): JSX.Element => {
  return (
    <DimensionsContainer
      Component={({ width }) => {
        return <SkidStrokeCountsCharts width={width} />;
      }}
    />
  );
};
