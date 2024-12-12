import React, { ReactNode } from 'react';
import { RouterTabNavPropsTab, RouterTabNav } from 'components/StyledUi/RouterTabNav';
import {
  SitePageViewContainer,
  sitePageContainerBaseClass as baseClass
} from './SitePage.elements';
import { DateButtonWithDropdown } from 'components/StyledUi/DateRange';
import { useLocation } from 'react-router-dom';
import { useDateRange } from 'components/StyledUi/DateRange';

export interface SitePageViewProps {
  hideDatePicker?: boolean;
  pageViewTabs?: RouterTabNavPropsTab[];
  children?: ReactNode | ReactNode[];
  pageViewSlug: string;
  className?: string;
}

export const SitePageView = ({
  children,
  pageViewTabs,
  hideDatePicker,
  className
}: SitePageViewProps): JSX.Element => {
  const { pathname } = useLocation();
  const range = useDateRange();

  let showDatePicker = hideDatePicker ? false : true;

  if (pageViewTabs)
    pageViewTabs.map(({ slug, hideDatePicker }) => {
      if (pathname.includes(slug) && hideDatePicker) showDatePicker = false;
    });

  const hasHeader = showDatePicker || pageViewTabs ? true : false;
  const customClass = `${className ? className : ''} ${baseClass}__page-view site-page-view${
    hasHeader ? ` has-header` : ``
  }`;
  // adding whitespace

  return (
    <SitePageViewContainer className={customClass}>
      {hasHeader && (
        <header className="site-page-view__header">
          {pageViewTabs && (
            <RouterTabNav
              {...{
                routerTabs: pageViewTabs,
                uiStyle: `pills`,
                className: `site-page-view__view-nav`
              }}
            />
          )}
          {showDatePicker && range && (
            <DateButtonWithDropdown {...{ className: 'site-page-view__tab-nav', ...range }} />
          )}
        </header>
      )}
      <div
        className={`site-page-view__view-tab${
          pageViewTabs
            ? pageViewTabs
                ?.map(({ slug, tabClass }) =>
                  pathname.includes(slug) && tabClass ? ` ${tabClass}` : false
                )
                .filter((x) => x)
            : ``
        }`}
      >
        {children}
      </div>
    </SitePageViewContainer>
  );
};
