import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import { usePageSettings } from '../usePageSettings';
import { WidgetTableProvider } from 'components/machine-health';
// Pages
import { Alarms, Cleaning, Overview, ProductMovement, ProductProcessing } from './MachineHealth';
import { CurrentData, HistoricRecipes, MachinePerformanceToggle } from './MachinePerformance';
import { AlarmsList, Alerts, InformationTab, MasterTagList, UnitClasses } from './Common';
import { WarningPrompt } from 'components';
import { WidgetTableDataItem } from 'types/machine-health';
import { JBTRoutes } from 'constants/routes';
import { TopLevelTabs } from 'types/protein';
import { ConfiguratorPage } from 'components/Configurator';

interface Props {
  machineId?: string;
  machineWidgets: WidgetTableDataItem[] | undefined;
  isMachinePerformanceActive: boolean;
}

const ConfiguratorWrapperProtein = ({
  machineId,
  machineWidgets,
  isMachinePerformanceActive
}: Props): JSX.Element => {
  if (!machineId || !machineWidgets) return <></>;
  const match = useRouteMatch();

  const [isDirty, setIsDirty] = useState(false);
  const [hasWidgets, setHasWidgets] = useState(!!machineWidgets?.[0]?.members?.length);
  const [machinePerformanceWidget, setMachinePerformanceWidget] = useState<
    WidgetTableDataItem | undefined
  >();
  const [hasMachinePerformanceToggle, setHasMachinePerformanceToggle] = useState(false);

  useEffect(() => {
    setHasWidgets(!!machineWidgets?.[0]?.members?.length);
  }, [machineWidgets]);

  const machinePerfomanceSettings = {
    hasMachinePerformanceToggle: hasMachinePerformanceToggle,
    isMachinePerformanceActive: isMachinePerformanceActive,
    machineId: machineId,
    machinePerformanceWidget: machinePerformanceWidget
  };

  //passing page configs for each BU
  const data = usePageSettings();
  const configSettings = {
    data: {
      ...data,
      machinePerfomanceComponent: <MachinePerformanceToggle {...machinePerfomanceSettings} />
    }
  };

  useEffect(() => {
    if (match.path === JBTRoutes.machinePerformanceConfig) {
      const mpWidget = machineWidgets?.find(
        (widget) => widget.label === TopLevelTabs.MachinePerformance
      );
      setMachinePerformanceWidget(mpWidget);
      setHasMachinePerformanceToggle(mpWidget?.toggleActive || false);
    }
  }, [data, location.pathname, match.path]);

  const isMainTabActive = data?.configTabs?.filter((tab) => tab.path === match.url)?.[0];
  const redirectSubtab =
    isMainTabActive &&
    data?.configTabsViews &&
    data?.configTabsViews[`${isMainTabActive?.slug}`][0]?.slug;
  const mainTabs = data?.configTabs?.map((tab) => tab.path) as unknown as string[];

  //Passing different routes for each BU
  const routes = (
    <>
      <WarningPrompt
        helperText="You have customised this machine and not saved the changes. Are you sure you want to
            navigate away without saving?"
        isVisible={isDirty}
        title="Unsaved Changes"
      />
      <WidgetTableProvider>
        <Switch>
          <Route exact path={mainTabs}>
            <Redirect to={`${match.path.replace(':machineId', machineId)}/${redirectSubtab}`} />
          </Route>
          <Route path={`${match.path}/overview`}>
            <Overview hasWidgets={hasWidgets} isDirty={isDirty} setIsDirty={setIsDirty} />
          </Route>
          <Route path={`${match.path}/product-processing`}>
            <ProductProcessing
              hasWidgets={hasWidgets}
              hideTabToggler
              isDirty={isDirty}
              setIsDirty={setIsDirty}
            />
          </Route>
          <Route path={`${match.path}/product-movement`}>
            <ProductMovement
              hasWidgets={hasWidgets}
              hideTabToggler
              isDirty={isDirty}
              setIsDirty={setIsDirty}
            />
          </Route>
          <Route path={`${match.path}/cleaning`}>
            <Cleaning
              hasWidgets={hasWidgets}
              hideTabToggler
              isDirty={isDirty}
              setIsDirty={setIsDirty}
            />
          </Route>
          <Route path={`${match.path}/alarms`}>
            <Alarms
              hasWidgets={hasWidgets}
              hideTabToggler
              isDirty={isDirty}
              setIsDirty={setIsDirty}
            />
          </Route>
          <Route path={`${match.path}/current`}>
            <CurrentData hasWidgets={hasWidgets} isDirty={isDirty} setIsDirty={setIsDirty} />
          </Route>
          <Route path={`${match.path}/historic-recipes`}>
            <HistoricRecipes hasWidgets={hasWidgets} isDirty={isDirty} setIsDirty={setIsDirty} />
          </Route>

          {process.env.REACT_APP_ALERT_CREATOR === 'true' && (
            <Route path={`${match.path}/alerts`}>
              <Alerts />
            </Route>
          )}
          <Route path={`${match.path}/alarms-list`}>
            <AlarmsList />
          </Route>
          <Route path={`${match.path}/master-tag-list`}>
            <MasterTagList />
          </Route>
          <Route path={`${match.path}/unit-classes`}>
            <UnitClasses />
          </Route>
          <Route path={`${match.path}/information`}>
            <InformationTab setIsDirty={setIsDirty} isDirty={isDirty} />
          </Route>
        </Switch>
      </WidgetTableProvider>
    </>
  );

  //Provider for each BU would be here
  return <ConfiguratorPage {...configSettings}>{routes}</ConfiguratorPage>;
};

export default ConfiguratorWrapperProtein;
