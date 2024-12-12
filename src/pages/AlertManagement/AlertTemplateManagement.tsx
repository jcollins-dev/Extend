import React from 'react';
import { SitePageView, SitePageViewProps } from 'components/StyledUi';

import { AlertPageContainer } from './index.elements';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router';
import { usePageSettings } from './useAlertSettings';

import { ManageAlertTemplatePage } from './elements/ManageAlertTemplatePage';

export const AlertTemplateManagement = (): JSX.Element => {
  return (
    <AlertPageContainer className="alert-wrapper">
      <h1>Alert Template Management</h1>
      <AlertTemplateManagemenetPage />
    </AlertPageContainer>
  );
};

// this is the main wrapping page that contains the bread crumbs,
// page main tab nav, header buttons and icons.
// also serves as an error catcher if there are problems loading the
// machine account data.
export const AlertTemplateManagemenetPage = (): JSX.Element => {
  //hook here to get all alerts
  //const { machineId, isLoading, hasError } = useFleetMachineAccountData();
  //tests
  // const machineId = 'fdb06c9d-d061-42a3-b068-233d3dee99d8'
  // const isLoading = false
  // const hasError = undefined

  const match = useRouteMatch();

  return (
    <AlertPageView pageViewSlug="alert-template-management">
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/manage-template`} />
        </Route>
        <Route path={`${match.path}/manage-template`}>
          <ManageAlertTemplatePage />
        </Route>
        <Route path={`${match.path}/tags`}>{/* tags */}</Route>
      </Switch>
    </AlertPageView>
  );
};

export const AlertPageView = ({ children, pageViewSlug }: SitePageViewProps): JSX.Element => {
  const { pageTabsTemplates } = usePageSettings();

  const pageSettings = {
    pageViewSlug: pageViewSlug,
    className: 'alert-template-tabs',
    pageViewTabs: pageTabsTemplates,
    hideDatePicker: true
  };

  return <SitePageView {...pageSettings}>{children}</SitePageView>;
};
