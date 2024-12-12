import styled, { css } from 'styled-components';
import { styledTheme } from '../';

const pad = styledTheme.space.xs;

interface UiDataGridProps {
  /** used to set grid-template-columns: '1fr auto auto auto' */
  colSizes: string;
}

const customScrollBar = `
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 20px rgba(0,0,0,.1); 
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,.5); 
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${styledTheme.color.secondary};
  }
`;

const alertGrid = css`
  .ui-grid-header,
  .ui-cell,
  .ui-grid,
  .ui-grid-column-headers {
    border-style: solid;
    border-color: ${styledTheme.color.border.main};
  }
  .ui-grid-column-headers {
    border-width: 1px 1px 0px 1px;
  }
  .ui-grid-header {
    border-width: 1px 1px 0 1px;
    background-color: ${styledTheme.color.bg.negLighter};
    border-radius: ${styledTheme.radius.sm} ${styledTheme.radius.sm} 0 0;
  }
  .ui-cell {
    display: flex;
    align-items: center;
    border-width: 0 0 1px 0;
    min-height: 3rem;

    &.last {
      border-width: 0;
    }

    &.column-header {
      border-width: 0;
      min-height: auto;
    }
  }
  .ui-grid {
    border-width: 1px;
    overflow-x: auto;
    max-height: 6rem;

    border-radius: 0 0 ${styledTheme.radius.sm} ${styledTheme.radius.sm};
  }
`;

export const UiDataGrid = styled.div<UiDataGridProps>`
  display: flex;
  flex-direction: column;

  .ui-grid {
    display: grid;
    grid-template-columns: ${({ colSizes }) => colSizes};
  }

  .ui-grid-column-headers {
    display: grid;
    grid-template-columns: ${({ colSizes }) => colSizes};
  }

  .ui-grid-header,
  .ui-cell {
    padding: ${pad};
  }

  &.style-alerts {
    ${alertGrid};
  }

  .ui-color-warning {
    background-color: ${styledTheme.color.status.warning.light};
  }

  .ui-color-error {
    background-color: ${styledTheme.color.status.error.light};
  }

  .ui-no-issues {
    border-width: 1px;
    border-style: dashed;
    text-align: center;

    border-radius: ${styledTheme.radius.sm};
    border-color: ${styledTheme.color.status.success.base};
    color: ${styledTheme.color.status.success.base};
    background-color: ${styledTheme.color.status.success.light};
    padding: ${styledTheme.space.base};
  }

  .ui-grid {
    ${customScrollBar};
  }
`;
