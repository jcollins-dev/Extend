import styled from 'styled-components';
import { StyledUiContainerProps } from 'components';
import { styledTheme } from 'common/theme';

export const LiveGraphContainer = styled.div<StyledUiContainerProps>`
  div {
    //border: solid 1px rgba(0, 0, 0, 0.3);
  }

  min-height: 150px;
  grid-template-columns: 20em 1fr;
  grid-auto-rows: auto;
  grid-auto-flow: row;
  grid-gap: 0.7em;
  grid-template-areas:
    'time-bar time-bar'
    'zoom-bar zoom-bar'
    'stats    line-chart';

  display: grid !important;
  padding: 0.7em;
  padding-top: 0 !important;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'time-bar'
      'zoom-bar'
      'stats'
      'line-chart';
  }

  .live-graph-widget__time-bar {
    grid-area: time-bar;
    text-align: right;
    padding: 0.5em 0;
    border: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: baseline;

    @media (min-width: 1100px) {
      flex-direction: row;
    }

    border-bottom: solid 2px ${styledTheme.colors.secondaryLight};

    .live-graph-reset-button {
      display: block;
      border: 0;
      background: none;

      svg {
        top: 4px;
        right: 2px;
        position: relative;
      }
    }

    p {
      margin: 1rem 0.5rem;

      @media and (min-width: 1100px) {
        margin: 0 0.5rem;
      }
    }

    .ui-date-button-w-dropdown {
      margin-left: 1rem;
    }
  }

  .live-graph-widget__zoom-bar {
    grid-area: zoom-bar;
    text-align: center;
    height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
  }

  .live-graph-widget__stats {
    grid-area: stats;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    min-height: 480px;
    padding: 1rem 2rem 1rem 1rem;
    border-right: 1px solid ${styledTheme.colors.secondaryLight};
  }

  .live-graph-widget__line-chart {
    grid-area: line-chart;
    height: 450px;
    display: flex;
    flex-direction: column;
    padding: 0 1.25rem;
  }
`;
