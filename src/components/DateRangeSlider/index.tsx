// 3rd party
import React, { ReactElement, useEffect, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import styled from 'styled-components';
import Draggable, { DraggableEventHandler } from 'react-draggable';

// Styling - lots of overriding rc-slider properties
const RangeContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform: translateY(66%);
  display: flex;

  & .rc-slider {
    pointer-events: none;
  }

  & .rc-slider .rc-slider-handle {
    pointer-events: auto;
  }

  & .rc-slider-mark {
    top: -1.5rem;
    font-size: 0.75rem;
  }

  & .rc-slider-rail {
    background-color: ${(props) => props.theme.colors.primaryBlue3};
    height: 0.125rem;
    top: 0.375rem;
  }

  & .rc-slider-track {
    background-color: ${(props) => props.theme.colors.mediumBlue};
    height: 0.25rem;
  }

  & .rc-slider-dot {
    background-color: ${(props) => props.theme.colors.primaryBlue3};
    border-color: ${(props) => props.theme.colors.primaryBlue3};
    bottom: -0.125rem;
    margin-left: -0.25rem;
    width: 0.5rem;
    height: 0.5rem;
  }

  & .rc-slider-dot-active {
    display: none;
  }

  & .rc-slider-mark-text {
    font-family: ${(props) => props.theme.typography.family};
    font-size: ${(props) => props.theme.typography.text.bodySmall.size};
    line-height: ${(props) => props.theme.typography.text.bodySmall.lineHeight};
    font-weight: ${(props) => props.theme.typography.text.bodySmall.weight};
    color: ${(props) => props.theme.colors.mediumGrey3};
  }

  & .rc-slider-mark-text.rc-slider-mark-text-active {
    font-family: ${(props) => props.theme.typography.family};
    font-size: ${(props) => props.theme.typography.text.bodyMediumBold.size};
    line-height: ${(props) => props.theme.typography.text.bodyMediumBold.lineHeight};
    font-weight: ${(props) => props.theme.typography.text.bodyMediumBold.weight};
    color: ${(props) => props.theme.colors.darkGrey};
    top: -0.125rem;
  }

  & .rc-slider-mark-text.rc-slider-mark-text-active .mark-with-year {
    top: -1.25rem;
  }

  & .rc-slider-handle {
    width: 0.875rem;
    height: 0.875rem;
    margin-top: -0.3125rem;
    border: none;
    background-color: ${(props) => props.theme.colors.mediumBlue};
  }
`;

const MarkWithYear = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: -1.125rem;
  transform: translate(-50%);

  & > div {
    margin-bottom: 0.1875rem;
  }

  & > div:last-child {
    margin-bottom: 0;
  }
`;

interface LabelProps {
  left: number;
  width: number;
  numMonths: number;
  dragging: boolean;
  disabled?: boolean;
  displayOnly?: boolean;
}

const RangeLabel = styled.div<LabelProps>`
  user-select: none;
  pointer-events: ${(props) =>
    props.disabled || props.displayOnly ? 'none' : props.numMonths === 2 ? 'none' : 'auto'};
  cursor: ${(props) => (props.dragging ? 'grabbing' : 'grab')};
  position: absolute;
  left: ${(props) =>
    props.numMonths === 1
      ? `calc(${props.left}% + 0.8125rem)`
      : `calc(${props.left}% - 0.4375rem)`};
  top: ${(props) => (props.numMonths === 1 ? '1.125rem' : '0')};
  width: ${(props) => (props.numMonths === 1 ? '3rem' : `calc(${props.width}% + 0.875rem)`)};
  height: 0.875rem;
  border-radius: 0.5rem;
  color: ${(props) => props.theme.colors.white};
  background-color: ${(props) => props.theme.colors.mediumBlue};
  font-family: ${(props) => props.theme.typography.family};
  font-size: ${(props) => props.theme.typography.components.rangeLabel.size};
  line-height: ${(props) => props.theme.typography.components.rangeLabel.lineHeight};
  font-weight: ${(props) => props.theme.typography.components.rangeLabel.weight};
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${(props) => (props.displayOnly ? '1' : '0')};
`;

enum RangeOverlap {
  Enabled = 'enabled',
  EnabledNoLabel = 'enabled-with-label',
  Disabled = 'disabled',
  Push = 'push'
}

interface Props {
  initialStartDate?: Moment; // Default to now
  initialEndDate?: Moment; // Default to 1 year from now
  rangeStart?: number;
  rangeEnd?: number;
  // Callback to handle changes in the date range
  onChange?: (
    startDate: Moment,
    endDate: Moment,
    initialStartDate?: number,
    initialEndDate?: number
  ) => void;
  overlap?: RangeOverlap;
}

const DateRangeSlider = ({
  initialStartDate,
  initialEndDate,
  rangeStart,
  rangeEnd,
  onChange,
  overlap
}: Props): ReactElement => {
  // Element reference so the width can be retrieved for calculations
  const ref = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(0);

  // Track pill dragging state
  const [draggingPill, setDraggingPill] = useState<boolean>(false);

  // Set start and end dates of range, defaulting to 12 months
  const startDate = initialStartDate ? initialStartDate : moment().startOf('month');
  const endDate = initialEndDate
    ? initialEndDate
    : moment().add(1, 'y').subtract(1, 'month').endOf('month');
  const numSteps = endDate.diff(startDate, 'months');
  // Starting range is initially the whole selection, unless the caller provides new ones,
  // in case we store the range selection in user preferences someday
  const startingRange =
    typeof rangeStart === 'number' && typeof rangeEnd === 'number'
      ? [
          rangeStart >= 0 && rangeStart < numSteps ? rangeStart : 0,
          rangeEnd >= rangeStart && rangeEnd < numSteps ? rangeEnd : numSteps
        ]
      : [0, numSteps];
  const [range, setRange] = useState<number[]>(startingRange);

  // Reference arrays for easy access to data
  const dates = Array.from(Array(numSteps + 1)).map((val, i) => moment(startDate).add(i, 'months'));
  const marks = dates.map((date, i) => {
    // If the first mark, last mark, or January, or the handles
    if (
      i === 0 ||
      i === dates.length - 1 ||
      date.month() === 0 ||
      i === range[0] ||
      i === range[1]
    ) {
      return {
        label: (
          <MarkWithYear className="mark-with-year">
            <div>{date.format('yyyy')}</div>
            <div>{date.format('MMM')}</div>
          </MarkWithYear>
        )
      };
    }
    return date.format('MMM');
  });
  const stepsPx = Array.from(Array(numSteps + 1)).map((val, i) => (i / (numSteps + 1)) * width);

  /* Pill (label) calculations */
  let labelPosition = 0;
  let labelWidth = 0;
  if (width) {
    // Adjustments for handle displacement by rc-slider (14px / element width in px)
    const handleWidth = 14 / width;
    // Width of the label is the distance between marks (a percent)
    labelWidth = 100 / numSteps + handleWidth * 2;
    const left = range[0] * labelWidth;
    const right = range[1] * labelWidth;
    labelPosition = (left - right) / 2 + right - labelWidth / 2;
  }

  // Always at least one month in view
  const numMonths = Math.abs(range[1] - range[0] + 1);
  const labelText = numMonths === 1 ? dates[range[0]].format('MMM') : `${numMonths} months`;

  const hideLabelOnOverlap =
    overlap === RangeOverlap.EnabledNoLabel && numMonths === 0 ? true : false;
  const pillStepSize = numSteps ? width / numSteps : 0;
  const pillDraggingDisabled = range[0] === 0 && range[1] === numSteps;
  const pillPosition = (labelPosition / 100) * width;

  // Input event handlers
  const handleChange = (value: number[]) => {
    const updatedValue = [...value];
    if (overlap === RangeOverlap.Disabled && value[0] === value[1]) {
      // If the left handle is changing
      if (value[0] !== range[0]) {
        updatedValue[0] = value[0] + 1;
      } else if (value[1] !== range[1]) {
        updatedValue[1] = value[1] - 1;
      }
    }
    setRange(updatedValue);

    if (onChange) {
      onChange(dates[updatedValue[0]], dates[updatedValue[1]], updatedValue[0], updatedValue[1]);
    }
  };

  const handlePillDrag: DraggableEventHandler = (e, data) => {
    const stepChange = pillStepSize > 0 ? Math.round(data.deltaX / pillStepSize) : 0;
    if (data.deltaX < 0 && range[0] > 0) {
      const newLeft = range[0] + stepChange >= 0 ? range[0] + stepChange : 0;
      const leftDiff = range[0] - newLeft;
      const newRight = range[1] - leftDiff;
      handleChange([newLeft, newRight]);
    } else if (data.deltaX > 0 && range[1] < numSteps) {
      const newRight = range[1] + stepChange <= numSteps ? range[1] + stepChange : numSteps;
      const rightDiff = newRight - range[1];
      const newLeft = range[0] + rightDiff;
      handleChange([newLeft, newRight]);
    }
  };

  // Handle effects
  useEffect(() => {
    // Retrieving the container element's width for calculations
    const retrieveWidth = () => {
      if (ref && ref.current) {
        setWidth(ref.current.clientWidth);
      }
    };
    // Handle resizing
    // TODO - figure out how to handle parent resize
    // instead of window resize
    const handleResize = () => {
      retrieveWidth();
    };

    if (ref && ref.current) {
      // Remove in case it exists
      window.removeEventListener('resize', handleResize);
      // Add the event listener
      window.addEventListener('resize', handleResize);

      retrieveWidth();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  return (
    <RangeContainer ref={ref}>
      <Range
        pushable={overlap === RangeOverlap.Push}
        min={0}
        max={numSteps}
        marks={marks}
        value={range}
        onChange={handleChange}
      />
      {Boolean(width && !hideLabelOnOverlap) && (
        <>
          <RangeLabel
            dragging={draggingPill}
            disabled={pillDraggingDisabled}
            left={labelPosition}
            width={labelWidth}
            numMonths={numMonths}
            ref={pillRef}
            displayOnly
          >
            {labelText}
          </RangeLabel>
          <Draggable
            axis="x"
            bounds={{
              // Keep the pill from being dragged in a direction of a handle
              // that is already at the limite of the selection range
              left: range[0] === 0 ? pillPosition : stepsPx[range[0]],
              right: range[1] === numSteps ? pillPosition : stepsPx[range[1]]
            }}
            grid={[pillStepSize, 1]}
            position={{ x: pillPosition, y: 0 }}
            onDrag={handlePillDrag}
            onStart={() => setDraggingPill(true)}
            onStop={() => setDraggingPill(false)}
            nodeRef={pillRef}
            disabled={pillDraggingDisabled}
          >
            <RangeLabel
              dragging={draggingPill}
              disabled={pillDraggingDisabled}
              left={0}
              width={labelWidth}
              numMonths={numMonths}
              ref={pillRef}
            >
              {labelText}
            </RangeLabel>
          </Draggable>
        </>
      )}
    </RangeContainer>
  );
};

DateRangeSlider.defaultProps = {
  overlap: RangeOverlap.Push,
  draggablePill: true
};

export default DateRangeSlider;
