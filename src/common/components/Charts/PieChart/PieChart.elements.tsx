import styled from 'styled-components';

export const PieChartContainer = styled.div`
  position: relative;
  font-size: 1em;

  .dimensions-container {
    position: relative;
  }

  .pie-chart-container__chart {
    svg {
      overflow: visible;
    }
  }

  .pie-chart-container__hover-chart,
  .pie-chart-container__inside-label,
  .pie-chart-container__drop-shadow {
    position: absolute;
    top: 0;
    left: 0;
  }

  .pie-chart-container__hover-chart {
    z-index: 100;
  }

  .pie-chart-container__drop-shadow {
    z-index: 20;

    svg {
      overflow: visible;
    }
  }

  .pie-chart-container__main-chart {
    position: relative;
    z-index: 50;
  }

  .pie-chart-container__inside-label {
    z-index: 51;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
