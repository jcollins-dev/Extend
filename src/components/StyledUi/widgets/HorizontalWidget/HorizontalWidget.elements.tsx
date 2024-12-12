import styled from 'styled-components';
import { styledTheme } from 'components/StyledUi/theme';
import { WidgetUiContainer } from 'components/StyledUi/WidgetUi/WidgetUi.elements';

const pad = styledTheme.space.sm;
const rad = styledTheme.radius.base;

export const HorizontalWidgetContainer = styled(WidgetUiContainer)`
  grid-template-rows: auto;
  grid-template-columns: auto 1fr;
  overflow: hidden;

  grid-area: ${({ gridArea }) => gridArea};
  font-size: ${styledTheme.font.res.base};
  border-color: ${styledTheme.color.border.main};

  &.has-overflow .horizontal-widget-main {
    overflow: initial;
  }

  .horizontal-widget-header {
    width: 175px;
    padding: 1em;
    grid-row: 1;
    grid-column: 1;
    border-style: solid;
    border-width: 1px;
    border-color: inherit;
    font-size: 1.1em;

    border-radius: ${rad} 0 0 ${rad};
    background-color: ${styledTheme.color.bg.negLightest};
    padding: ${pad};

    h2 {
      font-size: 1.1em;
      font-weight: 500;
      margin: 0;
      padding: 0;
    }
  }

  .horizontal-widget-main {
    grid-row: 1;
    grid-column: 2;
    border-style: solid;
    border-width: 1px 1px 1px 0;
    border-color: inherit;
    overflow: hidden;

    border-radius: 0 ${rad} ${rad} 0;

    &.is-centered {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
