import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface RoundRangeSliderProps {
  min: number;
  max: number;
  defaultValue: number | string;
  onChange: (value: number) => void;
}

// Styled components
const SliderContainer = styled.div`
  width: 100%;
`;

const TagLine = styled.div`
  position: absolute;
  top: 30px;
  left: 10px;
  &:after {
    content: '|';
    width: 20px;
    height: 20px;
    z-index: 50;
    color: #0d99ff;
  }
`;

const SliderInput = styled.input`
  -webkit-appearance: none;
  margin: 1rem 0rem;
  width: 100%;
  height: 15px;
  border-radius: 5px;
  background: linear-gradient(
    90deg,
    rgba(255, 40, 40, 1) 0%,
    rgba(255, 145, 0, 1) 50%,
    rgba(251, 205, 16, 1) 100%
  );
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  position: relative;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    content: '!';
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background-image: url('/assets/imgs/icons/rangeSliderIcon.png'); /* Default thumb color */
    border: 5px solid var(--thumb-color, #888);
    cursor: pointer;
    position: relative;
    background-size: contain;
  }

  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #04aa6d;
    cursor: pointer;
  }

  &:before {
    content: '|';
    position: absolute;
    width: 20px;
    height: 20px;
    z-index: 50;
    top: 14px;
    left: 50%;
    color: #0d99ff;
  }

  &:after {
    content: '|';
    position: absolute;
    width: 15px;
    height: 20px;
    z-index: 50;
    top: 14px;
    right: 0;
    color: #0d99ff;
  }
`;

// const SlideContainer = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: 1rem;
// `;

// const SliderValue = styled.span`
//   margin-left: 0.5rem;
// `;

const Slider: React.FC<RoundRangeSliderProps> = ({ min, max, defaultValue, onChange }) => {
  const [value, setValue] = useState<number>(2);

  useEffect(() => {
    if (defaultValue === 'LOW') {
      setValue(3);
    } else if (defaultValue === 'MEDIUM') {
      setValue(2);
    } else {
      setValue(1);
    }
  }, [defaultValue]);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    onChange(newValue);
  };

  // Calculate thumb color based on value
  const thumbColor: string = value > 2 ? 'yellow' : value > 1 ? 'rgba(255, 145, 0, 1)' : 'red';

  // Define the dynamic style for the thumb color
  const thumbStyle: { [key: string]: string } = {
    '--thumb-color': thumbColor
  };

  return (
    <div style={{ position: 'relative' }}>
      <SliderContainer>
        <TagLine />
        <SliderInput
          style={thumbStyle}
          type="range"
          min={min}
          max={max}
          value={value.toString()}
          onChange={handleSliderChange}
        />
      </SliderContainer>
    </div>
  );
};

export default Slider;
