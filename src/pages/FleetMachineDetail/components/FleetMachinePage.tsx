import React, { ReactNode } from 'react';
import { SitePage, SitePageView, SitePageViewProps } from 'components';
import { usePageSettings, useFleetMachineAccountData } from '../hooks';

interface Props {
  children?: ReactNode | ReactNode[];
}

// this is the main wrapping page that contains the bread crumbs,
// page main tab nav, header buttons and icons.
// also serves as an error catcher if there are problems loading the
// machine account data.
export const FleetMachinePage = ({ children }: Props): JSX.Element => {
  const { machineId, isLoading, hasError } = useFleetMachineAccountData();

  const pageSettings = {
    ...usePageSettings()
  };

  if (!machineId && !isLoading && !hasError) {
    return <SitePage {...pageSettings}>Error loading machine info</SitePage>;
  } else {
    return <SitePage {...pageSettings}>{children}</SitePage>;
  }
};

export const FleetMachinePageView = ({
  children,
  pageViewSlug,
  ...rest
}: SitePageViewProps): JSX.Element => {
  const { pageViewTabs } = usePageSettings();

  const pageViewSettings = {
    pageViewSlug,
    pageViewTabs: pageViewTabs?.[pageViewSlug],
    ...rest
  };

  return <SitePageView {...pageViewSettings}>{children}</SitePageView>;
};
