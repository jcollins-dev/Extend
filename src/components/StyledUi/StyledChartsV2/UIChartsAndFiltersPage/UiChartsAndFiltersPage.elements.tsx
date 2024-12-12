import styled from 'styled-components';
import { StyledUiContainerProps } from 'components/StyledUi/StyledUiGlobal.types';
import { styledTheme } from 'components/StyledUi/theme';

export const baseClass = `charts-and-filters-page`;

export const UiChartsAndFiltersPageContainer = styled.div<StyledUiContainerProps>`
  display: grid;
  grid-gap: 1em;

  grid-template-rows: ${({ gridRows }) => gridRows || `auto auto 1fr`};
  grid-template-columns: ${({ gridCols }) => gridCols || `1fr`};
  grid-template-areas: ${({ gridAreas }) => gridAreas};

  .bar-chart-ui {
    flex-grow: 1;
    display: flex;
    align-items: center;
    .VictoryContainer {
      height: 200px;
      width: 100%;
    }
  }

  .pie-chart-ui {
    flex-grow: 0;
    .VictoryContainer {
      width: 200px !important;
      height: 200px !important;
    }
  }

  .${baseClass}__search-bar-area {
    gap: inherit;
    display: flex;
    flex-grow: 1;
  }

  .${baseClass}__totals-bar-area {
    height: 5em;
    display: flex;
    flex-grow: 1;

    border-radius: ${styledTheme.radius.base};
    border: 1px solid ${styledTheme.color.border.main};
  }

  .${baseClass}__charts-area {
    display: flex;
    gap: inherit;

    .widget-ui--pie-chart {
      min-width: 275px;
      &.has-legend {
        min-width: 350px;
      }
    }

    .widget-ui {
      height: 260px;

      .widget-ui-main {
        height: 100%;
        align-items: center;
        display: flex;
      }
    }
  }
`;
