import { styledTheme } from 'components/StyledUi/theme';
import styled from 'styled-components';

export const FilteredChartsAndDataContainer = styled.div`
  display: grid;
  grid-gap: ${styledTheme.space.base};
  grid-template-rows: auto;

  .filtered-charts-and-data__search-bar-area {
    display: flex;
    gap: ${styledTheme.space.base};
  }

  .filtered-charts-and-data__charts-area {
    gap: ${styledTheme.space.base};
    display: flex;

    .widget-ui {
      .widget-ui-main {
        overflow: visible;
      }

      &.styled-bar-chart {
        flex-grow: 1;

        .dimensions-container {
          height: 250px;
        }
      }
      &.styled-pie-chart--with-legend {
        width: max-content;
      }
      &.styled-pie-chart {
        flex-grow: 0;
      }
    }

    .pie-chart-label-background {
      rx: 5;
    }

    .styled-pie-chart__chart {
      display: grid;
      grid-template-rows: 1fr;
      grid-template-columns: 1fr;

      div {
        grid-row: 1;
        grid-column: 1;
      }
    }
  }
`;
