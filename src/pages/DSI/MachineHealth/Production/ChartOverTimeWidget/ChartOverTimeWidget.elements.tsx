import { styledTheme } from 'components';
import styled from 'styled-components';
import theme from 'themes';

export const ChartOverTimeWidgetContainer = styled.div<{ open?: boolean }>`
  background-color: ${theme.colors.lightGrey1};
  border-radius: 0.1875rem;
  border: 0.0625rem solid ${theme.colors.lightGrey3};
  font-size: clamp(12px, 2vw, 16px);
  margin-bottom: 1em;

  &.is-closed .show-hide-trigger span {
    transform: rotate(-90deg);
  }

  .show-hide-trigger {
    border: none;
    background-color: transparent;
    font-family: inherit;
    padding: 0.5em;
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: auto 1fr;
    width: 100%;
    align-items: center;
    text-align: left;
    color: ${styledTheme.color.main};
    cursor: pointer;

    span {
      font-size: 8px;
    }
  }

  .chart-wrapper {
    display: grid;
    grid-template-columns: 200px 1fr;
    grid-template-rows: 1fr;
    border-width: 1px 0 0 0;
    border-style: solid;
    border-color: #e5e9ed;
    background: ${theme.colors.background.background1};

    .chart-widget-ui__status {
      height: 150px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      grid-column: 1 / span 2;
    }

    .chart-over-time__legend {
      display: grid;
      grid-template-rows: 1fr auto;
      grid-gap: 0.5em;
      padding: 1em;
      border-right: solid 1px;
      border-color: inherit;
      h2 {
        margin: 0;
        padding: 0;
        font-size: 1rem;
        color: rgb(44, 71, 111);
        font-weight: 500;
      }
    }
  }

  .collapse-container .rc-collapse-header {
    display: flex;
    align-items: center;
    line-height: 1.375rem;
    padding: 0.625rem 1rem;
    color: ${theme.colors.darkGrey};
    cursor: pointer;
    width: 100%;
  }

  .collapse-container .rc-collapse-header .arrow {
    display: inline-block;
    content: '\\20';
    width: 0;
    height: 0;
    font-size: 0;
    line-height: 0;
    border-top: 0.1875rem solid transparent;
    border-bottom: 0.1875rem solid transparent;
    border-left: 0.25rem solid ${theme.colors.darkGrey};
    vertical-align: middle;
    margin-right: 0.5rem;
  }
`;

export const ChartOverTimeLegendItem = styled.button<{ color?: string }>`
  display: grid;
  text-transform: capitalize;
  grid-template-columns: 20px auto;
  align-items: center;
  text-align: left;
  cursor: pointer;
  grid-gap: 0.5em;
  background-color: transparent;
  border: none;
  font-size: 0.8em;
  font-family: inherit;

  &.is-inactive {
    opacity: 0.5;
  }

  &:before {
    content: '';
    border-radius: 3px;
    display: block;
    width: 20px;
    height: 20px;

    background-color: ${({ color }) => color || 'red'};
    text-align: left;
  }
`;
