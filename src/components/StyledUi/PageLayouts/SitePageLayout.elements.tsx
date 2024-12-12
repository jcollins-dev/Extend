import styled from 'styled-components';
import { StyledUiContainerProps } from '../StyledUiGlobal.types';

export type SitePageLayoutContainerProps = StyledUiContainerProps;

export const sitePageLayoutBaseClass = `site-page-layout`;
const baseClass = sitePageLayoutBaseClass;

const pad = `1.5em 2.5em`;

export const SitePageLayoutContainer = styled.main<SitePageLayoutContainerProps>`
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'header' 'nav' 'main';

  .${baseClass}__page-tabs {
    grid-area: nav;
  }

  .${baseClass}__main, section {
    grid-area: main;

    &[data-hidden='true'] {
      display: none;
    }
  }

  .${baseClass}__header {
    grid-area: header;
    min-height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1em;
    padding-right: 200px;
    background: linear-gradient(0deg, rgb(241, 243, 244) 0%, rgba(241, 243, 244, 0) 100%);
    padding: ${pad};
  }
`;

export const SitePageLayoutMain = styled.section.attrs(() => ({
  className: `${sitePageLayoutBaseClass}__main`
}))`
  padding: ${pad};
`;

export const SitePageTabsContainer = styled.section`
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 'tab';
  grid-gap: 1em;

  .horizontal-widget-main {
    height: 250px;
  }

  .site-page-tabs__tab {
    grid-area: tab;
    min-height: 200px;

    &[data-hidden='true'] {
      transform: translateX(-100%);
      display: none;
    }
  }

  .site-page-tabs__tab-header {
    display: flex;
    justify-content: flex-end;
    gap: 1em;

    .router-tab-nav {
      flex-grow: 1;
    }

    .ui-date-button-w-dropdown {
      flex-grow: 0;
    }
  }
`;
