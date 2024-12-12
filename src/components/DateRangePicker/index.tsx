import React, { useState, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Range } from 'react-date-range';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { DateRangePicker as BaseDateRangePicker } from 'react-date-range';
import { usePopper } from 'react-popper';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// Components
import { Button, Typography } from 'components';

// Helpers
import { DateRange } from 'helpers';

type Props = {
  /** The only parts of 'range' dates that are taken into account are year, month, day */
  range: DateRange;
  /** The only parts of 'range' dates that are meaningful are year, month, day. For an
   * accurate datetime, time zones should be applied.
   */
  onRangeUpdate: (range: DateRange) => void;
  maxDate?: Date;
  minDate?: Date;
  onToggle?: () => void;
};

// Styled Components
const ButtonContainer = styled.div`
  align-self: end;
  display: flex;
  gap: 1.1rem;
  justify-content: end;
  padding: 1rem;
  width: 25%;
`;

const ModalContainer = styled.div`
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  z-index: 900;

  border: 1px solid ${(props) => props.theme.colors.lightGrey3};
  border-radius: 0.5rem;
`;

const Icon = styled(FontAwesomeIcon)`
  margin-left: 0rem;
  margin-right: 1rem;
`;

const DateButton = styled(Button)`
  max-width: 20rem;
`;

const DateRangePicker = ({
  range,
  onRangeUpdate,
  maxDate,
  minDate,
  onToggle
}: Props): JSX.Element => {
  const referenceElement = useRef(null);
  const popperElement = useRef(null);
  const { styles, attributes } = usePopper(referenceElement.current, popperElement.current, {
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [50, 0]
        }
      }
    ]
  });

  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: range.from,
    endDate: range.to
  });

  const updateDateRange = useCallback((range: Range) => {
    setDateRange(range);
    return true;
  }, []);

  const togglePopover = useCallback(() => {
    setShowDateRangePicker((v) => !v);
    onToggle?.();
  }, []);

  const onSave = useCallback(() => {
    setShowDateRangePicker(false);
    onRangeUpdate({
      from: dateRange.startDate,
      to: dateRange.endDate
    });
    onToggle?.();
  }, [dateRange]);

  const staticDateRanges = useMemo(() => {
    const generateRange = (days: number) => (): Range => ({
      startDate: moment()
        .subtract(days - 1, 'days')
        .startOf('days')
        .toDate(),
      endDate: moment().endOf('days').toDate()
    });

    const isSelected = (range: Range, generatedRange: Range) => {
      const start = moment(range.startDate);
      const end = moment(range.endDate);
      return (
        start.isSame(generatedRange.startDate, 'day') && end.isSame(generatedRange.endDate, 'day')
      );
    };

    const dayRanges = [3, 7, 14, 30, 60, 90];

    return dayRanges.map((days) => ({
      label: `Last ${days} days`,
      range: generateRange(days),
      isSelected: (range: Range) => isSelected(range, generateRange(days)())
    }));
  }, []);

  return (
    <>
      <DateButton ref={referenceElement} onClick={togglePopover}>
        <Icon icon={faCalendarWeek} />
        <Typography mb={0} size="0.8125rem">
          {moment(range.from || new Date()).format('LL')} -{' '}
          {moment(range.to || new Date()).format('LL')}
        </Typography>
      </DateButton>
      <ModalContainer
        ref={popperElement}
        style={{
          ...styles.popper,
          ...{ visibility: showDateRangePicker ? 'visible' : 'hidden' }
        }}
        {...attributes.popper}
      >
        <BaseDateRangePicker
          onChange={(item) => updateDateRange(item.range1)}
          months={2}
          ranges={[dateRange]}
          staticRanges={staticDateRanges}
          inputRanges={[]}
          direction="horizontal"
          maxDate={maxDate}
          minDate={minDate}
        />
        <ButtonContainer>
          <Button
            onClick={() => {
              setShowDateRangePicker((v) => !v);
              onToggle?.();
            }}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={onSave}>
            Apply
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </>
  );
};

export default DateRangePicker;
