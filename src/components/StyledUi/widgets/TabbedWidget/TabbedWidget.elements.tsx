import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const TabbedWidgetMain = styled.div`
  grid-area: main;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;

  .styled-tabs-container__tab {
    transition: opacity 300ms ease;
    opacity: 1;
    grid-row: 1;
    grid-column: 1;

    background-color: ${styledTheme.color.neg};
  }

  .styled-tabs-container__tab--is-hidden {
    opacity: 0;
    animation: ani-fade-out 500ms;
    z-index: -1;
  }

  @keyframes ani-fade-out {
    0% {
      opacity: 1;
    }
    99% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      display: none;
    }
  }
`;

export const TabbedWidgetSubHeader = styled.div`
  display: flex;
  gap: 1em;
  justify-content: space-evenly;
  padding: 1em 0.5em 0 0.5em;
`;
