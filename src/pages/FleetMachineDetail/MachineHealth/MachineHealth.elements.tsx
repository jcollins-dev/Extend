import styled from 'styled-components';

export const AlarmsViewTablesContainer = styled.div`
  display: grid;
  grid-gap: inherit;
  grid-template-columns: 1fr 1fr;
`;

export const IntensifierViewContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 1fr;
  grid-gap: 1em;
`;

export const IntensifierViewChartsContainer = styled.div<{ skidCount: number }>`
  display: grid;
  grid-gap: inherit;
  grid-auto-flow: row;
  grid-gap: inherit;

  grid-template-columns: ${({ skidCount }) => (skidCount > 1 ? '1fr 1fr' : '1fr')};

  &:first-child {
    grid-column: ${({ skidCount }) => (skidCount === 3 ? `1 / span 2` : undefined)};
  }
`;
