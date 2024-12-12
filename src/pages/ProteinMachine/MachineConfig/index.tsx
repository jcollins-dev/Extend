// 3rd party libs
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
  useParams,
  Redirect,
  match
} from 'react-router-dom';

// Components
import { Pill, TabNav, WarningPrompt } from 'components';
import { TabNavItem } from 'components/TabNav';

// Hooks
import { useMachine } from 'hooks';

// Routes
import { JBTRoutes } from 'constants/routes';

// Pages
import { Alarms, Cleaning, Overview, ProductMovement, ProductProcessing } from './MachineHealth';
import { CurrentData, HistoricRecipes, MachinePerformanceToggle } from './MachinePerformance';
import { AlarmsList, Alerts, InformationTab, MasterTagList, UnitClasses } from './Common';

// Context
import { WidgetTableProvider } from 'components/machine-health';

// Types
import { TopLevelTabs } from 'types/protein';
import { WidgetTableDataItem } from 'types/machine-health';
import { useTranslation } from 'react-i18next';
import { FleetBreadCrumbs } from 'components/StyledUi/FleetBreadCrumbs';

interface SubPage {
  route: string;
  title: string;
  isTabEnabled: boolean;
}

const PARENT_PAGES: Record<string, SubPage> = {
  machineHealth: {
    route: JBTRoutes.machineHealthConfig,
    title: 'machine_health',
    isTabEnabled: true
  },
  machinePerformance: {
    route: JBTRoutes.machinePerformanceConfig,
    title: 'machine_performance',
    isTabEnabled: true
  },
  common: {
    route: JBTRoutes.machineCommonConfig,
    title: 'general',
    isTabEnabled: true
  }
};

const SUB_PAGES: Record<string, Record<string, SubPage>> = {
  common: {
    alerts: {
      route: JBTRoutes.machineConfigAlerts,
      title: 'alerts',
      isTabEnabled: true
    },
    alarmsList: {
      route: JBTRoutes.machineConfigAlarmsList,
      title: 'alarms_list',
      isTabEnabled: true
    },
    masterTagList: {
      route: JBTRoutes.machineConfigMasterTagList,
      title: 'Tag UI List',
      isTabEnabled: true
    },
    unitClasses: {
      route: JBTRoutes.machineConfigUnitClasses,
      title: 'unit_classes',
      isTabEnabled: true
    },
    information: {
      route: JBTRoutes.machineConfigInformation,
      title: 'information',
      isTabEnabled: true
    }
  },
  machineHealth: {
    overview: {
      route: JBTRoutes.machineHealthConfigOverview,
      title: 'overview',
      // This is enabled because is the entry point
      isTabEnabled: true
    },
    productProcessing: {
      route: JBTRoutes.machineHealthConfigProductProcessing,
      title: 'product_processing',
      isTabEnabled: true
    },
    productMovement: {
      route: JBTRoutes.machineHealthConfigProductMovement,
      title: 'product_movement',
      isTabEnabled: true
    },
    cleaning: {
      route: JBTRoutes.machineHealthConfigCleaning,
      title: 'cleaning',
      isTabEnabled: true
    },
    alarms: {
      route: JBTRoutes.machineHealthConfigAlarms,
      title: 'alarms',
      isTabEnabled: true
    }
  },
  machinePerformance: {
    currentData: {
      route: JBTRoutes.machinePerformanceConfigCurrent,
      title: 'current',
      // This is enabled because is the entry point
      isTabEnabled: true
    },
    historicRecipes: {
      route: JBTRoutes.machinePerformanceConfigHistoricRecipes,
      title: 'historic_recipes',
      isTabEnabled: true
    }
  }
};

const { machineHealth, machinePerformance, common } = SUB_PAGES;

const { alerts, alarmsList, masterTagList, unitClasses, information } = common;
const { overview, productProcessing, productMovement, cleaning, alarms } = machineHealth;
const { currentData, historicRecipes } = machinePerformance;

const ProteinConfigContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`;

const HeaderContainer = styled.header`
  padding-bottom: 1.25rem;
  background: linear-gradient(
    0deg,
    ${(props) => props.theme.colors.lightGrey2} 0%,
    rgba(241, 243, 244, 0) 100%
  );
  margin-left: 1em;
`;

const StyledPillContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StyledSubNavContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 1rem 2rem;
`;

interface ConfigProps {
  isMachinePerformanceActive: boolean;
  machineWidgets: WidgetTableDataItem[] | undefined;
}

const MachineConfig = ({
  isMachinePerformanceActive,
  machineWidgets
}: ConfigProps): JSX.Element => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation(['mh']);
  const previousLocation = useRef('');
  const { description } = useMachine().machine || { description: t('retrieving_machine') };
  const { machineId } = useParams<{ machineId: string }>();

  const [hasWidgets, setHasWidgets] = useState(!!machineWidgets?.[0]?.members?.length);
  const [machinePerformanceWidget, setMachinePerformanceWidget] = useState<
    WidgetTableDataItem | undefined
  >();
  const [hasMachinePerformanceToggle, setHasMachinePerformanceToggle] = useState(false);

  useEffect(() => {
    setHasWidgets(!!machineWidgets?.[0]?.members?.length);
  }, [machineWidgets]);

  useEffect(() => {
    if (match.path === JBTRoutes.machinePerformanceConfig) {
      const mpWidget = machineWidgets?.find(
        (widget) => widget.label === TopLevelTabs.MachinePerformance
      );
      setMachinePerformanceWidget(mpWidget);
      setHasMachinePerformanceToggle(mpWidget?.toggleActive || false);
    }
  }, [machineWidgets, location.pathname, match.path]);

  const [isDirty, setIsDirty] = useState(false);

  const goto = (SubPage: SubPage) => {
    !isActive(SubPage) && history.push(SubPage.route.replace(':machineId', machineId));
  };

  const isActive = (SubPage: SubPage) =>
    location.pathname.includes(SubPage.route.replace(':machineId', machineId));

  const navItem = (SubPage: SubPage) => {
    return {
      label: t(SubPage.title),
      onClick: () => {
        SubPage.isTabEnabled ? goto(SubPage) : console.log('onclick not enabled');
      },
      active: isActive(SubPage),
      isTabEnabled: SubPage.isTabEnabled
    };
  };

  const navItems = useMemo(() => {
    return [
      navItem(PARENT_PAGES.machineHealth),
      navItem(PARENT_PAGES.machinePerformance),
      navItem(PARENT_PAGES.common)
    ];
  }, [match.path]);

  const subNavItems = useMemo(() => {
    const navItems: TabNavItem[] = [];

    // populate sub nav items based on base route
    if (match.path === JBTRoutes.machineHealthConfig) {
      navItems.push(navItem(overview));
      navItems.push(navItem(productProcessing));
      navItems.push(navItem(productMovement));
      navItems.push(navItem(cleaning));
      navItems.push(navItem(alarms));
    }

    if (match.path === JBTRoutes.machinePerformanceConfig) {
      navItems.push(navItem(currentData));
      navItems.push(navItem(historicRecipes));
    }

    if (match.path === JBTRoutes.machineCommonConfig) {
      process.env.REACT_APP_ALERT_CREATOR === 'true' && navItems.push(navItem(alerts));
      navItems.push(navItem(alarmsList));
      navItems.push(navItem(masterTagList));
      navItems.push(navItem(unitClasses));
      navItems.push(navItem(information));
    }

    return navItems;
  }, [location.pathname, match.path]);

  useEffect(() => {
    if (previousLocation.current !== location.pathname) {
      setIsDirty(false);
      previousLocation.current = location.pathname;
    }
  }, [location]);

  const breadCrumbSettings = {
    paths: {
      machine: {
        label: description,
        slug: !machineId ? undefined : JBTRoutes.machine.replace(':machineId', machineId),
        isLoading: !machineId
      }
    }
  };
  return (
    <>
      <WarningPrompt
        helperText="You have customised this machine and not saved the changes. Are you sure you want to
            navigate away without saving?"
        isVisible={isDirty}
        title="Unsaved Changes"
      />
      <ProteinConfigContainer>
        <HeaderContainer>
          <FleetBreadCrumbs {...breadCrumbSettings} isConfig needsPadding />
        </HeaderContainer>
        <TabNav items={navItems} />
        <StyledSubNavContainer>
          <StyledPillContainer>
            {subNavItems.map((subTab, index) => (
              <Pill
                onClick={() => subTab.onClick()}
                key={`${subTab.label}-${index}`}
                selected={subTab.active}
              >
                {t(subTab.label)}
              </Pill>
            ))}
          </StyledPillContainer>
          <MachinePerformanceToggle
            hasMachinePerformanceToggle={hasMachinePerformanceToggle}
            isMachinePerformanceActive={isMachinePerformanceActive}
            machineId={machineId}
            machinePerformanceWidget={machinePerformanceWidget}
          />
        </StyledSubNavContainer>
        <Switch>
          <WidgetTableProvider>
            <Route exact path={`${match.path}/`}>
              {match.path === JBTRoutes.machineHealthConfig && (
                <Redirect to={overview.route.replace(':machineId', machineId)} />
              )}
              {match.path === JBTRoutes.machinePerformanceConfig && (
                <Redirect to={currentData.route.replace(':machineId', machineId)} />
              )}
              {match.path === JBTRoutes.machineCommonConfig && (
                <Redirect
                  to={
                    process.env.REACT_APP_ALERT_CREATOR === 'true'
                      ? alerts.route.replace(':machineId', machineId)
                      : alarmsList.route.replace(':machineId', machineId)
                  }
                />
              )}
            </Route>
            {/* Machine Health Components */}
            <Route exact path={overview.route}>
              <Overview hasWidgets={hasWidgets} isDirty={isDirty} setIsDirty={setIsDirty} />
            </Route>
            <Route path={productProcessing.route}>
              <ProductProcessing
                hasWidgets={hasWidgets}
                hideTabToggler
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </Route>
            <Route path={productMovement.route}>
              <ProductMovement
                hasWidgets={hasWidgets}
                hideTabToggler
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </Route>
            <Route path={cleaning.route}>
              <Cleaning
                hasWidgets={hasWidgets}
                hideTabToggler
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </Route>
            <Route path={alarms.route}>
              <Alarms
                hasWidgets={hasWidgets}
                hideTabToggler
                isDirty={isDirty}
                setIsDirty={setIsDirty}
              />
            </Route>

            {/* Machine Performance Components */}
            <Route exact path={currentData.route}>
              <CurrentData hasWidgets={hasWidgets} isDirty={isDirty} setIsDirty={setIsDirty} />
            </Route>
            <Route exact path={historicRecipes.route}>
              <HistoricRecipes hasWidgets={hasWidgets} isDirty={isDirty} setIsDirty={setIsDirty} />
            </Route>

            {/* General Components */}
            {process.env.REACT_APP_ALERT_CREATOR === 'true' && (
              <Route path={alerts.route}>
                <Alerts />
              </Route>
            )}
            <Route path={alarmsList.route}>
              <AlarmsList />
            </Route>
            <Route path={masterTagList.route}>
              <MasterTagList />
            </Route>
            <Route path={unitClasses.route}>
              <UnitClasses />
            </Route>
            <Route path={information.route}>
              <InformationTab setIsDirty={setIsDirty} isDirty={isDirty} />
            </Route>
          </WidgetTableProvider>
        </Switch>
      </ProteinConfigContainer>
    </>
  );
};

export default MachineConfig;
