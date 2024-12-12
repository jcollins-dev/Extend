import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';

import { usePageSettingsDSI } from '../usePageSettingsDSI';

import { SitePageViewContainer } from 'components/StyledUi/PageLayouts/SitePage/SitePage.elements';
import { ConfiguratorPage } from 'components/Configurator';

// Each BU will have configurator wrapper
export const ConfiguratorWrapperDSI = (): JSX.Element => {
  const match = useRouteMatch();

  //passing page configs for each BU
  const data = usePageSettingsDSI();
  const configSettings = {
    data: { ...data }
  };

  //passing different routes for each BU
  const routes = (
    <Switch>
      <Route exact path={`${match.path}/`}>
        <Redirect to={`${match.url}/overview`} />
      </Route>
      <Route path={`${match.path}/overview`}>
        <SitePageViewContainer className="no_config__page-view">
          <p>No Configurations available at this time</p>
        </SitePageViewContainer>
      </Route>
      <Route path={`${match.path}/production`}>
        {/* production component */}
        <SitePageViewContainer className="no_config__page-view">
          <p>No Configurations available at this time</p>
        </SitePageViewContainer>
      </Route>
      <Route path={`${match.path}/alarms`}>
        {/* alarms component */}
        <SitePageViewContainer className="no_config__page-view">
          <p>No Configurations available at this time</p>
        </SitePageViewContainer>
      </Route>
      <Route path={`${match.path}/data-analysis`}>
        {/* data analysis component */}
        <SitePageViewContainer className="no_config__page-view">
          <p>No Configurations available at this time</p>
        </SitePageViewContainer>
      </Route>
    </Switch>
  );

  //Provider for each BU would be here
  return <ConfiguratorPage {...configSettings}>{routes}</ConfiguratorPage>;
};
