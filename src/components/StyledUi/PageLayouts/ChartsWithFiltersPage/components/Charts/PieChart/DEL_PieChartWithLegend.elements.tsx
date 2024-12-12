import styled from 'styled-components';

export const PieChartWithLegendContainer = styled.div`
  display: grid;
  grid-template-columns: 175px 1fr;
  max-height: 100%;
  grid-gap: 0.5em;
  align-items: center;
  justify-content: center;
  padding-left: 2em !important;

  .dimensions-container {
    width: 100%;
    overflow: hidden;
  }
`;
