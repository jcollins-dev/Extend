import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const VirtualizedTableHeaderCellContainer = styled.div`
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr 20px;
  gap: 0.3em;
  align-items: center;

  &:hover {
    svg {
      opacity: 1;
    }
  }
`;

export const VirtualizedTableContainer = styled.div`
  padding: 0 2px 0 0 !important;
  color: ${styledTheme.color.main};
  font-weight: 500;

  .ReactVirtualized__Table__headerRow,
  .ReactVirtualized__Table__Grid,
  .ReactVirtualized__Table__row,
  .ReactVirtualized__Grid__innerScrollContainer {
    min-width: 700 !important;
  }

  .ReactVirtualized__Table__headerTruncatedText {
    white-space: initial;
  }

  .ReactVirtualized__Table__headerRow {
    text-transform: none;
    font-weight: 600;

    background-color: ${styledTheme.color.bg.negLighter};
  }

  .ReactVirtualized__Table__row {
    width: 100% !important;
    border-bottom: ${({ theme }) => theme.colors.borders.border02.border};
  }
`;
