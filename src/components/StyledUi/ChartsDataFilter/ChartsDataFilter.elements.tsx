import styled from 'styled-components';
import { styledTheme } from '../theme';

export interface ChartsDataFilterContainerProps {
  containerHeight?: string;
  className?: string;
  gridArea?: string;
}

export const ChartsDataFilterContainer = styled.div<ChartsDataFilterContainerProps>`
  font-size: 1em;
  display: flex;
  flex-direction: column;
  border-style: solid;
  border-width: 1px;
  padding: 1em;
  height: ${({ containerHeight }) => containerHeight};

  border-color: ${styledTheme.color.border.main};
  border-radius: ${styledTheme.radius.base};
  grid-area: ${({ gridArea }) => gridArea};

  .charts-data-filter__centered {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2em;
    height: 100%;
    text-transform: capitalize;
  }

  .charts-data-filter__centered--has-error {
    color: ${styledTheme.color.status.error.base};
  }

  .widget-ui-header,
  .widget-ui-main {
    border: none;
    padding: 0;
    border-radius: 0;
  }

  .widget-ui-header {
    font-size: 1em;
    background-color: transparent;
    border-bottom: solid 1px ${styledTheme.color.border.light};
    border-top: solid 1px ${styledTheme.color.border.light};
  }

  .line-spacer {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    border-color: ${styledTheme.color.border.light};
  }

  .select-list {
    grid-area: select;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
    padding: 1.5em 1em 0 1em;
  }

  .charts-data-filter__bars {
    grid-area: bars;
  }

  charts-data-filter__pie {
    grid-area: pie;
  }

  header {
    border-bottom: solid 1px ${styledTheme.color.border.light};
    grid-area: header;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5em;
    gap: 1em;

    h2 {
      flex-grow: 1;
      display: flex;
      padding: 0;
      margin: 0;
      font-weight: 500;
      font-size: 1.15em;
      gap: 0.5em;
    }
  }

  .charts-data-filter__count {
    color: ${styledTheme.color.gray};
    font-weight: 400;
    font-size: 0.9em;
  }

  .ReactVirtualized__Table__headerRow {
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-width: 0 0 1px 0 !important;
  }
`;

export const ChartsDataFilterSearchContainer = styled.div`
  gap: 1em;
  display: grid;
  grid-template-columns: 1fr auto auto;
`;

export const CenteredContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
