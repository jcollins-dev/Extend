import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';

export const DailyMetricsContainer = styled.div<StyledUiContainerProps>`
  padding: 1em;
  grid-template-columns: 3.5fr 1fr;
  display: grid !important;
  grid-gap: 0.7em;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;

    .daily-rate-metrics-widget__stats {
      border-width: 1px 0 0 0 !important;
    }
  }

  .daily-rate-metrics-widget__charts-wrapper {
    display: flex;
    gap: 0.7em;
    height: 100%;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  .pie-chart-container {
    margin: 0 auto;
  }

  .daily-rate-metrics-widget__stats {
    display: flex;
    flex-grow: 1;
    min-height: 100px;
    height: 100%;
    align-items: center;
    justify-content: center;
    border-color: #ccc;
    border-width: 0 0 0 1px;
    border-style: solid;
  }
`;
