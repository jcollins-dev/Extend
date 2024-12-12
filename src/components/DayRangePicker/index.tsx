// 3rd party libs
import React from 'react';
import styled from 'styled-components';
import 'react-day-picker/lib/style.css';

// Components
import { DayPicker } from 'components';

// Helpers
import { formatDate, DateRange } from 'helpers';

type Props = {
  icon?: 'caret' | 'calendar';
  format?: string;
  dateRange: DateRange;
  // Callback to parent
  onDateRangeChange: (range: DateRange) => void;
};

const Container = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
`;

const DayRangePicker = ({ onDateRangeChange, dateRange, icon = 'caret' }: Props): JSX.Element => {
  // Do not let users choose 'to' date that is before the 'from' date
  const disableToBefore = dateRange.from;

  return (
    <Container>
      <DayPicker
        value={dateRange?.from}
        icon={icon}
        formatDate={(date: Date | number) => formatDate(date, 'long')}
        placeholder="From"
        onDayChange={(from) => {
          onDateRangeChange({ ...dateRange, from });
        }}
      />
      <DayPicker
        value={dateRange?.to}
        icon={icon}
        formatDate={(date: Date | number) => formatDate(date, 'long')}
        placeholder="To"
        dayPickerProps={{
          disabledDays: disableToBefore && { before: disableToBefore }
        }}
        onDayChange={(to) => {
          onDateRangeChange({ ...dateRange, to });
        }}
        overlayPosition={'right'}
      />
    </Container>
  );
};

export default DayRangePicker;
