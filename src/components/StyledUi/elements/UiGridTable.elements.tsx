import styled from 'styled-components';
import { styledTheme } from '../';

const pad = styledTheme.space.xs;

interface UiGridTableProps {
  /** used to set grid-template-columns: '1fr auto auto auto' */
  colSizes: string;
}

export const UiGridTable = styled.div<UiGridTableProps>`
  display: grid;
  grid-template-columns: ${({ colSizes }) => colSizes};
  grid-gap: ${pad};

  .ui-grid-header,
  .ui-cell {
    padding-right: 0.7em;
  }

  .ui-col-title {
    font-weight: 500;
    font-size: 1.1em;
  }

  .ui-label {
    font-weight: 500;
    text-transform: capitalize;
    word-break: break-word;
  }

  .ui-no-data {
    border-width: 1px;
    border-style: dashed;
    text-align: center;

    border-radius: ${styledTheme.radius.sm};
    border-color: ${styledTheme.color.status.error.base};
    color: ${styledTheme.color.status.error.base};
    background-color: ${styledTheme.color.status.error.light};
    padding: ${styledTheme.space.base};
  }
`;
