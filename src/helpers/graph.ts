// 3rd party libs
import { flatten } from 'lodash';
import * as Moment from 'moment';
import { max, min } from 'moment';
import { extendMoment } from 'moment-range';

// Types
import { DateTuple } from 'types';
import { DatePoint } from 'types/graph';

const momentRange = extendMoment(Moment);
// Default left padding for synchronized graphs
export const DEFAULT_LEFT_PADDING = 150;
/**
 * Remove points below a certain value from a series of points
 * We do not remove _all_the points below the threshold. To make sure that graph lines overlap the axis nicely,
 * we leave one point unaffected (the point that is closest to the threshold).
 * This means that when plotting the points, the line will still cross the axis
 *
 * Note: Supplied points must be in ascending order, in the x axis.
 */
export const prunePointsBelow = (dataSet: DatePoint[], threshold: Date): DatePoint[] => {
  // Remove points less than threshold, leaving one point behind
  let remainingMinPoint = false;
  const reversed = [...dataSet].reverse();

  const minRemoved = reversed.filter((point) => {
    if (point.x < threshold) {
      if (remainingMinPoint) {
        return false;
      }
      remainingMinPoint = true;
    }
    return true;
  });

  return minRemoved.reverse();
};

/**
 * Remove points above a certain value from a series of points
 * We do not remove _all_the points aboe the threshold. To make sure that graph lines overlap the axis nicely,
 * we leave one point unaffected (the point that is closest to the threshold)
 * This means that when plotting the points, the line will still cross the axis
 *
 * Note: Supplied points must be in ascending order, in the x axis.
 */
export const prunePointsAbove = (dataSet: DatePoint[], threshold: Date): DatePoint[] => {
  // Remove points greater than threshold, leaving one point behind
  let remainingMaxPoint = false;
  const maxRemoved = [...dataSet].filter((point) => {
    if (point.x > threshold) {
      if (remainingMaxPoint) {
        return false;
      }
      remainingMaxPoint = true;
    }
    return true;
  });

  return maxRemoved;
};

/**
 * Prune data from DataPoint[]
 */
export const pruneData = (data: DatePoint[], domain: DateTuple): DatePoint[] => {
  const prunedDataBelow = prunePointsBelow(data, domain[0]);
  const prundedData = prunePointsAbove(prunedDataBelow, domain[1]);
  return prundedData;
};

/**
 * Get the first & last date offsets of Series[]
 */

export const getXaxisOffset = <T extends { data: DatePoint[] }>(
  series: readonly T[]
): { min: Date; max: Date } => {
  const dates = flatten(series.map((s) => s.data?.map((d) => d.x))).map((date) =>
    Moment.default(date)
  );
  return {
    min: min(dates).toDate(),
    max: max(dates).toDate()
  };
};

/**
 * Get [min, max] of yAxis values
 */
export const getYaxisOffset = <T extends { data: DatePoint[] }>(
  series: readonly T[]
): { min: number; max: number } => {
  const ys = flatten(series.map((s) => s.data.map((d) => d.y))) as number[];
  const isYsNumber = ys.every((y) => typeof y === 'number');
  return {
    min: isYsNumber ? getMin(ys) : 0,
    max: isYsNumber ? getMax(ys) : 0
  };
};

const getMax = (arr: number[]) => {
  let len = arr.length;
  let max = -Infinity;

  while (len--) {
    max = arr[len] > max ? arr[len] : max;
  }
  return max;
};

const getMin = (arr: number[]) => {
  let len = arr.length;
  let min = Infinity;

  while (len--) {
    min = arr[len] < min ? arr[len] : min;
  }
  return min;
};

export const getXaxisTicks = (start: Date, end: Date): Date[] => {
  const range = momentRange.range(start, end);
  const firstHalf = momentRange.range(start, range.center());
  const secondHalf = momentRange.range(range.center(), end);
  return [
    start,
    firstHalf.center().toDate(),
    range.center().toDate(),
    secondHalf.center().toDate(),
    end
  ];
};
