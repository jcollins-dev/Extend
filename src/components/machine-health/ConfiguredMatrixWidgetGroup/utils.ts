// 3rd party libs
import { VictoryAxisProps } from 'victory';

// Types
import { DatePoint, Series } from 'types/graph';
import { BaseTag, BaseTagDataType, BaseTagType, BooleanTagDisplayValue } from 'types/protein';

// Themes
import theme from 'themes';

// Helpers
import { formatDate, getRandomColor, getUserTimeZone, isUSTimeZone } from 'helpers';

// Constants
import { NO_SELECTION } from 'constants/machineTags';

/**
 * Transform api response to <KPIOverTimeGraph /> input format
 */
export const toLineSeries = (tags: BaseTag[] | undefined): Series[] => {
  const series: Series[] = [];
  tags?.forEach((tag) => {
    const data: DatePoint[] = tag.values.map((value) => {
      return {
        y: typeof value.value === 'number' ? value.value : 0,
        x: new Date(value.timestamp)
      };
    });
    const color = theme.colors.kpiChartColors[series.length] || getRandomColor();
    series.push({
      mode: 'LINE',
      id: tag.id,
      label: tag.name || tag.id,
      data,
      color,
      optimize: true,
      unit: tag?.unit || ''
    });
  });
  return [...series];
};

export const formatLineSeriesTooltip = (series: Series[], timeZone?: string): Series[] => {
  return series.map((s) => {
    return {
      ...s,
      tooltipFormat: (s, value) => {
        const displayDate = (value.dateActual || value.x) as Date | undefined;
        return isUSTimeZone(getUserTimeZone())
          ? `${s.label}, ${value.interpolationMessage ? `${value.interpolationMessage} ` : ''}${
              typeof value.y === 'number' ? value.y.toFixed(1) : value.y
            } ${s.unit}, ${formatDate(
              displayDate,
              'hours-minutes',
              timeZone,
              'en-US',
              true
            )} ${formatDate(displayDate, 'numeric-month-day', timeZone, 'en-US')}`
          : `${s.label}, ${value.interpolationMessage ? `${value.interpolationMessage} ` : ''}${
              typeof value.y === 'number' ? value.y.toFixed(1) : value.y
            } ${s.unit}, ${formatDate(value.x, 'hours-minutes', timeZone)} ${formatDate(
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

export const parseTagValue = (tag: BaseTag): number | string => {
  // Get the latest value, otherwise set to '--'
  let latestTagValue = (tag.values?.length || 0) > 0 ? tag.values?.[0]?.value : '--';

  // If the tag is numeric, add precision
  if (
    typeof latestTagValue === 'number' &&
    tag.type === BaseTagType.Tag &&
    tag.meta?.dataType !== BaseTagDataType.Integer
  ) {
    latestTagValue = latestTagValue.toFixed(1);
  }

  // Attach units if they exist
  if (tag.unit) {
    latestTagValue += ` ${tag.unit}`;
  }

  // If the tag is a boolean, convert to 'On' or 'Off'
  if (tag.meta?.dataType === BaseTagDataType.Boolean && tag.values?.[0]?.value !== undefined) {
    latestTagValue =
      tag.values?.[0]?.value === 1 ? BooleanTagDisplayValue.On : BooleanTagDisplayValue.Off;
  }

  // Check for default fallback on string tags
  if (latestTagValue === '') {
    latestTagValue = NO_SELECTION;
  }

  return latestTagValue;
};
