// 3rd party libs
import { VictoryAxisProps } from 'victory';

// Helpers
import { formatDate, getUserTimeZone, isUSTimeZone } from 'helpers';
import { getRandomColor } from 'helpers/colors';

// Theme
import theme from 'themes';

// Types
import { DatePoint, Series } from 'types/graph';
import { BaseTag, DataAnalysisProperty, DataAnalysisPropTypes } from 'types/protein';

const rescaleValues = (value: number, min: number | string, max: number | string): number => {
  const minNumber = typeof min === 'string' ? Number(min) || 0 : min;
  const maxNumber = typeof max === 'string' ? Number(max) || 1 : max;
  return Number(((maxNumber - minNumber) * value + minNumber).toFixed(1));
};

const normalizeValue = (value: number, min: number | string, max: number | string): number => {
  const minNumber = typeof min === 'string' ? Number(min) || 0 : min;
  const maxNumber = typeof max === 'string' ? Number(max) || 1 : max;
  return (value - minNumber) / (maxNumber - minNumber);
};

/**
 * Transform api response to <KPIOverTimeGraph /> input format
 */
export const toLineSeries = (tags: BaseTag[] | undefined, rightAxis: string[]): Series[] => {
  const series: Series[] = [];
  tags?.forEach((tag) => {
    const data: DatePoint[] = tag.values.map((value) => {
      return {
        y: typeof value.value === 'number' ? value.value : 0,
        x: new Date(value.timestamp)
      };
    });
    const color =
      tag?.extrinsics?.color || theme.colors.kpiChartColors[series.length] || getRandomColor();
    series.push({
      mode: 'LINE',
      id: tag.id,
      label: tag.name || tag.id,
      data,
      color,
      optimize: true,
      isRightAxis: rightAxis.includes(tag.id),
      unit: tag?.unit || ''
    });
  });
  return [...series];
};

export const formatLineSeriesTooltip = (
  series: Series[],
  min: number,
  max: number,
  timeZone?: string
): Series[] => {
  return series.map((s) => {
    return {
      ...s,
      tooltipFormat: (s, value) => {
        const displayDate: Date = value.dateActual || value.x;
        return isUSTimeZone(getUserTimeZone())
          ? `${s.label}, ${value.interpolationMessage ? `${value.interpolationMessage} ` : ''}${
              typeof value.y === 'number' ? rescaleValues(value.y, min, max).toFixed(1) : value.y
            } ${s.unit}, ${formatDate(
              displayDate,
              'hours-minutes',
              timeZone,
              'en-US',
              true
            )} ${formatDate(displayDate, 'numeric-month-day', timeZone, 'en-US')}`
          : `${s.label}, ${value.interpolationMessage ? `${value.interpolationMessage} ` : ''}${
              typeof value.y === 'number' ? rescaleValues(value.y, min, max).toFixed(1) : value.y
            } ${s.unit}, ${formatDate(displayDate, 'hours-minutes', timeZone)} ${formatDate(
              displayDate,
              'numeric-month-day',
              timeZone
            )}`;
      }
    };
  });
};

// Axis style
export const axisStyle = {
  vertical: {
    style: {
      grid: {
        stroke: 'none'
      },
      axis: {
        stroke: 'none'
      }
    }
  },
  horizontal: {
    style: {
      axis: { stroke: 'none' },
      grid: { stroke: theme.colors.lightGrey3 }
    }
  }
};

/**
 * Build Axis
 */
export const leftAxis = (
  max: number,
  min: number,
  dataParams: DataAnalysisProperty[]
): VictoryAxisProps | undefined => {
  if (!isFinite(max)) return undefined;
  const firstYAxisMin = dataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.FirstYAxisMin
  );
  const firstYAxisMax = dataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.FirstYAxisMax
  );
  const minDomain = typeof firstYAxisMin?.value === 'number' ? firstYAxisMin?.value : min;

  return {
    style: axisStyle.vertical.style,
    // Use normalized tickValues (0, 1)
    tickValues: [0, 0.25, 0.5, 0.75, 1],
    // Re-scale ticks
    tickFormat: (t) => rescaleValues(t, min, max),
    ...(firstYAxisMin?.value !== null &&
      firstYAxisMax?.value !== null && {
        domain: [
          normalizeValue(minDomain, min, max),
          normalizeValue(firstYAxisMax?.value as number, min, max)
        ]
      })
  };
};

export const rightAxis = (
  max: number,
  min: number,
  dataParams: DataAnalysisProperty[]
): VictoryAxisProps | undefined => {
  if (!isFinite(max)) return undefined;
  const secondYAxisMin = dataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.SecondYAxisMin
  );
  const secondYAxisMax = dataParams.find(
    (dataParam) => dataParam.property === DataAnalysisPropTypes.SecondYAxisMax
  );
  const minDomain = typeof secondYAxisMin?.value === 'number' ? secondYAxisMin?.value : min;
  return {
    orientation: 'right',
    style: axisStyle.vertical.style,
    // Use normalized tickValues (0, 1)
    tickValues: [0, 0.25, 0.5, 0.75, 1],
    // Re-scale ticks
    tickFormat: (t) => rescaleValues(t, min, max),
    ...(secondYAxisMin?.value !== null &&
      secondYAxisMax?.value !== null && {
        domain: [
          normalizeValue(minDomain, min, max),
          normalizeValue(secondYAxisMax?.value as number, min, max)
        ]
      })
  };
};

export const yAxis = (timeZone?: string): VictoryAxisProps => {
  return {
    orientation: 'top',
    style: axisStyle.horizontal.style,
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

export const normalize = (series: Series[], max: number, min: number): Series[] =>
  series.map((s) => {
    return {
      ...s,
      data: s.data.map((d) => {
        if (max === min) {
          // If max and min are the same, we can't normalize.
          // This edge case happens when there is only one data point
          return { x: d.x, y: 1 };
        }
        return { x: d.x, y: typeof d.y === 'number' ? (d.y - min) / (max - min) : 1 };
      })
    };
  });
