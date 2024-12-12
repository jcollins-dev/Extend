import { DateRangeProps } from 'components';
import moment from 'moment';

export type UseRangeSelectListOptionsReturnProps = Record<string, DateRangeProps>;

export interface UseRangeSelectListOptionsProps {
  hasProvider?: boolean;
}

export const rangeSelectListOptionsWithoutTimezone = {
  today: {
    startTime: moment().startOf('day').toDate(),
    endTime: moment().toDate()
  },
  yesterday: {
    startTime: moment().subtract(1, 'days').startOf('day').toDate(),
    endTime: moment().subtract(1, 'days').endOf('day').toDate()
  },
  'this-week': {
    startTime: moment().startOf('isoWeek').toDate(),
    endTime: moment().toDate()
  },
  'last-week': {
    startTime: moment().subtract(1, 'weeks').startOf('isoWeek').toDate(),
    endTime: moment().subtract(1, 'weeks').endOf('isoWeek').toDate()
  },
  'last-2-weeks': {
    startTime: moment().subtract(2, 'weeks').startOf('isoWeek').toDate(),
    endTime: moment().toDate()
  },
  'this-month': {
    startTime: moment().startOf('month').toDate(),
    endTime: moment().toDate()
  },
  'last-30-days': {
    startTime: moment().subtract(30, 'days').startOf('day').toDate(),
    endTime: moment().toDate()
  },
  day: {
    startTime: moment().subtract(1, 'days').startOf('day').toDate(),
    endTime: moment().toDate()
  },
  '2-days': {
    startTime: moment().subtract(2, 'days').startOf('day').toDate(),
    endTime: moment().toDate()
  },
  '3-days': {
    startTime: moment().subtract(3, 'day').startOf('day').toDate(),
    endTime: moment().toDate()
  },
  '15-minutes': {
    startTime: moment().subtract(15, 'minutes').toDate(),
    endTime: moment().toDate()
  },
  '30-minutes': {
    startTime: moment().subtract(30, 'minutes').toDate(),
    endTime: moment().toDate()
  },
  '2-hours': {
    startTime: moment().subtract(2, 'hours').toDate(),
    endTime: moment().toDate()
  },
  '4-hours': {
    startTime: moment().subtract(4, 'hours').toDate(),
    endTime: moment().toDate()
  },
  '8-hours': {
    startTime: moment().subtract(8, 'hours').toDate(),
    endTime: moment().toDate()
  },
  '24-hours': {
    startTime: moment().subtract(24, 'hours').toDate(),
    endTime: moment().toDate()
  }
};

export const useRangeSelectListOptions = (): UseRangeSelectListOptionsReturnProps =>
  rangeSelectListOptionsWithoutTimezone;
