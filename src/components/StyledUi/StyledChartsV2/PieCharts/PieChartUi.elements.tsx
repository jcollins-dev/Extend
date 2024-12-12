import styled from 'styled-components';

export const baseClass = `pie-chart-ui`;

export const PieChartUiContainer = styled.div.attrs(() => ({
  className: `widget-ui-main widget-ui-main--${baseClass}`
}))`
  display: grid;
  gap: 1em;
  height: 200px;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: 'chart legend';
  overflow: visible !important;
  align-items: center;
  padding: 0 !important;

  .${baseClass}__chart {
    grid-area: chart;
  }

  .${baseClass}__legend {
    display: flex;
    flex-direction: column;
    justify-content: center;
    grid-area: legend;
    overflow: hidden;
    max-height: 300px;
    flex-grow: 1;
    padding: 1em;
  }
`;
