import styled, { css } from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';
import { themeColors } from 'themes';

const pad = styledTheme.space.sm;
const rad = styledTheme.radius.base;

export interface UiWidgetContainerProps {
  hasFooter?: boolean;
  hasHeader?: boolean;
  hasSubHeader?: boolean;
  hasStatus?: string;
  ga?: string;
  gridArea?: string;
  styleType?: string;
}

// calculations
// 1920:
// 12px = .625vw at full width

// styles for outlined widget, this is here for new widgets that have a different look, or if the child component
// has border set and we're not able to override it.
const outlinedStyles = css<UiWidgetContainerProps>`
  ${({ hasHeader, hasFooter }) => `
    .widget-ui-sub-header,
    .widget-ui-header,
    .widget-ui-footer,
    .widget-ui-main {
      border-style: solid;
      border-color: ${styledTheme.color.border.main};
    }

    .widget-ui-header { border-width: 1px 1px 0 1px; }
    .widget-ui-footer { border-width: 0 1px 1px 1px; }
    .widget-ui-sub-header { 
      border-width: 0 1px; 
      border-bottom-color: ${styledTheme.color.border.light}!important;
      border-top-color: ${styledTheme.color.border.light}!important;
    }
    .widget-ui-main { 
      border-width: ${hasHeader ? `0` : `1px`} 1px ${hasFooter ? `0` : `1px`} 1px; 
      &.is-centered {
        justify-content: center;
        align-items: center;
        display: flex;
      }
    }
  `}
`;

const roundedStyles = css<UiWidgetContainerProps>`
  ${({ hasFooter, hasHeader }) => `
    .widget-ui-header { border-radius: ${rad} ${rad} 0 0; }
    .widget-ui-main { border-radius: ${hasHeader ? `0` : rad} ${hasHeader ? `0` : rad} ${
    hasFooter ? `0` : rad
  } ${hasFooter ? `0` : rad}; }
    .widget-ui-footer { border-radius: 0 0 ${rad} ${rad}; }
  `}
`;

//
//  modifier classes for setting status, these classes should go on main wrapping
//  element or component or can be modified by parent container styles.
//
/* example of usage:

.element { color: black; }
.element.status--error {
    .style-me { color: red; }
}
.element.status--success {
  .style-me { color: red; }
}

<div className='element'>
    <div className='style-me'>title</div>
    <div>content</div>
</div>

<div className='element status--success'>
    <div className='style-me'>title</div>
    <div>content</div>
</div>

*/

export const statusStyles = css`
  &.status--bad {
    .widget-ui-header {
      color: ${styledTheme.color.status.error.base};
      background-color: ${styledTheme.color.status.error.lighter};
    }
    .widget-ui-header,
    .widget-ui-footer,
    .widget-ui-main {
      border-color: ${styledTheme.color.status.error.light};
    }
    .widget-ui-sub-header {
      border-left-color: ${styledTheme.color.status.error.light};
      border-right-color: ${styledTheme.color.status.error.light};
    }
  }

  &.status--good {
    .widget-ui-header {
      color: ${styledTheme.color.status.success.base};
      background-color: ${styledTheme.color.status.success.lighter};
    }
    .widget-ui-header,
    .widget-ui-footer,
    .widget-ui-main {
      border-color: ${styledTheme.color.status.success.light};
    }
    .widget-ui-sub-header {
      border-left-color: ${styledTheme.color.status.success.light};
      border-right-color: ${styledTheme.color.status.success.light};
    }
  }

  &.status--warning {
    .widget-ui-header {
      color: ${styledTheme.color.status.warning.base};
      background-color: ${styledTheme.color.status.warning.lighter};
    }
    .widget-ui-header,
    .widget-ui-footer,
    .widget-ui-main {
      border-color: ${styledTheme.color.status.warning.light};
    }
    .widget-ui-sub-header {
      border-left-color: ${styledTheme.color.status.warning.light};
      border-right-color: ${styledTheme.color.status.warning.light};
    }
  }

  .widget-ui-header {
    transition: border-color 750ms ease, background-color 750ms ease, color 750ms ease;
  }

  .widget-ui-sub-header,
  .widget-ui-footer,
  .widget-ui-main {
    transition: border-color 750ms ease;
  }
`;

export const statusStyles2 = css`
  .status-icon {
    &:before,
    &:after {
      transition: background-color 500ms ease;
    }
  }

  &.status--bad,
  &.status--error {
    .status-icon {
      &:before,
      &:after {
        background-color: ${styledTheme.color.status.error.base};
      }
    }
  }

  &.status--success,
  &.status--good {
    .status-icon {
      &:before,
      &:after {
        background-color: ${styledTheme.color.status.success.base};
      }
    }
  }

  &.status--warning,
  &.status--ok {
    .status-icon {
      &:before,
      &:after {
        background-color: ${styledTheme.color.status.warning.base};
      }
    }
  }
`;

const gridStyles = css<UiWidgetContainerProps>`
  display: grid;

  ${({ hasFooter, hasHeader, hasSubHeader }) => `
    grid-template-areas: ${hasHeader ? `'header'` : ``}${hasSubHeader ? `'sub-header'` : ``}'main'${
    hasFooter ? `'footer'` : ``
  };
    grid-template-rows: ${hasHeader ? `3em ` : ``}${hasSubHeader ? `auto ` : ``}1fr${
    hasFooter ? ` auto` : ``
  };
  `}

  .widget-ui-header {
    grid-area: header;
  }
  .widget-ui-sub-header {
    grid-area: sub-header;
  }
  .widget-ui-main {
    grid-area: main;
    overflow-y: auto;
    overflow-x: hidden;

    &.has-overflow {
      overflow: visible !important;
    }
  }

  .widget-ui-footer {
    grid-area: footer;
  }
`;

const widgetUiHeaderStyles = css<UiWidgetContainerProps>`
  display: flex;
  justify-content: center;

  align-items: center;
  z-index: 9;

  background-color: ${styledTheme.color.bg.negLightest};
  padding: ${styledTheme.space.xs} ${pad};
  gap: ${styledTheme.space.xs};

  &.color-coded-widget {
    color: red;
  }

  .widget-ui-header__icon {
    flex-grow: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    display: ${({ hasStatus }) => hasStatus && `none`};

    &.ui-icon--left {
      font-size: 0.8em;
    }
  }

  button.widget-ui-header__icon {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
  }

  h3.widget-ui-header__title {
    margin: 0;
    font-weight: 500;
  }

  .widget-ui-header__title {
    flex-grow: 1;
    text-transform: capitalize;
    line-height: 1;
    font-size: 1.3em;
    padding: 0;
    min-width: max-content;
    color: inherit;

    .widget-ui-header__sub-title {
      display: block;
      font-size: 0.7em;
    }

    &.widget-ui-header__title--flex {
      display: flex;
      gap: 0.4em;
      align-items: center;
    }
  }
`;

const widgetUiSubHeaderStyles = css`
  font-weight: 500;

  padding: ${styledTheme.space.xs} ${pad};
`;

const widgetUiMainStyles = css`
  padding: ${pad};

  &.no-padding {
    padding: 0;
  }

  &.widget-ui-main--center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.widget-ui-main--full {
    border-width: 1px;

    border-radius: ${rad};
    padding: ${pad};
  }

  .rc-table-tbody {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &.no-overflow {
    overflow: hidden;
  }
`;

export const widgetUiFooterStyles = `
  overflow: hidden;

  padding: ${styledTheme.space.xs} ${pad};
`;

const kpiCardStyles = css`
  &.widget-ui--kpi-card {
    min-height: 15em;

    .widget-ui-sub-header {
      display: grid;
      grid-template-columns: 1fr auto;
      border-width: 0 1px;
      grid-gap: 0.4em;
      align-items: center;
      padding-top: 0;
      padding-bottom: 0;
    }

    .widget-ui-footer {
      padding: 0 0.4em 0.4em 0.4em;
    }

    .kpi-cell {
      display: flex;
      flex-direction: column;
      justify-content: center;

      .kpi-cell__value {
        align-self: initial;
      }
    }
  }

  &.widget-ui--oee {
    align-self: center;
    grid-template-rows: auto 1fr;

    .widget-ui-header {
      display: grid;
      grid-template-columns: 12px 1fr;
      grid-template-rows: auto auto;
      grid-gap: 0.3em;
      font-weight: 500;

      svg {
        cursor: pointer;
      }
    }

    .oee-header__title {
      font-size: 2em;
      font-weight: 900;
    }
  }

  &.widget-ui--loading {
    .widget-ui-main {
      grid-row: 2 / span 3;
      grid-template-rows: 2.05em auto 1fr;
    }

    .kpi-cell__title {
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
  }
`;
// base class is widget-ui
export const WidgetUiContainer = styled.div<UiWidgetContainerProps>`
  * {
    box-sizing: border-box;
  }

  // v2 version is where header has more padding and white header background
  &.v2 {
    .widget-ui-header {
      background: none;
      padding: 1rem 1.5em 0 1.5em;
    }
  }

  &.v2.color-coded-widget {
    p {
      margin: 0;
    }
  }

  &.color-coded-widget {
    .widget-ui-header {
      .color-coded-title--green {
        color: ${themeColors.green2};
      }

      .color-coded-title--red {
        color: ${themeColors.errorRed};
      }
    }

    .widget-ui-main--no_data {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      padding: 2rem 0 1rem;

      img {
        max-width: 75px;
        width: 100%;
      }

      p {
        font-size: 1rem;
        font-weight: 700;
        color: ${themeColors.mediumGrey4};
      }
    }
  }

  flex-grow: 1;
  height: 100%;
  min-height: 10em;

  font-size: ${styledTheme.font.res.base};
  grid-area: ${({ ga, gridArea }) => ga || gridArea};
  color: ${styledTheme.color.main};

  &.no-table-border {
    .rc-table {
      border: none;
    }
  }

  .ui-icon {
    line-height: 0;
  }

  &.is-centered .widget-ui-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .state-over-time-card {
    border: none;
  }

  .no-overflow {
    overflow: hidden;
  }

  ${outlinedStyles};
  ${roundedStyles};
  ${gridStyles};
  ${statusStyles};

  .widget-ui-header {
    ${widgetUiHeaderStyles};
  }
  .widget-ui-sub-header {
    ${widgetUiSubHeaderStyles};
  }
  .widget-ui-main {
    ${widgetUiMainStyles};

    .is-centered {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 100%;
    }

    &.scroll-x {
      overflow-x: auto;
      overflow-y: hidden;
    }

    &.scroll-y {
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
  .widget-ui-footer {
    ${widgetUiFooterStyles};
  }

  ${kpiCardStyles};

  &.scroll-y .widget-ui-main {
    overflow-y: auto;
    overflow-x: hidden;
  }

  &.scroll-x .widget-ui-main {
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

export interface TileWidgetContainerProps {
  ga?: string;
  className?: string;
}
export const TileWidgetContainer = styled.div<TileWidgetContainerProps>`
  display: flex;
  width: 100%;
  text-transform: capitalize;
  min-height: 5em;

  grid-area: ${({ ga }) => ga};
  color: ${styledTheme.color.main};

  header {
    ${widgetUiHeaderStyles};

    flex-grow: 1;
    flex-direction: column;
    gap: 0;

    border: solid 1px ${styledTheme.color.border.main};
    border-radius: ${rad} 0 0 ${rad};
  }

  .tile-widget-header__title {
    line-height: 1;
    min-width: initial;
    font-weight: 500;
  }

  .tile-widget-header__sub-title {
    font-size: 0.8em;
    opacity: 0.7;
  }

  .tile-widget-main {
    ${widgetUiMainStyles};

    border-style: solid;
    border-width: 1px 1px 1px 0;
    padding: 0;
    display: flex;
    flex-grow: 1;

    border-color: ${styledTheme.color.border.main};
    border-radius: 0 ${rad} ${rad} 0;
  }

  .tile-widget-main--full {
    grid-column: 1 / span 2;
    border-width: 1px;
    align-items: center;
    justify-content: center;
    border-radius: ${styledTheme.radius.base};
  }

  .tile-widget-cell {
    display: flex;
    min-width: max-content;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0.5em;
    min-height: 3em;
    border-width: 0 0 0 1px;
    border-style: inherit;
    border-color: inherit;

    &:nth-child(1) {
      border: none;
    }
  }

  .tile-widget-cell__value {
    font-size: 1.3em;
    font-weight: 900;
  }

  .tile-widget-cell__label {
    font-size: 1.05em;
    font-weight: 500;
  }

  .tile-widget-cell__title {
    font-size: 0.85em;
    opacity: 0.7;
  }

  ${statusStyles};
`;

//${resFontStyles};

/* moved these to index.css but keepint for reference 

.fade-in {
    animation-name: fadein;
    animation-duration: 300ms;
    animation-direction: both;
    animation-delay: 200ms;
    animation-fill-mode: forwards;
  }

  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
.res-font-sm {
  font-size: clamp(8px, 0.8vw, 14px);
}

.res-font {
  font-size: clamp(11px, 0.92vw, 14px);
}

.res-font-md {
  font-size: clamp(14px, 0.95vw, 18px);
}

.res-font-lg {
  font-size: clamp(16px, 1.18vw, 24px);
}

.res-font-xl {
  font-size: clamp(20px, 1.5vw, 29px);
}
*/
