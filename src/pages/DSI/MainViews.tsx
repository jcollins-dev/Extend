import React from 'react';
import { useFleetMachineAccountData } from 'pages/FleetMachineDetail/hooks';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import OverviewV2 from './MachineHealth/Overview';
import Alarms from './MachineHealth/Alarms/Alarms';
import DataAnalysis from './MachineHealth/DataAnalysis';
import Production from './MachineHealth/Production';
import { usePageSettingsDSI } from './usePageSettingsDSI';
import { SitePageView, SitePageViewProps } from 'components/StyledUi';
import { SyncZoomProvider } from 'providers';
import { MachineAlarmsProvider } from 'hooks/useMachineAlarms';

export const PageViewMachineHealth = (): JSX.Element => {
  const { machineId } = useFleetMachineAccountData();

  if (!machineId) return <></>;

  const match = useRouteMatch();

  return (
    <FleetMachinePageView pageViewSlug="machine-health">
      <Switch>
        <Route exact path={`${match.path}/`}>
          <Redirect to={`${match.url}/overview`} />
        </Route>
        <Route path={`${match.path}/overview`}>
          <OverviewV2 />
        </Route>
        <Route path={`${match.path}/alarms`}>
          <MachineAlarmsProvider>
            <Alarms />
          </MachineAlarmsProvider>
        </Route>
        <Route path={`${match.path}/data-analysis`}>
          <SyncZoomProvider>
            <DataAnalysis />
          </SyncZoomProvider>
        </Route>
        <Route path={`${match.path}/production`}>
          <Production />
        </Route>
      </Switch>
    </FleetMachinePageView>
  );
};

export const FleetMachinePageView = ({
  children,
  pageViewSlug,
  ...rest
}: SitePageViewProps): JSX.Element => {
  const { pageViewTabs } = usePageSettingsDSI();

  const pageViewSettings = {
    pageViewSlug,
    hideDatePicker: true,
    pageViewTabs: pageViewTabs?.[pageViewSlug],
    ...rest
  };

  return <SitePageView {...pageViewSettings}>{children}</SitePageView>;
};
