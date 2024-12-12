import styled from 'styled-components';
import { SitePageViewContainerProps, StyledUiContainerProps } from 'components';

export const sitePageContainerBaseClass = `site-page`;
const baseClass = sitePageContainerBaseClass;

const pad = `1.5em 2.5em 1.5em 3.2em`;

export type SitePageContainerProps = StyledUiContainerProps;
export const SitePageContainer = styled.main<SitePageContainerProps>`
  display: grid;
  height: 100%;
  max-height: 100%;

  grid-template-coluns: ${({ gridCols }) => gridCols};
  grid-template-rows: ${({ gridRows }) => gridRows};
  grid-area: ${({ gridArea }) => gridArea};
  grid-gap: ${({ gridGap }) => gridGap};

  ${({ className }) => `.${className}__subtabs__header {
    display: flex;
    flex-direction: row;
    gap: 1em;
    min-height: 90px;
    justify-content: space-between;

    padding: ${pad};

    .router-tab-nav__item {
      display: flex;
    }

    .bread-crumbs {
      //padding-bottom: 1.625em;

      .machine-details-bar {
        font-size: 0.875rem;
        font-weight: 400;
      }
    }
  }`}

  .${baseClass}__header {
    display: flex;
    flex-direction: column;
    gap: 1em;
    min-height: 90px;
    justify-content: center;

    padding: ${pad};

    .bread-crumbs {
      //padding-bottom: 1.625em;

      .machine-details-bar {
        font-size: 0.875rem;
        font-weight: 400;
      }
    }
  }

  .no_config__page-view,
  .${baseClass}__page-view {
    overflow: auto;
    height: 100%;
    &[data-hidden='true'] {
      display: none;
    }
  }

  &.dsi {
    .site-page__header {
      gap: 0;
    }

    .site-page-view__view-tab.data_analysis {
      background-image: radial-gradient(#303e47 3%, transparent 4%);
      background-color: #f9fafb;
      padding: 0;
      height: 100%;
    }
  }
`;

export const SitePageViewContainer = styled.section<SitePageViewContainerProps>`
  .site-page-view__header {
    display: flex;
    gap: 1em;
    align-items: flex-end;

    padding: ${pad};
  }

  .site-page-view__view-nav {
    flex-grow: 1;
  }

  .site-page-view__view-tab {
    position: relative;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 5px 3px inset;
  }

  .has-padding,
  .site-page-view__view-tab {
    padding: ${pad};
  }

  &.alerts-tab {
    .router-tab-nav__item {
      border: 0;
    }

    .router-tab-nav--pills .router-tab-nav__item {
      border-radius: 0;
      font-size: 0.885rem;
      font-weight: 600;
      background-color: #ffffff;
      color: #323130;
      transition: none;
      border-bottom: 2px solid #ffffff;
    }

    .router-tab-nav--pills .router-tab-nav__item:not([data-disabled='true']):hover,
    .router-tab-nav--pills .router-tab-nav__item:not([data-disabled='true'])[data-current='true'] {
      font-size: 0.885rem;
      color: #0076cc;
      font-weight: 600;
      background: none;
      border: 0;
      border-bottom: 2px solid #0076cc;
    }

    .site-page-view__view-tab {
      box-shadow: none;
    }
  }
`;
