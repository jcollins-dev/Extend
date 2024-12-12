import { styledTheme } from 'components';
import styled from 'styled-components';
/*
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
*/

export const MultiRangeSliderContainer = styled.div<{ width: number }>`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: auto;
  margin: 0.7em 0;
  padding-bottom: 1.5em;

  .slider {
    position: relative;
    width: ${({ width }) => width}px;
  }

  .slider__track,
  .slider__range,
  .slider__left-value,
  .slider__right-value {
    position: absolute;
  }

  .slider__track,
  .slider__range {
    border-radius: 3px;
    height: 5px;
  }

  .slider__track {
    background-color: #ced4da;
    width: ${({ width }) => width}px;
    z-index: 1;
  }

  .slider__range {
    background-color: ${styledTheme.color.secondary};
    opacity: 0.3;
    z-index: 2;
  }

  .slider__left-value,
  .slider__right-value {
    margin-top: 20px;
    font-size: 0.9em;
  }

  .slider__left-value {
    left: 6px;
  }

  .slider__right-value {
    right: -4px;
  }

  /* Removing the default appearance */
  .thumb,
  .thumb::-webkit-slider-thumb {
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
  }

  .thumb {
    pointer-events: none;
    position: absolute;
    height: 0;
    width: ${({ width }) => width}px;
    outline: none;
  }

  .thumb--zindex-3 {
    z-index: 3;
  }

  .thumb--zindex-4 {
    z-index: 4;
  }

  .thumb--zindex-5 {
    z-index: 5;
  }

  /* For Chrome browsers */
  .thumb::-webkit-slider-thumb {
    background-color: ${styledTheme.color.secondary};
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px ${styledTheme.color.secondary};
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }

  /* For Firefox browsers */
  .thumb::-moz-range-thumb {
    background-color: ${styledTheme.color.secondary};
    border: none;
    border-radius: 50%;
    box-shadow: 0 0 1px 1px ${styledTheme.color.secondary};
    cursor: pointer;
    height: 18px;
    width: 18px;
    margin-top: 4px;
    pointer-events: all;
    position: relative;
  }
`;
