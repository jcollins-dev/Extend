import styled, { css } from 'styled-components';
import { StyledUiContainerProps, styledTheme } from 'components';

export const baseClass = 'widget-ui';

export const basePad = '1em';
export const resFontSize = 'clamp(0.75rem, 1.8vw, 0.875rem)';

// overrides that simulate the old widget ui look
const styleTypeV1 = css`
  font-size: clamp(10px, 0.8vw, 14px);

  .${baseClass}__header {
    background-color: #f9fafb;
    padding: 0.5rem 0.65rem;

    h2 {
      font-size: 1.3em;
      font-weight: 500;
    }
  }
`;

export const WidgetUiHeaderStyles = css`
  font-weight: 500;
  margin: 0;
  font-size: 1em;
  flex-grow: 1;
  padding: 0;
  margin: 0;
`;

export const WidgetUiBorderStyles = css`
  // border-width: 1px;
  // border-style: solid;
  // border-color: ${styledTheme.color.border.main};
  // border-radius: ${styledTheme.radius.base};
`;

export const WidgetUiContainer = styled.div<StyledUiContainerProps>`
  display: grid;
  font-size: ${resFontSize};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  border-width: 0;
  position: relative;

  border-color: ${styledTheme.color.border.main};
  grid-template-rows: ${({ gridRows }) => gridRows || `auto 1fr`};

  .${baseClass}__header {
    display: flex;
    border-width: 1px 1px 0 1px;
    border-style: solid;
    gap: 0.5em;
    align-items: center;

    .date-range-picker {
      z-index: 500;
    }

    padding: ${basePad} ${basePad} 0 ${basePad};

    h2 {
      ${WidgetUiHeaderStyles}
    }

    border-color: ${styledTheme.color.border.main};
    border-top-left-radius: ${styledTheme.radius.base};
    border-top-right-radius: ${styledTheme.radius.base};
  }

  .${baseClass}__sub-header {
    position: relative;

    border-width: 0 1px;
    border-style: solid;
    border-color: inherit;
    padding: 0 0.5em;
  }

  .${baseClass}__main {
    border-width: 0 1px 1px 1px;
    border-style: solid;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    border-color: inherit;
    position: relative;
    z-index: 1;

    border-bottom-left-radius: ${styledTheme.radius.base};
    border-bottom-right-radius: ${styledTheme.radius.base};
  }

  &.has-footer {
    .${baseClass}__main {
      border-bottom: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
    }

    & > footer,
    .${baseClass}__footer {
      border-width: 0 1px 1px 1px;
      border-style: solid;
      border-color: inherit;
      border-bottom-left-radius: ${styledTheme.radius.base};
      border-bottom-right-radius: ${styledTheme.radius.base};
    }
  }

  .has-padding {
    padding: ${basePad};
  }

  &.style-type--v1 {
    ${styleTypeV1}
  }
`;
