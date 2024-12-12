import React, { ReactNode } from 'react';

import {
  MachineDetailsBarProps,
  MachineDetailsBar,
  RouterTabNavPropsTab,
  RouterTabNav,
  FleetBreadCrumbsProps,
  FleetBreadCrumbs
} from 'components';

import {
  SitePageViewContainer,
  SitePageContainer,
  SitePageContainerProps
} from './SitePage.elements';
import { sitePageContainerBaseClass as baseClass } from './SitePage.elements';
import { useLocation } from 'react-router-dom';
import { DSImachineStatusProvider, useDSImachineStatus } from 'pages/DSI/useMachineStatusProvider';
import { BusinessUnit } from 'types/dsi';
import {
  ProteinmachineStatusProvider,
  useProteinmachineStatus
} from 'pages/ProteinMachine/useMachineStatusProvider';
import { WatchdogProvider, useWatchdog } from 'pages/FleetMachineDetail/hooks/useWatchdogData';

export type SitePagePropsPageTab = RouterTabNavPropsTab;
export type SitePagePropsPageView = ReactNode | ReactNode[];
export type SitePagePropsPageViews = Record<string, SitePagePropsPageView>;

export interface SitePageProps extends SitePageContainerProps {
  pageTabs?: SitePagePropsPageTab[];
  pageViewTabs?: Record<string, RouterTabNavPropsTab[]>;
  PageViews?: SitePagePropsPageViews;
  breadCrumbs?: FleetBreadCrumbsProps;
  machineDetails?: MachineDetailsBarProps;
  Header?: ReactNode | ReactNode[];
  PageTitle?: ReactNode | ReactNode[];
  PageIcon?: ReactNode | ReactNode[];
  pageSlug?: string;
  pageBasePath?: string;
}

interface Props extends SitePageProps {
  children?: ReactNode | ReactNode[];
  businessUnit?: string; //we have different APIs for different BUs when it comes to machine status. Based on BU we will display corrent breadcrumb wrapper
}

export const SitePage = ({
  Header,
  PageTitle,
  PageIcon,
  pageTabs,
  PageViews,
  pageViewTabs,
  breadCrumbs,
  machineDetails,
  className,
  children,
  dataId,
  pageBasePath,
  pageSlug,
  businessUnit
}: Props): JSX.Element => {
  const hasHeader = Header || PageTitle || PageIcon || breadCrumbs || machineDetails ? true : false;

  const containerSettings = {
    // setup grid row heights
    gridRows: `${hasHeader ? `auto ` : ``}${pageTabs ? `auto ` : ``}1fr`,
    // add custom class to base class
    className: className ? `${className} ${baseClass}` : baseClass,
    ['data-id']: dataId ? dataId : undefined
  };

  const pageTabNavSettings = pageTabs && {
    pageSlug,
    routerTabs: pageTabs || pageViewTabs,
    basePath: pageBasePath,
    className: `${baseClass}__page-nav`
  };

  const breadCrumbSettings = {
    breadCrumbs,
    machineDetails,
    businessUnit,
    machineId: machineDetails?.machineId
  };

  return (
    <SitePageContainer {...containerSettings}>
      {hasHeader && (
        <header className={`${baseClass}__header`}>
          {PageTitle && (
            <h1 className={`${baseClass}__page-title headline--page-header`}>
              {PageIcon} {PageTitle}
            </h1>
          )}
          <BUbasedBreadcrumbs {...breadCrumbSettings} />
        </header>
      )}

      {pageTabNavSettings && (
        <>
          <RouterTabNav {...pageTabNavSettings} />

          {PageViews && <SitePageViews {...{ PageViews }} />}
        </>
      )}

      {!PageViews && children}
    </SitePageContainer>
  );
};

export const SitePageViews = ({ PageViews }: Props): JSX.Element => {
  // this will never happen
  if (!PageViews) return <></>;

  const { pathname } = useLocation();

  const Tabs = Object.entries(PageViews).map(([slug, View]) => {
    const pageViewSettings: Record<string, string> = {
      className: `${baseClass}__page-view`
    };

    if (!pathname.includes(slug)) pageViewSettings[`data-hidden`] = 'true';

    return (
      <SitePageViewContainer key={slug} {...pageViewSettings}>
        {View}
      </SitePageViewContainer>
    );
  });

  return <>{Tabs}</>;
};

interface BreadCrumbsProps {
  breadCrumbs?: FleetBreadCrumbsProps;
  machineDetails?: MachineDetailsBarProps;
}

export const BreadCrumbsWrap = ({ breadCrumbs, machineDetails }: BreadCrumbsProps): JSX.Element => {
  return (
    <>
      {breadCrumbs && <FleetBreadCrumbs {...breadCrumbs} />}
      {machineDetails && <MachineDetailsBar {...machineDetails} />}
    </>
  );
};

export const DSIBreadCrumbsWrap = ({
  breadCrumbs,
  machineDetails
}: BreadCrumbsProps): JSX.Element => {
  const { machineState, isLoading, isDisconnected } = useDSImachineStatus();

  const fleetSettings = {
    ...breadCrumbs,
    businessUnit: machineDetails?.businessUnit,
    productionState: machineState?.state,
    lastConnected: machineState?.timestamp,
    isDisconnected: isDisconnected,
    isLoading: isLoading
  };

  const machineDetailsBarSeetings = {
    ...machineDetails,
    businessUnit: machineDetails?.businessUnit,
    productionState: machineState?.state,
    lastConnected: machineState?.timestamp,
    isDisconnected: isDisconnected,
    isLoading: isLoading
  };

  return (
    <>
      {breadCrumbs && <FleetBreadCrumbs {...fleetSettings} />}
      {machineDetails && <MachineDetailsBar {...machineDetailsBarSeetings} />}
    </>
  );
};

export const ProteinBreadCrumbsWrap = ({
  breadCrumbs,
  machineDetails
}: BreadCrumbsProps): JSX.Element => {
  // machine states come from api where we grab latest knows state with timestamp for this state
  const { machineState, isLoading } = useProteinmachineStatus();
  // Determination wether machine is online/offline comes from watchdog provider which bases its value on last known connected date/time
  const { isLoading: isLoadingWatchdog, isDisconnected } = useWatchdog();

  const fleetSettings = {
    ...breadCrumbs,
    businessUnit: breadCrumbs?.machineStatus?.businessUnit,
    productionState: machineState?.state,
    lastConnected: breadCrumbs?.machineStatus?.lastConnected,
    isLoading: isLoadingWatchdog || isLoading,
    isDisconnected: isDisconnected
  };

  const machineDetailsBarSeetings = {
    ...machineDetails,
    businessUnit: machineDetails?.businessUnit,
    productionState: machineState?.state,
    lastConnected: breadCrumbs?.machineStatus?.lastConnected,
    isLoading: isLoadingWatchdog || isLoading,
    isDisconnected: isDisconnected
  };

  return (
    <>
      {breadCrumbs && <FleetBreadCrumbs {...fleetSettings} />}
      {machineDetails && <MachineDetailsBar {...machineDetailsBarSeetings} />}
    </>
  );
};

// This wrapper will be individual to each BU
// Provider contains api calls that refreshed every 5 seconds
interface BreadCrumbsWrapperProps {
  breadCrumbs?: FleetBreadCrumbsProps;
  machineDetails?: MachineDetailsBarProps;
  machineId?: string;
  businessUnit?: string;
  timeZone?: string;
}

// Wrapper below comes with a provider with API call with 3 seconds interval.
// I want info from api(provider) to be passed only to avoid the whole oage re-rendering
export const BUbasedBreadcrumbs = ({
  businessUnit,
  machineId,
  breadCrumbs,
  machineDetails,
  timeZone
}: BreadCrumbsWrapperProps): JSX.Element => {
  switch (businessUnit) {
    case BusinessUnit.DSI:
      return (
        <DSImachineStatusProvider {...{ machineId }}>
          <DSIBreadCrumbsWrap breadCrumbs={breadCrumbs} machineDetails={machineDetails} />
        </DSImachineStatusProvider>
      );
    case BusinessUnit.PROTEIN:
      return (
        <ProteinmachineStatusProvider {...{ machineId, timeZone }}>
          <WatchdogProvider {...{ timeZone }}>
            <ProteinBreadCrumbsWrap breadCrumbs={breadCrumbs} machineDetails={machineDetails} />
          </WatchdogProvider>
        </ProteinmachineStatusProvider>
      );
    default:
      return <BreadCrumbsWrap breadCrumbs={breadCrumbs} machineDetails={machineDetails} />;
  }
};
