import React from 'react';
import { SitePageView, SitePageViewProps } from 'components/StyledUi';

import { AlertPageContainer } from './index.elements';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { usePageSettings } from './useAlertSettings';

import { ManageAlertPage } from './elements/ManageAlertPage';

export const AlertManagement = (): JSX.Element => {
  return (
    <AlertPageContainer className="alert-wrapper">
      <h1>Alert Management</h1>
      <AlertsManagemenetPage />
    </AlertPageContainer>
  );
};

// this is the main wrapping page that contains the bread crumbs,
// page main tab nav, header buttons and icons.
// also serves as an error catcher if there are problems loading the
// machine account data.
export const AlertsManagemenetPage = (): JSX.Element => {
  //hook here to get all alerts
  //const { machineId, isLoading, hasError } = useFleetMachineAccountData();
  //tests
  // const machineId = 'fdb06c9d-d061-42a3-b068-233d3dee99d8'
  // const isLoading = false
  // const hasError = undefined

  const match = useRouteMatch();

  return (
    <AlertPageView pageViewSlug="alert-management">
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/manage-alert`} />
        </Route>
        <Route path={`${match.path}/manage-alert`}>
          <ManageAlertPage />
        </Route>
        <Route path={`${match.path}/tags`}>{/* tags */}</Route>
      </Switch>
    </AlertPageView>
  );
};

export const AlertPageView = ({ children, pageViewSlug }: SitePageViewProps): JSX.Element => {
  const { pageTabs } = usePageSettings();

  const pageSettings = {
    pageViewSlug: pageViewSlug,
    className: 'alert-management-tabs',
    pageViewTabs: pageTabs,
    hideDatePicker: true
  };

  return <SitePageView {...pageSettings}>{children}</SitePageView>;
};
