import styled, { css } from 'styled-components';
import { StyledContainer, HTML, StyledButton, Text, StyledTypes } from '.';
import { DashboardWidgetTypes, styledTheme } from '../';
import HistoryClock from 'img/history-clock.svg';

const iconWidth = 'clamp(35px, 20%, 50px)';

export interface HeaderProps extends StyledTypes.StatusProps {
  hasLeft?: boolean;
  hasRight?: boolean;
  headerBackgroundColor?: string;
  hasTitleIndicator?: boolean;
}

export interface ContainerProps {
  hasError?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasSubHeader?: boolean;
  gridStyle?: boolean;
  isCentered?: boolean;
  isFullScreen?: boolean;
}
export interface UiProps extends HeaderProps, ContainerProps {}

const customScrollBar = `
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 20px rgba(0,0,0,.1); 
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,.5); 
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0,0,0,.5); 
    cursor: pointer;
  }
`;

export const Header = styled(HTML.Header).attrs(() => ({
  className: 'ui-widget__header'
}))<HeaderProps>`
  display: grid;
  border-style: solid;
  border-width: 1px 1px 0;
  overflow: hidden;
  min-height: 3em;

  border-top-left-radius: ${styledTheme.radius.base};
  border-top-right-radius: ${styledTheme.radius.base};

  border-color: ${styledTheme.color.border.main};

  background-color: ${({ headerBackgroundColor }) =>
    headerBackgroundColor ? `${headerBackgroundColor}` : `${styledTheme.color.bg.negLightest}`};

  grid-template-areas: ${({ hasLeft, hasRight }) =>
    `${hasLeft ? `'icon-left ` : `'`}header${hasRight ? ` icon-right'` : `'`}`};
  grid-template-columns: ${({ hasLeft, hasRight }) =>
    `${hasLeft ? `${iconWidth} ` : ``}1fr${hasRight ? ` ${iconWidth}` : ``}`};
`;

export const Title = styled(Text.Headline).attrs(() => ({
  styleType: 'tile-headline',
  className: 'ui-widget__title'
}))<UiProps>`
  margin: 0;
  padding-top: ${styledTheme.space.lg};
  padding-right: ${styledTheme.space.lg};
  padding-bottom: ${styledTheme.space.lg};
  padding-left: ${({ hasLeft }) => (hasLeft ? 0 : styledTheme.space.lg)};

  ${({ hasHeader }) =>
    !hasHeader &&
    `
    border-style: solid;
    border-width: 1px 1px 0 1px;
    border-top-left-radius: ${styledTheme.radius.base};
    border-top-right-radius: ${styledTheme.radius.base};
    border-color: ${styledTheme.color.border.main};
    background-color: ${styledTheme.color.bg.negLightest};
  `}

  ${({ hasTitleIndicator }) =>
    hasTitleIndicator &&
    `
    svg {
      padding-right: ${styledTheme.space.lg};
    }
  `}
`;

interface SubTitleProps extends UiProps {
  iconType?: 'history-clock';
}
export const SubTitle = styled(Text.StyledText).attrs(() => ({
  className: 'ui-widget__sub-title',
  size: 'sm',
  styleType: 'label'
}))<SubTitleProps>`
  display: ${({ hasError }) => (hasError ? 'none' : 'flex')};
  margin: 0;
  align-items: center;

  min-height: 15px;
  align-items: center;
  span {
    opacity: 0.6;
    display: block;
    padding-right: 5px;
  }
  ${({ iconType }) => {
    switch (iconType) {
      case 'history-clock':
        return `
      padding-left: 15px;
      position: relative;
         &:before {
            background: url(${HistoryClock}) left top no-repeat;
            background-size: 100%;
            position: absolute;
            content: '';
            width: 11px;
            height: 11px;
            left: 0;
            top: 4px;
            opacity: .4;
          }
      `;
      default:
        return ``;
    }
  }}
`;

export const Icon = styled(StyledContainer).attrs(() => ({
  className: `ui-widget__icon`
}))`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const IconButton = styled(StyledButton).attrs(() => ({
  className: `ui-widget__icon-btn`
}))<UiProps>`
  display: ${({ hasError }) => hasError && 'none'};
  background-color: transparent;
  border: none;
  grid-area: ${({ ga }) => ga};
  color: ${styledTheme.color.primaryAlt};
`;

interface MainProps extends UiProps, DashboardWidgetTypes.RefProps {
  noPad?: boolean;
}
export const Main = styled(StyledContainer).attrs(() => ({
  className: 'ui-widget__main'
}))<MainProps>`
  overflow: auto;
  border-style: solid;
  border-width: 0 1px 1px 1px;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  flex: 1;

  padding: ${({ noPad }) => (noPad ? 0 : `3px`)};
  border-color: ${styledTheme.color.border.main};

  ${({ hasError }) =>
    hasError &&
    `
    color: ${styledTheme.color.status.error.base};
    font-size: 0.875rem;
  `}
  ${({ isCentered, hasError }) =>
    (isCentered || hasError) &&
    `
    justify-content: center;
    align-items: center;
  `};

  ${({ hasHeader }) =>
    !hasHeader &&
    `
    border-top-left-radius: ${styledTheme.radius.base};
    border-top-right-radius: ${styledTheme.radius.base};
  `};

  ${({ hasFooter }) =>
    !hasFooter &&
    `
    border-bottom-left-radius: ${styledTheme.radius.base};
    border-bottom-right-radius: ${styledTheme.radius.base};
  `};
`;
export const Footer = styled(HTML.Footer).attrs(() => ({ className: 'ui-widget__footer' }))`
  grid-area: footer;
`;
export const SubHeader = styled(StyledContainer).attrs(() => ({
  className: 'ui-widget__sub-header'
}))<UiProps>`
  padding: 5px;
  background-color: ${styledTheme.color.neg};
  border-style: solid;
  border-width: 0 1px;
  border-color: ${({ hasError }) =>
    hasError ? styledTheme.color.status.error.light : styledTheme.color.border.main};
`;

// component container styles
const gridStyles = css<ContainerProps>`
  display: grid !important;

  grid-template-rows: ${({ hasHeader, hasFooter, hasSubHeader }) =>
    `${hasHeader ? `auto ` : ``}${hasSubHeader ? ` auto ` : ``}1fr${hasFooter ? `auto` : ``}`};
  grid-template-areas: ${({ hasHeader, hasFooter, hasSubHeader }) =>
    `${hasHeader ? `'header'` : ``}${hasSubHeader ? `'sub-header'` : ``}'main'${
      hasFooter ? `'footer'` : ``
    }`};

  .ui-widget__header {
    grid-area: header;
  }
  .ui-widget__title {
    grid-area: header;
  }
  .ui-widget__sub-title {
    grid-area: sub-title;
  }
  .ui-widget__main {
    grid-area: main;
    ${customScrollBar};
  }
  .ui-widget__sub-header {
    grid-area: sub-header;
  }
`;
const flexStyles = css<ContainerProps>`
  display: flex;
  flex: 1;
`;

const containerFullScreenStyles = css`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding: 1vw;
  &:after {
    content: '';
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: black;
    position: absolute;
    z-index: -1;
  }
`;

export const Container = styled(StyledContainer).attrs(() => ({
  className: 'ui-widget'
}))<ContainerProps>`
  * {
    box-sizing: border-box;
  }

  //height: 100%;
  ${({ gridStyle }) => (gridStyle ? gridStyles : flexStyles)};
  grid-aread: ${({ ga }) => ga};
  ${({ hasError }) =>
    hasError &&
    `
    .ui-widget__main {
      border-color: ${styledTheme.color.status.error.light};
    }

    .ui-widget__title {
      min-height: 3em;
    }
  `}
  ${({ isFullScreen }) => (isFullScreen ? containerFullScreenStyles : `position: relative;`)};

  .graph_container {
    flex: 1;
    padding: 1rem;

    .no_data {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 180px;
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: center;
    }

    .pie_chart_wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;
