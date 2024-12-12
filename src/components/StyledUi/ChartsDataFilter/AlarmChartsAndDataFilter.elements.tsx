import styled from 'styled-components';
//import { styledTheme } from '../theme';

export const baseClass = `charts-data-filter`;

export interface AlarmChartsAndDataFilterContainerProps {
  containerHeight?: string;
  className?: string;
  gridArea?: string;
}

const pad = `1em`;
export const AlarmChartsAndDataFilterContainer = styled.div<AlarmChartsAndDataFilterContainerProps>`
  display: grid;
  grid-template-rows: auto auto 1fr;

  grid-gap: ${pad};

  .${baseClass}__search {
    display: grid;
    grid-template-columns: 1fr auto auto;
    grid-gap: ${pad};
  }

  .${baseClass}__charts {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;

    grid-gap: ${pad};

    .widget-ui {
      height: 300px;
    }
  }

  .${baseClass}__main {
  }

  .ReactVirtualized__Table__headerRow {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-width: 0 0 1px 0 !important;
  }
`;
