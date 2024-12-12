import moment from 'moment';

interface ObjProps {
  [n: string]: string;
}

const formats: ObjProps = {
  short: 'll',
  numbers: 'LL'
};

interface Props {
  startTime?: Date;
  endTime?: Date;
  from?: Date;
  to?: Date;
  format?: string;
  useForDisplay?: boolean;
}

export const timeDisplayFormatter = ({
  startTime,
  endTime,
  to,
  from,
  format,
  useForDisplay
}: Props): string => {
  const today = moment();
  const end = moment(endTime || to);

  const duration = moment.duration(moment(endTime || to).diff(moment(startTime || from)));
  const endsToday = moment(end).isSame(today, 'day');
  const days = duration.days();

  const formatStart = moment(startTime || from).format(formats[format || 'short']);
  const formatEnd = moment(endTime || to).format(formats[format || 'short']);

  let ret = `${formatStart}${days > 1 ? ` - ${formatEnd}` : ``}`;

  if (useForDisplay && endsToday) {
    if (days < 8) ret = `last ${days} days`;
    if (days < 2) ret = `last 24 hours`;
    if (days < 1) {
      if (duration.hours() === 8) ret = `last 8 hours`;
      if (duration.hours() === 4) ret = `last 4 hours`;
      if (duration.hours() === 2) ret = `last 2 hours`;
      if (duration.minutes() === 30) ret = `last 30 minutes`;
      if (duration.minutes() === 15) ret = `last 15 minutes`;
    }
  }

  return ret;
};
