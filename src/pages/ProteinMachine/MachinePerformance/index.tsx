// 3rd party libs
import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';

// Components
import { PageTabView, DateButtonWithDropdown, useDateRange } from 'components';
import { ConfiguredSubNav, DataRenderer, GenericWidgetPage } from 'components/machine-health';

// SubViews
import { HistoricRecipes } from './HistoricRecipes/HistoricRecipesV2';

// Providers
import { SyncZoomProvider } from 'providers';

// Types
import { MachinePerformanceSubTabs, MachinePerformanceTabs, TopLevelTabs } from 'types/protein';

// Routes
import { proteinMachinePerformanceSlugs } from 'constants/routes';

// Hooks
import { useConfiguredSubNav } from 'hooks';
import { DATA_DATE_LIMIT_DAYS } from 'constants/machineConfig';

// Define the slugs used for top level nav within Machine Health
export const SUB_ROUTES = {
  current: proteinMachinePerformanceSlugs[MachinePerformanceTabs.Current],
  historicRecipes: proteinMachinePerformanceSlugs[MachinePerformanceTabs.HistoricRecipes]
};

const MachinePerformance = (): JSX.Element => {
  const match = useRouteMatch();

  const { dateRange, setDateRange } = useDateRange();

  const { isLoading, error, tabs } = useConfiguredSubNav(
    undefined,
    [TopLevelTabs.MachinePerformance],
    proteinMachinePerformanceSlugs
  );

  const hasGoBackDateLimit = DATA_DATE_LIMIT_DAYS;

  return (
    <DataRenderer isLoading={isLoading} error={error && 'Failed to load navigation'}>
      <PageTabView
        TabSubNav={
          tabs && (
            <ConfiguredSubNav
              baseUrl={match.url}
              labels={[TopLevelTabs.MachinePerformance]}
              slugMap={proteinMachinePerformanceSlugs}
            />
          )
        }
        HeaderRight={
          <DateButtonWithDropdown {...{ dateRange, setDateRange, hasGoBackDateLimit }} />
        }
      >
        <SyncZoomProvider>
          <Switch>
            <Route exact path={`${match.path}/`}>
              {/* Redirect to the first active tab - this may not necessarily be Overview */}
              <Redirect to={`${match.url}/${tabs && tabs[0].slug}`} />
            </Route>
            <Route path={`${match.path}/${SUB_ROUTES.current}`}>
              {/* MP is one nav-level collapsed; we are rendering the sub-tabs directly */}
              <GenericWidgetPage
                pageTemplateId={MachinePerformanceSubTabs.Current}
                {...dateRange}
              />
            </Route>
            <Route path={`${match.path}/${SUB_ROUTES.historicRecipes}`}>
              <HistoricRecipes />
            </Route>
          </Switch>
        </SyncZoomProvider>
      </PageTabView>
    </DataRenderer>
  );
};

export default MachinePerformance;
