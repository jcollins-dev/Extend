import styled from 'styled-components';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';

export const baseClass = `time-range-inputs`;

export const TimeRangeInputsContainer = styled.div<StyledUiContainerProps>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  font-size: 1em;
  grid-gap: 1em;

  grid-area: ${({ gridArea }) => gridArea};

  .inputs-title {
    padding-left: 0.2em;
    margin-bottom: 0.2em;
    font-size: 0.9em;
    font-weight: 500;

    span {
      font-size: 1em;
      display: block;
    }
  }
`;
