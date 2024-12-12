import { DateRangeProps, useDateRange } from 'components';
import moment from 'moment';

export type UseRangeSelectListOptionsReturnProps = Record<string, DateRangeProps>;

export interface UseRangeSelectListOptionsProps {
  hasProvider?: boolean;
}

export const useRangeSelectListOptions = (): UseRangeSelectListOptionsReturnProps => {
  const { rightNow: endTime } = useDateRange();

  return {
    today: {
      startTime: moment(endTime).startOf('day').toDate(),
      endTime
    },
    yesterday: {
      startTime: moment(endTime).subtract(1, 'days').startOf('day').toDate(),
      endTime: moment(endTime).subtract(1, 'days').endOf('day').toDate()
    },
    'this-week': {
      startTime: moment(endTime).startOf('isoWeek').toDate(),
      endTime
    },
    'last-week': {
      startTime: moment(endTime).subtract(1, 'weeks').startOf('isoWeek').toDate(),
      endTime: moment(endTime).subtract(1, 'weeks').endOf('isoWeek').toDate()
    },
    'last-2-weeks': {
      startTime: moment(endTime).subtract(2, 'weeks').startOf('isoWeek').toDate(),
      endTime
    },
    'this-month': {
      startTime: moment(endTime).startOf('month').toDate(),
      endTime
    },
    'last-30-days': {
      startTime: moment(endTime).subtract(30, 'days').startOf('day').toDate(),
      endTime
    },
    day: {
      startTime: moment(endTime).subtract(1, 'days').startOf('day').toDate(),
      endTime
    },
    '2-days': {
      startTime: moment(endTime).subtract(2, 'days').startOf('day').toDate(),
      endTime
    },
    '3-days': {
      startTime: moment(endTime).subtract(3, 'day').startOf('day').toDate(),
      endTime
    },
    '15-minutes': {
      startTime: moment(endTime).subtract(15, 'minutes').toDate(),
      endTime
    },
    '30-minutes': {
      startTime: moment(endTime).subtract(30, 'minutes').toDate(),
      endTime
    },
    '2-hours': {
      startTime: moment(endTime).subtract(2, 'hours').toDate(),
      endTime
    },
    '4-hours': {
      startTime: moment(endTime).subtract(4, 'hours').toDate(),
      endTime
    },
    '8-hours': {
      startTime: moment(endTime).subtract(8, 'hours').toDate(),
      endTime
    },
    '24-hours': {
      startTime: moment(endTime).subtract(24, 'hours').toDate(),
      endTime
    }
  };
};
