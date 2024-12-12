import React, { createContext, useContext, useState, ReactNode } from 'react';
import moment from 'moment';

import { DateRange } from 'helpers';

interface ContextProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}
export const PageDateRangeContext = createContext<ContextProps>({
  dateRange: {
    from: moment().subtract(7, 'days').startOf('days').toDate(),
    to: moment().endOf('days').toDate()
  },
  setDateRange: (range: DateRange) => console.log('status not set' + range)
});

export const usePageDateRange = (): ContextProps => useContext(PageDateRangeContext);

export const PageDateRangeProvider = ({
  children,
  subtractDaysCount
}: {
  children?: ReactNode;
  subtractDaysCount?: number;
}): JSX.Element => {
  // provided date range to be shared accoross widgets
  // each widget will also have it's own custom dateRange
  const [dateRange, setDateRange] = useState<DateRange>({
    from: moment()
      .subtract(subtractDaysCount || 6, 'days')
      .startOf('days')
      .toDate(),
    to: moment().endOf('days').toDate()
  });

  return (
    <PageDateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </PageDateRangeContext.Provider>
  );
};
