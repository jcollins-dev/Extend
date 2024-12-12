// 3rd party libs
import React from 'react';
import { VictoryLine, VictoryScatter } from 'victory';
import styled from 'styled-components';
import findLastIndex from 'lodash/findLastIndex';
import { LTD } from 'downsample';

// Components
import { GraphLegend } from 'components';

// Helpers
import { pruneData } from 'helpers/graph';

// Types
import {
  BaseSeries,
  ScatterSeries,
  Series,
  DatePoint,
  Interpolation,
  InterpolationPropType
} from 'types/graph';
import { DateTuple } from 'types';
import { BooleanTagDisplayValue } from 'types/protein';

// Theme
import theme from 'themes';

// Constants
export const SEPARATOR = 't-#?';
const MAX_POINTS = 300;

const LegendRow = styled.div`
  margin-bottom: 0.5rem;
`;

const optimizeData = (data: readonly DatePoint[], domain: DateTuple, title: string) => {
  if (data.length === 0) return [];

  // TODO: consider a single pass filter stage to limit number of data points
  // and select points within the domain. I'm not sure, but it _may_ be
  // possible that we could receive unsorted data. Not to mention two finds
  // plus a likely filter is probably less efficient than just a single pass
  // filter.
  const startIndex = data.findIndex((d) => d.x >= domain[0]);
  // Couldn't use the native Array.findLastIndex yet because our TypeScript
  // version does not yet recognize its existence
  const endIndex = findLastIndex(data, (d) => d.x <= domain[1]);
  let filtered = data.slice(startIndex, endIndex + 1);
  if (title === 'Machine tags') {
    filtered = filtered.filter((d) => d.y <= 1 && d.y >= 0);
  }

  let optimized = filtered;

  if (filtered.length > MAX_POINTS) {
    // Interpolate the data to reduce the number of points.
    // We know we are only working with numbers here, so we can safely cast
    optimized = LTD(filtered as { x: Date; y: number }[], MAX_POINTS) as DatePoint[];
  }

  // Insert the previous and next known data points to ensure that the graph
  // is continuous. This is necessary because the data is dead-banded

  const previousDatum = data[startIndex - 1];
  const nextDatum = data[endIndex + 1];

  previousDatum &&
    optimized.unshift({
      x: domain[0],
      y: previousDatum.y,
      dateActual: previousDatum.x,
      interpolationMessage: 'Previous known data point: '
    });

  if (nextDatum) {
    optimized.push({
      x: domain[1],
      y: nextDatum.y,
      dateActual: nextDatum.x,
      interpolationMessage: 'Next known data point: '
    });
  } else {
    optimized.push({
      x: domain[1],
      y: optimized[optimized.length - 1].y,
      dateActual: domain[1],
      interpolationMessage: 'Continuing at approximately: '
    });
  }

  return optimized;
};

// Handle zooming behavior
export const zoom = (series: readonly Series[], domain: DateTuple, title: string): Series[] => {
  return series.map((s) => {
    return {
      ...s,
      data: s.optimize ? optimizeData(s.data, domain, title) : pruneData(s.data, domain)
    };
  });
};

// Handle tooltip logic, in case 'tooltipComponent' is supplied, tooltipContent will be assigned an empty string to disable
// ... the default tooltip behavior which is handled at the VictoryContainer level
const getTooltip = (series: Series, d: DatePoint, color: string, i?: number) => {
  return {
    tooltipContent: series.tooltipComponent
      ? ''
      : series.tooltipFormat && series.tooltipFormat(series, d, i).concat(SEPARATOR, color, '\n'),

    customToolTipContent:
      series.tooltipComponent && series.tooltipFormat && series.tooltipFormat(series, d, i)
  };
};

// Draw legends
export function drawLegends(
  series: readonly Series[],
  onClick: (id: string) => void
): JSX.Element[] {
  return series
    .filter((s) => s.label)
    .map((s) => (
      <LegendRow key={s.id}>
        <GraphLegend
          id={s.id}
          active={s.active}
          onClick={() => onClick(s.id)}
          label={s.label as string}
          color={s.color}
        />
      </LegendRow>
    ));
}

const getInterpolation = (interpolation?: string): InterpolationPropType => {
  return (interpolation ? interpolation : Interpolation.Linear) as InterpolationPropType;
};

// Draw Line series.
export function drawLineSeries(
  filteredSeries: readonly Series[],
  interpolation?: string
): JSX.Element[] {
  return filteredSeries?.map((s) => (
    <VictoryLine
      interpolation={getInterpolation(interpolation)}
      name={s.id}
      key={s.id}
      style={{
        data: { stroke: s.color, ...s.style },
        labels: {
          fill: s.color
        }
      }}
      data={s.data.map((d) => {
        return {
          ...d,
          ...getTooltip(s, d, s.color)
        };
      })}
      labels={({ datum }) => s.tooltipComponent && datum.customToolTipContent}
      labelComponent={s.tooltipComponent}
    />
  ));
}
// Draw Points for line series.
export function drawPoints(
  points: { id: string; data: DatePoint[] }[],
  innerSeries: Series[]
): JSX.Element[] {
  return innerSeries?.map((s, index) => (
    <VictoryScatter
      name={points[index].id}
      key={points[index].id}
      size={2}
      style={{
        data: { stroke: theme.colors.darkGrey },
        labels: {
          fill: theme.colors.darkGrey
        }
      }}
      data={s.active ? points[index].data : []}
    />
  ));
}

// Draw Scatter series.
export function drawScatterSeries(
  filteredSeries: readonly (BaseSeries & ScatterSeries)[],
  yAxisMin: number
): JSX.Element[] {
  return filteredSeries?.map((s) => {
    return (
      <VictoryScatter
        name={s.id}
        key={s.id}
        samples={s.samples}
        size={s.size}
        style={{ data: { fill: ({ datum }) => (s.fill ? s.fill(datum.x) : '') } }}
        data={
          !s.samples
            ? s.data.map((d, i) => {
                return {
                  ...d,
                  color: d.color,
                  ...getTooltip(s, d, d.color || 'transparent', i)
                };
              })
            : undefined
        }
        y={
          s.bottom
            ? () => (s.bottom && isFinite(yAxisMin) ? yAxisMin - Math.abs(yAxisMin / 10) : s.bottom)
            : undefined
        }
        labels={({ datum }) => s.tooltipComponent && datum.customToolTipContent}
        labelComponent={s.tooltipComponent}
        dataComponent={s.dataComponent}
      />
    );
  });
}

// Format Boolean Axis
export const formatBooleanAxis = (value: number): string => {
  switch (value) {
    case 0:
      return BooleanTagDisplayValue.Off;
    case 1:
      return BooleanTagDisplayValue.On;
    default:
      return '';
  }
};
