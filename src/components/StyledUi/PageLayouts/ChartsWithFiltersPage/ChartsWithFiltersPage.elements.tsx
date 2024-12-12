import styled from 'styled-components';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';

export const baseClass = `charts-with-filters`;

export const alarmTypeColors = {
  Critical: `rgb(32, 36, 162)`,
  Warning: `rgb(255, 178, 102)`,
  'Product Alarm': `rgb(255, 74, 74)`
};

export const ChartsWithFiltersPageContainer = styled.div<StyledUiContainerProps>`
  display: grid;
  grid-template-rows: auto 1fr;
  padding: 0;

  grid-area: ${({ gridArea }) => gridArea};
  grid-gap: ${({ gridGap }) => gridGap || `1em`};

  .${baseClass}__header {
    display: flex;
    gap: 1em;
  }

  .${baseClass}__charts-area {
    display: grid;
    grid-gap: inherit;

    grid-template-rows: ${({ gridRows }) => gridRows || `300px auto`};
    grid-template-columns: ${({ gridCols }) => gridCols || `1fr clamp(300px, 25%, 100vw)`};
    grid-gap: ${({ gridGap }) => gridGap || `1em`};
  }

  .${baseClass}__tables-area {
    display: grid;
    grid-auto-flow: row;
    grid-auto-row: auto;
    grid-gap: inherit;
  }

  .pie-chart-with-legend {
    min-width: 350px;

    .widget-ui-main {
      display: grid;
      grid-gap: 2em;
    }
  }
`;
