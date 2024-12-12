// 3rd party libs
import React, { useRef } from 'react';
import styled from 'styled-components';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DayPickerInputProps, Modifier } from 'react-day-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { CustomOverlay, OverlayProps } from './utils';
import moment from 'moment';

type Props = DayPickerInputProps & {
  format?: string;
  icon?: 'caret' | 'calendar';
  overlayPosition?: 'left' | 'right';
  formatDate?: (date: Date, format?: string) => string;
};

const faIcon = { caret: faCaretDown, calendar: faCalendarWeek };

// Styling
const DayPickerContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 11.125rem;
  height: 2.5rem;

  .DayPickerInput {
    width: 100%;
    height: 100%;
  }

  .DayPickerInput > input {
    width: 100%;
    height: 100%;

    padding: 0 1rem;
    font-size: 0.875rem;
    line-height: 1.125rem;
    font-weight: 500;
    border: 0.0625rem solid #d8dde3;
    border-radius: 0.25rem;
    box-sizing: border-box;

    :hover {
      background: #e0e4e7;
    }
  }

  svg {
    position: absolute;
    right: 5%;
  }
`;

const defaultFormatDate = (date: Date, format = 'll') => moment(date).format(format);

const DayPicker = ({
  value,
  placeholder,
  format,
  icon,
  overlayPosition,
  onDayChange,
  dayPickerProps,
  formatDate = defaultFormatDate
}: Props): JSX.Element => {
  const ref = useRef<DayPickerInput>(null);

  const focus = () => (ref.current?.getInput() as HTMLInputElement).focus();

  const overlayStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = { bottom: -8 };
    if (overlayPosition == 'right') style.left = -40;
    return style;
  };

  return (
    <DayPickerContainer>
      <DayPickerInput
        ref={ref}
        value={value}
        formatDate={(date) => formatDate(date, format)}
        placeholder={placeholder}
        onDayChange={onDayChange}
        overlayComponent={(props: OverlayProps) => {
          return <CustomOverlay {...props} style={overlayStyle()} />;
        }}
        dayPickerProps={{
          selectedDays: value as Modifier,
          ...dayPickerProps
        }}
      />
      {icon && <FontAwesomeIcon icon={faIcon[icon]} onClick={focus} />}
    </DayPickerContainer>
  );
};

export default DayPicker;
