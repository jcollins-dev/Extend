// 3rd party
import React, { ReactElement, useMemo, useCallback } from 'react';
import moment from 'moment';
import Slider, { Handle } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { scaleTime } from 'd3';

// Components
import { Typography } from 'components';

// Theme
import theme from 'themes';

const RAIL_COLOR = '#e9e9e9';

enum StepValue {
  Hours = 'hours'
}

interface Props {
  stepValue?: StepValue;
  value: Date;
  min: Date;
  max: Date;
  tz: string; // only for display
  onChange: (updatedDate: Date) => void;
}

const DateSlider = ({
  stepValue = StepValue.Hours,
  value,
  min,
  max,
  tz,
  onChange
}: Props): ReactElement => {
  const scaler = useMemo(() => scaleTime().domain([min, max]), [min, max]);

  const step = useMemo(() => {
    switch (stepValue) {
      case StepValue.Hours:
        return scaler(moment(min).add(1, 'hour').toDate()) - scaler(min);
      default:
        return;
    }
  }, [stepValue, scaler, min]);

  const dateHandler = useCallback(
    (handleProps) => {
      const style = {
        ...handleProps.style,
        backgroundColor: theme.colors.darkBlue,
        borderColor: theme.colors.darkBlue,
        borderRadius: '1rem',
        color: 'white',
        height: '1.5rem',
        marginTop: '-10px',
        textAlign: 'center',
        width: '5rem'
      };
      return (
        <Handle {...handleProps} style={style}>
          <Typography size="0.75rem">
            {moment(scaler.invert(handleProps.value)).tz(tz).format('DD/MM ddd')}
          </Typography>
        </Handle>
      );
    },
    [min, max]
  );

  return (
    <Slider
      handle={dateHandler}
      trackStyle={{ backgroundColor: RAIL_COLOR }}
      step={step}
      min={scaler(min)}
      max={scaler(max)}
      value={scaler(value)}
      onChange={(value) => onChange(scaler.invert(value))}
    />
  );
};

export default DateSlider;
