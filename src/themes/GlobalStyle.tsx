// globalStyles.js
import { createGlobalStyle } from 'styled-components';
import { styledTheme } from 'components/StyledUi';

export const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${styledTheme.color.main};
    font-size: 15px;
    overflow-x: hidden;
  }

  .status--bad,
  .status--error,
  .status--not-running {
    &.status__font, &svg, .status__font  { color: ${styledTheme.color.status.error.base}; }
    &.status__border, .status__border { border-color: ${styledTheme.color.status.error.light}; }
    &.status__bg, .status__bg { background-color: ${styledTheme.color.status.error.lighter}; }
  }

  .status--success,
  .status--good,
  .status--ok, 
  .status--running,
  .status--production-running {
    &.status__font, .status__font { color: ${styledTheme.color.status.success.base}; }
    &.status__border, .status__border { border-color: ${styledTheme.color.status.success.light}; }
    &.status__bg, .status__bg { background-color: ${styledTheme.color.status.success.lighter}; }
  }

  .status--warning,
  .status--alert,
  .status--production-stopped,
  .status--no-product,
  .status--offline,
  .status--medium {
    &.status__font, &svg, .status__font { color: ${styledTheme.color.status.warning.base}; }
    &.status__border, .status__border { border-color: ${styledTheme.color.status.warning.light}; }
    &.status__bg, .status__bg { background-color: ${styledTheme.color.status.warning.lighter}; }
  }

  .font--caps {
    text-transform: capitalize;
  }

  .font--upcase {
    text-transform: uppercase;
  }

  .sb-show-main #root { position: relative;}
`;
