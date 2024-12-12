import React from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  useFleetMachineAccountData,
  FleetMachineAccountDataProvider,
  PressurizeCycleDataByIdProvider
} from './hooks';
import { FleetMachinePage } from './components';
import { JBTRoutes } from 'constants/routes';
import { DateRangeProvider } from 'components';
import { PageViewMachineHealth, PageViewMachineProduction, PageViewReports } from './views';
import { AlertTabGlobal } from 'pages/AlertsPage/AlertsTab';

// if you look at the FleetMachinePage code, you'll see that it does some error checking.
// if there isn't a machineId, the page will load an error because it needs that info
// to proceed.
const ProvidedPage = (): JSX.Element => {
  const { machineId, timeZone, isLoading } = useFleetMachineAccountData();

  const match = useRouteMatch();

  return (
    <FleetMachinePage>
      {!isLoading && (
        <DateRangeProvider timeZone={timeZone} subtractDaysCount={30} frequencyRefresh={60000}>
          <Switch>
            <Route exact path={`${match.path}/`}>
              <Redirect
                to={JBTRoutes.machineProduction.replace(':machineId', machineId as string)}
              />
            </Route>
            <PressurizeCycleDataByIdProvider>
              <Route path={JBTRoutes.machineProduction}>
                <PageViewMachineProduction />
              </Route>
              <Route path={JBTRoutes.machineHealth}>
                <PageViewMachineHealth />
              </Route>
              {process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' && (
                <Route path={JBTRoutes.machineAlerts}>
                  <AlertTabGlobal />
                </Route>
              )}
              <Route path={JBTRoutes.machineReports}>
                <PageViewReports />
              </Route>
            </PressurizeCycleDataByIdProvider>
          </Switch>
        </DateRangeProvider>
      )}
    </FleetMachinePage>
  );
};

// first thing is to provide the account data needed to populate the pages and sub pages
export const FleetMachineDetail = (): JSX.Element => {
  return (
    <FleetMachineAccountDataProvider>
      <ProvidedPage />
    </FleetMachineAccountDataProvider>
  );
};
