// 3rd party libs
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import moment from 'moment';

import { useTimeZone } from 'providers';
// Components
import {
  PageLayout,
  TabNav,
  DateRangeProvider,
  PermissionWrapper,
  Reports,
  BUbasedBreadcrumbs
} from 'components';
import MachineHealth from './MachineHealth';
import MachinePerformance from './MachinePerformance';

// Hooks & Providers
import { useLanguage } from 'providers';

// Types
import { ConfigActiveTab, TopLevelTabs } from 'types/protein';
import { Role, UserScopes } from 'types';
import { PermissionScopeName } from 'types/user-management';

// Constants
import { JBTRoutes } from 'constants/routes';

// API
import {
  useGetAccountInfoQuery,
  useGetMachineByIdQuery,
  useGetMachineConfiguratorDataQuery
} from 'api';
import { reportActions } from 'actions';
import ConfiguratorWrapperProtein from './MachineConfig/indexV2';
import { FleetMachineAccountDataProvider } from 'pages/FleetMachineDetail/hooks';
import { AlertTabGlobal } from 'pages/AlertsPage/AlertsTab';

const HeaderContainer = styled.header`
  padding-bottom: 1.25rem;
  background: linear-gradient(
    0deg,
    ${(props) => props.theme.colors.lightGrey2} 0%,
    rgba(241, 243, 244, 0) 100%
  );
  .bread-crumbs {
    padding-top: 1rem;
  }
`;

const HeaderInner = styled.div`
  padding: 0 3.25rem;
`;

const ProteinMachineContainer = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;

  .historic-recipes-page-grid {
    padding: 1em;
  }
`;

const ProteinMachine = (): JSX.Element => {
  const { machineId } = useParams<{ machineId: string }>();
  const { languageId } = useLanguage();
  // Fetch machine widgets, this is used to determine if the
  // copy configuration button should be visible and if the MP tab is enabled
  const { data, isLoading, isFetching } = useGetMachineConfiguratorDataQuery({
    machineId: machineId,
    labels: [], // No labels; this will return all widgets
    languageId: languageId,
    showInactive: true
  });

  const [isMachinePerformanceActive, setIsMachinePerformanceActive] = useState(false);
  const [isLoadingMachinePerformance, setIsLoadingMachinePerformance] = useState(true);

  useEffect(() => {
    setIsLoadingMachinePerformance(true);

    const mpWidget = data?.find((widget) => widget.label === TopLevelTabs.MachinePerformance);
    setIsMachinePerformanceActive(mpWidget?.active || false);

    setIsLoadingMachinePerformance(isLoading);
  }, [data, isLoading, isFetching]);

  const configuratorSettings = {
    machineId: machineId,
    machineWidgets: data,
    isMachinePerformanceActive: isMachinePerformanceActive
  };

  return (
    <FleetMachineAccountDataProvider>
      <Switch>
        <Route
          path={[
            JBTRoutes.machineHealthConfig,
            JBTRoutes.machinePerformanceConfig,
            JBTRoutes.machineCommonConfig
          ]}
        >
          <PermissionWrapper
            page={PermissionScopeName.FLEET}
            scope={UserScopes.Write}
            role={Role.Admin}
          >
            <ConfiguratorWrapperProtein {...configuratorSettings} />
          </PermissionWrapper>
        </Route>
        <Route>
          <ProteinMachineView
            isLoading={isLoadingMachinePerformance}
            isMachinePerformanceActive={isMachinePerformanceActive}
          />
        </Route>
      </Switch>
    </FleetMachineAccountDataProvider>
  );
};

const configRouteMap = {
  [ConfigActiveTab.MachineHealth]: JBTRoutes.machineHealthConfig,
  [ConfigActiveTab.MachinePerformance]: JBTRoutes.machinePerformanceConfig,
  [ConfigActiveTab.Alerts]: JBTRoutes.machineAlerts,
  [ConfigActiveTab.Reports]: JBTRoutes.machineReports
};

interface ProteinMachineViewProps {
  isLoading: boolean;
  isMachinePerformanceActive: boolean;
}

const ProteinMachineView = ({
  isLoading,
  isMachinePerformanceActive
}: ProteinMachineViewProps): JSX.Element => {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const { timeZone } = useTimeZone();
  const dispatch = useDispatch();
  const { t } = useTranslation(['mh']);
  const { languageId } = useLanguage();
  const { machineId } = useParams<{ machineId: string }>();
  const { data: accountData } = useGetAccountInfoQuery({ machineId });
  const { data: machineData } = useGetMachineByIdQuery(machineId);
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);

  // Alert tab settings
  //const alertsPageViewSlug = 'alerts';
  // const alertPageViewSettings = {
  //   pageViewSlug: alertsPageViewSlug,
  //   hideDatePicker: true,
  //   ...usePageSettings()
  // };

  // This block is to determine machine status, we save last 3 dates and if they are the same, machine is considered disconnected
  // We know that protein has watchdog, thereofre skipping check for it
  const lastConnectedDates = useRef<string[]>([]);
  useEffect(() => {
    if (!lastConnectedDates) return;
    if (lastConnectedDates && lastConnectedDates?.current?.length === 3) {
      lastConnectedDates?.current?.unshift();
    }
    accountData?.connectionStatus.lastKnownConnected &&
      lastConnectedDates?.current?.push(accountData?.connectionStatus.lastKnownConnected);

    //compare dates only when array has all 3 last values
    if (lastConnectedDates?.current?.length === 3) {
      const isSameTimestamp = new Set(lastConnectedDates?.current);
      if (isSameTimestamp.size === 1) setIsDisconnected(true);
    }
  }, [accountData]);

  let formattedZone = '';
  if (timeZone) {
    const offset = moment.tz(timeZone).format('Z');
    formattedZone = `${timeZone} ( UTC ${offset} )`;
  }

  if (accountData?.reportId && accountData?.workspaceId) {
    dispatch({ type: reportActions.SHOW_REPORT, machineId: machineId });
  } else {
    dispatch({ type: reportActions.HIDE_REPORT, machineId: machineId });
  }

  const [activeTab, setActiveTab] = useState<ConfigActiveTab>(ConfigActiveTab.MachineHealth);

  const goto = (route: string) => {
    history.push(route.replace(':machineId', machineId));
  };

  const isActive = (route: string) =>
    location.pathname.includes(route.replace(':machineId', machineId));

  const breadCrumbSettings = {
    paths: {
      customer: {
        label: accountData?.companyName,
        isLoading: !accountData
      },
      site: {
        label: accountData?.siteName,
        slug: !accountData?.plantId ? undefined : `/fleet/site/${accountData.plantId}`,
        isLoading: !accountData
      },
      line: {
        label: accountData?.lineName,
        isLoading: !accountData,
        slug: !machineData?.lineId ? undefined : `/fleet/line/${machineData.lineId}`
      },
      machine: {
        label: accountData?.description,
        isLoading: !accountData,
        slug: !machineId ? undefined : `/fleet/machine/${machineId}/machine-health/overview`
      }
    },
    machineStatus: {
      machineStatus: accountData?.connectionStatus?.watchdog,
      dataStatus: accountData?.connectionStatus?.gateway,
      lastConnected: accountData?.connectionStatus?.lastKnownConnected,
      isLoading: !accountData,
      productionState: accountData?.currProdState,
      watchDog: accountData?.connectionStatus?.watchdog,
      businessUnit: 'protein',
      isDisconnected: isDisconnected
    },
    handleEdit: () => history.push(configRouteMap[activeTab].replace(':machineId', machineId))
  };

  const navItems = useMemo(() => {
    return [
      {
        label: t('machine_health'),
        onClick: () => {
          goto(JBTRoutes.machineHealth);
          setActiveTab(ConfigActiveTab.MachineHealth);
        },
        active: isActive(JBTRoutes.machineHealth),
        isTabEnabled: true
      },
      {
        label: t('machine_performance'),
        active: isActive(JBTRoutes.machinePerformance),
        onClick: () => {
          goto(JBTRoutes.machinePerformance);
          setActiveTab(ConfigActiveTab.MachinePerformance);
        },
        isTabEnabled: isMachinePerformanceActive
      },
      {
        label: t('alerts'),
        onClick: () => {
          if (process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true') {
            goto(JBTRoutes.machineAlerts);
            setActiveTab(ConfigActiveTab.Alerts);
          }
        },
        active: isActive(JBTRoutes.machineAlerts),
        isTabEnabled: process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' ? true : false
      }
    ];
  }, [isMachinePerformanceActive, location, languageId]);

  const breadCrumbWrapperSettings = {
    machineId: machineId,
    businessUnit: 'protein',
    breadCrumbs: { ...breadCrumbSettings },
    machineDetails: {
      serialNumber: accountData?.serialNumber,
      productionState: accountData?.currProdState,
      isDisconnected: isDisconnected,
      orderNumber: accountData?.order,
      formattedZone: formattedZone,
      isLoading: !accountData,
      businessUnit: 'protein',
      timeZone,
      machineId
    }
  };

  return (
    <>
      {/* TODO - Uncomment MachineHealthBar once there is an available API to connect to  */}
      {/* <MachineHealthBar width={240} indicatorPosition={30} /> */}
      <ProteinMachineContainer>
        <HeaderContainer>
          <HeaderInner>
            <BUbasedBreadcrumbs {...breadCrumbWrapperSettings} />
          </HeaderInner>
        </HeaderContainer>
        <TabNav items={navItems} />
        <Switch>
          <Route exact path={`${match.path}/`}>
            <Redirect to={JBTRoutes.machineHealth.replace(':machineId', machineId)} />
          </Route>
          <Route path={JBTRoutes.machineHealth}>
            <DateRangeProvider {...{ timeZone }}>
              <MachineHealth />
            </DateRangeProvider>
          </Route>
          <Route path={JBTRoutes.machinePerformance}>
            {!isLoading && !isMachinePerformanceActive ? (
              <Redirect to={JBTRoutes.machineHealth.replace(':machineId', machineId)} />
            ) : (
              // MP is one nav-level collapsed, so we need to use PageLayout here
              <PageLayout pageName="machinePerformance">
                <DateRangeProvider {...{ timeZone }}>
                  <MachinePerformance />
                </DateRangeProvider>
              </PageLayout>
            )}
          </Route>

          {process.env.REACT_APP_ENABLE_ALERTS_TAB === 'true' && (
            <Route path={JBTRoutes.machineAlerts}>
              <DateRangeProvider {...{ timeZone }}>
                <AlertTabGlobal />
              </DateRangeProvider>
            </Route>
          )}

          <Route path={JBTRoutes.machineReports}>
            <Reports
              // uuIDs={{ reportId: accountData?.reportId, workspaceId: accountData?.workspaceId }}
              powerBiList={accountData?.powerBiList}
            />
          </Route>
        </Switch>
      </ProteinMachineContainer>
    </>
  );
};

export default ProteinMachine;

/*

  const breadCrumbItems = useMemo(
    () => [
      {
        label: accountData ? accountData.companyName : t('retrieving_customer')
      },
      {
        label: accountData ? accountData.siteName : t('retrieving_plant'),
        link: JBTRoutes.site.replace(':plantId', accountData ? accountData.plantId : '')
      },
      {
        label: accountData ? accountData.lineName : t('retrieving_line'),
        link: JBTRoutes.line.replace(
          ':lineId',
          machineData && machineData?.lineId ? machineData.lineId : ''
        )
      },
      {
        label: accountData ? accountData.description : t('retrieving_machine_name'),
        component: <ProteinBreadcrumb activeTab={activeTab} machineId={machineId} />
      }
    ],
    [accountData, activeTab, machineData]
  );
  */
