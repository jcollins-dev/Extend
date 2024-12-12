// 3rd party libs
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Components
import { KPIOverTimeGraph } from 'components';

// Helpers
import { getYaxisOffset, pruneData } from 'helpers/graph';

// Utils
import {
  formatLineSeriesTooltip,
  leftAxis,
  normalize,
  rightAxis,
  toLineSeries,
  yAxis
} from './utils';

// Types
import { BaseTag, DataAnalysisProperty, DataAnalysisPropTypes } from 'types/protein';
import { DateTuple } from 'types';

// Providers
import { useOverviewTemplate, useSyncZoom, useTimeZone } from 'providers';

// Styling
const Graph = styled.div`
  flex: 1;
  margin: auto;
`;

type Props = {
  tags: BaseTag[] | undefined;
  rightAxisTags: string[];
  filterDataParams: DataAnalysisProperty[];
  isBooleanChart: boolean;
  interpolation: string;
};

const MachineTagsChart = ({
  tags,
  rightAxisTags,
  filterDataParams,
  isBooleanChart,
  interpolation
}: Props): JSX.Element => {
  const { setYAxisMinMax } = useOverviewTemplate();
  const { timeZone } = useTimeZone();
  const { zoomedDomain, onBrushDomainChangeEnd, resetZoom } = useSyncZoom();
  const { t } = useTranslation(['mh']);
  /**
   * Transform data
   */
  const linesSeries = toLineSeries(tags, rightAxisTags);

  const leftSeries = linesSeries.filter((s) => !s.isRightAxis);
  const rightSeries = linesSeries.filter((s) => s.isRightAxis);

  // When zoomed, prune data above/below the x domain.
  // This ensures the correct visible min/max values are used
  // when calculating the y domain.
  if (zoomedDomain?.x) {
    leftSeries.forEach(
      (series) => (series.data = pruneData(series.data, zoomedDomain.x as DateTuple))
    );
    rightSeries.forEach(
      (series) => (series.data = pruneData(series.data, zoomedDomain.x as DateTuple))
    );
  }

  let { max: leftAxisMax, min: leftAxisMin } = getYaxisOffset(leftSeries);
  const firstYAxisMax = filterDataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.FirstYAxisMax
  );
  if (firstYAxisMax?.value !== null && firstYAxisMax?.value !== '') {
    leftAxisMax = firstYAxisMax?.value as number;
  }

  const firstYAxisMin = filterDataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.FirstYAxisMin
  );
  if (firstYAxisMin?.value !== null && firstYAxisMin?.value !== '') {
    leftAxisMin = firstYAxisMin?.value as number;
  }

  let { max: rightAxisMax, min: rightAxisMin } = getYaxisOffset(rightSeries);
  const secondYAxisMax = filterDataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.SecondYAxisMax
  );
  if (secondYAxisMax?.value !== null && secondYAxisMax?.value !== '') {
    rightAxisMax = secondYAxisMax?.value as number;
  }

  const secondYAxisMin = filterDataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.SecondYAxisMin
  );
  if (secondYAxisMin?.value !== null && secondYAxisMin?.value !== '') {
    rightAxisMin = secondYAxisMin?.value as number;
  }

  // Setting property filter values
  let leftYaxisBool = false;
  if (isFinite(leftAxisMax) && isFinite(leftAxisMin)) {
    leftYaxisBool = true;
  }
  let rightYaxisBool = false;
  if (isFinite(rightAxisMax) && isFinite(rightAxisMin)) {
    rightYaxisBool = true;
  }

  useEffect(() => {
    setYAxisMinMax([
      {
        left: leftYaxisBool,
        min: leftAxisMin,
        max: leftAxisMax
      },
      {
        right: rightYaxisBool,
        min: rightAxisMin,
        max: rightAxisMax
      }
    ]);
  }, [leftYaxisBool, leftAxisMin, leftAxisMax, rightYaxisBool, rightAxisMin, rightAxisMax]);

  /**
   * Normalize data
   */
  const normalizedLeftSeries = formatLineSeriesTooltip(
    normalize(leftSeries, leftAxisMax, leftAxisMin),
    leftAxisMin,
    leftAxisMax,
    timeZone
  );
  const normalizedRightSeries = formatLineSeriesTooltip(
    normalize(rightSeries, rightAxisMax, rightAxisMin),
    rightAxisMin,
    rightAxisMax,
    timeZone
  );

  return (
    <Graph key={`chart-${tags?.map((tag) => tag.id).join('-')}`}>
      <KPIOverTimeGraph
        series={[...normalizedLeftSeries, ...normalizedRightSeries]}
        yDomain={[0, 1]}
        title={t('machine_tags') as string}
        axisH={yAxis(timeZone)}
        axisV={leftAxis(leftAxisMax, leftAxisMin, filterDataParams)}
        rightAxisV={rightAxis(rightAxisMax, rightAxisMin, filterDataParams)}
        sync={true}
        graphContainerHeight="18.3125rem"
        brush={{
          zoomedDomain,
          onBrushDomainChangeEnd,
          resetZoom
        }}
        isBooleanChart={isBooleanChart}
        interpolation={interpolation}
      />
    </Graph>
  );
};

export default MachineTagsChart;
