import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const ConnectedScatterChartContainer = styled.div<StyledUiContainerProps>`
  display: grid !important;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  padding: 0.5em;

  grid-template-areas: 'legend legend' 'labelLeft chart';

  width: 100%;

  .chart-legend {
    grid-area: legend;
  }

  .chart-label-left {
    grid-area: labelLeft;
    font-size: 0.8em;
    width: 0.8em;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      postion: absolute;
      display: block;
      transform: rotate(-90deg);
      min-width: max-content;
    }
  }

  .dimensions-container {
    grid-area: chart;
  }
`;

export const LegendContainer = styled.div`
  display: flex;
  gap: 1em;
  font-size: 0.8em;
`;

export const LegendItemContainer = styled.button.attrs(() => ({ type: 'button' }))<{
  color?: string;
  isSelected?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 0.4em;
  border: none;
  background-color: transparent;
  cursor: pointer;

  opacity: ${({ isSelected }) => (isSelected ? 1 : 0.7)};

  &:before {
    opacity: ${({ isSelected }) => (isSelected ? 1 : 0.3)};
    content: '';
    width: 0.8em;
    height: 0.8em;
    border-radius: 50%;
    background-color: ${({ color, isSelected }) => (!isSelected ? 'black' : color || 'black')};
    flex-grow: 0;
  }
`;
