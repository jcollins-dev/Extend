import { styledTheme } from 'components/StyledUi/theme';
import styled from 'styled-components';
import { themeColors } from 'themes';

export const MachineOverviewWidgetMain = styled.div.attrs(() => ({
  className: 'widget-ui-main no-padding'
}))`
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  min-width: 300px;
  height: 100%;
  color: ${styledTheme.color.main};

  &.widget-ui-main.no-padding {
    overflow: visible;

    .tooltip {
      font-size: 0.75rem;
    }
  }

  header {
    display: flex;
    gap: inherit;
    align-items: center;
    justify-content: space-between;
    font-weight: 500;
    font-size: 1.3em;
    padding: 2% 4%;

    button {
      border: none;
      background-color: transparent;
      background: ${themeColors.lightGrey2};
      border-radius: 4px;
      cursor: pointer;
      padding: 0.25rem 0.5rem;

      img {
        height: 10px;
        width: 10px;
      }
    }
  }

  .machine-overview-widget__content-row {
    display: flex;
    font-weight: 500;
    border-top: 1px solid ${styledTheme.color.border.light};

    &:last-child {
      .machine-overview-widget__content-row__value {
        border-bottom-right-radius: 0.625rem;
      }
    }
  }

  .machine-overview-widget__content-row__label {
    color: ${themeColors.mediumGrey4};
    width: 42%;
    padding: 4% 4%;
  }

  .machine-overview-widget__content-row__value {
    width: 58%;
    padding: 4% 4%;
    color: ${themeColors.darkGrey};
    background: ${themeColors.lightGrey1};

    p {
      margin: 0;
      padding: 0;

      span {
        color: ${themeColors.darkGrey};
        font-weight: 700;
      }
    }
  }

  .machine-overview-widget__content-row--header {
    font-weight: bold;
    background-color: ${styledTheme.color.bg.negLighter};
  }

  footer {
    dispaly: flex;
    justify-content: center;
    align-items: center;

    border-top: 1px solid ${styledTheme.color.border.light};

    button {
      background: transparent;
      font-family: inherit;
      border: none;

      padding: ${styledTheme.space.base};
      color: ${styledTheme.color.main};
    }
  }

  .machine-overview-widget__image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    postion: relative;
    padding: 2% 10% 6%;

    img {
      height: auto;
      max-height: 100%;
      max-width: 100%;
      display: block;
      border-radius: ${styledTheme.radius.base};
      overflow: hidden;
    }
  }
`;
