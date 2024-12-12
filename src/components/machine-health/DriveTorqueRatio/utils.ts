// Types
import { DatePoint } from 'types/graph';
import { BaseTag } from 'types/protein';

// Constants
import { INNER_DRIVE_TORQUE, OUTER_DRIVE_TORQUE } from 'constants/machineTags';

interface ProcessedData {
  innerSeriesData: DatePoint[];
  outerSeriesData: DatePoint[];
  innerValuePercent: number;
  outerValuePercent: number;
}

/**
 * Process API response data into appropriate format for both graphs
 */
export const processData = (data?: BaseTag[]): ProcessedData => {
  let innerSeriesData: DatePoint[] = [];
  let outerSeriesData: DatePoint[] = [];
  let lastInnerValue = 0;
  let lastOuterValue = 0;

  const innerResponse = data?.find(({ id }) => id === INNER_DRIVE_TORQUE);
  if (innerResponse?.values.length) {
    innerSeriesData = innerResponse.values.map(({ value, timestamp }) => ({
      x: new Date(timestamp),
      y: value
    }));
    const isLastValueNumber = typeof innerSeriesData[innerSeriesData.length - 1].y === 'number';
    lastInnerValue = isLastValueNumber
      ? (innerSeriesData[innerSeriesData.length - 1].y as number)
      : 0;
  }

  const outerResponse = data?.find(({ id }) => id === OUTER_DRIVE_TORQUE);
  if (outerResponse?.values.length) {
    outerSeriesData = outerResponse.values.map(({ value, timestamp }) => ({
      x: new Date(timestamp),
      y: value
    }));
    const isLastValueNumber = typeof outerSeriesData[outerSeriesData.length - 1].y === 'number';
    lastOuterValue = isLastValueNumber
      ? (outerSeriesData[outerSeriesData.length - 1].y as number)
      : 0;
  }

  // Calculate the last inner/outer values as a ratio/percentage
  const total = lastInnerValue + lastOuterValue;
  let innerValuePercent = 0;
  let outerValuePercent = 0;

  if (total > 0) {
    innerValuePercent = Math.round((100 / total) * lastInnerValue);
    outerValuePercent = Math.round((100 / total) * lastOuterValue);
  }

  return {
    innerSeriesData,
    outerSeriesData,
    innerValuePercent,
    outerValuePercent
  };
};
