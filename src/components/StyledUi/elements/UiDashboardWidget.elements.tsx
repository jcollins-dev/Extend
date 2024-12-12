import styled, { css } from 'styled-components';
import { StyledContainer } from './StyledContainer';
import { styledTheme } from '../theme';

const pad = styledTheme.space.sm;
const rad = styledTheme.radius.base;

interface DashboardWidgetUiProps {
  hasFooter?: boolean;
  hasHeader?: boolean;
  hasSubHeader?: boolean;
  hasStatus?: string;
}

// styles for outlined widget, this is here for new widgets that have a different look, or if the child component
// has border set and we're not able to override it.
const outlinedStyles = css<DashboardWidgetUiProps>`
  ${({ hasHeader }) => `
    .ui-header, .ui-sub-header {
      border-width: 1px;
      border-style: solid;
      border-color: ${styledTheme.color.border.main};
    }
    .ui-sub-header, .ui-footer {
      border-width: 0 1px 1px 1px;
      border-style: solid;
      border-color: ${styledTheme.color.border.main};
    }
    .ui-main {
      border-width: ${hasHeader ? `0` : `1px`} 1px 1px 1px;
      border-style: solid;
      border-color: ${styledTheme.color.border.main};
    }
  `}
`;

const roundedStyles = css<DashboardWidgetUiProps>`
  ${({ hasFooter, hasHeader }) => `
    .ui-header {
      border-radius: ${rad} ${rad} 0 0;
    }
    .ui-main {
      border-radius: ${hasHeader ? `0` : rad} ${hasHeader ? `0` : rad} ${hasFooter ? `0` : rad} ${
    hasFooter ? `0` : rad
  };
    }
    .ui-footer {
      border-radius: 0 0 ${rad} ${rad};
    }
  `}
`;

// TODO:  Change widget master font-size to be based on body REM once global styles are defined
export const UiDashboardWidget = styled(StyledContainer)<DashboardWidgetUiProps>`
  * {
    box-sizing: border-box;
  }

  display: grid;
  font-size: 13px;

  color: ${styledTheme.color.main};

  ${({ hasFooter, hasHeader, hasSubHeader }) => `
    grid-template-areas: ${hasHeader ? `'header'` : ``}${hasSubHeader ? `'subHeader'` : ``}'main'${
    hasFooter ? `'footer'` : ``
  };
    grid-template-rows: ${hasHeader ? `auto ` : ``}${hasSubHeader ? `auto ` : ``}1fr${
    hasFooter ? ` auto` : ``
  };
  `}

  .ui-icon {
    line-height: 0;
  }

  .ui-header {
    grid-area: header;
    display: flex;
    justify-content: center;

    background-color: ${({ hasStatus }) =>
      hasStatus === 'alert'
        ? styledTheme.color.status.error.light
        : styledTheme.color.bg.negLightest};

    .ui-icon {
      flex-grow: 0;

      padding: ${pad};
      display: ${({ hasStatus }) => hasStatus && `none`};
    }
    button.ui-icon {
      background-color: transparent;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      color: ${styledTheme.color.main};
    }

    .ui-title {
      flex-grow: 1;
      font-size: 1.2em;
      text-transform: capitalize;
      font-weight: 700;

      padding: ${pad};

      .ui-sub-title {
        display: block;
        font-size: 0.7em;
        font-weight: 400;
      }

      &.ui-title--flex {
        display: flex;
        gap: 0.4em;
        align-items: center;
      }
    }
    h3.ui-title {
      margin: 0;
    }
  }

  .ui-sub-header {
    grid-area: subHeader;
    font-weight: 500;

    padding: ${styledTheme.space.xs} ${pad};
  }

  .ui-main {
    grid-area: main;

    padding: ${pad};

    &.no-padding {
      padding: 0;
    }

    &.has-status {
      display: flex;
      justify-content: center;
      align-items: center;
      text-transform: capitalize;
    }

    &.has-error {
      color: ${styledTheme.color.status.error.base};
    }
  }

  .ui-footer {
    grid-area: footer;
    overflow: hidden;
  }

  ${outlinedStyles};
  ${roundedStyles};
`;
