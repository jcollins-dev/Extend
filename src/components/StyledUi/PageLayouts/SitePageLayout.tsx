import React, { ReactNode } from 'react';
import {
  SitePageLayoutContainer,
  SitePageLayoutMain,
  SitePageLayoutContainerProps,
  sitePageLayoutBaseClass as baseClass
} from './SitePageLayout.elements';
import { FleetBreadCrumbsProps, FleetBreadCrumbs } from '../FleetBreadCrumbs';
import { RouterTabNavTabProps, RouterTabNav } from '../RouterTabNav/RouterTabNav';
import { MachineDetailsBar, MachineDetailsBarProps } from '../MachineDetailsBar/MachineDetailsBar';

export type SitePageLayoutPropsView = JSX.Element | JSX.Element[];

export interface SitePageLayoutProps extends SitePageLayoutContainerProps {
  pageSlug?: string;
  machineDetailsBar?: MachineDetailsBarProps;
  breadCrumbs?: FleetBreadCrumbsProps;
  mainTabs?: RouterTabNavTabProps[];
  basePath?: string;
  Header?: ReactNode | ReactNode[];
  PageTitle?: ReactNode | ReactNode[];
  PageIcon?: ReactNode | ReactNode[];
  Main?: ReactNode | ReactNode[];
}

interface Props extends SitePageLayoutProps {
  children?: ReactNode | ReactNode[];
}

export const SitePageLayout = ({
  className,
  gridArea,
  children,
  breadCrumbs,
  basePath,
  mainTabs,
  Header,
  PageTitle,
  PageIcon,
  machineDetailsBar,
  Main
}: Props): JSX.Element => {
  // default settings
  let hasHeader = false;

  // add custom className to baseClass if needed,
  className = className ? `${baseClass} ${className}` : baseClass;

  // check if we should load the <header> tag or use custom Header
  if (breadCrumbs || PageTitle || PageIcon || machineDetailsBar) hasHeader = true;

  return (
    <SitePageLayoutContainer {...{ className, gridArea }}>
      {Header && Header}

      {hasHeader && (
        <header className={`${baseClass}__header`}>
          {PageTitle ||
            (PageIcon && (
              <h1 className={`headline--page-title${PageIcon ? ` has-icon-left` : ``}`}>
                {PageIcon}
                {PageTitle}
              </h1>
            ))}

          {breadCrumbs && <FleetBreadCrumbs {...breadCrumbs} />}

          {machineDetailsBar && <MachineDetailsBar {...machineDetailsBar} />}
        </header>
      )}

      {mainTabs && (
        <RouterTabNav
          {...{ routerTabs: mainTabs, basePath, className: `${baseClass}__page-tabs` }}
        />
      )}

      {Main || <SitePageLayoutMain>{children}</SitePageLayoutMain>}
    </SitePageLayoutContainer>
  );
};
