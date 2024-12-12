// 3rd party libs
import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

// Components
import { PageTabView, useDateRange, DateButtonWithDropdown } from 'components';
import { GenericWidgetPage, ConfiguredSubNav } from 'components/machine-health';

// Sub pages
import Overview from './Overview';

// Types
import { MachineHealthSubTabs, MachineHealthTabs } from 'types/protein';

// Hooks
import { useConfiguredSubNav } from 'hooks';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';

const ProductProcessing = (): JSX.Element => {
  const match = useRouteMatch();
  // No need to check for loading of tab data - this view will not be rendered unless the data is available
  const { tabs, mapLabelsToSlugs } = useConfiguredSubNav(MachineHealthTabs.ProductMovement);

  const { dateRange, setDateRange } = useDateRange();
  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;

  const pageTabViewSettings = {
    TabSubNav: (
      <ConfiguredSubNav
        parentSection={MachineHealthTabs.ProductMovement}
        baseUrl={match.url}
        showMe={true}
      />
    ),
    HeaderRight: <DateButtonWithDropdown {...{ dateRange, setDateRange, hasGoBackDateLimit }} />
  };

  return (
    <PageTabView {...pageTabViewSettings}>
      <Switch>
        <Route exact path={`${match.path}/`}>
          {/* Redirect to the first active tab - this may not necessarily be Overview */}
          <Redirect to={`${match.url}/${tabs && tabs[0].slug}`} />
        </Route>
        <Route path={`${match.path}/${mapLabelsToSlugs[MachineHealthSubTabs.PMOverview]}`}>
          <Overview {...dateRange} />
        </Route>

        {/* All other subroutes (not already matching routes above) are mapped to GenericWidgetPage, 
        which will just load a blank page containing only matrix widgets */}
        {tabs?.map((tab) => (
          <Route path={`${match.path}/${tab.slug}`} key={tab.id}>
            <GenericWidgetPage pageTemplateId={tab.label as MachineHealthSubTabs} {...dateRange} />
          </Route>
        ))}
      </Switch>
    </PageTabView>
  );
};

export default ProductProcessing;
