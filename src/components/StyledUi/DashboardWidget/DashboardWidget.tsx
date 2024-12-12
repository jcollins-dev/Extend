// 3rd party libs
import React, { ReactNode, useState } from 'react';

// Components
import { WidgetHeader, WidgetMain, Types } from './';
import { UiWidget as Ui, useDateRange } from '../';
import { Modal } from 'components';
import { DateRangePicker } from '../DateRange/DateRangePicker/DateRangePicker';

// Hooks
import { useContainerSize } from 'hooks';

// Types
import { DateRangeProps } from '../DateRange/DateRangePicker/DateRangePicker.types';
import { ModalSize } from 'types';

interface Props extends Ui.UiProps, Types.Props {
  children?: ReactNode | ReactNode[];
  subtractDaysCount?: number;
  linksToPathTooltipContent?: string;
  titleIndicator?: ReactNode | ReactNode[];
  showIconHelper?: boolean;
  headerBackgroundColor?: string;
  ga?: string;
  dateRange?: DateRangeProps;
  hasGoBackDateLimit?: number;
}

const Calendar = ({
  setShowCalendar,
  showCalendar,
  hasGoBackDateLimit,
  headline
}: {
  headline?: string;
  setShowCalendar: (x: boolean) => void;
  dayRanges?: number[];
  showCalendar?: boolean;
  subtractDaysCount?: number;
  hasGoBackDateLimit?: number;
}): JSX.Element => {
  const { dateRange, setDateRange } = useDateRange();

  return (
    <Modal
      allowContentScroll
      title={headline}
      visible={showCalendar ? true : false}
      onClose={() => setShowCalendar(false)}
      size={ModalSize.SM}
      maxWidth="502px"
      contentBorderRadius="0"
    >
      <DateRangePicker
        handleSubmit={(range: DateRangeProps) => {
          setDateRange({
            startTime: range.startTime,
            endTime: range.endTime
          });
          setShowCalendar(false);
        }}
        handleCancel={() => setShowCalendar(false)}
        dateRange={{
          startTime: dateRange.startTime || new Date(),
          endTime: dateRange.endTime || new Date()
        }}
        hasGoBackDateLimit={hasGoBackDateLimit}
      />
    </Modal>
  );
};

export const DashboardWidget = ({
  children,
  dayRanges,
  hasDatePicker,
  hasFlyOut,
  hasStatusIcon,
  hasError,
  hasGoBackDateLimit,
  headerBackgroundColor,
  isAdminWidget,
  isCentered,
  isLoading,
  Load,
  linksToPath,
  linksToPathTooltipContent,
  Main,
  onAdminButtonClickCallback,
  dateRange,
  showDateRange,
  SubTitle,
  showIconHelper,
  refs,
  timeZone,
  title,
  titleIndicator,
  ga
}: Props): JSX.Element => {
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  // make ref to man section, load it and send to main component
  const { width, height, containerRef: refMain } = useContainerSize();

  const handleToggleCalendar = () => hasDatePicker && setShowCalendar(!showCalendar);

  // check to see if a <header> wrapper is needed and styles the rest accordingly
  const hasHeader =
    hasDatePicker ||
    linksToPath ||
    showDateRange ||
    hasFlyOut ||
    hasStatusIcon ||
    isAdminWidget ||
    showIconHelper ||
    titleIndicator
      ? true
      : false;
  // does the content need to be centered?  typcially used for error or loading
  isCentered = isCentered || isLoading || hasError ? true : false; // send to Ui.Main

  const uiContainer = {
    // setting up styles to pass to Ui.Container
    hasHeader: hasHeader || title ? true : false,
    ref: refs?.refHeader, // send any incoming ref
    isLoading, // set ariaBusy if loading
    ga // grid-area
  };

  const uiHeader = {
    // setting up styles to pass to Ui.Header
    hasRight:
      hasDatePicker || linksToPath || isAdminWidget || showIconHelper || hasFlyOut ? true : false,
    hasLeft: hasStatusIcon ? true : false,
    ref: refs?.refHeader, // send any incoming ref,
    headerBackgroundColor: headerBackgroundColor
  };

  const widgetHeader = {
    isLoading,
    hasError,
    timeZone,
    title,
    titleIndicator,
    SubTitle,
    hasDatePicker,
    hasFlyOut,
    linksToPath,
    linksToPathTooltipContent,
    dateRange,
    showDateRange,
    showIconHelper,
    handleToggleCalendar,
    onAdminButtonClickCallback,
    containerRef: refs?.refHeader,
    isAdminWidget
  };

  // set headline if widget has a popup
  const calendarPopupHeadline = title && `Selecting date range for ${title}`;

  return (
    // get the divs/refs loaded to dom before return children
    <Ui.Container {...uiContainer} gridStyle>
      {!hasHeader ? (
        title && (
          // only load h3 tag if there's only a title, otherwise wrap in a </header> tag
          <Ui.Title>
            {title}
            {SubTitle && !hasError && !isLoading && <Ui.SubTitle>{SubTitle}</Ui.SubTitle>}
          </Ui.Title>
        )
      ) : (
        // needs the <header> wrapper
        <Ui.Header {...uiHeader}>
          <WidgetHeader {...widgetHeader} />
        </Ui.Header>
      )}

      <Ui.Main {...{ isCentered, ref: refMain, hasError }} hasHeader>
        <WidgetMain {...{ Main, isLoading, Load, width, height, hasError }}>{children}</WidgetMain>
      </Ui.Main>

      <Calendar
        {...{
          setShowCalendar,
          showCalendar,
          dayRanges,
          headline: calendarPopupHeadline,
          hasGoBackDateLimit
        }}
      />
    </Ui.Container>
  );
};
