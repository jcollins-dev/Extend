import React from 'react';
import {
  useFleetMachineAccountData,
  FleetMachineHealthByIdProvider,
  MachinePressurizationProvider
} from '../hooks';
import { Reports } from 'components';
import { FleetMachinePageView } from '../components';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { PressurizationPerformanceView } from './PressurizationPerformanceView';
import { IntensifierView } from '../MachineHealth/IntensifierView';
//import AlarmPanel from '../MachineHealthPanel/AlarmsPanel';
import SubComponentPanel from '../MachineHealthPanel/SubComponentPanel';
import { AlarmsView } from '../MachineHealth/AlarmsView';
import { MachineProductionPanel } from '../MachineProduction/MachineProductionPanel';

export const PageViewMachineProduction = (): JSX.Element => {
  return (
    <FleetMachineHealthByIdProvider>
      <FleetMachinePageView pageViewSlug="machine-production" hideDatePicker>
        <MachineProductionPanel />
      </FleetMachinePageView>
    </FleetMachineHealthByIdProvider>
  );
};

export const PageViewMachineHealth = (): JSX.Element => {
  const { machineId, curCustomer } = useFleetMachineAccountData();

  if (!machineId) return <></>;

  const match = useRouteMatch();

  return (
    <MachinePressurizationProvider>
      <FleetMachinePageView pageViewSlug="machine-health">
        <Switch>
          <Route exact path={`${match.path}/`}>
            {curCustomer?.isPascal ? (
              <Redirect to={`${match.url}/alarms`} />
            ) : (
              <Redirect to={`${match.url}/sub-components`} />
            )}
          </Route>
          <Route path={`${match.path}/alarms`}>
            <AlarmsView />
          </Route>
          <Route path={`${match.path}/sub-components`}>
            <SubComponentPanel />
          </Route>
          <Route path={`${match.path}/pressurize-performance`}>
            <PressurizationPerformanceView />
          </Route>
          <Route path={`${match.path}/intensifier-performance`}>
            <IntensifierView />
          </Route>
        </Switch>
      </FleetMachinePageView>
    </MachinePressurizationProvider>
  );
};

export const PageViewReports = (): JSX.Element => {
  const powerBiList = useFleetMachineAccountData().powerBiList;
  return <Reports powerBiList={powerBiList} />;
};
