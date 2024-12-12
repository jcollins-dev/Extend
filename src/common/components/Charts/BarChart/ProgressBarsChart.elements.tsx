import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

interface ContainerProps extends StyledUiContainerProps {
  count: number;
}

interface BarProps {
  color?: string;
  value: number;
}
export const BarContainer = styled.div<BarProps>`
  display: flex;
  position: relative;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  align-items: center;
  font-size: 0.75rem;

  .progress-bars-chart__bar-col {
    position: absolute;
    bottom: 0;
    width: 65%;
    max-width: 80px;
    min-width: max-content;

    height: ${({ value }) => `${value}%`};
  }

  .progress-bars-chart__bar {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    border-radius: 0.3em;
    z-index: 400;

    background-color: ${({ color }) => color};
  }

  .progress-bars-chart__bar-label {
    position: relative;
    color: white;
    font-size: 1.2em;
    font-weight: 500;
    transform: translateY(-3px);
  }

  .progress-bars-chart__bar-title {
    position: absolute;
    transform: translate(-50%, -5px);
    bottom: 100%;
    left: 50%;
    font-weight: 500;
    text-align: center;
    text-transform: capitalize;
    line-height: 1;
    z-index: 500;
  }
`;

export const ProgressBarsChartContainer = styled.div<ContainerProps>`
  position: relative;
  font-size: 1em;
  display: flex;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  justify-content: space-evenly;
  padding-top: 2em;
`;
