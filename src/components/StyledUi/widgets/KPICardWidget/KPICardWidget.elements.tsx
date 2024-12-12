import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';

interface MainProps {
  flexCols?: boolean;
}

export const KPICardWidgetSubHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 5px;
  border-top: none;
  border-bottom: none;
  align-items: center;
`;

export const KPICardWidgetMain = styled.div.attrs(() => ({
  className: `widget-ui-main res-font-lg`
}))<MainProps>`
  padding: 0 0.4em 0.4em 0.4em !important;

  ${({ flexCols }) =>
    flexCols
      ? `display: flex;
  gap: 1em;
  `
      : `display: grid;
  grid-template-rows: auto auto;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  text-align: center;
  grid-column-gap: 1em;
`}

  .kpi-cell {
    flex-grow: 1;
    text-align: center;
  }

  .kpi-cell__value,
  .kpi-cell__label,
  .kpi-cell__units {
    min-height: 1em;
    transition: color 750ms ease;
  }

  .kpi-cell--full {
    grid-column: 1 / span 2;
    font-size: 0.7em;
    &.kpi-cell__value {
      grid-row: 3;
      font-size: 1.5em;
    }
    &.kpi-cell__label {
      grid-row: 4;
    }
  }

  .kpi-cell__label {
    color: ${styledTheme.color.mainLight};
    font-size: 0.7em;
    opacity: 0.9;
  }

  .kpi-cell__units {
    font-size: 0.5em;
    opacity: 0.8;
  }

  .kpi-cell__value {
    font-weight: 900;
    font-size: 1.8em;
    align-self: end;
  }

  .kpi-cell__value--xl {
    font-size: 2.2em;
  }

  .kpi-cell__title {
    font-weight: 500;
    font-size: 0.9em;
    min-height: 2.05em;
  }

  .kpi-values--oee {
    display: grid;
    grid-template-rows: auto auto auto;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    text-align: center;
    grid-column-gap: 1em;
  }

  .kpi-cell__units {
    font-weight: 900;
  }

  .font--smaller {
    display: inline;
    font-size: 0.45em;
  }
`;

export const KPICardWidgetOEEHeader = styled.header.attrs(() => ({
  className: 'widget-ui-header widget-ui-header--oee'
}))`
  display: grid !important;
  grid-template-rows: auto auto;
  grid-template-columns: 15px 1fr;
  grid-gap: 0.2em !important;

  svg {
    cursor: pointer;
  }

  .oee-header__title {
    grid-columns: 1 / span 2;
    font-size: 2em;
    font-weight: 900;
    display: flex;
    justify-contenter: center;
    min-height: 1em;
  }
`;
