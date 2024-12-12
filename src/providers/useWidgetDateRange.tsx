import React, { createContext, useContext, useState, ReactNode } from 'react';
import moment from 'moment';
import { usePageDateRange } from 'providers';
import { DateRange } from 'helpers';

/***********
 * USAGE:
 * This is dependant on being a child of PageDateRangeProvider and the component must be wrapped in WidgetDateRangeProvider
 *
 * this hook will get the current dateRange from usePageDateRange and use that as a starting dateRange to provide to component.
 * If the property subtractDaysCount is set, the widget will switch to custom date mode and go back x amount of days.
 *
 * to set the date range of the widget, use {setDateRange} from the useWidgetDateRange() hook
 * to set the date range of the page, use {setDateRange} from the usePageDateRange() hook
 *
 */

interface ContextProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}
export const WidgetDateRangeContext = createContext<ContextProps>({
  dateRange: {
    from: moment().subtract(6, 'days').startOf('days').toDate(),
    to: moment().endOf('days').toDate()
  },
  setDateRange: (range: DateRange) => console.log('status not set' + range)
});

export const useWidgetDateRange = (): ContextProps => useContext(WidgetDateRangeContext);

export const WidgetDateRangeProvider = ({
  children,
  subtractDaysCount
}: {
  children?: ReactNode;
  subtractDaysCount?: number;
}): JSX.Element => {
  const { dateRange: pageDateRange } = usePageDateRange();
  // provided date range to be shared accoross widgets
  // each widget will also have it's own custom dateRange
  const [widgetDateRange, setWidgetDateRange] = useState<DateRange>(
    !subtractDaysCount
      ? pageDateRange
      : {
          from: moment().subtract(subtractDaysCount, 'days').startOf('days').toDate(),
          to: moment().endOf('days').toDate()
        }
  );

  const value = {
    // check to see if there's a custom date range for this widget and provide it
    dateRange: widgetDateRange,
    setDateRange: (range: DateRange) => {
      // currently, the widget cannot set the main page date range
      setWidgetDateRange(range);
    }
  };

  return (
    <WidgetDateRangeContext.Provider value={value}>{children}</WidgetDateRangeContext.Provider>
  );
};
