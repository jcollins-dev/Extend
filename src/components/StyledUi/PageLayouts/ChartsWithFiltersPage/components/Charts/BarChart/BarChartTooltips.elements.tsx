import styled from 'styled-components';

export const BarChartCounterTooltipContainer = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto auto;
  grid-template-areas: 'group value';
  grid-gap: 0.3em;

  .tooltip-group {
    grid-area: group;
    width: max-conent;
  }

  .tooltip-value {
    grid-area: value;
    width: max-conent;
    font-weight: 500;
  }
`;
