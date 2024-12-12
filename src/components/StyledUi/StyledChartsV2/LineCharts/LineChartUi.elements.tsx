import styled from 'styled-components';

export const baseClass = `line-chart-ui`;

export const LineChartUiContainer = styled.div.attrs(() => ({
  className: `widget-ui-main ${baseClass}`
}))`
  display: grid;
  gap: 1em;
  min-height: 100%;
  grid-template-columns: 250px 150px;
  grid-template-areas: 'chart legend';
  overflow-x: visible !important;
  overflow-y: visible !important;
  height: 200px;
  padding: 0;

  .${baseClass}__chart {
    grid-area: chart;
    padding: 0;
  }

  .${baseClass}__legend {
    display: flex;
    flex-direction: column;
    align-items: center;
    grid-area: legend;
    overflow: auto;
    height: 100%;
  }
`;
