import styled from 'styled-components';

export const BarChartContainer = styled.div`
  position: relative;
  font-size: 1em;

  .dimensions-container {
    position: relative;
  }

  .bar-chart-container__hover-chart,
  .bar-chart-container__inside-label {
    position: absolute;
    top: 0;
    left: 0;
  }

  .bar-chart-container__hover-chart {
    z-index: 500;
  }

  .bar-chart-container__inside-label {
    z-index: 499;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
