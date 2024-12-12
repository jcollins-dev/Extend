import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

export const DatePickerWidgetMain = styled.div`
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

export const DatePickerWidgetSubHeader = styled.div`
  font-size: 0.7em;
  padding-top: 0.5em;
  opacity: 0.9;
  font-weight: 500;
  .spacer {
    opacity: 0.8;
    display: inline-block;
    padding: 0 3px;
    text-transform: none;
  }
`;
