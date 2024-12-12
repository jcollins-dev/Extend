import styled from 'styled-components';

export const PieChartWithLegendContainer = styled.div.attrs(() => ({
  className: `widget-ui-main`
}))`
  padding: 0;
  display: grid;
  grid-template-columns: 175px 1fr;
  align-items: center;
  justify-content: center;

  .pie-chart-with-legend__pie-chart {
    width: 175px;
    height: 175px;
  }

  .pie-chart-with-legend__legend {
    min-width: 100px;
  }
`;
