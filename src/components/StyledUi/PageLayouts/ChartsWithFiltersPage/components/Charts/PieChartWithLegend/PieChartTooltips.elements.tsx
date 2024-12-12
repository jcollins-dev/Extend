import styled from 'styled-components';

export const StackedBarChartOverTimeTooltipContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto auto;
  grid-template-areas: 'category category' 'group value';
  grid-gap: 0.3em;
  font-size: 1rem;

  .tooltip-category {
    grid-area: category;
    font-size: 0.9em;
    opacity: 0.8;
    width: max-conent;
  }

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
