// 3rd party libs
import React from 'react';
import { VictoryAxisProps, VictoryTooltip } from 'victory';

// Types
import { BaseSeries, DatePoint, ScatterSeries, Series } from 'types/graph';
import { KeyIndicatorHistory, StateCategory } from 'types/protein';

// Helpers
import { formatDate, getUserTimeZone, isUSTimeZone } from 'helpers/dates';
import { getRandomColor } from 'helpers/colors';

// Constants
export const CIRCLE_RADIUS = 10;
export const SCATTER_DISTANCE = 10;

// Theme
import theme from 'themes';

// Constants
import { proteinMachineCategoryStatesToString } from 'constants/proteinMachineCategoryStates';

const colors = theme.colors.ProteinMachineStateCatgoryColors as Record<string, string>;
const labels = proteinMachineCategoryStatesToString as Record<string, string>;
// Pre-process series to specify a custom format for the tooltip content
//
//
export const formatLineSeriesTooltip = (series: Series[], timeZone?: string): Series[] => {
  return series.map((s) => {
    return {
      ...s,
      tooltipFormat: (s, value) => {
        const displayDate: Date = value.dateActual || value.x;

        return isUSTimeZone(getUserTimeZone())
          ? `${s.label ? s.label + ',' : ''} ${
              value.interpolationMessage ? `${value.interpolationMessage} ` : ''
            }${typeof value.y === 'number' ? value.y.toFixed(1) : value.y} ${s.unit}, ${formatDate(
              displayDate,
              'hours-minutes',
              timeZone,
              'en-US',
              true
            )} ${formatDate(displayDate, 'numeric-month-day', timeZone, 'en-US')}`
          : `${s.label ? s.label + ',' : ''} ${
              value.interpolationMessage ? `${value.interpolationMessage} ` : ''
            }${typeof value.y === 'number' ? value.y.toFixed(1) : value.y} ${s.unit}, ${formatDate(
              displayDate,
              'hours-minutes',
              timeZone
            )} ${formatDate(displayDate, 'numeric-month-day', timeZone)}`;
      }
    };
  });
};

export const formatScatterSeriesTooltip = (series: Series): Series => {
  return {
    ...series,
    tooltipComponent: (
      <VictoryTooltip
        pointerOrientation="bottom"
        dy={-15}
        cornerRadius={2}
        centerOffset={{ y: -(CIRCLE_RADIUS * 4) }}
        style={{ fill: theme.colors.white }}
        flyoutStyle={{
          fill: theme.colors.black,
          fillOpacity: 0.8,
          pointerEvents: 'none'
        }}
      />
    ),
    tooltipFormat: (_, __, index) => {
      if (index == undefined) return '';
      return series.data[index].label || '';
    }
  };
};

/**
 * Transform api response to <KPIOverTimeGraph /> input format
 * @param indicators
 * @param colors to pass different line colors
 */
export const toLineSeries = (indicators?: KeyIndicatorHistory[], colors?: string[]): Series[] => {
  const series: Series[] = [];
  indicators
    ?.filter((d) => d.values.length > 0)
    .forEach((indicator, index) => {
      const data: DatePoint[] = indicator.values.map((value) => {
        return {
          y: typeof value.value === 'number' ? value.value : 0,
          x: new Date(value.timestamp)
        };
      });
      const color =
        (colors && colors[index]) ??
        (theme.colors.kpiChartColors[series.length] || getRandomColor());
      series.push({
        mode: 'LINE',
        id: indicator.tagId,
        label: indicator.name || indicator.tagId,
        data,
        color,
        optimize: true,
        unit: indicator?.unit || ''
      });
    });
  return [...series];
};

/**
 * Transform api response to <KPIOverTimeGraph /> input format
 * @param statesCategories
 * @param min
 */
export const toScatterSeries = (
  statesCategories: StateCategory[],
  min: number,
  timeZone?: string
): Series => {
  const series: Series = {
    mode: 'SCATTER',
    bottom: SCATTER_DISTANCE,
    id: 'states',
    color: 'transparent',
    size: CIRCLE_RADIUS,
    fill: (d) => {
      const color = statesCategories.find(
        (a) => new Date(a.timestamp).toISOString() === d.toISOString()
      );
      if (!color) return 'black';
      return colors[color.name];
    },

    data: statesCategories.map((state, i) => {
      return {
        x: new Date(state.timestamp),
        y: min - SCATTER_DISTANCE,
        color: colors[statesCategories[i].name],
        label: isUSTimeZone(getUserTimeZone())
          ? `${labels[statesCategories[i].name]}, ${formatDate(
              state.timestamp,
              'hours-minutes',
              timeZone,
              'en-US',
              true
            )} ${formatDate(state.timestamp, 'numeric-month-day', timeZone, 'en-US')}`
          : `${labels[statesCategories[i].name]}, ${formatDate(
              state.timestamp,
              'hours-minutes',
              timeZone
            )} ${formatDate(state.timestamp, 'numeric-month-day', timeZone)}`
      };
    })
  };
  return series;
};

// Compute scatter points colors
export const color = (x: Date, states: StateCategory[]): string => {
  const state = states.find(
    (state) => x >= new Date(state.timestamp) && x <= new Date(state.endTimestamp)
  );
  return state ? colors[state.name] : '';
};

/**
 *
 * Scatter points that connect states
 */
export const toScatterPoints = (statesCategories: StateCategory[]): BaseSeries & ScatterSeries => {
  const series: BaseSeries & ScatterSeries = {
    mode: 'SCATTER',
    id: 'connect-states',
    bottom: SCATTER_DISTANCE,
    color: 'red',
    data: [],
    size: 1.5,
    samples: 200,
    ignore: true,
    fill: (x: Date) => color(new Date(x), statesCategories)
  };
  return series;
};

/**
 * Axis
 */
export const axisH = (timeZone?: string): VictoryAxisProps => {
  return {
    orientation: 'top',
    style: {
      axis: { stroke: 'none' },
      grid: { stroke: theme.colors.lightGrey3 }
    },
    tickFormat: (t) =>
      isUSTimeZone(getUserTimeZone())
        ? `${formatDate(t, 'hours-minutes', timeZone, 'en-US', true)}\n${formatDate(
            t,
            'numeric-month-day',
            timeZone,
            'en-US'
          )}`
        : `${formatDate(t, 'hours-minutes', timeZone)}\n${formatDate(
            t,
            'numeric-month-day',
            timeZone
          )}`
  };
};

export const axisV = (): VictoryAxisProps => {
  return {
    style: {
      grid: {
        stroke: 'none'
      },
      axis: {
        stroke: 'none'
      }
    }
  };
};
